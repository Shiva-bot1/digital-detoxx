import React, { useState, useEffect } from 'react';
import { getGoals, setGoal } from '../services/api';
import { supabase } from '../services/api';
import Navbar from '../components/Navbar';
import ScreenTimeGuide from '../components/ScreenTimeGuide';
import { useTheme } from '../context/ThemeContext';
import {
  RiAddLine, RiCheckLine, RiTimeLine,
  RiNotificationLine, RiLeafLine, RiEditLine,
  RiTrophyLine, RiFireLine,
} from 'react-icons/ri';

const APPS = ['Instagram','YouTube','X','Netflix','WhatsApp','LinkedIn','Snapchat','Other'];
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

const CHALLENGES = [
  { id:1, title:'No Social Morning',   desc:'No social media before 10am for 7 days',          duration:7,  icon:'🌅', reward:'Early Bird Badge'    },
  { id:2, title:'2-Hour Total Cap',    desc:'Stay under 2 hours total screen time for 5 days', duration:5,  icon:'⏱️', reward:'Time Master Badge'   },
  { id:3, title:'Phone-Free Dinner',   desc:'No phone during meals for 7 days',                duration:7,  icon:'🍽️', reward:'Mindful Eater Badge' },
  { id:4, title:'Weekend Digital Detox', desc:'No social media on Saturday and Sunday',        duration:2,  icon:'🏕️', reward:'Weekend Warrior'     },
  { id:5, title:'30-Min Max Per App',  desc:'Keep every app under 30 mins for 3 days',        duration:3,  icon:'📱', reward:'App Tamer Badge'     },
];

const Settings = () => {
  const { theme } = useTheme();
  const [goals,         setGoals]         = useState([]);
  const [form,          setForm]          = useState({ appName:'Instagram', hours:'0', minutes:'30' });
  const [saved,         setSaved]         = useState(false);
  const [loading,       setLoading]       = useState(true);
  const [activeTab,     setActiveTab]     = useState('goals');
  const [editingGoal,   setEditingGoal]   = useState(null);
  const [editForm,      setEditForm]      = useState({ hours:'0', minutes:'30' });
  const [activeChallenge, setActiveChallenge] = useState(
    JSON.parse(localStorage.getItem('activeChallenge') || 'null')
  );
  const [focusSchedule, setFocusSchedule] = useState(
    JSON.parse(localStorage.getItem('focusSchedule') ||
      '{"enabled":false,"startTime":"22:00","endTime":"08:00","days":["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],"mode":"strict"}')
  );
  const [focusSaved,    setFocusSaved]    = useState(false);
  const [notify,        setNotify]        = useState(
    JSON.parse(localStorage.getItem('notifySettings') ||
      '{"dailyReminder":true,"reminderTime":"21:00","goalAlert":true,"streakAlert":true}')
  );
  const [notifySaved,   setNotifySaved]   = useState(false);

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

  const toMinutes = (hours, minutes) =>
    parseInt(hours || 0) * 60 + parseInt(minutes || 0);

  const fromMinutes = (total) => ({
    hours:   String(Math.floor(total / 60)),
    minutes: String(total % 60),
  });

  const handleGoalSubmit = async e => {
    e.preventDefault();
    const totalMins = toMinutes(form.hours, form.minutes);
    if (totalMins < 1) return;

    try {
      // Check if goal already exists for this app
      const existing = goals.find(g => g.app_name === form.appName);

      if (existing) {
        // Update existing goal — add minutes
        const newTotal = existing.daily_limit_minutes + totalMins;
        const { error } = await supabase
          .from('goals')
          .update({ daily_limit_minutes: newTotal })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        // Create new goal
        await setGoal({ appName: form.appName, dailyLimitMinutes: totalMins });
      }

      setSaved(true);
      setForm({ appName:'Instagram', hours:'0', minutes:'30' });
      fetchGoals();
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditGoal = async (goal) => {
    const { hours, minutes } = fromMinutes(goal.daily_limit_minutes);
    setEditingGoal(goal.id);
    setEditForm({ hours, minutes });
  };

  const handleEditSave = async (goalId) => {
    const totalMins = toMinutes(editForm.hours, editForm.minutes);
    if (totalMins < 1) return;
    try {
      const { error } = await supabase
        .from('goals')
        .update({ daily_limit_minutes: totalMins })
        .eq('id', goalId);
      if (error) throw error;
      setEditingGoal(null);
      fetchGoals();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleDay = (day) => {
    setFocusSchedule(p => ({
      ...p,
      days: p.days.includes(day)
        ? p.days.filter(d => d !== day)
        : [...p.days, day],
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

  const joinChallenge = (challenge) => {
    const active = { ...challenge, startDate: new Date().toISOString() };
    localStorage.setItem('activeChallenge', JSON.stringify(active));
    setActiveChallenge(active);
  };

  const leaveChallenge = () => {
    localStorage.removeItem('activeChallenge');
    setActiveChallenge(null);
  };

  const challengeDaysLeft = () => {
    if (!activeChallenge) return 0;
    const start    = new Date(activeChallenge.startDate);
    const end      = new Date(start);
    end.setDate(end.getDate() + activeChallenge.duration);
    const diff     = Math.ceil((end - new Date()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  const inputStyle = {
    padding:'11px 14px',
    background:'var(--bg3)', border:'1px solid var(--border)',
    borderRadius:'10px', color:'var(--text)', fontSize:'14px',
    outline:'none', width:'100%',
  };

  const tabBtn = (key, label, icon) => (
    <button onClick={() => setActiveTab(key)} style={{
      display:'flex', alignItems:'center', gap:'8px',
      padding:'10px 18px', borderRadius:'10px', fontSize:'13px',
      fontWeight:600, border:'none', cursor:'pointer', transition:'all 0.2s',
      background: activeTab === key ? 'var(--accent)' : 'var(--bg3)',
      color:      activeTab === key ? '#0a0f0d'       : 'var(--muted)',
    }}>
      {icon} {label}
    </button>
  );

  const card = (children, extraStyle={}) => (
    <div style={{
      background:'var(--card)', border:'1px solid var(--border)',
      borderRadius:'16px', padding:'28px', marginBottom:'20px',
      backdropFilter:'blur(12px)', ...extraStyle,
    }}>
      {children}
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      <Navbar />
      <div style={{ maxWidth:'800px', margin:'0 auto', padding:'32px 24px' }}>

        <h1 style={{
          fontFamily:"'Syne', sans-serif", fontSize:'28px',
          fontWeight:800, marginBottom:'6px',
        }}>Settings</h1>
        <p style={{ color:'var(--muted)', fontSize:'14px', marginBottom:'24px' }}>
          Manage your goals, focus schedule, challenges and notifications
        </p>

        <ScreenTimeGuide />
        <div style={{ marginBottom:'24px' }}/>

        {/* Tabs */}
        <div style={{ display:'flex', gap:'10px', marginBottom:'28px', flexWrap:'wrap' }}>
          {tabBtn('goals',     'Daily Goals',       <RiLeafLine size={15}/>)}
          {tabBtn('challenge', 'Challenges',        <RiTrophyLine size={15}/>)}
          {tabBtn('focus',     'Focus Schedule',    <RiTimeLine size={15}/>)}
          {tabBtn('notify',    'Notifications',     <RiNotificationLine size={15}/>)}
        </div>

        {/* ── GOALS TAB ──────────────────────────────────────────── */}
        {activeTab === 'goals' && (
          <>
            {card(
              <>
                <h3 style={{ fontWeight:700, fontSize:'16px', marginBottom:'6px' }}>
                  Set a Daily Limit
                </h3>
                <p style={{ color:'var(--muted)', fontSize:'13px', marginBottom:'20px' }}>
                  If a goal for this app already exists, the time will be added to it.
                </p>
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
                      Daily Limit
                    </label>
                    <div style={{ display:'flex', gap:'12px', alignItems:'center' }}>
                      <div style={{ flex:1 }}>
                        <input
                          type="number" min="0" max="23" placeholder="0"
                          value={form.hours}
                          onChange={e => setForm({ ...form, hours:e.target.value })}
                          style={inputStyle}
                        />
                        <p style={{ fontSize:'11px', color:'var(--muted)', marginTop:'4px', textAlign:'center' }}>
                          Hours
                        </p>
                      </div>
                      <span style={{ color:'var(--muted)', fontSize:'20px', fontWeight:700, paddingBottom:'18px' }}>:</span>
                      <div style={{ flex:1 }}>
                        <input
                          type="number" min="0" max="59" placeholder="30"
                          value={form.minutes}
                          onChange={e => setForm({ ...form, minutes:e.target.value })}
                          style={inputStyle}
                        />
                        <p style={{ fontSize:'11px', color:'var(--muted)', marginTop:'4px', textAlign:'center' }}>
                          Minutes
                        </p>
                      </div>
                    </div>
                  </div>

                  <button type="submit" style={{
                    display:'flex', alignItems:'center', gap:'8px',
                    padding:'12px 24px',
                    background: saved ? 'var(--accent2)' : 'var(--accent)',
                    border:'none', borderRadius:'10px',
                    color:'#0a0f0d', fontWeight:700, fontSize:'14px', cursor:'pointer',
                  }}>
                    {saved
                      ? <><RiCheckLine size={16}/> Saved!</>
                      : <><RiAddLine   size={16}/> {goals.find(g => g.app_name === form.appName) ? 'Update Goal' : 'Add Goal'}</>
                    }
                  </button>
                </form>
              </>
            )}

            {card(
              <>
                <h3 style={{ fontWeight:700, fontSize:'16px', marginBottom:'20px' }}>Your Goals</h3>
                {loading ? (
                  <p style={{ color:'var(--muted)', fontSize:'14px' }}>Loading...</p>
                ) : goals.length === 0 ? (
                  <p style={{ color:'var(--muted)', fontSize:'14px' }}>No goals set yet.</p>
                ) : (
                  goals.map(goal => {
                    const { hours, minutes } = fromMinutes(goal.daily_limit_minutes);
                    const isEditing = editingGoal === goal.id;
                    return (
                      <div key={goal.id} style={{
                        padding:'16px 0', borderBottom:'1px solid var(--border)',
                      }}>
                        {isEditing ? (
                          <div style={{ display:'flex', gap:'12px', alignItems:'center', flexWrap:'wrap' }}>
                            <span style={{ fontWeight:700, minWidth:'90px' }}>{goal.app_name}</span>
                            <div style={{ display:'flex', gap:'8px', alignItems:'center', flex:1 }}>
                              <input
                                type="number" min="0" max="23"
                                value={editForm.hours}
                                onChange={e => setEditForm({ ...editForm, hours:e.target.value })}
                                style={{ ...inputStyle, width:'80px' }}
                              />
                              <span style={{ color:'var(--muted)' }}>h</span>
                              <input
                                type="number" min="0" max="59"
                                value={editForm.minutes}
                                onChange={e => setEditForm({ ...editForm, minutes:e.target.value })}
                                style={{ ...inputStyle, width:'80px' }}
                              />
                              <span style={{ color:'var(--muted)' }}>m</span>
                            </div>
                            <div style={{ display:'flex', gap:'8px' }}>
                              <button onClick={() => handleEditSave(goal.id)} style={{
                                padding:'8px 16px', background:'var(--accent)',
                                border:'none', borderRadius:'8px',
                                color:'#0a0f0d', fontWeight:700, fontSize:'13px', cursor:'pointer',
                              }}>Save</button>
                              <button onClick={() => setEditingGoal(null)} style={{
                                padding:'8px 16px', background:'transparent',
                                border:'1px solid var(--border)', borderRadius:'8px',
                                color:'var(--muted)', fontSize:'13px', cursor:'pointer',
                              }}>Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                            <span style={{ fontWeight:700 }}>{goal.app_name}</span>
                            <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                              <span style={{
                                padding:'4px 14px', borderRadius:'20px', fontSize:'13px',
                                background:'rgba(0,232,122,0.1)', color:'var(--accent)',
                                border:'1px solid rgba(0,232,122,0.2)',
                              }}>
                                {parseInt(hours) > 0 ? `${hours}h ` : ''}{minutes}m / day
                              </span>
                              <button onClick={() => handleEditGoal(goal)} style={{
                                background:'transparent', border:'1px solid var(--border)',
                                borderRadius:'8px', padding:'6px 10px',
                                color:'var(--muted)', cursor:'pointer', transition:'all 0.2s',
                                display:'flex', alignItems:'center', gap:'4px', fontSize:'12px',
                              }}
                                onMouseOver={e => e.currentTarget.style.borderColor='var(--accent)'}
                                onMouseOut={e  => e.currentTarget.style.borderColor='var(--border)'}
                              >
                                <RiEditLine size={13}/> Edit
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </>
            )}
          </>
        )}

        {/* ── CHALLENGE TAB ───────────────────────────────────────── */}
        {activeTab === 'challenge' && (
          <>
            {activeChallenge && (
              <div style={{
                background:'rgba(0,232,122,0.08)',
                border:'1px solid rgba(0,232,122,0.3)',
                borderRadius:'16px', padding:'24px', marginBottom:'24px',
              }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <div>
                    <p style={{ fontSize:'11px', color:'var(--accent)', fontWeight:700,
                      letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:'8px' }}>
                      Active Challenge
                    </p>
                    <h3 style={{ fontWeight:800, fontSize:'18px', marginBottom:'6px' }}>
                      {activeChallenge.icon} {activeChallenge.title}
                    </h3>
                    <p style={{ color:'var(--muted)', fontSize:'13px', marginBottom:'12px' }}>
                      {activeChallenge.desc}
                    </p>
                    <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                      <RiFireLine size={16} style={{ color:'#ffb347' }}/>
                      <span style={{ fontSize:'14px', fontWeight:700, color:'#ffb347' }}>
                        {challengeDaysLeft()} days remaining
                      </span>
                    </div>
                  </div>
                  <button onClick={leaveChallenge} style={{
                    padding:'8px 16px', background:'transparent',
                    border:'1px solid var(--border)', borderRadius:'10px',
                    color:'var(--muted)', fontSize:'12px', cursor:'pointer',
                  }}>
                    Leave
                  </button>
                </div>
              </div>
            )}

            <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
              {CHALLENGES.map(c => {
                const isActive = activeChallenge?.id === c.id;
                return (
                  <div key={c.id} style={{
                    background:'var(--card)', border:`1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius:'16px', padding:'22px',
                    display:'flex', justifyContent:'space-between',
                    alignItems:'center', gap:'16px',
                    backdropFilter:'blur(12px)', transition:'border 0.2s',
                  }}
                    onMouseOver={e => { if (!isActive) e.currentTarget.style.borderColor='rgba(0,232,122,0.3)'; }}
                    onMouseOut={e  => { if (!isActive) e.currentTarget.style.borderColor='var(--border)'; }}
                  >
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'6px' }}>
                        <span style={{ fontSize:'24px' }}>{c.icon}</span>
                        <h3 style={{ fontWeight:700, fontSize:'15px' }}>{c.title}</h3>
                        {isActive && (
                          <span style={{
                            padding:'2px 10px', borderRadius:'20px', fontSize:'11px',
                            background:'rgba(0,232,122,0.15)', color:'var(--accent)',
                            fontWeight:700,
                          }}>Active</span>
                        )}
                      </div>
                      <p style={{ color:'var(--muted)', fontSize:'13px', marginBottom:'8px' }}>
                        {c.desc}
                      </p>
                      <div style={{ display:'flex', gap:'16px' }}>
                        <span style={{ fontSize:'12px', color:'var(--muted)' }}>
                          ⏱ {c.duration} days
                        </span>
                        <span style={{ fontSize:'12px', color:'var(--accent)' }}>
                          🏅 {c.reward}
                        </span>
                      </div>
                    </div>

                    {!isActive && (
                      <button
                        onClick={() => joinChallenge(c)}
                        disabled={!!activeChallenge}
                        style={{
                          padding:'10px 20px', borderRadius:'10px', fontSize:'13px',
                          fontWeight:700, border:'none', cursor: activeChallenge ? 'not-allowed' : 'pointer',
                          background: activeChallenge ? 'var(--bg3)' : 'var(--accent)',
                          color: activeChallenge ? 'var(--muted)' : '#0a0f0d',
                          opacity: activeChallenge && activeChallenge.id !== c.id ? 0.5 : 1,
                          whiteSpace:'nowrap', transition:'all 0.2s',
                        }}>
                        Join
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ── FOCUS TAB ───────────────────────────────────────────── */}
        {activeTab === 'focus' && card(
          <>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' }}>
              <div>
                <h3 style={{ fontWeight:700, fontSize:'16px', marginBottom:'4px' }}>Focus Mode Schedule</h3>
                <p style={{ color:'var(--muted)', fontSize:'13px' }}>Block logging during focus hours</p>
              </div>
              <button
                onClick={() => setFocusSchedule(p => ({ ...p, enabled:!p.enabled }))}
                style={{
                  width:'48px', height:'26px', borderRadius:'13px', border:'none',
                  cursor:'pointer', position:'relative', transition:'all 0.3s',
                  background: focusSchedule.enabled ? 'var(--accent)' : 'var(--bg3)',
                }}
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
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'20px' }}>
                <div>
                  <label style={{ display:'block', fontSize:'13px', color:'var(--muted)', marginBottom:'8px' }}>Start Time</label>
                  <input type="time" value={focusSchedule.startTime}
                    onChange={e => setFocusSchedule(p => ({ ...p, startTime:e.target.value }))}
                    style={inputStyle}/>
                </div>
                <div>
                  <label style={{ display:'block', fontSize:'13px', color:'var(--muted)', marginBottom:'8px' }}>End Time</label>
                  <input type="time" value={focusSchedule.endTime}
                    onChange={e => setFocusSchedule(p => ({ ...p, endTime:e.target.value }))}
                    style={inputStyle}/>
                </div>
              </div>

              <div style={{ marginBottom:'20px' }}>
                <label style={{ display:'block', fontSize:'13px', color:'var(--muted)', marginBottom:'12px' }}>Active Days</label>
                <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                  {DAYS.map(day => (
                    <button key={day} onClick={() => toggleDay(day)} style={{
                      padding:'8px 14px', borderRadius:'8px', fontSize:'13px',
                      fontWeight:600, border:'none', cursor:'pointer', transition:'all 0.2s',
                      background: focusSchedule.days.includes(day) ? 'var(--accent)' : 'var(--bg3)',
                      color:      focusSchedule.days.includes(day) ? '#0a0f0d'       : 'var(--muted)',
                    }}>{day}</button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom:'24px' }}>
                <label style={{ display:'block', fontSize:'13px', color:'var(--muted)', marginBottom:'12px' }}>Mode</label>
                <div style={{ display:'flex', gap:'10px' }}>
                  {[
                    { key:'strict', label:'Strict', desc:'Block logging during focus hours' },
                    { key:'remind', label:'Remind', desc:'Show warning but allow logging' },
                  ].map(m => (
                    <div key={m.key} onClick={() => setFocusSchedule(p => ({ ...p, mode:m.key }))}
                      style={{
                        flex:1, padding:'14px', borderRadius:'12px', cursor:'pointer',
                        border:`1px solid ${focusSchedule.mode===m.key ? 'var(--accent)' : 'var(--border)'}`,
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
              color:'#0a0f0d', fontWeight:700, fontSize:'14px', cursor:'pointer',
            }}>
              {focusSaved ? <><RiCheckLine size={16}/> Saved!</> : 'Save Schedule'}
            </button>
          </>
        )}

        {/* ── NOTIFY TAB ──────────────────────────────────────────── */}
        {activeTab === 'notify' && card(
          <>
            <h3 style={{ fontWeight:700, fontSize:'16px', marginBottom:'8px' }}>Notification Preferences</h3>
            <p style={{ color:'var(--muted)', fontSize:'13px', marginBottom:'24px' }}>
              SvaZen sends browser notifications to keep you on track.
            </p>

            {'Notification' in window && Notification.permission !== 'granted' && (
              <div style={{
                padding:'16px', borderRadius:'12px', marginBottom:'20px',
                background:'rgba(255,179,71,0.08)', border:'1px solid rgba(255,179,71,0.3)',
                display:'flex', alignItems:'center', justifyContent:'space-between', gap:'12px',
              }}>
                <div>
                  <p style={{ fontWeight:600, fontSize:'14px', color:'#ffb347', marginBottom:'4px' }}>
                    Notifications not enabled
                  </p>
                  <p style={{ fontSize:'12px', color:'var(--muted)' }}>
                    Allow browser notifications from SvaZen
                  </p>
                </div>
                <button
                  onClick={() => Notification.requestPermission().then(() => window.location.reload())}
                  style={{
                    padding:'9px 18px', background:'#ffb347',
                    border:'none', borderRadius:'9px',
                    color:'#0a0f0d', fontWeight:700, fontSize:'13px', cursor:'pointer',
                    whiteSpace:'nowrap',
                  }}>
                  Enable Now
                </button>
              </div>
            )}

            {'Notification' in window && Notification.permission === 'granted' && (
              <div style={{
                padding:'12px 16px', borderRadius:'10px', marginBottom:'20px',
                background:'rgba(0,232,122,0.08)', border:'1px solid rgba(0,232,122,0.2)',
                fontSize:'13px', color:'var(--accent)',
              }}>
                ✓ Browser notifications are enabled
              </div>
            )}

            {[
              { key:'dailyReminder', label:'Daily Logging Reminder', desc:'Remind me to log screen time every evening' },
              { key:'goalAlert',     label:'Goal Exceeded Alert',    desc:'Alert when I exceed a daily app limit' },
              { key:'streakAlert',   label:'Streak Milestone Alert', desc:'Notify when I unlock a new streak reward' },
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
                  style={{
                    width:'48px', height:'26px', borderRadius:'13px', border:'none',
                    cursor:'pointer', position:'relative', transition:'all 0.3s', flexShrink:0,
                    background: notify[item.key] ? 'var(--accent)' : 'var(--bg3)',
                  }}
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

            {notify.dailyReminder && (
              <div style={{ marginTop:'20px' }}>
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
              color:'#0a0f0d', fontWeight:700, fontSize:'14px', cursor:'pointer',
            }}>
              {notifySaved ? <><RiCheckLine size={16}/> Saved!</> : 'Save Preferences'}
            </button>
          </>
        )}

      </div>
    </div>
  );
};

export default Settings;