require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Import routes AFTER mongoose models are defined
const animalRoutes = require('./routes/animals');
const newsletterRoutes = require('./routes/newsletter');
const authRoutes = require('./routes/auth');
const adminAnimalRoutes = require('./routes/adminAnimals');
const reserveRoutes = require('./routes/reserves'); // Add this if you have it

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ 1. BODY PARSERS FIRST (CRITICAL)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ✅ 2. SECURITY MIDDLEWARE
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// ✅ 3. CORS (after body parsers)
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      'http://localhost:5174',
      'http://localhost:3000',
      process.env.CORS_ORIGIN
    ].filter(Boolean);
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// ✅ 4. MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ 5. ROUTES (after all middleware)
app.use('/api/auth', authRoutes);
app.use('/api/admin/animals', adminAnimalRoutes);
app.use('/api/animals', animalRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/reserves', reserveRoutes); // Add if exists

// ✅ 6. SEED endpoint
app.post('/api/seed', async (req, res) => {
  try {
    const Animal = require('./models/Animal'); // Import here to avoid circular dependency
    await Animal.deleteMany({});
    
    const seedAnimals = [ /* your seed data - PERFECT! */ ];
    await Animal.insertMany(seedAnimals);
    
    res.json({ message: 'Database seeded successfully', count: seedAnimals.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ 7. Health check LAST
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


// 404 handler (for unknown routes)
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found', path: req.originalUrl });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('GLOBAL ERROR:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    stack: err.stack,
    location: 'global-error-handler',
  });
});
