import React, { useState, useEffect } from 'react';
import { getUsage, getGoals, logUsage } from '../services/api';
import Navbar from '../components/Navbar';
import QuoteCard from '../components/QuoteCard';
import StreakPanel from '../components/StreakPanel';
import RedPanda from '../components/RedPanda';
import NightBackground from '../components/NightBackground';

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';
import {
  RiAddLine, RiTimeLine, RiFireLine,
  RiLeafLine, RiSmartphoneLine
} from 'react-icons/ri';

const APPS = ['Instagram','YouTube','X','Netflix','WhatsApp','LinkedIn','Snapchat','Other'];

const StatCard = ({ icon, label, value, color = 'var(--accent)' }) => (
  <div style={{
    background: 'var(--card)', border: '1px solid var(--border)',
    borderRadius: '16px', padding: '24px', flex: 1,
  }}>
    <div style={{
      width: '40px', height: '40px', borderRadius: '10px',
      background: `${color}18`, display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      marginBottom: '16px', color,
    }}>{icon}</div>
    <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '6px' }}>{label}</p>
    <p style={{ fontSize: '28px', fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>{value}</p>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border)',
        borderRadius: '10px', padding: '10px 14px', fontSize: '13px',
      }}>
        <p style={{ color: 'var(--muted)', marginBottom: '4px' }}>{label}</p>
        <p style={{ color: 'var(--accent)', fontWeight: 600 }}>
          {payload[0].value} mins
        </p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {

  
  const [usage,    setUsage]    = useState([]);
  const [goals,    setGoals]    = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form,     setForm]     = useState({ appName: 'Instagram', minutesSpent: '' });
  const [loading,  setLoading]  = useState(true);
  const [focusBlocked,  setFocusBlocked]  = useState(false);
  const [goalExceeded,  setGoalExceeded]  = useState(null);
  
  const fetchData = async () => {
    try {
      const [u, g] = await Promise.all([getUsage(), getGoals()]);
      setUsage(u.data);
      setGoals(g.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleLog = async e => {
    e.preventDefault();

    // ── Focus Schedule enforcement ──────────────────────────
    const schedule = JSON.parse(localStorage.getItem('focusSchedule') || '{}');
    if (schedule.enabled) {
      const now     = new Date();
      const dayMap  = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
      const today   = dayMap[now.getDay()];
      const current = now.getHours() * 60 + now.getMinutes();

      const [sh, sm] = schedule.startTime.split(':').map(Number);
      const [eh, em] = schedule.endTime.split(':').map(Number);
      const start = sh * 60 + sm;
      const end   = eh * 60 + em;

      const inFocus = start <= end
        ? current >= start && current <= end
        : current >= start || current <= end;

      if (inFocus && schedule.days.includes(today)) {
        setFocusBlocked(true);
        return;
      }
    }

    // ── Save log ─────────────────────────────────────────────
    try {
      await logUsage({ appName: form.appName, minutesSpent: Number(form.minutesSpent) });

      // ── Goal exceeded alert ───────────────────────────────
      const updatedUsage = await getUsage();
      const todayLogs    = updatedUsage.data.filter(s =>
        new Date(s.date).toDateString() === new Date().toDateString()
      );

      const matchingGoal = goals.find(g => g.app_name === form.appName);
      if (matchingGoal) {
        const total = todayLogs
          .filter(s => s.app_name === form.appName)
          .reduce((sum, s) => sum + s.minutes_spent, 0);

        if (total > matchingGoal.daily_limit_minutes) {
          setGoalExceeded({
            app:   form.appName,
            total,
            limit: matchingGoal.daily_limit_minutes,
          });
        }
      }

      setForm({ appName: 'Instagram', minutesSpent: '' });
      setShowForm(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const label = d.toLocaleDateString('en', { weekday: 'short' });
    const total = usage
      .filter(s => new Date(s.date).toDateString() === d.toDateString())
      .reduce((sum, s) => sum + s.minutes_spent, 0);
    return { day: label, mins: total };
  });

  const todayTotal = usage
    .filter(s => new Date(s.date).toDateString() === new Date().toDateString())
    .reduce((sum, s) => sum + s.minutes_spent, 0);

  const weekTotal = usage.reduce((sum, s) => sum + s.minutes_spent, 0);

  const topApp = usage.length > 0
    ? [...usage].sort((a, b) => b.minutes_spent - a.minutes_spent)[0]?.app_name
    : '—';

  

  if (loading) return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ color: 'var(--accent)', fontSize: '18px' }}>Loading...</div>
    </div>
  );

  



  return (
    <div style={{ minHeight: '100vh', background: '#020a08', position: 'relative' }}>

      <NightBackground />

      {/* ── Focus Block Overlay ───────────────────────────── */}
      {focusBlocked && (
        <div style={{
          position:'fixed', inset:0, zIndex:999,
          background:'rgba(2,10,8,0.92)',
          display:'flex', alignItems:'center', justifyContent:'center',
          backdropFilter:'blur(8px)',
        }}>
          <div style={{
            background:'var(--card)', border:'1px solid rgba(255,179,71,0.4)',
            borderRadius:'20px', padding:'40px', maxWidth:'400px',
            textAlign:'center',
          }}>
            <div style={{ fontSize:'48px', marginBottom:'16px' }}>🌙</div>
            <h2 style={{
              fontFamily:"'Syne',sans-serif", fontSize:'22px',
              fontWeight:800, marginBottom:'12px', color:'#ffb347',
            }}>Focus Mode Active</h2>
            <p style={{ color:'var(--muted)', fontSize:'14px', lineHeight:1.7, marginBottom:'24px' }}>
              You've set a focus schedule for this time. Step away from the screen — you've got this.
            </p>
            <button onClick={() => setFocusBlocked(false)} style={{
              padding:'11px 28px', background:'#ffb347',
              border:'none', borderRadius:'10px',
              color:'#0a0f0d', fontWeight:700, fontSize:'14px',
              cursor:'pointer', fontFamily:"'Space Grotesk',sans-serif",
            }}>
              Override Focus Mode
            </button>
          </div>
        </div>
      )}

      {/* ── Goal Exceeded Overlay ─────────────────────────── */}
      {goalExceeded && (
        <div style={{
          position:'fixed', inset:0, zIndex:999,
          background:'rgba(2,10,8,0.92)',
          display:'flex', alignItems:'center', justifyContent:'center',
          backdropFilter:'blur(8px)',
        }}>
          <div style={{
            background:'var(--card)', border:'1px solid rgba(255,77,109,0.4)',
            borderRadius:'20px', padding:'40px', maxWidth:'400px',
            textAlign:'center',
          }}>
            <div style={{ fontSize:'48px', marginBottom:'16px' }}>⚠️</div>
            <h2 style={{
              fontFamily:"'Syne',sans-serif", fontSize:'22px',
              fontWeight:800, marginBottom:'12px', color:'var(--danger)',
            }}>Goal Exceeded!</h2>
            <p style={{ color:'var(--muted)', fontSize:'14px', lineHeight:1.7, marginBottom:'8px' }}>
              You've spent <strong style={{ color:'var(--danger)' }}>{goalExceeded.total} minutes</strong> on{' '}
              <strong style={{ color:'var(--text)' }}>{goalExceeded.app}</strong> today.
            </p>
            <p style={{ color:'var(--muted)', fontSize:'13px', marginBottom:'24px' }}>
              Your daily limit is <strong style={{ color:'var(--accent)' }}>{goalExceeded.limit} minutes</strong>.
              Time to put the phone down. 🐾
            </p>
            <button onClick={() => setGoalExceeded(null)} style={{
              padding:'11px 28px', background:'var(--danger)',
              border:'none', borderRadius:'10px',
              color:'white', fontWeight:700, fontSize:'14px',
              cursor:'pointer', fontFamily:"'Space Grotesk',sans-serif",
            }}>
              I'll do better tomorrow
            </button>
          </div>
        </div>
      )}

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar />

        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          padding: '32px 24px',
          display: 'grid',
          gridTemplateColumns: '1fr 300px',
          gap: '24px',
          alignItems: 'start',
        }}>

        

        {/* ── LEFT MAIN COLUMN ── */}
        <div>
          {/* Header */}
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: '24px',
          }}>
            <div>
              <h1 style={{
                fontFamily: "'Syne', sans-serif", fontSize: '26px',
                fontWeight: 800, marginBottom: '4px',
              }}>Your Dashboard</h1>
              <p style={{ color: 'var(--muted)', fontSize: '13px' }}>
                {new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <button onClick={() => setShowForm(!showForm)} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '11px 18px', background: 'var(--accent)',
              border: 'none', borderRadius: '12px',
              color: '#0a0f0d', fontWeight: 700, fontSize: '14px',
            }}>
              <RiAddLine size={18}/> Log Usage
            </button>
          </div>


          {/* Log Form */}
          {showForm && (
            <div style={{
              background: 'var(--card)', border: '1px solid var(--accent)',
              borderRadius: '16px', padding: '24px', marginBottom: '24px',
            }}>
              <h3 style={{ marginBottom: '16px', fontWeight: 600 }}>Log Screen Time</h3>
              <form onSubmit={handleLog} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <select
                  value={form.appName}
                  onChange={e => setForm({ ...form, appName: e.target.value })}
                  style={{
                    flex: 1, minWidth: '150px', padding: '11px 14px',
                    background: 'var(--bg3)', border: '1px solid var(--border)',
                    borderRadius: '10px', color: 'var(--text)', fontSize: '14px',
                  }}
                >
                  {APPS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
                <input
                  type="number" placeholder="Minutes spent" min="1"
                  value={form.minutesSpent}
                  onChange={e => setForm({ ...form, minutesSpent: e.target.value })}
                  required
                  style={{
                    flex: 1, minWidth: '150px', padding: '11px 14px',
                    background: 'var(--bg3)', border: '1px solid var(--border)',
                    borderRadius: '10px', color: 'var(--text)', fontSize: '14px',
                  }}
                />
                <button type="submit" style={{
                  padding: '11px 22px', background: 'var(--accent)',
                  border: 'none', borderRadius: '10px',
                  color: '#0a0f0d', fontWeight: 700, fontSize: '14px',
                }}>Save</button>
                <button type="button" onClick={() => setShowForm(false)} style={{
                  padding: '11px 22px', background: 'transparent',
                  border: '1px solid var(--border)', borderRadius: '10px',
                  color: 'var(--muted)', fontSize: '14px',
                }}>Cancel</button>
              </form>
            </div>
          )}

          {/* Stat Cards */}
          <div style={{ display: 'flex', gap: '14px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <StatCard icon={<RiTimeLine size={20}/>}       label="Today's Screen Time" value={`${todayTotal} mins`} />
            <StatCard icon={<RiFireLine size={20}/>}       label="Weekly Total"         value={`${weekTotal} mins`}  color="var(--warning)" />
            <StatCard icon={<RiSmartphoneLine size={20}/>} label="Most Used App"        value={topApp}              color="var(--danger)" />
          </div>

          {/* Chart + Goals */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '16px', marginBottom: '24px' }}>
            <div style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: '16px', padding: '24px',
            }}>
              <h3 style={{ marginBottom: '20px', fontWeight: 600, fontSize: '15px' }}>
                Weekly Screen Time
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} barSize={26}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false}
                    tick={{ fill: '#6b8f78', fontSize: 12 }}/>
                  <YAxis axisLine={false} tickLine={false}
                    tick={{ fill: '#6b8f78', fontSize: 12 }}/>
                  <Tooltip content={<CustomTooltip/>} cursor={{ fill: 'rgba(0,232,122,0.04)' }}/>
                  <Bar dataKey="mins" radius={[6,6,0,0]}>
                    {chartData.map((entry, i) => (
                      <Cell key={i}
                        fill={entry.mins > 120 ? '#ff4d6d' : entry.mins > 60 ? '#ffb347' : '#00e87a'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Goals */}
            <div style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: '16px', padding: '24px',
            }}>
              <h3 style={{ marginBottom: '16px', fontWeight: 600, fontSize: '15px' }}>
                Today's Goals
              </h3>
              {goals.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--muted)', fontSize: '13px' }}>
                  <RiLeafLine size={28} style={{ marginBottom: '10px', opacity: 0.4 }}/>
                  <p>No goals yet.</p>
                  <p style={{ marginTop: '4px' }}>Go to Settings.</p>
                </div>
              ) : (
                goals.map(goal => {
                  const todayUsage = usage
                    .filter(s =>
                      s.app_name === goal.app_name &&
                      new Date(s.date).toDateString() === new Date().toDateString()
                    )
                    .reduce((sum, s) => sum + s.minutes_spent, 0);
                  const pct   = Math.min((todayUsage / goal.daily_limit_minutes) * 100, 100);
                  const color = pct > 90 ? 'var(--danger)' : pct > 60 ? 'var(--warning)' : 'var(--accent)';
                  return (
                    <div key={goal.id} style={{ marginBottom: '18px' }}>
                      <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        marginBottom: '6px', fontSize: '13px',
                      }}>
                        <span style={{ fontWeight: 600 }}>{goal.app_name}</span>
                        <span style={{ color: 'var(--muted)' }}>
                          {todayUsage}/{goal.daily_limit_minutes}m
                        </span>
                      </div>
                      <div style={{
                        height: '6px', background: 'var(--bg3)',
                        borderRadius: '4px', overflow: 'hidden',
                      }}>
                        <div style={{
                          height: '100%', width: `${pct}%`,
                          background: color, borderRadius: '4px',
                          transition: 'width 0.5s ease',
                        }}/>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Recent Logs */}
          <div style={{
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: '16px', padding: '24px',
          }}>
            <h3 style={{ marginBottom: '20px', fontWeight: 600, fontSize: '15px' }}>Recent Logs</h3>
            {usage.length === 0 ? (
              <p style={{ color: 'var(--muted)', fontSize: '14px', textAlign: 'center', padding: '20px 0' }}>
                No usage logged yet. Hit "Log Usage" to start.
              </p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['App', 'Minutes', 'Date & Time'].map(h => (
                      <th key={h} style={{
                        textAlign: 'left', padding: '10px 0',
                        color: 'var(--muted)', fontWeight: 500, fontSize: '12px',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {usage.slice(0, 8).map(s => {
                    const d = new Date(s.date);
                    return (
                      <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '12px 0', fontWeight: 600 }}>{s.app_name}</td>
                        <td style={{ padding: '12px 0', color: 'var(--accent)' }}>{s.minutes_spent} mins</td>
                        <td style={{ padding: '12px 0', color: 'var(--muted)', fontSize: '13px' }}>
                          {d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', timeZone: 'Asia/Kolkata' })}{' '}
                          {d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <RedPanda />
          <QuoteCard />
          <StreakPanel usage={usage} goals={goals} />
        </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;