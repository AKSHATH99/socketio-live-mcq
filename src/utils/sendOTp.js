const  transporter  = require( '../lib/nodemailer');
// export const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });


async function sendOtpEmail(toEmail, otp) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL, // Make sure this is your Gmail ID
      to: toEmail,
      subject: 'Your OTP Code',
      html: `<p>Your OTP is <strong>${otp}</strong>. It expires in 5 minutes.</p>`,
    });

    return { success: true, info };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return { success: false, error: error.message };
  }
}

module.exports = sendOtpEmail;
