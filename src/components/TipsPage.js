import React from 'react';

const TipsPage = ({ language, t }) => {
  const tips = language === 'english' ? [
    "Practice deep breathing exercises daily",
    "Get regular physical activity",
    "Maintain a healthy sleep schedule",
    "Connect with loved ones regularly",
    "Practice mindfulness and meditation"
  ] : [
    "مارس تمارين التنفس العميق يومياً",
    "احرص على النشاط البدني المنتظم",
    "حافظ على جدول نوم صحي",
    "تواصل مع أحبائك بانتظام",
    "مارس اليقظة الذهنية والتأمل"
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>💡 {t.tips}</h1>
      <div style={{ marginTop: '1rem' }}>
        {tips.map((tip, index) => (
          <div key={index} style={{
            background: '#f8f9fa',
            padding: '1rem',
            margin: '0.5rem 0',
            borderRadius: '8px',
            borderLeft: '4px solid #667eea'
          }}>
            {tip}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TipsPage;