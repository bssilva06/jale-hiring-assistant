const nodemailer = require("nodemailer");

// Create email transporter
const createTransporter = () => {
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER) {
    console.warn(
      "⚠️  Email configuration not set. Notifications will not be sent."
    );
    return null;
  }

  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

/**
 * Send application confirmation email to candidate
 */
const sendApplicationConfirmation = async (
  candidateEmail,
  candidateName,
  jobTitle
) => {
  const transporter = createTransporter();
  if (!transporter) return { success: false, message: "Email not configured" };

  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: candidateEmail,
      subject: `Application Received - ${jobTitle}`,
      html: `
                <h2>Thank you for your application!</h2>
                <p>Hi ${candidateName},</p>
                <p>We've received your application for the <strong>${jobTitle}</strong> position.</p>
                <p>Our team will review your application and get back to you soon.</p>
                <br>
                <p>Best regards,<br>The Jale Team</p>
            `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Send interview scheduled notification
 */
const sendInterviewNotification = async (
  candidateEmail,
  candidateName,
  jobTitle,
  interviewDetails
) => {
  const transporter = createTransporter();
  if (!transporter) return { success: false, message: "Email not configured" };

  const { scheduled_at, meeting_link, interview_type } = interviewDetails;
  const interviewDate = new Date(scheduled_at).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: candidateEmail,
      subject: `Interview Scheduled - ${jobTitle}`,
      html: `
                <h2>Interview Scheduled!</h2>
                <p>Hi ${candidateName},</p>
                <p>Great news! Your interview for the <strong>${jobTitle}</strong> position has been scheduled.</p>
                <h3>Interview Details:</h3>
                <ul>
                    <li><strong>Date & Time:</strong> ${interviewDate}</li>
                    <li><strong>Type:</strong> ${
                      interview_type || "Video Interview"
                    }</li>
                    ${
                      meeting_link
                        ? `<li><strong>Meeting Link:</strong> <a href="${meeting_link}">${meeting_link}</a></li>`
                        : ""
                    }
                </ul>
                <p>Please make sure to join on time. We look forward to speaking with you!</p>
                <br>
                <p>Best regards,<br>The Jale Team</p>
            `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Interview notification sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending interview notification:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Send interview reminder (24 hours before)
 */
const sendInterviewReminder = async (
  candidateEmail,
  candidateName,
  jobTitle,
  interviewDetails
) => {
  const transporter = createTransporter();
  if (!transporter) return { success: false, message: "Email not configured" };

  const { scheduled_at, meeting_link } = interviewDetails;
  const interviewDate = new Date(scheduled_at).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: candidateEmail,
      subject: `Reminder: Interview Tomorrow - ${jobTitle}`,
      html: `
                <h2>Interview Reminder</h2>
                <p>Hi ${candidateName},</p>
                <p>This is a friendly reminder about your upcoming interview for the <strong>${jobTitle}</strong> position.</p>
                <h3>Interview Details:</h3>
                <ul>
                    <li><strong>Date & Time:</strong> ${interviewDate}</li>
                    ${
                      meeting_link
                        ? `<li><strong>Meeting Link:</strong> <a href="${meeting_link}">${meeting_link}</a></li>`
                        : ""
                    }
                </ul>
                <p>Please make sure to join on time. Good luck!</p>
                <br>
                <p>Best regards,<br>The Jale Team</p>
            `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Interview reminder sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending interview reminder:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Send interview cancellation notification
 */
const sendInterviewCancellation = async (
  candidateEmail,
  candidateName,
  jobTitle,
  reason
) => {
  const transporter = createTransporter();
  if (!transporter) return { success: false, message: "Email not configured" };

  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: candidateEmail,
      subject: `Interview Cancelled - ${jobTitle}`,
      html: `
                <h2>Interview Cancelled</h2>
                <p>Hi ${candidateName},</p>
                <p>We regret to inform you that your interview for the <strong>${jobTitle}</strong> position has been cancelled.</p>
                ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ""}
                <p>We apologize for any inconvenience. We'll reach out if we'd like to reschedule.</p>
                <br>
                <p>Best regards,<br>The Jale Team</p>
            `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Cancellation notification sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending cancellation notification:", error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendApplicationConfirmation,
  sendInterviewNotification,
  sendInterviewReminder,
  sendInterviewCancellation,
};
