const cron = require("node-cron");
const supabase = require("../config/supabase");
const { sendInterviewReminder } = require("./notificationService");

/**
 * Generate Jitsi meeting link
 */
const generateMeetingLink = (jobId, candidateId, interviewId) => {
  const roomName = `jale-interview-${interviewId}-${Date.now()}`;
  return `https://meet.jit.si/${roomName}`;
};

/**
 * Check for upcoming interviews and send reminders
 * This should be called by a cron job or scheduled task
 */
const sendUpcomingInterviewReminders = async () => {
  try {
    console.log("Checking for upcoming interviews...");

    // Get interviews scheduled for tomorrow (24 hours from now)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    const { data: interviews, error } = await supabase
      .from("interviews")
      .select(
        `
                *,
                candidate:candidates(name, email),
                job:jobs(title)
            `
      )
      .eq("status", "scheduled")
      .gte("scheduled_at", tomorrow.toISOString())
      .lt("scheduled_at", dayAfterTomorrow.toISOString());

    if (error) {
      console.error("Error fetching interviews:", error);
      return;
    }

    if (!interviews || interviews.length === 0) {
      console.log("No interviews scheduled for tomorrow");
      return;
    }

    console.log(`Found ${interviews.length} interviews for tomorrow`);

    // Send reminders
    for (const interview of interviews) {
      try {
        await sendInterviewReminder(
          interview.candidate.email,
          interview.candidate.name,
          interview.job.title,
          {
            scheduled_at: interview.scheduled_at,
            meeting_link: interview.meeting_link,
          }
        );
        console.log(`Reminder sent to ${interview.candidate.email}`);
      } catch (error) {
        console.error(
          `Failed to send reminder to ${interview.candidate.email}:`,
          error
        );
      }
    }
  } catch (error) {
    console.error("Error in sendUpcomingInterviewReminders:", error);
  }
};

/**
 * Initialize cron job for interview reminders
 * Runs every day at 9:00 AM
 */
const initializeInterviewReminderCron = () => {
  // Schedule task to run every day at 9:00 AM
  cron.schedule("0 9 * * *", async () => {
    console.log("Running scheduled interview reminder job...");
    await sendUpcomingInterviewReminders();
  });

  console.log("📅 Interview reminder cron job initialized (9:00 AM daily)");
};

/**
 * Check for interviews in the next hour and send immediate reminders
 */
const sendImmediateInterviewReminders = async () => {
  try {
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

    const { data: interviews, error } = await supabase
      .from("interviews")
      .select(
        `
                *,
                candidate:candidates(name, email),
                job:jobs(title)
            `
      )
      .eq("status", "scheduled")
      .gte("scheduled_at", now.toISOString())
      .lt("scheduled_at", oneHourFromNow.toISOString());

    if (error) {
      console.error("Error fetching interviews:", error);
      return;
    }

    if (!interviews || interviews.length === 0) {
      return;
    }

    console.log(`Found ${interviews.length} interviews in the next hour`);

    for (const interview of interviews) {
      try {
        await sendInterviewReminder(
          interview.candidate.email,
          interview.candidate.name,
          interview.job.title,
          {
            scheduled_at: interview.scheduled_at,
            meeting_link: interview.meeting_link,
          }
        );
      } catch (error) {
        console.error(`Failed to send immediate reminder:`, error);
      }
    }
  } catch (error) {
    console.error("Error in sendImmediateInterviewReminders:", error);
  }
};

/**
 * Calculate available time slots based on existing interviews
 */
const getAvailableTimeSlots = async (date) => {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(9, 0, 0, 0); // Start at 9 AM

    const endOfDay = new Date(date);
    endOfDay.setHours(17, 0, 0, 0); // End at 5 PM

    // Get existing interviews for this day
    const { data: existingInterviews, error } = await supabase
      .from("interviews")
      .select("scheduled_at")
      .gte("scheduled_at", startOfDay.toISOString())
      .lt("scheduled_at", endOfDay.toISOString())
      .neq("status", "cancelled");

    if (error) throw error;

    // Generate time slots (every 30 minutes)
    const slots = [];
    const current = new Date(startOfDay);

    while (current < endOfDay) {
      const slotTime = new Date(current);
      const isBooked = existingInterviews?.some((interview) => {
        const interviewTime = new Date(interview.scheduled_at);
        return Math.abs(interviewTime - slotTime) < 30 * 60 * 1000; // Within 30 minutes
      });

      if (!isBooked) {
        slots.push({
          time: slotTime.toISOString(),
          available: true,
        });
      }

      current.setMinutes(current.getMinutes() + 30);
    }

    return slots;
  } catch (error) {
    console.error("Error getting available time slots:", error);
    throw error;
  }
};

module.exports = {
  generateMeetingLink,
  sendUpcomingInterviewReminders,
  initializeInterviewReminderCron,
  sendImmediateInterviewReminders,
  getAvailableTimeSlots,
};
