// Email Sending Backend Service
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..')));

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// API endpoint to send emails
app.post('/api/send-email', async (req, res) => {
  try {
    const { firstName, lastName, phone, email, company, website, comments, smsConsent } = req.body;
    
    if (!phone || !email) {
      return res.status(400).json({ success: false, message: 'Phone and email are required fields' });
    }
    
    // Email to site owner
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'lennoxlocaladsflyer@gmail.com',
      subject: 'New Spot Reservation from Gigante Print Media Website',
      html: `
        <h2>New Reservation Request</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company || 'Not provided'}</p>
        <p><strong>Website:</strong> ${website || 'Not provided'}</p>
        <p><strong>SMS consent:</strong> ${smsConsent ? 'Yes' : 'No'}</p>
        <h3>Comments:</h3>
        <p>${comments || 'No comments'}</p>
      `
    };
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    // Also send confirmation email to customer
    const confirmationMail = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Gigante Print Media Spot Reservation',
      html: `
        <h2>Thank you for your reservation, ${firstName}!</h2>
        <p>We've received your request to secure a spot in our upcoming direct mail campaign.</p>
        <p>A member of our team will contact you shortly to confirm the details.</p>
        <h3>Your submitted information:</h3>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company || 'Not provided'}</p>
        <p><strong>Comments:</strong> ${comments || 'None'}</p>
        <hr>
        <p>If you have any questions, please contact us at:</p>
        <p>Phone: (562) 282-9498</p>
        <p>Email: lennoxlocaladsflyer@gmail.com</p>
        <p>Thank you for choosing Gigante Print Media!</p>
      `
    };
    
    await transporter.sendMail(confirmationMail);
    
    // Log success and return response
    console.log('Emails sent successfully:', info.messageId);
    res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully!',
      messageId: info.messageId 
    });
    
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send email', 
      error: error.message 
    });
  }
});

// Basic error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    error: err.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; // For testing purposes