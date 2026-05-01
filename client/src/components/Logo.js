import React from 'react';

const Logo = ({ size = 40 }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="19" stroke="#00e87a" strokeWidth="1.5" strokeDasharray="4 2"/>
      <circle cx="20" cy="20" r="13" fill="#00e87a" fillOpacity="0.08"/>
      <path d="M20 8 L20 20 L28 26" stroke="#00e87a" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="20" cy="20" r="2.5" fill="#00e87a"/>
      <path d="M14 6 Q20 2 26 6" stroke="#00e87a" strokeWidth="1"
        strokeLinecap="round" opacity="0.4"/>
    </svg>
    <span style={{
      fontFamily: "'Syne', sans-serif",
      fontWeight: 800,
      fontSize: size * 0.55,
      color: '#00e87a',
      letterSpacing: '-0.5px'
    }}>
      detox<span style={{ color: '#e8f5ee' }}>.</span>
    </span>
  </div>
);

export default Logo;