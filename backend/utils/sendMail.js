import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASSWORD
  }
});

export const sendMail = async ({ subject, text, to }) => {
  const mailOptions = {
    from: `"Inventory Alert System" <${process.env.ADMIN_EMAIL}>`,
    to,
    subject,
    text
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("📧 Email sent to admin:", to);
  } catch (error) {
    console.error("❌ Error sending mail:", error);
  }
};
