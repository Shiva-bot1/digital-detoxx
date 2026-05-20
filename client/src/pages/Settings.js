import React, { useState, useEffect } from 'react';
import { getGoals, setGoal } from '../services/api';
import Navbar from '../components/Navbar';
import ScreenTimeGuide from '../components/ScreenTimeGuide';
import {
  RiAddLine, RiCheckLine, RiTimeLine,
  RiNotificationLine, RiLeafLine, RiDeleteBinLine
} from 'react-icons/ri';

const APPS = ['Instagram','YouTube','X','Netflix','WhatsApp','LinkedIn','Snapchat','Other'];

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

const Settings = () => {
  const [goals,        setGoals]        = useState([]);
  const [form,         setForm]         = useState({ appName:'Instagram', dailyLimitMinutes:'' });
  const [saved,        setSaved]        = useState(false);
  const [loading,      setLoading]      = useState(true);
  const [activeTab,    setActiveTab]    = useState('goals');
  const [focusSchedule, setFocusSchedule] = useState({
    enabled: false,
    startTime: '22:00',
    endTime:   '08:00',
    days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    mode: 'strict',
  });
  const [focusSaved,   setFocusSaved]   = useState(false);
  const [notify,       setNotify]       = useState({
    dailyReminder: true,
    reminderTime:  '21:00',
    goalAlert:     true,
    streakAlert:   true,
  });
  const [notifySaved,  setNotifySaved]  = useState(false);

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

  // Load saved focus schedule from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('focusSchedule');
    if (saved) setFocusSchedule(JSON.parse(saved));
    const savedNotify = localStorage.getItem('notifySettings');
    if (savedNotify) setNotify(JSON.parse(savedNotify));
  }, []);

  const handleGoalSubmit = async e => {
    e.preventDefault();
    try {
      await setGoal({ ...form, dailyLimitMinutes: Number(form.dailyLimitMinutes) });
      setSaved(true);
      setForm({ appName:'Instagram', dailyLimitMinutes:'' });
      fetchGoals();
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleDay = (day) => {
    setFocusSchedule(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day],
    }));
  };

  const saveFocusSchedule = () => {
    localStorage.setItem('focusSchedule', JSON.stringify(focusSchedule));
    setFocusSaved(true);
    setTimeout(() => setFocusSaved(false), 2000);
  };

  const saveNotifications = () => {
    localStorage.setItem('notifySettings', JSON.stringify(notify));
    setNotifySaved(true);
    setTimeout(() => setNotifySaved(false), 2000);
  };

  const tab = (key, label, icon) => (
    <button onClick={() => setActiveTab(key)} style={{
      display: 'flex', alignItems: 'center', gap: '8px',
      padding: '10px 20px', borderRadius: '10px', fontSize: '14px',
      fontWeight: 600, border: 'none', cursor: 'pointer',
      fontFamily: "'Space Grotesk', sans-serif", transition: 'all 0.2s',
      background: activeTab === key ? 'var(--accent)' : 'var(--bg3)',
      color:      activeTab === key ? '#0a0f0d'       : 'var(--muted)',
    }}>
      {icon} {label}
    </button>
  );

  const inputStyle = {
    width: '100%', padding: '12px 14px',
    background: 'var(--bg3)', border: '1px solid var(--border)',
    borderRadius: '10px', color: 'var(--text)', fontSize: '14px',
    outline: 'none', fontFamily: "'Space Grotesk', sans-serif",
  };

  const toggleStyle = (on) => ({
    width: '48px', height: '26px', borderRadius: '13px', border: 'none',
    cursor: 'pointer', position: 'relative', transition: 'all 0.3s',
    background: on ? 'var(--accent)' : 'var(--bg3)',
  });

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      <Navbar />
      <div style={{ maxWidth:'800px', margin:'0 auto', padding:'32px 24px' }}>

        {/* Page Header */}
        <h1 style={{
          fontFamily:"'Syne', sans-serif", fontSize:'28px',
          fontWeight:800, marginBottom:'6px',
        }}>Settings</h1>
        <p style={{ color:'var(--muted)', fontSize:'14px', marginBottom:'28px' }}>
          Manage your goals, focus schedule, and notification preferences
        </p>

        {/* Screen Time Guide */}
        <ScreenTimeGuide />
        <div style={{ marginBottom:'24px' }}/>

        {/* Tabs */}
        <div style={{ display:'flex', gap:'10px', marginBottom:'28px', flexWrap:'wrap' }}>
          {tab('goals',    'Daily Goals',       <RiLeafLine size={16}/>)}
          {tab('focus',    'Focus Schedule',    <RiTimeLine size={16}/>)}
          {tab('notify',   'Notifications',     <RiNotificationLine size={16}/>)}
        </div>

        {/* ── TAB: GOALS ──────────────────────────────────────────────── */}
        {activeTab === 'goals' && (
          <>
            {/* Add Goal */}
            <div style={{
              background:'var(--card)', border:'1px solid var(--border)',
              borderRadius:'16px', padding:'28px', marginBottom:'20px',
            }}>
              <h3 style={{ fontWeight:600, marginBottom:'20px', fontSize:'16px' }}>
                Set a Daily Limit
              </h3>
              <form onSubmit={handleGoalSubmit}>
                <div style={{ marginBottom:'16px' }}>
                  <label style={{ display:'block', fontSize:'13px', color:'var(--muted)', marginBottom:'8px' }}>
                    App
                  </label>
                  <select
                    value={form.appName}
                    onChange={e => setForm({ ...form, appName:e.target.value })}
                    style={inputStyle}
                  >
                    {APPS.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom:'20px' }}>
                  <label style={{ display:'block', fontSize:'13px', color:'var(--muted)', marginBottom:'8px' }}>
                    Daily Limit (minutes)
                  </label>
                  <input
                    type="number" min="1" placeholder="e.g. 60"
                    value={form.dailyLimitMinutes}
                    onChange={e => setForm({ ...form, dailyLimitMinutes:e.target.value })}
                    required style={inputStyle}
                    onFocus={e => e.target.style.borderColor='var(--accent)'}
                    onBlur={e  => e.target.style.borderColor='var(--border)'}
                  />
                </div>
                <button type="submit" style={{
                  display:'flex', alignItems:'center', gap:'8px',
                  padding:'12px 24px', background: saved ? 'var(--accent2)' : 'var(--accent)',
                  border:'none', borderRadius:'10px',
                  color:'#0a0f0d', fontWeight:700, fontSize:'14px',
                  fontFamily:"'Space Grotesk', sans-serif", cursor:'pointer',
                }}>
                  {saved ? <><RiCheckLine size={16}/> Saved!</> : <><RiAddLine size={16}/> Add Goal</>}
                </button>
              </form>
            </div>

            {/* Existing Goals */}
            <div style={{
              background:'var(--card)', border:'1px solid var(--border)',
              borderRadius:'16px', padding:'28px',
            }}>
              <h3 style={{ fontWeight:600, marginBottom:'20px', fontSize:'16px' }}>Your Goals</h3>
              {loading ? (
                <p style={{ color:'var(--muted)', fontSize:'14px' }}>Loading...</p>
              ) : goals.length === 0 ? (
                <p style={{ color:'var(--muted)', fontSize:'14px' }}>No goals set yet.</p>
              ) : (
                goals.map(goal => (
                  <div key={goal.id} style={{
                    display:'flex', justifyContent:'space-between', alignItems:'center',
                    padding:'14px 0', borderBottom:'1px solid var(--border)',
                  }}>
                    <span style={{ fontWeight:600 }}>{goal.app_name}</span>
                    <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                      <span style={{
                        padding:'4px 14px', borderRadius:'20px', fontSize:'13px',
                        background:'rgba(0,232,122,0.1)', color:'var(--accent)',
                        border:'1px solid rgba(0,232,122,0.2)',
                      }}>
                        {goal.daily_limit_minutes} mins / day
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* ── TAB: FOCUS SCHEDULE ─────────────────────────────────────── */}
        {activeTab === 'focus' && (
          <div style={{
            background:'var(--card)', border:'1px solid var(--border)',
            borderRadius:'16px', padding:'28px',
          }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' }}>
              <div>
                <h3 style={{ fontWeight:700, fontSize:'16px', marginBottom:'4px' }}>Focus Mode Schedule</h3>
                <p style={{ color:'var(--muted)', fontSize:'13px' }}>
                  Block your usage during specific hours automatically
                </p>
              </div>
              <button
                onClick={() => setFocusSchedule(p => ({ ...p, enabled:!p.enabled }))}
                style={toggleStyle(focusSchedule.enabled)}
              >
                <div style={{
                  position:'absolute', top:'3px',
                  left: focusSchedule.enabled ? '25px' : '3px',
                  width:'20px', height:'20px', borderRadius:'50%',
                  background:'white', transition:'left 0.3s',
                }}/>
              </button>
            </div>

            <div style={{ opacity: focusSchedule.enabled ? 1 : 0.4, pointerEvents: focusSchedule.enabled ? 'all' : 'none' }}>

              {/* Time Range */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'20px' }}>
                <div>
                  <label style={{ display:'block', fontSize:'13px', color:'var(--muted)', marginBottom:'8px' }}>
                    Start Time
                  </label>
                  <input type="time" value={focusSchedule.startTime}
                    onChange={e => setFocusSchedule(p => ({ ...p, startTime:e.target.value }))}
                    style={inputStyle}/>
                </div>
                <div>
                  <label style={{ display:'block', fontSize:'13px', color:'var(--muted)', marginBottom:'8px' }}>
                    End Time
                  </label>
                  <input type="time" value={focusSchedule.endTime}
                    onChange={e => setFocusSchedule(p => ({ ...p, endTime:e.target.value }))}
                    style={inputStyle}/>
                </div>
              </div>

              {/* Days */}
              <div style={{ marginBottom:'20px' }}>
                <label style={{ display:'block', fontSize:'13px', color:'var(--muted)', marginBottom:'12px' }}>
                  Active Days
                </label>
                <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                  {DAYS.map(day => (
                    <button key={day} onClick={() => toggleDay(day)} style={{
                      padding:'8px 14px', borderRadius:'8px', fontSize:'13px',
                      fontWeight:600, border:'none', cursor:'pointer',
                      fontFamily:"'Space Grotesk', sans-serif", transition:'all 0.2s',
                      background: focusSchedule.days.includes(day) ? 'var(--accent)' : 'var(--bg3)',
                      color:      focusSchedule.days.includes(day) ? '#0a0f0d'       : 'var(--muted)',
                    }}>{day}</button>
                  ))}
                </div>
              </div>

              {/* Mode */}
              <div style={{ marginBottom:'24px' }}>
                <label style={{ display:'block', fontSize:'13px', color:'var(--muted)', marginBottom:'12px' }}>
                  Mode
                </label>
                <div style={{ display:'flex', gap:'10px' }}>
                  {[
                    { key:'strict',  label:'Strict',  desc:'No access during focus hours' },
                    { key:'remind',  label:'Remind',  desc:'Show a warning but allow access' },
                  ].map(m => (
                    <div key={m.key} onClick={() => setFocusSchedule(p => ({ ...p, mode:m.key }))}
                      style={{
                        flex:1, padding:'14px', borderRadius:'12px', cursor:'pointer',
                        border: `1px solid ${focusSchedule.mode===m.key ? 'var(--accent)' : 'var(--border)'}`,
                        background: focusSchedule.mode===m.key ? 'rgba(0,232,122,0.08)' : 'var(--bg3)',
                        transition:'all 0.2s',
                      }}>
                      <p style={{ fontWeight:700, fontSize:'14px', marginBottom:'4px',
                        color: focusSchedule.mode===m.key ? 'var(--accent)' : 'var(--text)' }}>
                        {m.label}
                      </p>
                      <p style={{ fontSize:'12px', color:'var(--muted)' }}>{m.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={saveFocusSchedule} style={{
              display:'flex', alignItems:'center', gap:'8px',
              padding:'12px 24px',
              background: focusSaved ? 'var(--accent2)' : 'var(--accent)',
              border:'none', borderRadius:'10px',
              color:'#0a0f0d', fontWeight:700, fontSize:'14px',
              fontFamily:"'Space Grotesk', sans-serif", cursor:'pointer',
            }}>
              {focusSaved ? <><RiCheckLine size={16}/> Saved!</> : 'Save Schedule'}
            </button>
          </div>
        )}

        {/* ── TAB: NOTIFICATIONS ──────────────────────────────────────── */}
        {activeTab === 'notify' && (
          <div style={{
            background:'var(--card)', border:'1px solid var(--border)',
            borderRadius:'16px', padding:'28px',
          }}>
            <h3 style={{ fontWeight:700, fontSize:'16px', marginBottom:'24px' }}>
              Notification Preferences
            </h3>

            {[
              { key:'dailyReminder', label:'Daily Logging Reminder',
                desc:'Remind me to log my screen time every evening' },
              { key:'goalAlert',     label:'Goal Exceeded Alert',
                desc:'Alert me when I exceed a daily app limit' },
              { key:'streakAlert',   label:'Streak Milestone Alert',
                desc:'Notify me when I unlock a new streak reward' },
            ].map(item => (
              <div key={item.key} style={{
                display:'flex', justifyContent:'space-between', alignItems:'center',
                padding:'16px 0', borderBottom:'1px solid var(--border)',
              }}>
                <div>
                  <p style={{ fontWeight:600, fontSize:'14px', marginBottom:'4px' }}>{item.label}</p>
                  <p style={{ fontSize:'12px', color:'var(--muted)' }}>{item.desc}</p>
                </div>
                <button
                  onClick={() => setNotify(p => ({ ...p, [item.key]:!p[item.key] }))}
                  style={toggleStyle(notify[item.key])}
                >
                  <div style={{
                    position:'absolute', top:'3px',
                    left: notify[item.key] ? '25px' : '3px',
                    width:'20px', height:'20px', borderRadius:'50%',
                    background:'white', transition:'left 0.3s',
                  }}/>
                </button>
              </div>
            ))}

            {/* Daily reminder time */}
            {notify.dailyReminder && (
              <div style={{ marginTop:'20px', marginBottom:'8px' }}>
                <label style={{ display:'block', fontSize:'13px', color:'var(--muted)', marginBottom:'8px' }}>
                  Reminder Time
                </label>
                <input type="time" value={notify.reminderTime}
                  onChange={e => setNotify(p => ({ ...p, reminderTime:e.target.value }))}
                  style={{ ...inputStyle, width:'200px' }}/>
              </div>
            )}

            <button onClick={saveNotifications} style={{
              display:'flex', alignItems:'center', gap:'8px',
              padding:'12px 24px', marginTop:'24px',
              background: notifySaved ? 'var(--accent2)' : 'var(--accent)',
              border:'none', borderRadius:'10px',
              color:'#0a0f0d', fontWeight:700, fontSize:'14px',
              fontFamily:"'Space Grotesk', sans-serif", cursor:'pointer',
            }}>
              {notifySaved ? <><RiCheckLine size={16}/> Saved!</> : 'Save Preferences'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Settings;