import React, { useState, useEffect } from 'react';
import { getGoals, setGoal } from '../services/api';
import Navbar from '../components/Navbar';
import { RiAddLine, RiCheckLine } from 'react-icons/ri';

const APPS = ['Instagram','YouTube','Twitter','TikTok','Netflix','Reddit','WhatsApp','Other'];

const Settings = () => {
  const [goals,   setGoals]   = useState([]);
  const [form,    setForm]    = useState({ appName: 'Instagram', dailyLimitMinutes: '' });
  const [saved,   setSaved]   = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchGoals = async () => {
    try {
      const { data } = await getGoals();
      setGoals(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGoals(); }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await setGoal({ ...form, dailyLimitMinutes: Number(form.dailyLimitMinutes) });
      setSaved(true);
      setForm({ appName: 'Instagram', dailyLimitMinutes: '' });
      fetchGoals();
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '32px 24px' }}>

        <h1 style={{
          fontFamily: "'Syne', sans-serif", fontSize: '28px',
          fontWeight: 800, marginBottom: '8px',
        }}>Settings</h1>
        <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '32px' }}>
          Set daily screen time limits for your apps
        </p>

        {/* Add Goal Form */}
        <div style={{
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: '16px', padding: '28px', marginBottom: '24px',
        }}>
          <h3 style={{ fontWeight: 600, marginBottom: '20px' }}>Add a Goal</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block', fontSize: '13px',
                color: 'var(--muted)', marginBottom: '8px',
              }}>App</label>
              <select
                value={form.appName}
                onChange={e => setForm({ ...form, appName: e.target.value })}
                style={{
                  width: '100%', padding: '12px 14px',
                  background: 'var(--bg3)', border: '1px solid var(--border)',
                  borderRadius: '10px', color: 'var(--text)', fontSize: '14px',
                }}
              >
                {APPS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block', fontSize: '13px',
                color: 'var(--muted)', marginBottom: '8px',
              }}>Daily Limit (minutes)</label>
              <input
                type="number" min="1" placeholder="e.g. 60"
                value={form.dailyLimitMinutes}
                onChange={e => setForm({ ...form, dailyLimitMinutes: e.target.value })}
                required
                style={{
                  width: '100%', padding: '12px 14px',
                  background: 'var(--bg3)', border: '1px solid var(--border)',
                  borderRadius: '10px', color: 'var(--text)', fontSize: '14px',
                  outline: 'none',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e  => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            <button type="submit" style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '12px 24px',
              background: saved ? 'var(--accent2)' : 'var(--accent)',
              border: 'none', borderRadius: '10px',
              color: '#0a0f0d', fontWeight: 700, fontSize: '14px',
              transition: 'all 0.2s',
            }}>
              {saved ? <><RiCheckLine size={16}/> Saved!</> : <><RiAddLine size={16}/> Add Goal</>}
            </button>
          </form>
        </div>

        {/* Existing Goals */}
        <div style={{
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: '16px', padding: '28px',
        }}>
          <h3 style={{ fontWeight: 600, marginBottom: '20px' }}>Your Goals</h3>
          {loading ? (
            <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Loading...</p>
          ) : goals.length === 0 ? (
            <p style={{ color: 'var(--muted)', fontSize: '14px' }}>No goals set yet.</p>
          ) : (
            goals.map(goal => (
              <div key={goal.id} style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', padding: '14px 0',
                borderBottom: '1px solid var(--border)',
              }}>
                <span style={{ fontWeight: 600 }}>{goal.app_name}</span>
                <span style={{
                  padding: '4px 12px', borderRadius: '20px', fontSize: '13px',
                  background: 'rgba(0,232,122,0.1)', color: 'var(--accent)',
                  border: '1px solid rgba(0,232,122,0.2)',
                }}>
                  {goal.daily_limit_minutes} mins / day
                </span>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default Settings;