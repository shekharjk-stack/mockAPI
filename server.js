const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const hotelRoutes = require('./routes/hotelRoutes');
const authRoutes = require('./routes/authRoutes');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/hotel', hotelRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Hotel Booking Mock API',
    version: '1.0.0'
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🏨 Hotel Booking Mock API is running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Authentication:`);
  console.log(`   Login: POST http://localhost:${PORT}/api/auth/login`);
  console.log(`   Profile: GET http://localhost:${PORT}/api/auth/profile`);
  console.log(`   Demo Credentials: GET http://localhost:${PORT}/api/auth/demo-credentials`);
  console.log(`🏨 Hotel Endpoints:`);
  console.log(`   Search: POST http://localhost:${PORT}/api/hotel/search`);
  console.log(`   Pre-book: POST http://localhost:${PORT}/api/hotel/prebook`);
  console.log(`   Book: POST http://localhost:${PORT}/api/hotel/book`);
  console.log(`   Cancel: POST http://localhost:${PORT}/api/hotel/cancel`);
  console.log(`   Edit: PUT http://localhost:${PORT}/api/hotel/edit`);
});

module.exports = app;