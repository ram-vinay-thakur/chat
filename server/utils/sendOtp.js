import nodemailer from 'nodemailer';

// Create a transporter object using your email service
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use any email provider
  auth: {
    user: process.env.EMAIL_USER,  // Your email address
    pass: process.env.EMAIL_PASS,  // Your email password or app password (for Gmail)
  },
});

const sendOtp = async (email, otp) => {
  try {
    // Create the email content
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender's address
      to: email, // Receiver's address
      subject: 'Your OTP Code', // Subject line
      text: `Your OTP code is: ${otp}`, // Plain text body
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('OTP sent successfully to:', email);
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw new Error('Failed to send OTP');
  }
};

export default sendOtp;
