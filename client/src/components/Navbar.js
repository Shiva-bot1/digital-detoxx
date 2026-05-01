import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import { RiDashboardLine, RiSettings4Line, RiLogoutBoxLine } from 'react-icons/ri';

const Navbar = () => {
  const { logout, user } = useAuth();
  const navigate         = useNavigate();
  const location         = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };

  const navLink = (path, icon, label) => {
    const active = location.pathname === path;
    return (
      <Link to={path} style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '8px 16px', borderRadius: '10px', textDecoration: 'none',
        fontSize: '14px', fontWeight: 500, transition: 'all 0.2s',
        background: active ? 'rgba(0,232,122,0.1)' : 'transparent',
        color: active ? 'var(--accent)' : 'var(--muted)',
        border: active ? '1px solid rgba(0,232,122,0.2)' : '1px solid transparent',
      }}>
        {icon} {label}
      </Link>
    );
  };

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 32px', background: 'var(--bg2)',
      borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100,
    }}>
      <Logo size={36} />

    <nav style={{
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '16px 32px',
  background: 'rgba(6,19,14,0.7)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  borderBottom: '1px solid rgba(0,232,122,0.1)',
  position: 'sticky', top: 0, zIndex: 100,
}}></nav>

      <div style={{ display: 'flex', gap: '8px' }}>
        {navLink('/',         <RiDashboardLine size={16}/>, 'Dashboard')}
        {navLink('/settings', <RiSettings4Line size={16}/>, 'Settings')}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ fontSize: '14px', color: 'var(--muted)' }}>
          Hey, <strong style={{ color: 'var(--text)' }}>{user?.name}</strong>
        </span>
        <button onClick={handleLogout} style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '8px 14px', borderRadius: '10px', fontSize: '13px',
          background: 'transparent', border: '1px solid var(--border)',
          color: 'var(--muted)', transition: 'all 0.2s',
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