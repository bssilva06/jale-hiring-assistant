const Anthropic = require("@anthropic-ai/sdk");

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const getMatchScore = async (candidateProfile, jobRequirements) => {
  const prompt = `
    You are evaluating a candidate for a job. Analyze ALL factors carefully and provide a fair assessment.

    CANDIDATE PROFILE:
    - Name: ${candidateProfile.name}
    - Skills: ${JSON.stringify(candidateProfile.skills || [])}
    - Years of Experience: ${candidateProfile.experience_years || 0}
    - Certifications: ${JSON.stringify(candidateProfile.certifications || [])}
    - Education: ${candidateProfile.education || 'Not specified'}
    - Language: ${candidateProfile.language_preference || 'English'}

    JOB POSTING:
    - Title: ${jobRequirements.title}
    - Company: ${jobRequirements.company}
    - Pay Rate: $${jobRequirements.pay}/hour
    - Location: ${jobRequirements.location}
    - Work Schedule: ${jobRequirements.schedule}
    - Job Type: ${jobRequirements.job_type || 'Not specified'}
    - Job Description: ${jobRequirements.description || 'Not provided'}
    - Requirements: ${jobRequirements.requirements || 'Not specified'}

    CRITICAL INSTRUCTIONS FOR SKILLS MATCHING:
    You MUST extract the required skills from BOTH the "Job Description" and "Requirements" fields above.
    Look for keywords like: forklift, warehouse, customer service, bilingual, Spanish, construction, etc.
    
    Then compare the candidate's skills array with those extracted requirements.
    
    SCORING INSTRUCTIONS (total = 100 points):

    1. SKILLS MATCH (40 points) - HIGHEST PRIORITY
       - Extract skills mentioned in the job description and requirements
       - Compare with candidate's skills array
       - Look for EXACT matches (e.g., "forklift" in both)
       - Look for RELATED matches (e.g., "warehouse" relates to "inventory")
       - If candidate has 80%+ of needed skills → 35-40 points
       - If candidate has 60-80% of needed skills → 28-34 points
       - If candidate has 40-60% of needed skills → 20-27 points
       - Even 1-2 key skill matches are worth 15-20 points

    2. EXPERIENCE (25 points)
       - 3+ years for most jobs → 20-25 points
       - 1-3 years → 12-19 points
       - Less than 1 year → 5-11 points
       - Consider if experience level fits job complexity

    3. CERTIFICATIONS (15 points)
       - Each relevant certification is valuable
       - Industry-specific certs are highly valuable

    4. LOCATION & SCHEDULE (10 points)
       - Location compatibility
       - Schedule alignment

    5. EDUCATION & LANGUAGE (10 points)
       - Education level
       - Language compatibility (bilingual is a plus)

    CRITICAL SCORING RULES:
    - If candidate skills array contains words found in job description/requirements, score HIGH (70%+)
    - Example: Candidate has ["forklift", "warehouse"] and job needs "forklift operation" → This is 80%+ match
    - Example: Candidate has ["customer service", "bilingual"] and job needs "Spanish speaking customer service" → This is 90%+ match
    - DO NOT penalize small gaps - focus on what matches
    - A candidate with 2-3 key matching skills should score 75-85%
    - Only score below 60% if there are NO skill matches or major red flags

    Return ONLY valid JSON (no markdown, no explanations outside JSON):
    {
      "match_score": <number 0-100>,
      "reasoning": "<explain what skills matched and why score is high/low>",
      "strengths": ["<specific matching skill or quality>", "<another strength>", "<third strength>"],
      "red_flags": ["<concern if any>"] or [],
      "recommendation": "proceed_to_interview" or "maybe" or "not_a_fit"
    }
`;

  try {
    const msg = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1200,
      temperature: 0.5,
      system: "You are a fair hiring assistant. You MUST extract skills from the job description and requirements text, then compare them to the candidate's skills array. Give HIGH scores (70-90%) when skills clearly match. Return ONLY valid JSON.",
      messages: [{ role: "user", content: prompt }],
    });

    const responseText = msg.content[0].text.trim();
    // Remove markdown code blocks if present
    const jsonText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    const result = JSON.parse(jsonText);
    
    // Log what the AI found
    console.log('AI Analysis - Match Score:', result.match_score);
    console.log('AI Analysis - Reasoning:', result.reasoning);
    
    return result;
  } catch (error) {
    console.error("Error getting match score from Claude:", error);
    throw error;
  }
};

const getChatResponse = async (userMessage, jobDetails, history) => {
  // Comprehensive Spanish detection on current message
  const spanishCharacters = /[áéíóúñ¿¡]/i.test(userMessage);
  const spanishWords = /\b(hola|qué|que|cuál|cual|dónde|donde|cómo|como|cuánto|cuanto|gracias|por favor|bueno|locacion|posicion|trabajo|salario|horario|requisitos|aplicar|necesito|tengo|español|es|el|la|los|las|un|una|pago|está|esta)\b/i.test(userMessage);
  
  const isSpanish = spanishCharacters || spanishWords;

  const systemPrompt = `
    You are an AI hiring assistant for Jale, a company that connects workers with jobs. 
    You help candidates by answering questions about job postings in a friendly, professional manner.

    Context about this job:
    - Title: ${jobDetails.title}
    - Pay: $${jobDetails.pay}/hour
    - Location: ${jobDetails.location}
    - Schedule: ${jobDetails.schedule}
    - Requirements: ${JSON.stringify(jobDetails.requirements)}

    IMPORTANT LANGUAGE INSTRUCTION:
    ${isSpanish 
      ? '- You MUST respond COMPLETELY in Spanish\n    - DO NOT use any English words\n    - Keep all responses in Spanish only'
      : '- You MUST respond COMPLETELY in English\n    - DO NOT use any Spanish words\n    - Keep all responses in English only'
    }

    Guidelines:
    - Be concise and friendly (2-3 sentences max)
    - Only answer questions about: pay, location, schedule, requirements, application process
    - If asked about something else, politely redirect to submitting an application
 `;

  const formattedHistory = history.map((msg) => ({
    role: msg.sender === "ai" ? "assistant" : "user",
    content: msg.content,
  }));

  try {
    const msg = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 300,
      temperature: 0.2, // Very low temperature for consistent language
      system: systemPrompt,
      messages: [
        ...formattedHistory,
        { role: "user", content: userMessage },
      ],
    });

    return msg.content[0].text;
  } catch (error) {
    console.error("Error calling Claude API:", error);
    throw new Error("Failed to get chat response from AI");
  }
};

const parseResume = async (resumeText) => {
  const prompt = `
    You are a resume parser. Extract structured information from the following resume text.

    RESUME TEXT:
    ${resumeText}

    Extract the following information and return it as a JSON object:
    {
      "name": "Full name of the candidate",
      "email": "Email address (if found)",
      "phone": "Phone number (if found)",
      "skills": ["skill1", "skill2", "skill3"],
      "experience_years": <number of years of total work experience>,
      "certifications": ["cert1", "cert2"],
      "education": "Highest education level or degree",
      "summary": "Brief 1-2 sentence summary of the candidate's background"
    }

    INSTRUCTIONS:
    - Extract ALL skills mentioned (technical skills, soft skills, tools, languages, etc.)
    - For experience_years, calculate total years across all jobs listed
    - Include ALL certifications, licenses, and training mentioned
    - For education, include degree and field if available
    - If information is not found, use empty string "" for text or empty array [] for lists
    - For experience_years, use 0 if not determinable
    - Return ONLY valid JSON, no markdown formatting

    Extract the information now:
  `;

  try {
    const message = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 2048,
      temperature: 0,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const responseText = message.content[0].text;
    console.log('📄 Resume parsing response:', responseText);

    // Clean up markdown code blocks if present
    const cleanedResponse = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const parsedData = JSON.parse(cleanedResponse);
    console.log('✅ Parsed resume data:', parsedData);
    
    return parsedData;
  } catch (error) {
    console.error('❌ Error parsing resume:', error);
    throw new Error('Failed to parse resume: ' + error.message);
  }
};

module.exports = {
  getMatchScore,
  getChatResponse,
  parseResume,
};
