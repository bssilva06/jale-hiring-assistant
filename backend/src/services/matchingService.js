const supabase = require("../config/supabase");
const { getMatchScore } = require("./claudeService");

/**
 * Find and rank candidates for a specific job
 * @param {string} jobId - The job ID to match candidates against
 * @param {number} limit - Maximum number of candidates to return
 * @returns {Array} - Array of matched candidates with scores
 */
const findMatchingCandidates = async (jobId, limit = 10) => {
  try {
    // Get job details
    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", jobId)
      .single();

    if (jobError) throw new Error("Job not found");

    // Get all candidates who haven't applied to this job yet
    const { data: existingApplications, error: appError } = await supabase
      .from("applications")
      .select("candidate_id")
      .eq("job_id", jobId);

    const appliedCandidateIds =
      existingApplications?.map((app) => app.candidate_id) || [];

    // Get candidates (optionally filter by language preference)
    let candidateQuery = supabase
      .from("candidates")
      .select("*")
      .order("created_at", { ascending: false });

    // Filter out candidates who already applied
    if (appliedCandidateIds.length > 0) {
      candidateQuery = candidateQuery.not(
        "id",
        "in",
        `(${appliedCandidateIds.join(",")})`
      );
    }

    const { data: candidates, error: candidateError } = await candidateQuery;

    if (candidateError) throw new Error(candidateError.message);

    if (!candidates || candidates.length === 0) {
      return [];
    }

    // Get match scores for each candidate
    const matchPromises = candidates
      .slice(0, limit * 2)
      .map(async (candidate) => {
        try {
          const matchAnalysis = await getMatchScore(candidate, job);

          // Store the match in the database
          await supabase.from("matches").upsert({
            candidate_id: candidate.id,
            job_id: jobId,
            match_score: matchAnalysis.match_score,
            reasoning: matchAnalysis.reasoning,
            strengths: matchAnalysis.strengths,
            red_flags: matchAnalysis.red_flags,
            recommendation: matchAnalysis.recommendation,
          });

          return {
            ...candidate,
            match_analysis: matchAnalysis,
          };
        } catch (error) {
          console.error(`Error matching candidate ${candidate.id}:`, error);
          return null;
        }
      });

    const matchedCandidates = (await Promise.all(matchPromises)).filter(
      Boolean
    );

    // Sort by match score
    matchedCandidates.sort(
      (a, b) => b.match_analysis.match_score - a.match_analysis.match_score
    );

    // Return top matches
    return matchedCandidates.slice(0, limit);
  } catch (error) {
    console.error("Error in findMatchingCandidates:", error);
    throw error;
  }
};

/**
 * Find suitable jobs for a specific candidate
 * @param {string} candidateId - The candidate ID to match jobs against
 * @param {number} limit - Maximum number of jobs to return
 * @returns {Array} - Array of matched jobs with scores
 */
const findMatchingJobs = async (candidateId, limit = 5) => {
  try {
    // Get candidate details
    const { data: candidate, error: candidateError } = await supabase
      .from("candidates")
      .select("*")
      .eq("id", candidateId)
      .single();

    if (candidateError) throw new Error("Candidate not found");

    // Get active jobs
    const { data: jobs, error: jobError } = await supabase
      .from("jobs")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (jobError) throw new Error(jobError.message);

    if (!jobs || jobs.length === 0) {
      return [];
    }

    // Get match scores for each job
    const matchPromises = jobs.slice(0, limit * 2).map(async (job) => {
      try {
        const matchAnalysis = await getMatchScore(candidate, job);

        // Store the match in the database
        await supabase.from("matches").upsert({
          candidate_id: candidateId,
          job_id: job.id,
          match_score: matchAnalysis.match_score,
          reasoning: matchAnalysis.reasoning,
          strengths: matchAnalysis.strengths,
          red_flags: matchAnalysis.red_flags,
          recommendation: matchAnalysis.recommendation,
        });

        return {
          ...job,
          match_analysis: matchAnalysis,
        };
      } catch (error) {
        console.error(`Error matching job ${job.id}:`, error);
        return null;
      }
    });

    const matchedJobs = (await Promise.all(matchPromises)).filter(Boolean);

    // Sort by match score
    matchedJobs.sort(
      (a, b) => b.match_analysis.match_score - a.match_analysis.match_score
    );

    // Return top matches
    return matchedJobs.slice(0, limit);
  } catch (error) {
    console.error("Error in findMatchingJobs:", error);
    throw error;
  }
};

/**
 * Get existing match from database or calculate new one
 * @param {string} candidateId - The candidate ID
 * @param {string} jobId - The job ID
 * @returns {Object} - Match analysis
 */
const getOrCreateMatch = async (candidateId, jobId) => {
  try {
    // Check if match already exists
    const { data: existingMatch, error: matchError } = await supabase
      .from("matches")
      .select("*")
      .eq("candidate_id", candidateId)
      .eq("job_id", jobId)
      .single();

    if (!matchError && existingMatch) {
      return {
        match_score: existingMatch.match_score,
        reasoning: existingMatch.reasoning,
        strengths: existingMatch.strengths,
        red_flags: existingMatch.red_flags,
        recommendation: existingMatch.recommendation,
      };
    }

    // If not, calculate new match
    const { data: candidate, error: candidateError } = await supabase
      .from("candidates")
      .select("*")
      .eq("id", candidateId)
      .single();

    if (candidateError) throw new Error("Candidate not found");

    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", jobId)
      .single();

    if (jobError) throw new Error("Job not found");

    const matchAnalysis = await getMatchScore(candidate, job);

    // Store the new match
    await supabase.from("matches").insert({
      candidate_id: candidateId,
      job_id: jobId,
      match_score: matchAnalysis.match_score,
      reasoning: matchAnalysis.reasoning,
      strengths: matchAnalysis.strengths,
      red_flags: matchAnalysis.red_flags,
      recommendation: matchAnalysis.recommendation,
    });

    return matchAnalysis;
  } catch (error) {
    console.error("Error in getOrCreateMatch:", error);
    throw error;
  }
};

module.exports = {
  findMatchingCandidates,
  findMatchingJobs,
  getOrCreateMatch,
};
