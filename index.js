const express = require('express');
const UserService = require('./src/core/user.service');
const authRoutes = require('./src/api/auth.route');

const app = express();
const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api', authRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    version: '2.0.0',
    environment: ENV,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    app: 'Blackbird',
    version: '2.0.0',
    status: 'healthy',
    memory: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
    uptime: Math.floor(process.uptime()) + 's',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.path
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: ENV === 'development' ? err.message : 'Server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║           ✅ Blackbird v2.0.0 - Application Started        ║
╚════════════════════════════════════════════════════════════╝

🚀 Server running on port ${PORT}
📍 Environment: ${ENV}
⏰ Started: ${new Date().toISOString()}

📌 API ENDPOINTS:
  GET    /api/health         - Health check
  GET    /api/status         - Server status
  POST   /api/login          - User login
  DELETE /api/users/:id      - Delete account
  POST   /api/password-reset - Reset password

🔐 SECURITY:
  ✅ JWT Authentication
  ✅ Rate Limiting
  ✅ bcrypt Hashing
  ✅ HTTPS Ready
  ✅ Input Validation

════════════════════════════════════════════════════════════
  `);
});
