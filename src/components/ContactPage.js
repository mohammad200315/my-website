import React from 'react';

const ContactPage = ({ language, t }) => {
  return (
    <div className="page-container">
      <h1>{t.contact}</h1>
      <p>
        {language === 'english' 
          ? 'Contact information and support will be available here.' 
          : 'سيتم توفير معلومات الاتصال والدعم هنا.'
        }
      </p>
    </div>
  );
};

export default ContactPage;