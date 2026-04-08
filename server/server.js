const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for demo (use database in production)
let users = [];
let otps = {};

// Email transporter (configure with your email service)
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Generate OTP
function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

// Send OTP email
async function sendOTPEmail(email, otp) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP for CitizenConnect',
    text: `Your OTP is: ${otp}. It will expire in 5 minutes.`
  };

  await transporter.sendMail(mailOptions);
}

// Routes
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;

  // Simple demo login (replace with real authentication)
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    // Generate and send OTP
    const otp = generateOTP();
    otps[email] = { otp, expires: Date.now() + 5 * 60 * 1000 }; // 5 minutes

    sendOTPEmail(email, otp).then(() => {
      res.json({ message: 'OTP sent to your email' });
    }).catch(error => {
      console.error('Error sending OTP:', error);
      res.status(500).json({ error: 'Failed to send OTP' });
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.post('/auth/verify-otp', (req, res) => {
  const { otp, email } = req.body;

  if (!email || !otps[email]) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  if (otps[email].otp === otp && Date.now() < otps[email].expires) {
    delete otps[email];
    res.json({ success: true, token: 'demo-token-' + email });
  } else {
    res.status(400).json({ error: 'Invalid or expired OTP' });
  }
});

app.post('/auth/resend-otp', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  const otp = generateOTP();
  otps[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };

  sendOTPEmail(email, otp).then(() => {
    res.json({ message: 'OTP resent' });
  }).catch(error => {
    console.error('Error resending OTP:', error);
    res.status(500).json({ error: 'Failed to resend OTP' });
  });
});

app.post('/auth/update-email', (req, res) => {
  const { email } = req.body;
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token || !email) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  // Update email in user record (demo)
  const userIndex = users.findIndex(u => u.email === token.replace('demo-token-', ''));
  if (userIndex !== -1) {
    users[userIndex].email = email;
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Demo user creation (for testing)
app.post('/auth/signup', (req, res) => {
  const { email, password } = req.body;
  users.push({ email, password });
  res.json({ message: 'User created' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});