const nodemailer = require('nodemailer');

const sendConfirmationEmail = async (to, subject, htmlContent) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER, // your email
      pass: process.env.MAIL_PASS, // your app password
    },
  });

  const mailOptions = {
    from: `"Ayu Arana Care" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendConfirmationEmail;
