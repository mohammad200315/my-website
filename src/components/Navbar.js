import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, userProfile, language, onLanguageChange, onLogout, onShowTeam, t }) => {
  return (
    <nav style={{ 
      padding: '1rem', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {/* زر فريقنا في البداية */}
        <button 
          onClick={onShowTeam}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '14px'
          }}
        >
          👥 {language === 'english' ? 'Our Team' : 'فريقنا'}
        </button>
        
        {/* الروابط الأخرى */}
        <Link to="/chat" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          💬 {t.chat}
        </Link>
        <Link to="/about" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          ℹ️ {t.about}
        </Link>
        <Link to="/tips" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          💡 {t.tips}
        </Link>
        <Link to="/contact" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          📞 {t.contact}
        </Link>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* مبدل اللغة */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={() => onLanguageChange('english')}
            style={{
              background: language === 'english' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
              border: 'none',
              color: 'white',
              padding: '0.3rem 0.7rem',
              borderRadius: '3px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            EN
          </button>
          <button 
            onClick={() => onLanguageChange('arabic')}
            style={{
              background: language === 'arabic' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
              border: 'none',
              color: 'white',
              padding: '0.3rem 0.7rem',
              borderRadius: '3px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            AR
          </button>
        </div>
        
        {/* معلومات المستخدم */}
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          👤 {userProfile?.fullName || user?.fullName || (language === 'english' ? 'User' : 'مستخدم')}
        </span>
        
        {/* زر تسجيل الخروج */}
        <button 
          onClick={onLogout}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          🚪 {t.logout}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;