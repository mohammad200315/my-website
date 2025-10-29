import React from 'react';

const AboutPage = ({ language, t }) => {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>ℹ️ {t.about}</h1>
      <div style={{ background: '#f8f9fa', padding: '2rem', borderRadius: '10px', marginTop: '1rem' }}>
        <p>
          {language === 'english' 
            ? 'This is a mental health support application that provides AI-powered chat assistance for emotional well-being and psychological support.'
            : 'هذا تطبيق دعم الصحة النفسية يوفر مساعدة دردشة مدعومة بالذكاء الاصطناعي للرفاهية العاطفية والدعم النفسي.'
          }
        </p>
      </div>
    </div>
  );
};

export default AboutPage;