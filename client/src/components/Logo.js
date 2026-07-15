import React from 'react';
import svazenLogo from '../assets/svazen-logo.png';

const Logo = ({ size = 40, showText = true }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <img
      src={svazenLogo}
      alt="SvaZen Logo"
      style={{
        width:        size,
        height:       size,
        borderRadius: '50%',
        objectFit:    'cover',
        flexShrink:   0,
      }}
    />
    {showText && (
      <div>
        <span style={{
          fontFamily:   "'Syne', sans-serif",
          fontWeight:   800,
          fontSize:     size * 0.52,
          color:        '#00e87a',
          letterSpacing:'-0.5px',
          display:      'block',
          lineHeight:   1.1,
        }}>
          SvaZen<span style={{ color: '#e8f5ee' }}>.</span>
        </span>
        {size >= 36 && (
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize:   size * 0.22,
            color:      '#6b8f78',
            display:    'block',
            letterSpacing: '0.3px',
          }}>
            Take Control of Your Digital Life.
          </span>
        )}
      </div>
    )}
  </div>
);

export default Logo;