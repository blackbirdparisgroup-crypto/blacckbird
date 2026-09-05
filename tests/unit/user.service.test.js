// Tests - Agent QA
const UserService = require('../../src/core/user.service');

// ✅ FIXED: Proper test setup with mocks
describe('UserService', () => {
  let userService;
  let mockDb;

  // ✅ FIXED #18: Setup beforeEach for proper initialization
  beforeEach(() => {
    mockDb = {
      query: jest.fn(),
      insert: jest.fn(),
      getConnection: jest.fn(),
    };
    userService = new UserService(mockDb);
  });

  // ✅ FIXED #18: Cleanup after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  // ✅ FIXED #19: Complete test with assertions
  describe('createUser', () => {
    test('should throw on invalid email', async () => {
      await expect(
        userService.createUser('', 'password', 'Name')
      ).rejects.toThrow('Email, password, and name are required');
    });

    test('should throw on weak password', async () => {
      await expect(
        userService.createUser('test@test.com', '123', 'Name')
      ).rejects.toThrow('Password must be at least 8 characters');
    });

    test('should throw on missing fields', async () => {
      await expect(
        userService.createUser('test@test.com', 'password123', null)
      ).rejects.toThrow('Email, password, and name are required');
    });
  });

  // ✅ FIXED #20 & #21: Proper async/await with test data
  describe('authenticate', () => {
    test('should throw on missing credentials', async () => {
      await expect(
        userService.authenticate('', 'password')
      ).rejects.toThrow('Email and password are required');
    });

    test('should return null if user not found', async () => {
      mockDb.query.mockResolvedValue(null);

      const result = await userService.authenticate(
        'nonexistent@test.com',
        'password'
      );

      expect(result).toBeNull();
    });

    test('should validate parameterized query', async () => {
      mockDb.query.mockResolvedValue(null);

      await userService.authenticate('test@test.com', 'password');

      expect(mockDb.query).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE email = ?',
        ['test@test.com']
      );
    });
  });

  // ✅ FIXED #21: Proper async/await handling
  describe('findByEmail', () => {
    test('should throw on invalid email', async () => {
      await expect(
        userService.findByEmail('')
      ).rejects.toThrow('Email is required');
    });

    test('should return null if user not found', async () => {
      mockDb.query.mockResolvedValue(null);

      const result = await userService.findByEmail('nonexistent@test.com');

      expect(result).toBeNull();
    });

    test('should use parameterized queries', async () => {
      mockDb.query.mockResolvedValue({ id: 1, email: 'test@test.com' });

      const result = await userService.findByEmail('test@test.com');

      expect(result).toBeDefined();
      expect(result.email).toBe('test@test.com');
      expect(mockDb.query).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE email = ?',
        ['test@test.com']
      );
    });
  });

  describe('getUserById', () => {
    test('should throw on invalid user ID', async () => {
      await expect(
        userService.getUserById('invalid')
      ).rejects.toThrow('Invalid user ID');
    });

    test('should throw on missing user ID', async () => {
      await expect(
        userService.getUserById(null)
      ).rejects.toThrow('Invalid user ID');
    });

    test('should use parameterized queries to prevent SQL injection', async () => {
      mockDb.query.mockResolvedValue(null);

      await userService.getUserById(1);

      expect(mockDb.query).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE id = ?',
        [1]
      );
    });
  });

  // ✅ FIXED #22: SQL Injection protection tests
  describe('Security', () => {
    test('should validate user ID format before query', async () => {
      await expect(
        userService.getUserById("1 OR 1=1")
      ).rejects.toThrow('Invalid user ID');
    });

    test('should always use parameterized queries', async () => {
      mockDb.query.mockResolvedValue(null);

      await userService.getUserById(1);

      const callArgs = mockDb.query.mock.calls[0];
      expect(callArgs[1]).toBeDefined(); // Should have parameters array
      expect(callArgs[0]).toContain('?'); // Should have placeholders
    });
  });
});
