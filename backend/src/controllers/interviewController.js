const supabase = require("../config/supabase");
const { sendInterviewNotification } = require("../services/notificationService");

// Schedule a new interview
const scheduleInterview = async (req, res) => {
  try {
    const {
      application_id,
      candidate_id,
      job_id,
      scheduled_at,
      scheduled_time,
      interview_type,
      meeting_link,
      notes,
      duration_minutes,
    } = req.body;

    // Accept either scheduled_at or scheduled_time for flexibility
    const scheduledDateTime = scheduled_at || scheduled_time;

    if (!application_id || !scheduledDateTime) {
      return res.status(400).json({
        error: "application_id and scheduled_at are required",
      });
    }

    // Fetch application details to get candidate and job info
    const { data: application, error: appError } = await supabase
      .from("applications")
      .select(`
        *,
        candidate:candidates(name, email),
        job:jobs(title, id)
      `)
      .eq("id", application_id)
      .single();

    if (appError || !application) {
      throw new Error("Application not found");
    }

    // Generate Jitsi meeting link
    const jitsiRoomId = `jale-interview-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const generatedMeetingLink = meeting_link || `https://meet.jit.si/${jitsiRoomId}`;

    const { data, error } = await supabase
      .from("interviews")
      .insert([
        {
          application_id,
          candidate_id: application.candidate_id,
          job_id: application.job_id,
          scheduled_time: scheduledDateTime,
          duration_minutes,
          interview_type: interview_type || "video",
          meeting_link: generatedMeetingLink,
          jitsi_room_id: jitsiRoomId,
          notes,
          status: "scheduled",
        },
      ])
      .select()
      .single();

    if (error) throw new Error(error.message);

    // Update application status
    await supabase
      .from("applications")
      .update({ status: "interview_scheduled" })
      .eq("id", application_id);

    // Send email notification to candidate
    try {
      await sendInterviewNotification(
        application.candidate.email,
        application.candidate.name,
        application.job.title,
        {
          scheduled_at: scheduledDateTime,
          meeting_link: generatedMeetingLink,
          interview_type: interview_type || "video",
        }
      );
      console.log(`✉️  Interview notification sent to ${application.candidate.email}`);
    } catch (emailError) {
      console.error("Failed to send interview notification:", emailError.message);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      message: "Interview scheduled successfully",
      interview: data,
    });
  } catch (error) {
    console.error("Error in scheduleInterview:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Get all interviews
const getAllInterviews = async (req, res) => {
  try {
    const { status, date } = req.query;

    let query = supabase
      .from("interviews")
      .select(
        `
                *,
                candidate:candidates(name, email, phone),
                job:jobs(title, company, location),
                application:applications(status, match_score)
            `
      )
      .order("scheduled_time", { ascending: true });

    // Filter by status if provided
    if (status) {
      query = query.eq("status", status);
    }

    // Filter by date if provided
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      query = query
        .gte("scheduled_time", startOfDay.toISOString())
        .lte("scheduled_time", endOfDay.toISOString());
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    // Transform data to flatten nested objects for frontend
    const transformedData = data.map(interview => ({
      ...interview,
      candidate_name: interview.candidate?.name || 'N/A',
      candidate_email: interview.candidate?.email || 'N/A',
      candidate_phone: interview.candidate?.phone || 'N/A',
      job_title: interview.job?.title || 'N/A',
      job_company: interview.job?.company || 'N/A',
      job_location: interview.job?.location || 'N/A',
      match_score: interview.application?.match_score || 0,
    }));

    res.status(200).json(transformedData);
  } catch (error) {
    console.error("Error in getAllInterviews:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Get a single interview by ID
const getInterviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("interviews")
      .select(
        `
                *,
                candidate:candidates(*),
                job:jobs(*),
                application:applications(*)
            `
      )
      .eq("id", id)
      .single();

    if (error) throw new Error("Interview not found");

    res.status(200).json(data);
  } catch (error) {
    console.error("Error in getInterviewById:", error.message);
    res.status(404).json({ error: error.message });
  }
};

// Get interviews for a specific candidate
const getCandidateInterviews = async (req, res) => {
  try {
    const { candidate_id } = req.params;

    const { data, error } = await supabase
      .from("interviews")
      .select(
        `
                *,
                job:jobs(title, company, location),
                application:applications(status)
            `
      )
      .eq("candidate_id", candidate_id)
      .order("scheduled_at", { ascending: true });

    if (error) throw new Error(error.message);

    res.status(200).json(data);
  } catch (error) {
    console.error("Error in getCandidateInterviews:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Update interview (reschedule, cancel, complete)
const updateInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from("interviews")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    // If interview is completed, update application status
    if (updates.status === "completed") {
      await supabase
        .from("applications")
        .update({ status: "interviewed" })
        .eq("id", data.application_id);
    }

    res.status(200).json({
      message: "Interview updated successfully",
      interview: data,
    });
  } catch (error) {
    console.error("Error in updateInterview:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Cancel an interview
const cancelInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const { data, error } = await supabase
      .from("interviews")
      .update({
        status: "cancelled",
        notes: reason || "Cancelled by user",
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    res.status(200).json({
      message: "Interview cancelled successfully",
      interview: data,
    });
  } catch (error) {
    console.error("Error in cancelInterview:", error.message);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  scheduleInterview,
  getAllInterviews,
  getInterviewById,
  getCandidateInterviews,
  updateInterview,
  cancelInterview,
};
