'use client';

import { useState } from 'react';

export default function TestLoginPage() {
  const [email, setEmail] = useState('test@cashwise.com');
  const [password, setPassword] = useState('password123');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

  const testLogin = async () => {
    setError('');
    setResponse('');

    try {
      console.log('Testing login with:', { email, password });

      const res = await fetch('http://localhost:3001/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log('Response:', data);

      if (res.ok) {
        setResponse(JSON.stringify(data, null, 2));
        // Store tokens
        if (data.accessToken) {
          localStorage.setItem('token', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
        }
      } else {
        setError(JSON.stringify(data, null, 2));
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '1rem' }}>Test Login Page</h1>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              display: 'block',
              width: '300px',
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              marginTop: '0.25rem',
            }}
          />
        </label>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              display: 'block',
              width: '300px',
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              marginTop: '0.25rem',
            }}
          />
        </label>
      </div>

      <button
        onClick={testLogin}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#4F46E5',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '1rem',
        }}
      >
        Test Login
      </button>

      {response && (
        <div style={{ marginTop: '1rem' }}>
          <h3 style={{ color: 'green', marginBottom: '0.5rem' }}>Success Response:</h3>
          <pre style={{
            backgroundColor: '#f0f0f0',
            padding: '1rem',
            borderRadius: '4px',
            overflow: 'auto',
          }}>
            {response}
          </pre>
        </div>
      )}

      {error && (
        <div style={{ marginTop: '1rem' }}>
          <h3 style={{ color: 'red', marginBottom: '0.5rem' }}>Error:</h3>
          <pre style={{
            backgroundColor: '#ffe0e0',
            padding: '1rem',
            borderRadius: '4px',
            overflow: 'auto',
          }}>
            {error}
          </pre>
        </div>
      )}

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#e0f2fe', borderRadius: '4px' }}>
        <h3 style={{ marginBottom: '0.5rem' }}>System Status:</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>✅ Frontend: {typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}</li>
          <li>✅ Auth API: http://localhost:3001</li>
          <li>✅ Test User: test@cashwise.com / password123</li>
        </ul>
      </div>
    </div>
  );
}