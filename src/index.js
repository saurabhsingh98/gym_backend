require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

// Route imports
const gymRoutes = require('./routes/gymRoutes');
const ownerRoutes = require('./routes/ownerRoutes');
const gymOwnerMappingRoutes = require('./routes/gymOwnerMappingRoutes');
const planRoutes = require('./routes/planRoutes');
const memberRoutes = require('./routes/memberRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

// API Routes
app.use('/api/v1/gyms', gymRoutes);
app.use('/api/v1/owners', ownerRoutes);
app.use('/api/v1/gym-owner-mappings', gymOwnerMappingRoutes);
app.use('/api/v1/plans', planRoutes);
app.use('/api/v1/members', memberRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Gym Management System API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      gyms: '/api/v1/gyms',
      owners: '/api/v1/owners',
      mappings: '/api/v1/gym-owner-mappings',
      plans: '/api/v1/plans',
      members: '/api/v1/members',
      dashboard: '/api/v1/dashboard',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
