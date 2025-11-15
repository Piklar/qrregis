const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Connect to database
connectDB();

// =============================
//         CORS WHITELIST
// =============================
const whitelist = [
  'https://innovaitqr.vercel.app',  // Your deployed frontend
  'http://127.0.0.1:5500',          // Local HTML / Live Server
  'http://localhost:3000'           // React local dev
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow if origin is in whitelist OR if no origin (ex: Postman)
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));
// =============================


// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/admin', require('./routes/AdminRoutes'));
app.use('/api/attendance', require('./routes/AttendanceRoutes'));
app.use('/api/courses', require('./routes/CourseRoutes'));
app.use('/api', require('./routes/StudentRoutes'));


// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});
