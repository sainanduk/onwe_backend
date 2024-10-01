const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE } = require("../email-templates/templates");
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.MAILER_MAIL,
    pass: process.env.MAILER_PASSWORD
  }
});

// Send Verification Email
const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const mailOptions = {
      from: process.env.MAILER_MAIL,
      to: email,
      subject: "Verify your Email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Verification email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};

// Send Password Reset Email
const sendPasswordResetEmail = async (email, otp) => {
  console.log("email",email);
  try {
    const mailOptions = {
      from: process.env.MAILER_MAIL,
      to: email,
      subject: "Password Reset OTP",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{otp}", otp),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset OTP email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending password reset OTP email:", error);
  }
};

// Send Password Reset Success Email
const sendResetSuccessEmail = async (email) => {
  try {
    const mailOptions = {
      from: process.env.MAILER_MAIL,
      to: email,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset success email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending password reset success email:", error);
  }
};

const sendeventmails = async (to,subject,text) => {
  try {
    const mailOptions = {
      from: process.env.MAILER_MAIL,
      to: to,
      subject: subject,
      html: text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Event email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending event email:", error);
  }
}

module.exports = { sendVerificationEmail, sendPasswordResetEmail, sendResetSuccessEmail,sendeventmails };