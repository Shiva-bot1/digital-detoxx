import React from 'react';
import { RiTrophyLine, RiFireLine, RiStarLine, RiMedalLine, RiGiftLine } from 'react-icons/ri';

const MILESTONES = [
  { days: 3,  icon: <RiStarLine  size={18}/>, label: '3-Day Starter',   reward: 'Detox Beginner Badge',    color: '#00e87a' },
  { days: 7,  icon: <RiFireLine  size={18}/>, label: '7-Day Warrior',   reward: 'Week Warrior Badge',      color: '#ffb347' },
  { days: 14, icon: <RiMedalLine size={18}/>, label: '2-Week Champion', reward: 'Digital Monk Badge',      color: '#00b8d9' },
  { days: 30, icon: <RiTrophyLine size={18}/>, label: '30-Day Legend',  reward: 'Detox Legend Trophy',     color: '#ff4d6d' },
];

const StreakPanel = ({ usage, goals }) => {

  // Calculate streak — days where total usage stayed under all goals
  const calculateStreak = () => {
    if (!goals.length) return 0;
    let streak = 0;
    const today = new Date();

    for (let i = 1; i <= 30; i++) {
      const day = new Date();
      day.setDate(today.getDate() - i);
      const dayStr = day.toDateString();

      const dayUsage = usage.filter(s =>
        new Date(s.date).toDateString() === dayStr
      );

      if (dayUsage.length === 0) break;

      const underLimit = goals.every(goal => {
        const appTotal = dayUsage
          .filter(s => s.app_name === goal.app_name)
          .reduce((sum, s) => sum + s.minutes_spent, 0);
        return appTotal <= goal.daily_limit_minutes;
      });

      if (underLimit) streak++;
      else break;
    }
    return streak;
  };

  const streak        = calculateStreak();
  const nextMilestone = MILESTONES.find(m => m.days > streak) || MILESTONES[MILESTONES.length - 1];
  const progress      = Math.min((streak / nextMilestone.days) * 100, 100);

  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--border)',
      borderRadius: '16px', padding: '24px',
    }}>
      <span style={{
        fontSize: '11px', fontWeight: 600, letterSpacing: '1.5px',
        color: 'var(--accent)', textTransform: 'uppercase',
      }}>Detox Streak</span>

      {/* Streak Count */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        margin: '16px 0',
      }}>
        <div style={{
          fontSize: '48px', fontFamily: "'Syne', sans-serif",
          fontWeight: 800, color: streak > 0 ? 'var(--accent)' : 'var(--muted)',
          lineHeight: 1,
        }}>{streak}</div>
        <div>
          <p style={{ fontWeight: 600, fontSize: '15px' }}>day{streak !== 1 ? 's' : ''}</p>
          <p style={{ fontSize: '12px', color: 'var(--muted)' }}>
            {streak === 0 ? 'Start today!' : 'Keep going!'}
          </p>
        </div>
        <RiFireLine size={32} style={{
          marginLeft: 'auto',
          color: streak > 0 ? '#ffb347' : 'var(--border)',
          transition: 'color 0.3s',
        }}/>
      </div>

      {/* Next Target */}
      <div style={{
        background: 'var(--bg3)', borderRadius: '10px',
        padding: '14px', marginBottom: '20px',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontSize: '13px', marginBottom: '8px',
        }}>
          <span style={{ color: 'var(--muted)' }}>Next target</span>
          <span style={{ color: nextMilestone.color, fontWeight: 600 }}>
            {streak}/{nextMilestone.days} days
          </span>
        </div>
        <div style={{
          height: '6px', background: 'var(--border)',
          borderRadius: '4px', overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', width: `${progress}%`,
            background: nextMilestone.color, borderRadius: '4px',
            transition: 'width 0.5s ease',
          }}/>
        </div>
        <p style={{
          fontSize: '12px', color: 'var(--muted)', marginTop: '8px',
        }}>
          {nextMilestone.days - streak} more day{nextMilestone.days - streak !== 1 ? 's' : ''} to unlock{' '}
          <span style={{ color: nextMilestone.color, fontWeight: 600 }}>
            {nextMilestone.label}
          </span>
        </p>
      </div>

      {/* Milestones */}
      <p style={{
        fontSize: '11px', fontWeight: 600, letterSpacing: '1px',
        color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '12px',
      }}>Rewards</p>

      {MILESTONES.map(m => {
        const unlocked = streak >= m.days;
        return (
          <div key={m.days} style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '10px 12px', borderRadius: '10px', marginBottom: '8px',
            background: unlocked ? `${m.color}12` : 'transparent',
            border: `1px solid ${unlocked ? m.color + '30' : 'var(--border)'}`,
            opacity: unlocked ? 1 : 0.5, transition: 'all 0.3s',
          }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: unlocked ? `${m.color}20` : 'var(--bg3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: unlocked ? m.color : 'var(--muted)',
            }}>
              {unlocked ? m.icon : <RiGiftLine size={16}/>}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{
                fontSize: '13px', fontWeight: 600,
                color: unlocked ? 'var(--text)' : 'var(--muted)',
              }}>{m.label}</p>
              <p style={{ fontSize: '11px', color: 'var(--muted)' }}>{m.reward}</p>
            </div>
            {unlocked && (
              <span style={{
                fontSize: '11px', padding: '3px 8px', borderRadius: '20px',
                background: `${m.color}20`, color: m.color, fontWeight: 600,
              }}>Unlocked</span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StreakPanel;