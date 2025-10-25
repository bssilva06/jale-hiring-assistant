const supabase = require("../config/supabase");
const { getChatResponse } = require("../services/claudeService");

// Send a chat message and get AI response
const sendMessage = async (req, res) => {
  try {
    const { job_id, candidate_id, message, language } = req.body;

    if (!message || !job_id) {
      return res.status(400).json({ error: "Message and job_id are required" });
    }

    // Fetch job details for context
    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", job_id)
      .single();

    if (jobError) throw new Error("Job not found");

    // Fetch chat history if candidate_id is provided
    let history = [];
    if (candidate_id) {
      const { data: chatHistory, error: historyError } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("job_id", job_id)
        .eq("candidate_id", candidate_id)
        .order("created_at", { ascending: true })
        .limit(10); // Last 10 messages for context

      if (!historyError && chatHistory) {
        history = chatHistory.map((msg) => ({
          sender: msg.sender,
          content: msg.message,
        }));
      }
    }

    // Get AI response
    const aiResponse = await getChatResponse(message, job, history);

    // Save user message
    if (candidate_id) {
      await supabase.from("chat_messages").insert([
        {
          job_id,
          candidate_id,
          sender: "candidate",
          message: message,
        },
      ]);

      // Save AI response
      await supabase.from("chat_messages").insert([
        {
          job_id,
          candidate_id,
          sender: "ai",
          message: aiResponse,
        },
      ]);
    }

    res.status(200).json({
      response: aiResponse,
      message: aiResponse,
      job_title: job.title,
    });
  } catch (error) {
    console.error("Error in sendMessage:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Get chat history for a candidate and job
const getChatHistory = async (req, res) => {
  try {
    const { job_id, candidate_id } = req.params;

    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("job_id", job_id)
      .eq("candidate_id", candidate_id)
      .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);

    res.status(200).json(data);
  } catch (error) {
    console.error("Error in getChatHistory:", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  sendMessage,
  getChatHistory,
};
