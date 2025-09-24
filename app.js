const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const userRoutes = require('./routes/users');
const progressRoutes = require('./routes/progress');
const foodLogRoutes = require('./routes/foodLogs');
const exerciseLogRoutes = require('./routes/exerciseLogs');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/food-logs', foodLogRoutes);
app.use('/api/exercise-logs', exerciseLogRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Fitness Tracker API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://kishore:kishore1329005@cluster.vhyes9r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});


// Start the server when running app.js directly
if (require.main === module) {
  startServer();
}

// Export for testing
module.exports = { app, startServer };
