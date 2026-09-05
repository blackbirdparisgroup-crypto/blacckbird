// User Service - Agent Backend
const bcrypt = require('bcrypt');

class UserService {
  constructor(db) {
    this.db = db;
    this.logger = console; // Can be replaced with proper logger
  }

  // ✅ FIXED #1: SQL Injection - Using parameterized queries
  async getUserById(userId) {
    if (!userId || isNaN(userId)) {
      throw new Error('Invalid user ID');
    }

    const query = 'SELECT * FROM users WHERE id = ?';
    return this.db.query(query, [userId]);
  }

  // ✅ FIXED #2 & #7: Input validation + bcrypt hashing
  async createUser(email, password, name) {
    // Validate inputs
    if (!email || !password || !name) {
      throw new Error('Email, password, and name are required');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Invalid email format');
    }

    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }

    // ✅ FIXED #8: Transaction handling
    const connection = await this.db.getConnection();
    try {
      await connection.beginTransaction();

      // ✅ FIXED #2: Use bcrypt for password hashing
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await connection.query(
        'INSERT INTO users (email, password, name, created_at) VALUES (?, ?, ?, NOW())',
        [email, hashedPassword, name]
      );

      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // ✅ FIXED #3 & #5: Removed infinite loop + SQL injection fix
  async findByEmail(email) {
    if (!email) {
      throw new Error('Email is required');
    }

    // Direct query with parameterized query
    const query = 'SELECT * FROM users WHERE email = ?';
    const user = await this.db.query(query, [email]);

    return user || null;
  }

  // ✅ FIXED #4 & #6: Remove password from logs + use bcrypt.compare()
  async authenticate(email, password) {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // ✅ Log without sensitive data
    this.logger.info(`Login attempt for ${email}`);

    const query = 'SELECT * FROM users WHERE email = ?';
    const user = await this.db.query(query, [email]);

    if (!user) {
      // Don't reveal if email exists
      this.logger.warn(`Login failed: user not found for ${email}`);
      return null;
    }

    // ✅ FIXED #6: Use bcrypt.compare() to verify password hash
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      this.logger.warn(`Login failed: invalid password for ${email}`);
      return null;
    }

    // Successful login - don't return password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Helper method for password reset
  async updatePassword(userId, newPassword) {
    if (!newPassword || newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const query = 'UPDATE users SET password = ? WHERE id = ?';
    return this.db.query(query, [hashedPassword, userId]);
  }
}

module.exports = UserService;
