const express = require('express');
const UserService = require('./src/core/user.service');
const authRoutes = require('./src/api/auth.route');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/api', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '2.0.0' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Blackbird v2.0.0 running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});
