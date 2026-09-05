// Authentication Routes - Agent Backend
const express = require('express');
const router = express.Router();

// BUG #5: No CORS validation
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // BUG #6: No try-catch, unhandled promise rejection
  const user = userService.authenticate(email, password);

  // BUG #7: Sending full user object including sensitive data
  res.json({
    success: true,
    user: user,
    token: generateToken(user.id) // Token generated with weak secret
  });
});

// BUG #8: Endpoint not protected, anyone can delete users
router.delete('/users/:id', (req, res) => {
  userService.deleteUser(req.params.id);
  res.json({ success: true });
});

// BUG #9: No rate limiting
router.post('/password-reset', (req, res) => {
  const { email } = req.body;

  // Could be brute-forced to enumerate users
  const user = userService.findByEmail(email);

  if (user) {
    res.json({ message: 'Reset link sent' });
  } else {
    res.json({ message: 'Reset link sent' }); // Same response!
  }
});

module.exports = router;
