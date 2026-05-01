import React, { useState, useEffect } from 'react';
import { RiRefreshLine, RiDoubleQuotesL } from 'react-icons/ri';

const QUOTES = [
  { text: "Almost everything will work again if you unplug it for a few minutes, including you.", author: "Anne Lamott" },
  { text: "Disconnect to reconnect. The greatest gift you can give someone is your undivided attention.", author: "Unknown" },
  { text: "Your phone is a tool, not a tyrant. You decide when to pick it up.", author: "Unknown" },
  { text: "In a world where you can be anything, be present.", author: "Unknown" },
  { text: "The irony of loneliness is we all feel it at the same time — together on our phones, alone.", author: "Unknown" },
  { text: "Not all those who wander are lost, but all those who scroll definitely are.", author: "Unknown" },
  { text: "Real life is happening outside your screen. Don't miss it.", author: "Unknown" },
  { text: "Boredom is the gateway to creativity. Embrace it.", author: "Unknown" },
  { text: "You are not your likes, your followers, or your screen time.", author: "Unknown" },
  { text: "Every moment you spend offline is a moment you spend actually living.", author: "Unknown" },
  { text: "Put down your phone and pick up your life.", author: "Unknown" },
  { text: "Silence is not empty. It is full of answers.", author: "Unknown" },
  { text: "The present moment is the only moment available to us, and it is the door to all moments.", author: "Thich Nhat Hanh" },
  { text: "Technology is a useful servant but a dangerous master.", author: "Christian Lous Lange" },
];

const QuoteCard = () => {
  const [idx,     setIdx]     = useState(0);
  const [fade,    setFade]    = useState(true);

  useEffect(() => {
    const today = new Date().getDate();
    setIdx(today % QUOTES.length);
  }, []);

  const refresh = () => {
    setFade(false);
    setTimeout(() => {
      setIdx(prev => (prev + 1) % QUOTES.length);
      setFade(true);
    }, 300);
  };

  const quote = QUOTES[idx];

  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--border)',
      borderRadius: '16px', padding: '24px', position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative background */}
      <div style={{
        position: 'absolute', top: '-20px', right: '-20px',
        width: '120px', height: '120px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,232,122,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }}/>

      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '16px',
      }}>
        <span style={{
          fontSize: '11px', fontWeight: 600, letterSpacing: '1.5px',
          color: 'var(--accent)', textTransform: 'uppercase',
        }}>Today's Quote</span>
        <button onClick={refresh} style={{
          background: 'transparent', border: 'none',
          color: 'var(--muted)', cursor: 'pointer', padding: '4px',
          borderRadius: '6px', transition: 'color 0.2s',
          display: 'flex', alignItems: 'center',
        }}
          onMouseOver={e => e.currentTarget.style.color = 'var(--accent)'}
          onMouseOut={e  => e.currentTarget.style.color = 'var(--muted)'}
        >
          <RiRefreshLine size={16}/>
        </button>
      </div>

      <div style={{
        transition: 'opacity 0.3s ease',
        opacity: fade ? 1 : 0,
      }}>
        <RiDoubleQuotesL size={24} style={{ color: 'var(--accent)', opacity: 0.4, marginBottom: '10px' }}/>
        <p style={{
          fontSize: '14px', lineHeight: '1.7',
          color: 'var(--text)', marginBottom: '14px', fontStyle: 'italic',
        }}>
          {quote.text}
        </p>
        <p style={{
          fontSize: '12px', color: 'var(--accent)',
          fontWeight: 600,
        }}>— {quote.author}</p>
      </div>
    </div>
  );
};

export default QuoteCard;