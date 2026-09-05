// Login Form Component - Agent Frontend
import React, { useState } from 'react';

// ✅ Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginForm() {
  // ✅ FIXED #1: Properly initialize all state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null); // ✅ FIXED: Added useState!
  const [loading, setLoading] = useState(false);

  // ✅ FIXED #2-6: Complete form handling with validation and error handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    // ✅ FIXED #3: Input validation
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
    }

    if (!EMAIL_REGEX.test(formData.email)) {
      setError('Invalid email format');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      // ✅ FIXED #4: Add request timeout with AbortController
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      // ✅ FIXED #5: Add Content-Type header
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // ✅ FIXED #6: Check HTTP response status
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: `HTTP ${response.status}`
        }));
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();

      // ✅ Validate token exists before storing
      if (!data.token) {
        throw new Error('No token received from server');
      }

      // ✅ Store token securely
      localStorage.setItem('token', data.token);

      // ✅ Redirect to dashboard or home
      window.location.href = '/dashboard';

    } catch (err) {
      // ✅ FIXED #2: Proper error handling
      if (err.name === 'AbortError') {
        setError('Request timeout. Please try again.');
      } else if (err instanceof SyntaxError) {
        setError('Server returned invalid response');
      } else {
        // ✅ FIXED #2: Generic error message (don't expose internals)
        setError(err.message || 'Login failed. Please try again.');
      }

      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter your email"
          disabled={loading}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Enter your password"
          disabled={loading}
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>

      {/* ✅ FIXED #2: Safe error display (no XSS) */}
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}
    </form>
  );
}
