import React from 'react';

const HomePage = ({ language, setLanguage, t, onGetStarted, onGuestLogin }) => {
  return (
    <div className="home-container">
      <div className="language-switcher-home">
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

      <div className="hero-section">
        <h1 className="hero-title">🌿 {t.welcome}</h1>
        <p className="hero-subtitle">{t.mentalHealthSupport}</p>
        
        <div className="hero-actions">
          <button className="primary-btn" onClick={onGetStarted}>
            {t.getStarted}
          </button>
          <button className="secondary-btn" onClick={onGuestLogin}>
            {t.guestLogin}
          </button>
        </div>
      </div>

      <div className="features-section">
        <div className="feature-card">
          <div className="feature-icon">💬</div>
          <h3>{language === 'english' ? 'AI Chat Support' : 'دردشة ذكية'}</h3>
          <p>
            {language === 'english' 
              ? 'Talk to our AI assistant for mental health support' 
              : 'تحدث مع مساعدنا الذكي للحصول على الدعم النفسي'
            }
          </p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">🔒</div>
          <h3>{language === 'english' ? 'Secure & Private' : 'آمن وخاص'}</h3>
          <p>
            {language === 'english' 
              ? 'Your conversations are completely confidential' 
              : 'محادثاتك سرية تماماً'
            }
          </p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">🌙</div>
          <h3>{language === 'english' ? '24/7 Available' : 'متاح 24/7'}</h3>
          <p>
            {language === 'english' 
              ? 'Get support whenever you need it' 
              : 'احصل على الدعم وقتما تحتاجه'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;