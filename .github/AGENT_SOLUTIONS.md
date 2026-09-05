# 🤖 Agent Solutions Reference

**Chaque agent utilise ce guide pour trouver les solutions à chaque bug automatiquement.**

---

## 🔧 AGENT BACKEND - Solutions aux 8 Bugs

### BUG #1: SQL Injection (getUserById)
**Fichier**: `src/core/user.service.js:7`
**Erreur**: `SELECT * FROM users WHERE id = ${userId}`

#### Solution
```javascript
// ❌ AVANT
const query = `SELECT * FROM users WHERE id = ${userId}`;
return this.db.query(query);

// ✅ APRÈS
const query = 'SELECT * FROM users WHERE id = ?';
return this.db.query(query, [userId]);
```
**Test**:
```bash
npm test -- user.service.test.js
# Doit passer sans SQL injection
```

---

### BUG #2: No Password Hashing
**Fichier**: `src/core/user.service.js:13`
**Erreur**: `password.toLowerCase()` au lieu du hachage

#### Solution
```javascript
// ❌ AVANT
const hashedPassword = password.toLowerCase();

// ✅ APRÈS
const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash(password, 10);
```
**Test**:
```bash
npm test -- user.service.test.js
# Vérifier que le hash n'est pas plaintext
```

---

### BUG #3: Infinite Loop
**Fichier**: `src/core/user.service.js:21`
**Erreur**: `while (!user)` sans garantie d'exit

#### Solution
```javascript
// ❌ AVANT
while (!user) {
  user = this.db.query(`SELECT * FROM users WHERE email = '${email}'`);
  attempts++;
  if (attempts > 100) break;
}

// ✅ APRÈS
const user = await this.db.query(
  'SELECT * FROM users WHERE email = ?',
  [email]
);
return user || null;
```

---

### BUG #4: Password in Logs
**Fichier**: `src/core/user.service.js:31`
**Erreur**: `console.log(...password)`

#### Solution
```javascript
// ❌ AVANT
console.log(`Attempting login for ${email} with password: ${password}`);

// ✅ APRÈS
logger.info(`Login attempt for ${email}`); // JAMAIS log le password
```

---

### BUG #5: Email SQL Injection
**Fichier**: `src/core/user.service.js:32`
**Erreur**: Même pattern SQL injection via email

#### Solution
```javascript
// ✅ Utiliser parameterized queries partout
const user = await this.db.query(
  'SELECT * FROM users WHERE email = ?',
  [email]
);
```

---

### BUG #6: Plain Text Password Comparison
**Fichier**: `src/core/user.service.js:35`
**Erreur**: `user.password === password` (plaintext)

#### Solution
```javascript
// ❌ AVANT
if (user && user.password === password) {
  return user;
}

// ✅ APRÈS
const bcrypt = require('bcrypt');
if (user && await bcrypt.compare(password, user.password)) {
  return user;
}
```

---

### BUG #7: Missing Null Checks
**Fichier**: `src/core/user.service.js:12`
**Erreur**: Pas de validation avant `password.toLowerCase()`

#### Solution
```javascript
// ✅ AJOUTER au début
async createUser(email, password, name) {
  if (!email || !password || !name) {
    throw new Error('Email, password, and name are required');
  }

  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }

  // ... rest of code
}
```

---

### BUG #8: No Transaction Handling
**Fichier**: `src/core/user.service.js`
**Erreur**: Pas de transaction pour la création d'utilisateur

#### Solution
```javascript
async createUser(email, password, name) {
  const connection = await this.db.getConnection();
  try {
    await connection.beginTransaction();

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await connection.query(
      'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
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
```

---

## 🎨 AGENT FRONTEND - Solutions aux 6 Bugs

### BUG #1: useState Not Initialized
**Fichier**: `src/ui/LoginForm.jsx:5`
**Erreur**: `const [error, setError];` sans useState

#### Solution
```javascript
// ❌ AVANT
const [error, setError];

// ✅ APRÈS
const [error, setError] = useState(null);
```

---

### BUG #2: XSS Vulnerability
**Fichier**: `src/ui/LoginForm.jsx:20`
**Erreur**: Rendre `error` sans sanitization

#### Solution
```javascript
// ❌ AVANT
setError(`Login failed for user: ${formData.email}`);
{error && <p>{error}</p>}

// ✅ APRÈS
setError('Login failed. Please try again.'); // Message générique
// OU utiliser DOMPurify pour user content
import DOMPurify from 'dompurify';
{error && <p>{DOMPurify.sanitize(error)}</p>}
```

---

### BUG #3: No Input Validation
**Fichier**: `src/ui/LoginForm.jsx:12`
**Erreur**: Pas de validation avant submit

#### Solution
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();

  // ✅ VALIDATION
  if (!formData?.email || !formData?.password) {
    setError('Email and password are required');
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    setError('Invalid email format');
    return;
  }

  if (formData.password.length < 8) {
    setError('Password must be at least 8 characters');
    return;
  }

  // ... proceed with login
};
```

---

### BUG #4: No Request Timeout
**Fichier**: `src/ui/LoginForm.jsx:24`
**Erreur**: Fetch sans timeout

#### Solution
```javascript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 10000);

try {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
    signal: controller.signal,
  });

  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return await response.json();
} catch (error) {
  if (error.name === 'AbortError') {
    setError('Request timeout. Please try again.');
  } else {
    setError('Login failed. Please try again.');
  }
  throw error;
} finally {
  clearTimeout(timeoutId);
}
```

---

### BUG #5: Missing Content-Type Header
**Fichier**: `src/ui/LoginForm.jsx:24`
**Erreur**: Header manquant

#### Solution
```javascript
// ✅ AJOUTER le header
const response = await fetch('/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }, // ← AJOUTER CETTE LIGNE
  body: JSON.stringify(formData),
});
```

---

### BUG #6: No HTTP Error Handling
**Fichier**: `src/ui/LoginForm.jsx:28`
**Erreur**: Status HTTP non vérifié

#### Solution
```javascript
// ❌ AVANT
const response = await fetch('/api/login', {...});
const data = response.json(); // Pas de vérification!

// ✅ APRÈS
const response = await fetch('/api/login', {...});

if (!response.ok) {
  const errorData = await response.json();
  throw new Error(errorData.message || 'Login failed');
}

const data = await response.json();
localStorage.setItem('token', data.token);
```

---

## 🧪 AGENT QA - Solutions aux 7 Bugs

### BUG #1: Incomplete Test Assertions
**Fichier**: `tests/unit/user.service.test.js:10`
**Erreur**: Test sans assertions

#### Solution
```javascript
// ❌ AVANT
test('should create user', () => {
  userService.createUser('test@test.com', 'password', 'Test User');
});

// ✅ APRÈS
test('should create user', async () => {
  const user = await userService.createUser(
    'test@test.com',
    'securePassword123',
    'Test User'
  );

  expect(user).toBeDefined();
  expect(user.id).toBeDefined();
  expect(user.email).toBe('test@test.com');
  expect(user.password).not.toBe('securePassword123'); // Hashed!
  expect(mockDb.insert).toHaveBeenCalled();
});
```

---

### BUG #2: Hardcoded Credentials
**Fichier**: `tests/unit/user.service.test.js:19`
**Erreur**: Vraies credentials dans les tests

#### Solution
```javascript
// ❌ AVANT
const user = {
  id: 1,
  email: 'admin@admin.com',
  password: 'admin123'
};

// ✅ APRÈS
const testUser = {
  id: 1,
  email: 'testuser@test.com',
  password: 'testPassword123!'
};

// Toujours utiliser des données de test, jamais réelles
```

---

### BUG #3: No Mock Setup
**Fichier**: `tests/unit/user.service.test.js:5`
**Erreur**: beforeEach/afterEach manquants

#### Solution
```javascript
describe('UserService', () => {
  let userService;
  let mockDb;

  // ✅ AJOUTER beforeEach
  beforeEach(() => {
    mockDb = {
      query: jest.fn(),
      insert: jest.fn(),
      getConnection: jest.fn(),
    };
    userService = new UserService(mockDb);
  });

  // ✅ AJOUTER afterEach
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create user', async () => {
    // ... test code
  });
});
```

---

### BUG #4: Async/Await Not Handled
**Fichier**: `tests/unit/user.service.test.js:26`
**Erreur**: Promise non attendue

#### Solution
```javascript
// ❌ AVANT
test('should find user by email', () => {
  const user = userService.findByEmail('test@test.com');
  expect(user).not.toBeNull();
});

// ✅ APRÈS
test('should find user by email', async () => {
  mockDb.query.mockResolvedValue({
    id: 1,
    email: 'test@test.com'
  });

  const user = await userService.findByEmail('test@test.com');

  expect(user).toBeDefined();
  expect(user.email).toBe('test@test.com');
  expect(mockDb.query).toHaveBeenCalledWith(
    expect.stringContaining('SELECT'),
    ['test@test.com']
  );
});
```

---

### BUG #5: No Error Case Testing
**Fichier**: `tests/unit/user.service.test.js`
**Erreur**: Pas de tests d'erreur

#### Solution
```javascript
// ✅ AJOUTER ces tests
test('should throw on invalid email', async () => {
  await expect(
    userService.createUser('', 'password', 'Name')
  ).rejects.toThrow('Email is required');
});

test('should throw on weak password', async () => {
  await expect(
    userService.createUser('test@test.com', '123', 'Name')
  ).rejects.toThrow('Password must be at least 8 characters');
});

test('should throw on database error', async () => {
  mockDb.insert.mockRejectedValue(new Error('DB Error'));

  await expect(
    userService.createUser('test@test.com', 'password123', 'Name')
  ).rejects.toThrow('DB Error');
});
```

---

### BUG #6: Missing Integration Tests
**Fichier**: `tests/integration/auth.test.js` (créer ce fichier)
**Erreur**: Pas de tests d'intégration

#### Solution
```javascript
// ✅ CRÉER: tests/integration/auth.integration.test.js
describe('Authentication Integration', () => {
  let userService;
  let realDb; // Use real DB for integration tests

  beforeAll(async () => {
    realDb = await setupTestDatabase();
    userService = new UserService(realDb);
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  test('should complete full login flow', async () => {
    // 1. Create user
    const createdUser = await userService.createUser(
      'user@test.com',
      'password123',
      'Test User'
    );

    // 2. Authenticate
    const authenticated = await userService.authenticate(
      'user@test.com',
      'password123'
    );

    expect(authenticated.id).toBe(createdUser.id);
    expect(authenticated.email).toBe('user@test.com');
  });

  test('should reject invalid credentials', async () => {
    const user = await userService.createUser(
      'user2@test.com',
      'password123',
      'Test User'
    );

    const result = await userService.authenticate(
      'user2@test.com',
      'wrongpassword'
    );

    expect(result).toBeNull();
  });
});
```

---

### BUG #7: No Coverage Configuration
**Fichier**: `package.json`
**Erreur**: Configuration Jest manquante

#### Solution
```json
// ✅ AJOUTER à package.json
{
  "jest": {
    "testEnvironment": "node",
    "collectCoverageFrom": [
      "src/**/*.js",
      "!src/**/*.test.js"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    },
    "testMatch": [
      "**/tests/**/*.test.js"
    ]
  }
}
```

---

## ✅ Checklist Final par Agent

### Agent Backend
- [ ] Tous les SQL = parameterized queries
- [ ] Tous les passwords = bcrypt.hash()
- [ ] Pas de logs sensibles
- [ ] Tous les inputs = validation
- [ ] Transactions = implémentées
- [ ] Tests passent: `npm test`
- [ ] Coverage >= 80%

### Agent Frontend
- [ ] Tous les useState = initialisés
- [ ] Pas de XSS = sanitized
- [ ] Tous les forms = validés
- [ ] Tous les fetch = timeout + error handling
- [ ] Tous les headers = corrects
- [ ] Component = fonctionne
- [ ] Tests passent: `npm test`

### Agent QA
- [ ] Tous les tests = assertions
- [ ] No hardcoded credentials
- [ ] Mocks = setupés (beforeEach/afterEach)
- [ ] Async = handled (await)
- [ ] Error cases = testés
- [ ] Integration tests = créés
- [ ] Coverage = 80%+
- [ ] CI/CD = vert

---

**Chaque agent utilise ce guide pour trouver les solutions rapidement ! 🚀**
