const nodemailer = require('nodemailer');

async function sendEmail(otp, mail) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'your@gmail.com',
        pass: 'pass key'
      }
    });

    const mailOptions = {
      from: 'your@gmail.com',
      to: mail,
      subject: 'OTP',
      text: `Do not share this PASSKEY: ${otp} with anyone, use this passkey to signin into mobile app`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

module.exports = sendEmail ;