import { resendClient, sender } from "../lib/resend.js";
import { createWelcomeEmailTemplate } from "../emails/emailTemplate.js";

export const sendWelcomeEmail = async (email, name, clientURL) => {
  if (process.env.NODE_ENV === "development") {
    console.log("Skipping welcome email in development");
    return;
  }
  const toEmail = process.env.RESEND_TEST_EMAIL || email;
  const { data, error } = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: toEmail,
    subject: "Welcome to MessageOS!",
    html: createWelcomeEmailTemplate(name, clientURL),
  });

  if (error) {
    console.error("Error sending welcome email:", error);
    throw new Error("Failed to send welcome email");
  }

  console.log("Welcome Email sent successfully", data);
};
