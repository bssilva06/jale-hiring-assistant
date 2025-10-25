const supabase = require("../config/supabase");

// Create a new job posting
const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      pay,
      schedule,
      requirements,
      description,
      language,
    } = req.body;

    const { data, error } = await supabase
      .from("jobs")
      .insert([
        {
          title,
          company,
          location,
          pay,
          schedule,
          requirements,
          description,
          language,
          status: "active",
        },
      ])
      .select()
      .single();

    if (error) throw new Error(error.message);

    res.status(201).json({
      message: "Job created successfully",
      job: data,
    });
  } catch (error) {
    console.error("Error in createJob:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Get all jobs
const getAllJobs = async (req, res) => {
  try {
    const { status, language } = req.query;

    let query = supabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });

    // Filter by status if provided
    if (status) {
      query = query.eq("status", status);
    }

    // Filter by language if provided
    if (language) {
      query = query.eq("language", language);
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    res.status(200).json(data);
  } catch (error) {
    console.error("Error in getAllJobs:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Get a single job by ID
const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error("Job not found");

    res.status(200).json(data);
  } catch (error) {
    console.error("Error in getJobById:", error.message);
    res.status(404).json({ error: error.message });
  }
};

// Update a job
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from("jobs")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    res.status(200).json({
      message: "Job updated successfully",
      job: data,
    });
  } catch (error) {
    console.error("Error in updateJob:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Delete (soft delete) a job
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("jobs")
      .update({ status: "closed" })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    res.status(200).json({
      message: "Job closed successfully",
      job: data,
    });
  } catch (error) {
    console.error("Error in deleteJob:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Get all applications for a specific job
const getJobApplications = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("applications")
      .select(
        `
                *,
                candidate:candidates(*),
                job:jobs(title, company)
            `
      )
      .eq("job_id", id)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    res.status(200).json(data);
  } catch (error) {
    console.error("Error in getJobApplications:", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getJobApplications,
};
