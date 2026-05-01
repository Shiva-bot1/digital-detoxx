import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const Login = () => {
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { login }   = useAuth();
  const navigate    = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await loginUser(form);
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,232,122,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }}/>

      <div style={{
        width: '100%', maxWidth: '420px', padding: '40px',
        background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: '20px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <Logo size={44} />
          </div>
          <h1 style={{
            fontFamily: "'Syne', sans-serif", fontSize: '24px',
            fontWeight: 800, marginBottom: '8px',
          }}>Welcome back</h1>
          <p style={{ color: 'var(--muted)', fontSize: '14px' }}>
            Sign in to track your digital wellness
          </p>
        </div>

        {error && (
          <div style={{
            padding: '12px 16px', borderRadius: '10px', marginBottom: '20px',
            background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.3)',
            color: '#ff4d6d', fontSize: '14px',
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          {[
            { label: 'Email',    name: 'email',    type: 'email' },
            { label: 'Password', name: 'password', type: 'password' },
          ].map(({ label, name, type }) => (
            <div key={name} style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block', fontSize: '13px', fontWeight: 500,
                color: 'var(--muted)', marginBottom: '8px',
              }}>{label}</label>
              <input
                type={type} name={name}
                value={form[name]} onChange={handleChange}
                required
                style={{
                  width: '100%', padding: '12px 16px',
                  background: 'var(--bg3)', border: '1px solid var(--border)',
                  borderRadius: '10px', color: 'var(--text)', fontSize: '14px',
                  outline: 'none', transition: 'border 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e  => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
          ))}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '13px',
            background: loading ? 'var(--accent2)' : 'var(--accent)',
            border: 'none', borderRadius: '10px',
            color: '#0a0f0d', fontWeight: 700, fontSize: '15px',
            marginTop: '8px', transition: 'all 0.2s',
          }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{
          textAlign: 'center', marginTop: '24px',
          fontSize: '14px', color: 'var(--muted)',
        }}>
          No account?{' '}
          <Link to="/register" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;