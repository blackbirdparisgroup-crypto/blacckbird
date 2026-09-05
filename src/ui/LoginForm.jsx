// Login Form Component - Agent Frontend
import React, { useState } from 'react';

export function LoginForm() {
  // BUG #10: State not properly initialized
  const [formData, setFormData] = useState();
  const [error, setError]; // Missing useState!
  const [loading, setLoading] = useState(false);

  // BUG #11: No validation before sending
  const handleSubmit = async (e) => {
    e.preventDefault();

    // BUG #12: XSS vulnerability - directly rendering user input
    setError(`Login failed for user: ${formData.email}`);

    try {
      // BUG #13: No timeout, request can hang forever
      const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(formData),
        // Missing Content-Type header
      });

      // BUG #14: Not handling response errors properly
      const data = response.json();
      localStorage.setItem('token', data.token); // No validation!

    } catch (err) {
      // BUG #15: Swallowing errors, no user feedback
      console.error(err);
    }
  };

  // BUG #16: Using array index as key
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData?.email}
        onChange={(e) => setFormData({ email: e.target.value })}
        placeholder="Email"
      />

      <input
        type="password"
        value={formData?.password}
        onChange={(e) => setFormData({ password: e.target.value })}
        placeholder="Password"
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>

      {error && <p>{error}</p>} {/* XSS vulnerable */}
    </form>
  );
}
