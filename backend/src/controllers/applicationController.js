const supabase = require("../config/supabase");

const getAllApplications = async (req, res) => {
  const { job_id } = req.query;

  try {
    let query = supabase
      .from("applications")
      .select(`
        *,
        candidate:candidates(*),
        job:jobs(*)
      `)
      .order("created_at", { ascending: false });

    if (job_id) {
      query = query.eq("job_id", job_id);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch applications: ${error.message}`);
    }

    res.json(data || []);
  } catch (error) {
    console.error("Error in getAllApplications:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const getApplicationById = async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from("applications")
      .select(`
        *,
        candidate:candidates(*),
        job:jobs(*)
      `)
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Failed to fetch application: ${error.message}`);
    }

    if (!data) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.json(data);
  } catch (error) {
    console.error("Error in getApplicationById:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const updateApplicationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["submitted", "reviewing", "interview", "accepted", "rejected"];
  
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ 
      error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` 
    });
  }

  try {
    const { data, error } = await supabase
      .from("applications")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update application: ${error.message}`);
    }

    if (!data) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.json(data);
  } catch (error) {
    console.error("Error in updateApplicationStatus:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const deleteApplication = async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from("applications")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Failed to delete application: ${error.message}`);
    }

    res.json({ message: "Application deleted successfully" });
  } catch (error) {
    console.error("Error in deleteApplication:", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
};
