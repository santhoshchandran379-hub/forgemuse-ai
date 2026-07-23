require('dotenv').config();
const dns = require('dns');

dns.setServers(['8.8.8.8']);

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const aiRoutes = require('./routes/ai');

const app = express();

// ------------------------
// Security & Middleware
// ------------------------
app.use(helmet());
app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ------------------------
// CORS
// ------------------------
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:3000',
    'https://forgemuseai.com',
    'https://www.forgemuseai.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ------------------------
// Rate Limiters
// ------------------------
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api', globalLimiter);

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10
});

app.use('/api/ai', aiLimiter);

// ------------------------
// Routes
// ------------------------
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/ai', aiRoutes);

// ------------------------
// Health Check
// ------------------------
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'ForgeMuse AI API is running',
    environment: process.env.NODE_ENV || 'development'
  });
});

// ------------------------
// 404
// ------------------------
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// ------------------------
// Error Handler
// ------------------------
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// ------------------------
// Database & Server
// ------------------------
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');

    app.listen(PORT, () => {
      console.log(`🚀 ForgeMuse AI API running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health: http://localhost:${PORT}/health`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

module.exports = app;