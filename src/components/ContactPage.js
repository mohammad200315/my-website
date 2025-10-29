import React from 'react';

const ContactPage = ({ language, t }) => {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>📞 {t.contact}</h1>
      <div style={{ background: '#f8f9fa', padding: '2rem', borderRadius: '10px', marginTop: '1rem' }}>
        <p>
          {language === 'english' 
            ? 'For support and inquiries, please contact our team at: support@mentalhealthapp.com'
            : 'للحصول على الدعم والاستفسارات، يرجى التواصل مع فريقنا على: support@mentalhealthapp.com'
          }
        </p>
      </div>
    </div>
  );
};

export default ContactPage;