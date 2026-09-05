-- Initialize Blackbird database

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- Sample data (for testing)
INSERT INTO users (email, password, name) VALUES 
  ('admin@example.com', '$2b$10$example', 'Admin User')
ON CONFLICT DO NOTHING;

SELECT 'Database initialized successfully' as status;
