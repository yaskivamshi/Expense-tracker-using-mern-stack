
const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // Use `true` for port 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Expense Manager" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (err) {
    console.error("Email Error:", err.message);
  }
};

module.exports = sendEmail;
