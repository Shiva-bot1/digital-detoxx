import React, { useState } from 'react';
import { RiSmartphoneLine, RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri';

const steps = {
  android: [
    'Open phone Settings',
    'Tap "Digital Wellbeing & Parental Controls"',
    'Tap the chart/circle showing today\'s usage',
    'You\'ll see per-app screen time breakdown',
    'Log each app\'s time above in "Log Usage"',
  ],
  ios: [
    'Open iPhone Settings',
    'Tap "Screen Time"',
    'Tap "See All Activity" under the graph',
    'View today\'s per-app breakdown at the top',
    'Log each app\'s time above in "Log Usage"',
  ],
};

const ScreenTimeGuide = () => {
  const [open, setOpen] = useState(false);
  const [tab,  setTab]  = useState('android');

  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--border)',
      borderRadius: '16px', overflow: 'hidden', marginBottom: '20px',
    }}>
      {/* Header — toggle */}
      <button onClick={() => setOpen(!open)} style={{
        width: '100%', padding: '18px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'transparent', border: 'none', cursor: 'pointer',
        color: 'var(--text)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <RiSmartphoneLine size={18} style={{ color: 'var(--accent)' }}/>
          <span style={{ fontWeight: 600, fontSize: '14px' }}>
            How to find your screen time
          </span>
        </div>
        {open
          ? <RiArrowUpSLine   size={18} style={{ color: 'var(--muted)' }}/>
          : <RiArrowDownSLine size={18} style={{ color: 'var(--muted)' }}/>
        }
      </button>

      {open && (
        <div style={{ padding: '0 24px 24px' }}>
          {/* Tabs */}
          <div style={{
            display: 'flex', gap: '8px', marginBottom: '20px',
          }}>
            {[
              { key: 'android', label: '🤖 Android' },
              { key: 'ios',     label: ' iOS' },
            ].map(({ key, label }) => (
              <button key={key} onClick={() => setTab(key)} style={{
                padding: '8px 18px', borderRadius: '8px', fontSize: '13px',
                fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                background: tab === key ? 'var(--accent)' : 'var(--bg3)',
                color: tab === key ? '#0a0f0d' : 'var(--muted)',
              }}>{label}</button>
            ))}
          </div>

          {/* Steps */}
          {steps[tab].map((step, i) => (
            <div key={i} style={{
              display: 'flex', gap: '14px', alignItems: 'flex-start',
              marginBottom: '14px',
            }}>
              <div style={{
                width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                background: 'rgba(0,232,122,0.12)', border: '1px solid rgba(0,232,122,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', fontWeight: 700, color: 'var(--accent)',
              }}>{i + 1}</div>
              <p style={{ fontSize: '13px', color: 'var(--text)', lineHeight: 1.6, paddingTop: '3px' }}>
                {step}
              </p>
            </div>
          ))}

          <div style={{
            marginTop: '16px', padding: '12px 14px', borderRadius: '10px',
            background: 'rgba(0,232,122,0.06)', border: '1px solid rgba(0,232,122,0.15)',
            fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6,
          }}>
            💡 Tip — Check your phone every evening and log the day's usage here for the most accurate detox tracking.
          </div>
        </div>
      )}
    </div>
  );
};

export default ScreenTimeGuide;