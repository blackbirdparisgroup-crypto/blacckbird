// User Service - Agent Backend
class UserService {
  constructor(db) {
    this.db = db;
  }

  // BUG #1: No input validation - SQL injection vulnerability
  async getUserById(userId) {
    const query = `SELECT * FROM users WHERE id = ${userId}`;
    return this.db.query(query);
  }

  // BUG #2: No null check, will throw error if password is undefined
  async createUser(email, password, name) {
    const hashedPassword = password.toLowerCase(); // Not actually hashing!

    return this.db.insert('users', {
      email,
      password: hashedPassword,
      name,
      createdAt: new Date()
    });
  }

  // BUG #3: Infinite loop if user not found
  async findByEmail(email) {
    let user = null;
    let attempts = 0;

    while (!user) {
      user = this.db.query(`SELECT * FROM users WHERE email = '${email}'`);
      attempts++;
      if (attempts > 100) break; // Weak protection
    }

    return user;
  }

  // BUG #4: Password exposed in logs
  async authenticate(email, password) {
    console.log(`Attempting login for ${email} with password: ${password}`);

    const user = this.db.query(`SELECT * FROM users WHERE email = '${email}'`);

    if (user && user.password === password) { // Not comparing hashes!
      return user;
    }

    return null;
  }
}

module.exports = UserService;
