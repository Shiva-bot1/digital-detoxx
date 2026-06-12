import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Logo from './Logo';
import {
  RiDashboardLine, RiSettings4Line,
  RiLogoutBoxLine, RiSunLine, RiMoonLine
} from 'react-icons/ri';

const Navbar = () => {
  const { logout, user }    = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate            = useNavigate();
  const location            = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };

  const navLink = (path, icon, label) => {
    const active = location.pathname === path;
    return (
      <Link to={path} style={{
        display:'flex', alignItems:'center', gap:'8px',
        padding:'8px 16px', borderRadius:'10px', textDecoration:'none',
        fontSize:'14px', fontWeight:500, transition:'all 0.2s',
        background: active ? 'rgba(0,232,122,0.1)' : 'transparent',
        color:      active ? 'var(--accent)'        : 'var(--muted)',
        border:     active ? '1px solid rgba(0,232,122,0.2)' : '1px solid transparent',
      }}>
        {icon} {label}
      </Link>
    );
  };

  return (
    <nav style={{
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'16px 32px',
      background: theme === 'dark' ? 'rgba(6,19,14,0.7)' : 'rgba(240,250,245,0.85)',
      backdropFilter:'blur(12px)',
      WebkitBackdropFilter:'blur(12px)',
      borderBottom:'1px solid var(--border)',
      position:'sticky', top:0, zIndex:100,
      transition:'background 0.3s ease',
    }}>
      <Logo size={36}/>

      <div style={{ display:'flex', gap:'8px' }}>
        {navLink('/',         <RiDashboardLine size={16}/>, 'Dashboard')}
        {navLink('/settings', <RiSettings4Line size={16}/>, 'Settings')}
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
        <span style={{ fontSize:'14px', color:'var(--muted)' }}>
          Hey, <strong style={{ color:'var(--text)' }}>{user?.name}</strong>
        </span>

        {/* Theme toggle */}
        <button onClick={toggleTheme} style={{
          width:'36px', height:'36px', borderRadius:'10px',
          display:'flex', alignItems:'center', justifyContent:'center',
          background:'transparent', border:'1px solid var(--border)',
          color:'var(--muted)', cursor:'pointer', transition:'all 0.2s',
        }}
          onMouseOver={e => e.currentTarget.style.borderColor = 'var(--accent)'}
          onMouseOut={e  => e.currentTarget.style.borderColor = 'var(--border)'}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark'
            ? <RiSunLine  size={16}/>
            : <RiMoonLine size={16}/>
          }
        </button>

        <button onClick={handleLogout} style={{
          display:'flex', alignItems:'center', gap:'6px',
          padding:'8px 14px', borderRadius:'10px', fontSize:'13px',
          background:'transparent', border:'1px solid var(--border)',
          color:'var(--muted)', transition:'all 0.2s', cursor:'pointer',
        }}
          onMouseOver={e => e.currentTarget.style.borderColor = 'var(--danger)'}
          onMouseOut={e  => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          <RiLogoutBoxLine size={15}/> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;