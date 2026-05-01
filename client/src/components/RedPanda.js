import React, { useState } from 'react';

const MESSAGES = [
  "Put the phone down. The bamboo forest has no Wi-Fi — and it's the most peaceful place I know.",
  "Every minute offline is a minute you're actually living. I'd know — I live in trees.",
  "Breathe. Stretch. Look up from the screen. The world is still here, I promise.",
  "Your goals are closer than your screen time suggests. Keep going!",
  "Rest is not laziness. Even I nap between detox sessions.",
  "Small steps every day. That's how I climbed to the top of the tree.",
  "You logged your screen time today. That's self-awareness. That's growth.",
  "The forest teaches patience. So does a good digital detox.",
];

const RedPanda = () => {
  const [msgIdx, setMsgIdx] = useState(0);
  const [fade,   setFade]   = useState(true);

  const nextMessage = () => {
    setFade(false);
    setTimeout(() => {
      setMsgIdx(prev => (prev + 1) % MESSAGES.length);
      setFade(true);
    }, 250);
  };

  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--border)',
      borderRadius: '16px', padding: '20px', textAlign: 'center',
      overflow: 'hidden', position: 'relative',
    }}>
      {/* Glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: '200px', height: '200px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(192,57,43,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }}/>

      {/* Label */}
      <span style={{
        fontSize: '11px', fontWeight: 600, letterSpacing: '1.5px',
        color: '#c0392b', textTransform: 'uppercase',
      }}>Your Detox Buddy</span>

      {/* SVG Panda */}
      <svg
        width="100%"
        viewBox="0 0 340 320"
        style={{ display: 'block', margin: '0 auto', maxWidth: '220px' }}
      >
        <style>{`
          @keyframes rp-tail { 0%,100%{transform:rotate(-8deg);transform-origin:160px 240px} 50%{transform:rotate(8deg);transform-origin:160px 240px} }
          @keyframes rp-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
          @keyframes rp-blink { 0%,88%,100%{transform:scaleY(1)} 93%{transform:scaleY(0.08)} }
          .rp-tail  { animation: rp-tail  3s ease-in-out infinite; }
          .rp-body  { animation: rp-float 4s ease-in-out infinite; }
          .rp-eyelL { animation: rp-blink 4s ease-in-out infinite; transform-origin:144px 152px; }
          .rp-eyeR  { animation: rp-blink 4s ease-in-out infinite 0.1s; transform-origin:196px 152px; }
        `}</style>

        {/* Tail */}
        <g className="rp-tail">
          <ellipse cx="108" cy="252" rx="72" ry="22" fill="#c0392b" transform="rotate(-30,108,252)"/>
          <ellipse cx="100" cy="245" rx="54" ry="14" fill="#e8956d" transform="rotate(-30,100,245)"/>
          <ellipse cx="80"  cy="234" rx="38" ry="11" fill="#c0392b" transform="rotate(-25,80,234)"/>
          <ellipse cx="68"  cy="227" rx="26" ry="8"  fill="#e8956d" transform="rotate(-18,68,227)"/>
          <ellipse cx="58"  cy="222" rx="16" ry="6"  fill="#c0392b" transform="rotate(-10,58,222)"/>
        </g>

        {/* Body group */}
        <g className="rp-body">
          {/* Body */}
          <ellipse cx="170" cy="228" rx="60" ry="65" fill="#c0392b"/>
          <ellipse cx="170" cy="240" rx="42" ry="48" fill="#e8956d"/>

          {/* Legs */}
          <ellipse cx="140" cy="287" rx="22" ry="11" fill="#8B2500"/>
          <ellipse cx="200" cy="287" rx="22" ry="11" fill="#8B2500"/>
          <ellipse cx="140" cy="285" rx="17" ry="8"  fill="#c0392b"/>
          <ellipse cx="200" cy="285" rx="17" ry="8"  fill="#c0392b"/>

          {/* Arms */}
          <ellipse cx="120" cy="235" rx="14" ry="28" fill="#c0392b" transform="rotate(15,120,235)"/>
          <ellipse cx="220" cy="235" rx="14" ry="28" fill="#c0392b" transform="rotate(-15,220,235)"/>

          {/* Hands */}
          <ellipse cx="115" cy="258" rx="12" ry="10" fill="#8B2500"/>
          <ellipse cx="225" cy="258" rx="12" ry="10" fill="#8B2500"/>

          {/* Plant in left hand */}
          <rect x="108" y="232" width="3" height="22" rx="1.5" fill="#2d6a4f"/>
          <ellipse cx="107" cy="232" rx="8" ry="6"  fill="#40916c" transform="rotate(-20,107,232)"/>
          <ellipse cx="116" cy="227" rx="7" ry="5"  fill="#52b788" transform="rotate(15,116,227)"/>
          <ellipse cx="110" cy="222" rx="5" ry="4"  fill="#74c69d" transform="rotate(-10,110,222)"/>

          {/* Head */}
          <circle cx="170" cy="148" r="58" fill="#c0392b"/>

          {/* Face patch */}
          <ellipse cx="170" cy="161" rx="37" ry="32" fill="#f5cba7"/>

          {/* Ears */}
          <ellipse cx="124" cy="103" rx="21" ry="18" fill="#c0392b"/>
          <ellipse cx="124" cy="103" rx="13" ry="11" fill="#8B2500"/>
          <ellipse cx="216" cy="103" rx="21" ry="18" fill="#c0392b"/>
          <ellipse cx="216" cy="103" rx="13" ry="11" fill="#8B2500"/>

          {/* Eye patches */}
          <ellipse cx="149" cy="146" rx="18" ry="16" fill="#3d1a0a"/>
          <ellipse cx="191" cy="146" rx="18" ry="16" fill="#3d1a0a"/>

          {/* Eyes */}
          <circle className="rp-eyeL" cx="151" cy="149" r="9" fill="#f5f5f0"/>
          <circle className="rp-eyeR" cx="189" cy="149" r="9" fill="#f5f5f0"/>
          <circle cx="153" cy="151" r="5.5" fill="#1a0a00"/>
          <circle cx="191" cy="151" r="5.5" fill="#1a0a00"/>
          <circle cx="155" cy="149" r="2"   fill="#ffffff"/>
          <circle cx="193" cy="149" r="2"   fill="#ffffff"/>

          {/* Nose */}
          <ellipse cx="170" cy="168" rx="7" ry="5" fill="#8B2500"/>

          {/* Mouth */}
          <path d="M163 174 Q170 180 177 174" fill="none" stroke="#8B2500" stroke-width="1.8" strokeLinecap="round"/>

          {/* Whiskers */}
          <line x1="136" y1="168" x2="157" y2="170" stroke="#f5cba7" stroke-width="1" strokeLinecap="round"/>
          <line x1="134" y1="173" x2="156" y2="173" stroke="#f5cba7" stroke-width="1" strokeLinecap="round"/>
          <line x1="184" y1="170" x2="205" y2="168" stroke="#f5cba7" stroke-width="1" strokeLinecap="round"/>
          <line x1="184" y1="173" x2="206" y2="173" stroke="#f5cba7" stroke-width="1" strokeLinecap="round"/>

          {/* Blush */}
          <ellipse cx="140" cy="175" rx="10" ry="6" fill="#e8956d" opacity="0.5"/>
          <ellipse cx="200" cy="175" rx="10" ry="6" fill="#e8956d" opacity="0.5"/>
        </g>

        {/* Shadow */}
        <ellipse cx="170" cy="302" rx="62" ry="8" fill="#0a1a0f" opacity="0.3"/>

        {/* Name badge */}
        <rect x="140" y="308" width="60" height="18" rx="9" fill="#00e87a" opacity="0.15" stroke="#00e87a" strokeWidth="1"/>
        <text x="170" y="321" textAnchor="middle" fontFamily="'Space Grotesk',sans-serif" fontSize="11" fill="#00e87a" fontWeight="600">Ruki</text>
      </svg>

      {/* Message bubble */}
      <div style={{
        background: 'var(--bg3)', border: '1px solid var(--border)',
        borderRadius: '12px', padding: '14px 16px', margin: '4px 0 14px',
        transition: 'opacity 0.25s ease',
        opacity: fade ? 1 : 0,
        minHeight: '72px', display: 'flex', alignItems: 'center',
      }}>
        <p style={{
          fontSize: '13px', lineHeight: 1.6,
          color: 'var(--text)', fontStyle: 'italic', textAlign: 'left',
        }}>
          "{MESSAGES[msgIdx]}"
        </p>
      </div>

      {/* Button */}
      <button onClick={nextMessage} style={{
        width: '100%', padding: '10px',
        background: 'transparent',
        border: '1px solid rgba(192,57,43,0.3)',
        borderRadius: '10px', fontSize: '13px',
        color: '#c0392b', fontWeight: 600,
        cursor: 'pointer', transition: 'all 0.2s',
        fontFamily: "'Space Grotesk', sans-serif",
      }}
        onMouseOver={e => {
          e.currentTarget.style.background = 'rgba(192,57,43,0.08)';
          e.currentTarget.style.borderColor = '#c0392b';
        }}
        onMouseOut={e => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.borderColor = 'rgba(192,57,43,0.3)';
        }}
      >
        Ask Ruki for wisdom
      </button>
    </div>
  );
};

export default RedPanda;