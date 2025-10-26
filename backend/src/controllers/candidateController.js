const supabase = require("../config/supabase");
const pdf = require("pdf-parse");

const { getMatchScore, parseResume } = require("../services/claudeService");

const createCandidateApplication = async (req, res) => {
  console.log('🔵 APPLICATION SUBMISSION RECEIVED!');
  console.log('Request body:', req.body);
  
  const {
    job_id,
    name,
    email,
    phone,
    skills,
    experience_years,
    certifications,
    language_preference,
    resume_url,
    education,
  } = req.body;

  try {
    // First check if candidate exists
    const { data: existingCandidate } = await supabase
      .from("candidates")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    // If candidate exists, check for duplicate application FIRST
    if (existingCandidate) {
      const { data: existingApplication } = await supabase
        .from("applications")
        .select("id")
        .eq("candidate_id", existingCandidate.id)
        .eq("job_id", job_id)
        .maybeSingle();

      if (existingApplication) {
        console.log('⚠️ Duplicate application detected');
        return res.status(409).json({ 
          error: "You have already applied for this job.",
          application_id: existingApplication.id 
        });
      }
    }

    let candidate;
    if (existingCandidate) {
      // Update existing candidate
      const updateData = {
        name,
        phone,
        skills,
        experience_years,
        certifications,
        language_preference,
      };

      // Only update resume_url if provided
      if (resume_url) {
        updateData.resume_url = resume_url;
      }

      // Only update education if provided
      if (education) {
        updateData.education = education;
      }

      const { data, error: updateError } = await supabase
        .from("candidates")
        .update(updateData)
        .eq("email", email)
        .select()
        .single();

      if (updateError) {
        throw new Error(`Candidate update failed: ${updateError.message}`);
      }
      candidate = data;
    } else {
      // Create new candidate
      const insertData = {
        name,
        email,
        phone,
        skills,
        experience_years,
        certifications,
        language_preference,
      };

      // Only include resume_url if provided
      if (resume_url) {
        insertData.resume_url = resume_url;
      }

      // Only include education if provided
      if (education) {
        insertData.education = education;
      }

      const { data, error: insertError } = await supabase
        .from("candidates")
        .insert([insertData])
        .select()
        .single();

      if (insertError) {
        throw new Error(`Candidate creation failed: ${insertError.message}`);
      }
      candidate = data;
    }

    // Fetch job details for match score calculation
    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", job_id)
      .single();

    if (jobError) {
      throw new Error(`Job not found: ${jobError.message}`);
    }

    // Calculate match score using Claude AI
    let matchScore = 0;
    try {
      console.log('=== MATCH SCORE CALCULATION ===');
      console.log('Candidate data:', {
        name: candidate.name,
        skills: candidate.skills,
        experience_years: candidate.experience_years,
        certifications: candidate.certifications,
        education: candidate.education,
        language_preference: candidate.language_preference
      });
      console.log('Job data:', {
        title: job.title,
        description: job.description,
        requirements: job.requirements,
        pay: job.pay,
        location: job.location,
        schedule: job.schedule
      });
      
      const matchResult = await getMatchScore(candidate, job);
      matchScore = matchResult.match_score || 0;
      console.log(`✓ Match score calculated: ${matchScore}%`);
      console.log('✓ Match reasoning:', matchResult.reasoning);
      console.log('✓ Strengths:', matchResult.strengths);
      console.log('✓ Red flags:', matchResult.red_flags);
      console.log('✓ Recommendation:', matchResult.recommendation);
      console.log('================================');
    } catch (scoreError) {
      console.error("❌ Error calculating match score:", scoreError.message);
      console.error("Full error:", scoreError);
      // Continue with 0 score if calculation fails
    }

    const { data: application, error: appError } = await supabase
      .from("applications")
      .insert([
        { 
          job_id: job_id, 
          candidate_id: candidate.id, 
          status: "submitted",
          match_score: matchScore 
        },
      ])
      .select()
      .single();

    if (appError) {
      if (appError.code === "23505") {
        return res
          .status(409)
          .json({ error: "You have already applied for this job." });
      }
      throw new Error(`Application creation failed: ${appError.message}`);
    }

    res.status(201).json({
      id: candidate.id,
      application_id: application.id,
      status: application.status,
      created_at: application.created_at,
    });
  } catch (error) {
    console.error("Error in createCandidateApplication:", error.message);
    res.status(400).json({ error: error.message });
  }
};

const getAllCandidates = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("candidates")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCandidateById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("candidates")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const getCandidateMatch = async (req, res) => {
  try {
    const { candidate_id, job_id } = req.params;

    // Fetch candidate data
    const { data: candidate, error: candidateError } = await supabase
      .from("candidates")
      .select("*")
      .eq("id", candidate_id)
      .single();

    if (candidateError) throw new Error("Candidate not found");

    // Fetch job data
    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", job_id)
      .single();

    if (jobError) throw new Error("Job not found");

    // Get AI match analysis
    const matchAnalysis = await getMatchScore(candidate, job);

    // Store the match result
    const { data: match, error: matchError } = await supabase
      .from("matches")
      .upsert({
        candidate_id,
        job_id,
        match_score: matchAnalysis.match_score,
        reasoning: matchAnalysis.reasoning,
        strengths: matchAnalysis.strengths,
        red_flags: matchAnalysis.red_flags,
        recommendation: matchAnalysis.recommendation,
      })
      .select()
      .single();

    if (matchError) throw new Error(matchError.message);

    res.status(200).json(matchAnalysis);
  } catch (error) {
    console.error("Error in getCandidateMatch:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const parseResumeText = async (req, res) => {
  console.log('📄 RESUME PARSING REQUEST RECEIVED!');
  
  const { resumeText } = req.body;

  if (!resumeText || resumeText.trim().length === 0) {
    return res.status(400).json({ error: 'Resume text is required' });
  }

  try {
    console.log('📝 Resume text length:', resumeText.length, 'characters');
    
    // Use Claude to parse the resume
    const parsedData = await parseResume(resumeText);
    
    console.log('✅ Resume parsed successfully');
    res.status(200).json(parsedData);
  } catch (error) {
    console.error('❌ Error parsing resume:', error.message);
    res.status(500).json({ error: 'Failed to parse resume: ' + error.message });
  }
};

const parseResumeFile = async (req, res) => {
  console.log('📎 RESUME FILE UPLOAD RECEIVED!');
  
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const file = req.file;
    console.log('📄 File info:', {
      name: file.originalname,
      type: file.mimetype,
      size: file.size,
    });

    let resumeText = '';

    // Extract text based on file type
    if (file.mimetype === 'application/pdf') {
      // Parse PDF
      const pdfData = await pdf(file.buffer);
      resumeText = pdfData.text;
      console.log('📄 Extracted text from PDF:', resumeText.substring(0, 200) + '...');
    } else if (file.mimetype === 'text/plain') {
      // Plain text file
      resumeText = file.buffer.toString('utf-8');
      console.log('📄 Text file content:', resumeText.substring(0, 200) + '...');
    } else if (
      file.mimetype === 'application/msword' || 
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      // For DOC/DOCX, we'd need additional libraries (mammoth, etc.)
      // For now, return error message
      return res.status(400).json({ 
        error: 'DOC/DOCX files are not yet supported. Please upload PDF or TXT files.',
        suggestion: 'You can convert your resume to PDF and try again.'
      });
    }

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ error: 'Could not extract text from file' });
    }

    console.log('📝 Resume text length:', resumeText.length, 'characters');
    
    // Use Claude to parse the resume
    const parsedData = await parseResume(resumeText);
    
    console.log('✅ Resume file parsed successfully');
    res.status(200).json(parsedData);
  } catch (error) {
    console.error('❌ Error parsing resume file:', error.message);
    res.status(500).json({ error: 'Failed to parse resume file: ' + error.message });
  }
};

module.exports = {
  createCandidateApplication,
  getAllCandidates,
  getCandidateById,
  getCandidateMatch,
  parseResumeText,
  parseResumeFile,
};
