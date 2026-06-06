import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const Register = () => {
  const [form,    setForm]    = useState({ name:'', email:'', password:'', confirm:'' });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate     = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim())
      newErrors.name = 'Full name is required.';
    if (!isValidEmail(form.email))
      newErrors.email = 'Please enter a valid email address.';
    if (form.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters.';
    if (form.password !== form.confirm)
      newErrors.confirm = 'Passwords do not match.';
    return newErrors;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setErrors({ general: err.message || 'Registration failed. Try again.' });
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label:'Full Name',        name:'name',     type:'text',     placeholder:'Shiva' },
    { label:'Email',            name:'email',    type:'email',    placeholder:'shiva@email.com' },
    { label:'Password',         name:'password', type:'password', placeholder:'Min. 6 characters' },
    { label:'Confirm Password', name:'confirm',  type:'password', placeholder:'Re-enter password' },
  ];

  return (
    <div style={{
      minHeight:'100vh', display:'flex',
      alignItems:'center', justifyContent:'center',
      background:'var(--bg)',
    }}>
      <div style={{
        position:'fixed', top:'20%', left:'50%', transform:'translateX(-50%)',
        width:'600px', height:'600px', borderRadius:'50%',
        background:'radial-gradient(circle, rgba(0,232,122,0.06) 0%, transparent 70%)',
        pointerEvents:'none',
      }}/>

      <div style={{
        width:'100%', maxWidth:'420px', padding:'40px',
        background:'var(--card)', border:'1px solid var(--border)',
        borderRadius:'20px',
      }}>
        <div style={{ textAlign:'center', marginBottom:'32px' }}>
          <div style={{ display:'flex', justifyContent:'center', marginBottom:'20px' }}>
            <Logo size={44}/>
          </div>
          <h1 style={{
            fontFamily:"'Syne', sans-serif", fontSize:'22px',
            fontWeight:800, marginBottom:'6px',
          }}>Start your detox</h1>
          <p style={{ color:'var(--muted)', fontSize:'13px' }}>
            Create your SvaZen account
          </p>
        </div>

        {errors.general && (
          <div style={{
            padding:'12px 16px', borderRadius:'10px', marginBottom:'20px',
            background:'rgba(255,77,109,0.1)', border:'1px solid rgba(255,77,109,0.3)',
            color:'#ff4d6d', fontSize:'14px',
          }}>{errors.general}</div>
        )}

        <form onSubmit={handleSubmit}>
          {fields.map(({ label, name, type, placeholder }) => (
            <div key={name} style={{ marginBottom:'16px' }}>
              <label style={{
                display:'block', fontSize:'13px', fontWeight:500,
                color:'var(--muted)', marginBottom:'8px',
              }}>{label}</label>
              <input
                type={type} name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={placeholder}
                required
                style={{
                  width:'100%', padding:'12px 16px',
                  background:'var(--bg3)',
                  border: `1px solid ${errors[name] ? '#ff4d6d' : 'var(--border)'}`,
                  borderRadius:'10px', color:'var(--text)', fontSize:'14px',
                  outline:'none', transition:'border 0.2s',
                  fontFamily:"'Space Grotesk', sans-serif",
                }}
                onFocus={e => e.target.style.borderColor = errors[name] ? '#ff4d6d' : 'var(--accent)'}
                onBlur={e  => e.target.style.borderColor = errors[name] ? '#ff4d6d' : 'var(--border)'}
              />
              {errors[name] && (
                <p style={{ fontSize:'12px', color:'#ff4d6d', marginTop:'6px' }}>
                  {errors[name]}
                </p>
              )}
            </div>
          ))}

          <button type="submit" disabled={loading} style={{
            width:'100%', padding:'13px',
            background: loading ? 'var(--accent2)' : 'var(--accent)',
            border:'none', borderRadius:'10px',
            color:'#0a0f0d', fontWeight:700, fontSize:'15px',
            marginTop:'8px', cursor:'pointer',
            fontFamily:"'Space Grotesk', sans-serif",
          }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{
          textAlign:'center', marginTop:'24px',
          fontSize:'14px', color:'var(--muted)',
        }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color:'var(--accent)', textDecoration:'none', fontWeight:600 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;