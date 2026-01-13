const Newsletter = require('../models/Newsletter');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASS
  }
});

exports.subscribe = async (req, res) => {
  try {
    const { email, name } = req.body;
    
    let subscriber = await Newsletter.findOne({ email });
    if (subscriber && subscriber.status === 'active') {
      return res.status(400).json({ error: 'Already subscribed' });
    }

    if (subscriber) {
      subscriber.status = 'active';
      subscriber.name = name;
      subscriber.subscribedAt = new Date();
      await subscriber.save();
    } else {
      subscriber = new Newsletter({ email, name });
      await subscriber.save();
    }

    // Send welcome email
    await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: 'Welcome to Wildlife Explorer!',
      html: `
        <h2>Welcome to the Conservation Community!</h2>
        <p>Thank you for joining ${name || 'our community'}. Stay updated on wildlife protection efforts.</p>
      `
    });

    res.json({ message: 'Successfully subscribed!', subscriber });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
