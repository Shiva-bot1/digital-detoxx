import React from 'react';

const Logo = ({ size = 40, showText = true }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="48" fill="#020a08"/>
      <circle cx="50" cy="50" r="48" fill="none" stroke="#00e87a"
        strokeWidth="1" strokeDasharray="4 3" opacity="0.3"/>
      <circle cx="50" cy="50" r="40" fill="none" stroke="#00e87a"
        strokeWidth="5" opacity="0.2"/>
      <circle cx="50" cy="50" r="33" fill="none" stroke="#00b8d9"
        strokeWidth="4" opacity="0.15"/>
      <circle cx="50" cy="50" r="38" fill="#06130e"/>
      <polygon points="18,72 34,48 50,72" fill="#0a1c14"/>
      <polygon points="34,72 50,44 66,72" fill="#0d2218"/>
      <polygon points="50,72 66,50 82,72" fill="#112a1e"/>
      <rect x="18" y="70" width="64" height="14" fill="#152e22"/>
      <circle cx="50" cy="50" r="18" fill="#0d1f16" stroke="#00e87a" strokeWidth="1.2"/>
      <line x1="50" y1="50" x2="50" y2="36" stroke="#00e87a"
        strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="50" y1="50" x2="60" y2="56" stroke="#00e87a"
        strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="50" cy="50" r="2.5" fill="#00e87a"/>
      <path d="M50 32 C47 27 41 25 39 28 C41 31 46 32 50 32 Z" fill="#00e87a"/>
      <path d="M50 32 C53 27 59 25 61 28 C59 31 54 32 50 32 Z" fill="#00c96a"/>
    </svg>
    {showText && (
      <div>
        <span style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: size * 0.52,
          color: '#00e87a',
          letterSpacing: '-0.5px',
          display: 'block',
          lineHeight: 1.1,
        }}>
          SvaZen<span style={{ color: '#e8f5ee' }}>.</span>
        </span>
        {size >= 36 && (
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: size * 0.22,
            color: '#6b8f78',
            letterSpacing: '0.3px',
            display: 'block',
          }}>
            Take Control of Your Digital Life.
          </span>
        )}
      </div>
    )}
  </div>
);

export default Logo;