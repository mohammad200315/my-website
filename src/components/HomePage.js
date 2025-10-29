import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = ({ language, setLanguage, t, onGetStarted, onGuestLogin }) => {
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="language-switcher">
          <button 
            className={`lang-btn ${language === 'english' ? 'active' : ''}`}
            onClick={() => setLanguage('english')}
          >
            EN
          </button>
          <button 
            className={`lang-btn ${language === 'arabic' ? 'active' : ''}`}
            onClick={() => setLanguage('arabic')}
          >
            AR
          </button>
        </div>

        <h1 className="login-title">🌿 {t.welcome}</h1>
        <p className="login-subtitle">{t.mentalHealthSupport}</p>

        <div className="login-form" style={{ gap: '15px' }}>
          <button className="login-btn full-width" onClick={onGetStarted}>
            🚀 {t.getStarted}
          </button>
          
          <button className="guest-login-btn" onClick={onGuestLogin}>
            👤 {t.guestLogin}
          </button>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>
            {language === 'english' 
              ? 'Your mental health journey starts here' 
              : 'رحلتك نحو الصحة النفسية تبدأ من هنا'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;