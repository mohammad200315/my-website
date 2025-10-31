import React from 'react';

const AboutPage = ({ language, t }) => {
  return (
    <div className="page-container">
      <h1>{t.about}</h1>
      <p>
        {language === 'english' 
          ? 'This is a mental health support chatbot designed to provide assistance and guidance.' 
          : 'هذا تطبيق شات بوت لدعم الصحة النفسية مصمم لتقديم المساعدة والإرشاد.'
        }
      </p>
    </div>
  );
};

export default AboutPage;