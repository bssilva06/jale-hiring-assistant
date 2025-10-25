const Anthropic = require("@anthropic-ai/sdk");

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const getMatchScore = async (candidateProfile, jobRequirements) => {
  const prompt = `
    Analyze this candidate profile against the job requirements and provide a detailed match assessment.

    Candidate Profile:
    - Skills: ${JSON.stringify(candidateProfile.skills)}
    - Experience: ${candidateProfile.experience_years} years
    - Certifications: ${JSON.stringify(candidateProfile.certifications)}
    - Language: ${candidateProfile.language}

    Job Requirements:
    - Required Skills: ${JSON.stringify(jobRequirements.requirements)}
    - Preferred Experience: 2 years (Compare against this)
    - Required Certifications: ["Forklift certified"] (Check if candidate has this)

    Provide your response in JSON format:
    {
    "match_score": <0-100>,
    "reasoning": "<explanation>",
    "strengths": ["strength1", "strength2"],
    "red_flags": ["flag1", "flag2"] or [],
    "recommendation": "proceed_to_interview" | "maybe" | "not_a_fit"
    }
`;

  try {
    const msg = await anthropic.messages.create({
      model: "claude-3-haiku-20240307", // Use the fastest model for a hackathon
      max_tokens: 1000,
      temperature: 0, // Low temperature for consistent JSON output
      system:
        "You are an expert hiring assistant. Your goal is to provide a numeric match score and analysis in JSON format.", // System prompt
      messages: [{ role: "user", content: prompt }],
    });

    return JSON.parse(msg.content[0].text);
  } catch (error) {
    console.error("Error getting match score from Claude:", error);
    throw error;
  }
};

const getChatResponse = async (userMessage, jobDetails, history) => {
  const systemPrompt = `
    You are an AI hiring assistant for Jale, a company that connects workers with jobs. 
    You help candidates by answering questions about job postings in a friendly, professional manner.

    Context about this job:
    - Title: ${jobDetails.title}
    - Pay: $${jobDetails.pay}/hour
    - Location: ${jobDetails.location}
    - Schedule: ${jobDetails.schedule}
    - Requirements: ${JSON.stringify(jobDetails.requirements)}

    Guidelines:
    - Be concise and friendly
    - Answer in the same language the candidate uses (English or Spanish)
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
      max_tokens: 500,
      temperature: 0.5,
      system: systemPrompt,
      messages: [
        ...formattedHistory, // Spread the previous messages
        { role: "user", content: userMessage }, // Add the new user message
      ],
    });

    return msg.content[0].text;
  } catch (error) {
    console.error("Error calling Claude API:", error);
    throw new Error("Failed to get chat response from AI");
  }
};

module.exports = {
  getMatchScore,
  getChatResponse,
};
