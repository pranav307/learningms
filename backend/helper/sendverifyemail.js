import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// ✅ Log environment variables for debugging (ensure these are correctly set)
console.log("Email User:", process.env.App_email);
console.log("Email Pass:", process.env.App_pass ? "******" : "Not Set");

// 1️⃣ Create the transporter with proper SMTP settings
const transporter = nodemailer.createTransport({
  host:"smtp.gmail.com",
  service: "gmail",
  port: 587,
  secure: false, // For TLS, set to false; for SSL (port 465), set to true
  auth: {
    user:process.env.App_email,
    pass:process.env.App_pass,
  },
  tls: {
    rejectUnauthorized: false, // Prevent self-signed certificate errors
  },
});

// 2️⃣ Function to generate email options
export function mailOptions(email, username, verifycode) {
  return {
    from: { name: "PSG Sender", address: process.env.App_email },
    to: email, // Only send to the provided email, remove extra hardcoded emails
    subject: `Verification Code for ${username}`,
    text: `Hello ${username}, your verification code is: ${verifycode}. It expires in 6 minutes.`,
    html: `<p>Hello, <b>${username}</b>! Your verification code is: <strong>${verifycode}</strong>. It expires in <b>6 minutes</b>.</p>`,
  };
}

// 3️⃣ Function to send email with proper error handling
export const sendMail = async (email, username, verifycode) => {
  try {
    const options = mailOptions(email, username, verifycode);
    const info = await transporter.sendMail(options);
    console.log("✅ Email sent successfully! Message ID:", info.messageId);
    return { type: "success", message: "Email sent successfully", info };
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return { type: "error", message: "Error sending email", error: error.message };
  }
};
