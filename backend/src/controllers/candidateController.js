const supabase = require("../config/supabase");

const { getMatchScore } = require("../services/claudeService");

const createCandidateApplication = async (req, res) => {
  const {
    job_id,
    name,
    email,
    phone,
    skills,
    experience_years,
    certifications,
    language_preference,
  } = req.body;

  try {
    const { data: candidate, error: candidateError } = await supabase
      .from("candidates")
      .upsert(
        {
          name,
          email,
          phone,
          skills,
          experience_years,
          certifications,
          language_preference,
        },
        { onConflict: "email" }
      )
      .select()
      .single();

    if (candidateError) {
      throw new Error(`Candidate creation failed: ${candidateError.message}`);
    }

    const { data: application, error: appError } = await supabase
      .from("applications")
      .insert([
        { job_id: job_id, candidate_id: candidate.id, status: "submitted" },
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

module.exports = {
  createCandidateApplication,
  getAllCandidates,
  getCandidateById,
  getCandidateMatch,
};
