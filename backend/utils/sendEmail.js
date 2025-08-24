const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, text }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Gmail use kar rahe ho
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSKEY
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject,
    text
  });
};

module.exports = sendEmail;
