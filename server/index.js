require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;

// Get all network IPs
function getNetworkIPs() {
  const interfaces = os.networkInterfaces();
  const ips = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push(iface.address);
      }
    }
  }
  return ips.length ? ips : ['localhost'];
}

const networkIPs = getNetworkIPs();
const allowedOrigins = [
  'http://localhost:5173',
  ...networkIPs.map(ip => `http://${ip}:5173`)
];

// Enhanced CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['POST', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());

// Email endpoint with improved error handling
app.post('/api/send-email', async (req, res) => {
  console.log('Email request received from:', req.headers.origin);
  
  const { user_name, user_email, user_phone, user_company, message } = req.body;

  // Enhanced validation
  if (!user_name || !user_email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and message are required fields'
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false // For local testing only
      }
    });

    const mailOptions = {
      from: `"RR Business Group" <${process.env.EMAIL_USER}>`,
      to: process.env.TO_EMAIL,
      replyTo: user_email,
      subject: `New Contact: ${user_name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${user_name}</p>
        <p><strong>Email:</strong> ${user_email}</p>
        ${user_phone ? `<p><strong>Phone:</strong> ${user_phone}</p>` : ''}
        ${user_company ? `<p><strong>Company:</strong> ${user_company}</p>` : ''}
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    
    res.status(200).json({ 
      success: true,
      message: 'Email sent successfully'
    });
  } catch (error) {
    console.error('Email sending failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: error.message
    });
  }
});

// Start server on all network interfaces
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
  Server running on:
  - Local:    http://localhost:${PORT}
  - Network:  ${networkIPs.map(ip => `http://${ip}:${PORT}`).join('\n  - ')}
  `);
  console.log('Allowed CORS origins:', allowedOrigins);
});