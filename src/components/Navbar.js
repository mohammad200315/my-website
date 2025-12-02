import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ user, userProfile, language, onLanguageChange, onLogout, onShowTeam, t }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h2>💬 {t.chat}</h2>
      </div>
      
      <div className="nav-links">
        <button 
          className={`nav-link ${isActive('/')}`}
          onClick={() => handleNavigation('/')}
        >
          🏠 {t.home}
        </button>
        <button 
          className={`nav-link ${isActive('/about')}`}
          onClick={() => handleNavigation('/about')}
        >
          ℹ️ {t.about}
        </button>
        <button 
          className={`nav-link ${isActive('/tips')}`}
          onClick={() => handleNavigation('/tips')}
        >
          💡 {t.tips}
        </button>
        <button 
          className={`nav-link ${isActive('/contact')}`}
          onClick={() => handleNavigation('/contact')}
        >
          📞 {t.contact}
        </button>
        <button 
          className={`nav-link ${isActive('/chat')}`}
          onClick={() => handleNavigation('/chat')}
        >
          💬 {t.chat}
        </button>
      </div>
      
      <div className="nav-controls">
        <div className="language-switcher-nav">
          <button 
            className={`lang-btn ${language === 'english' ? 'active' : ''}`} 
            onClick={() => onLanguageChange('english')}
          >
            EN
          </button>
          <button 
            className={`lang-btn ${language === 'arabic' ? 'active' : ''}`} 
            onClick={() => onLanguageChange('arabic')}
          >
            AR
          </button>
        </div>
        
        {user && (
          <div className="user-menu">
            <span className="user-greeting">
              {language === 'english' ? 'Hello' : 'مرحباً'} {userProfile.fullName || user.email}
            </span>
            <button className="team-btn" onClick={onShowTeam}>
              👥 {t.ourTeam}
            </button>
            <button className="logout-btn" onClick={onLogout}>
              🚪 {t.logout}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;