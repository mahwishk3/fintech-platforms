import { useState } from 'react';
import { useLocation } from 'wouter';
import { usePortfolio } from '../context/PortfolioContext';
import { useUserProfile } from '../context/UserProfileContext';

interface NavbarProps {
  darkMode: boolean;
  onToggleDark: () => void;
}

export default function Navbar({ darkMode, onToggleDark }: NavbarProps) {
  const [location, navigate] = useLocation();
  const { portfolio } = usePortfolio();
  const { isProfileComplete } = useUserProfile();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products' },
    { path: '/recommendations', label: 'Recommendations' },
    { path: '/profile', label: 'My Profile' },
  ];

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-inner">
          <div className="navbar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <div className="navbar-logo-icon">FP</div>
            FinPulse
          </div>

          <div className={`navbar-nav${menuOpen ? ' open' : ''}`}>
            {links.map(link => (
              <div
                key={link.path}
                className={`navbar-link${location === link.path ? ' active' : ''}`}
                onClick={() => { navigate(link.path); setMenuOpen(false); }}
                data-testid={`nav-${link.label.toLowerCase().replace(/\s/g, '-')}`}
              >
                {link.label}
                {link.path === '/profile' && isProfileComplete() && (
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--secondary)', display: 'inline-block' }} />
                )}
              </div>
            ))}
          </div>

          <div className="navbar-actions">
            <button
              className="navbar-theme-btn"
              onClick={onToggleDark}
              data-testid="btn-toggle-dark"
              title={darkMode ? 'Light mode' : 'Dark mode'}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button
              className="navbar-portfolio-btn"
              onClick={() => navigate('/portfolio')}
              data-testid="btn-portfolio"
            >
              💼 Portfolio
              {portfolio.items.length > 0 && (
                <span className="portfolio-badge">{portfolio.items.length}</span>
              )}
            </button>
            <button className="mobile-menu-btn" onClick={() => setMenuOpen(v => !v)}>
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
