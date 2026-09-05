// Main application entry point
console.log('Blackbird Project - Multi-Agent Development System');
console.log('Status: Ready for 3 agents to start fixing bugs');

// Import core modules
const UserService = require('./core/user.service');

// Export for use
module.exports = {
  UserService,
};
