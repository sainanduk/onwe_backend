const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
async function sendVerificationEmail(mail, otp) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.MAILER_MAIL,
          pass: process.env.MAILER_PASSWORD
        }
      });
  
      const mailOptions = {
        from: process.env.MAILER_MAIL,
        to: mail,
        subject: 'OTP',
        text: `Do not share this OTP: ${otp}`
      };
  
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
    } catch (error) {
      console.error('Error occurred:', error);
    }
  }
module.exports = sendVerificationEmail;