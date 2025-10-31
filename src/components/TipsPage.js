import React from 'react';

const TipsPage = ({ language, t }) => {
  return (
    <div className="page-container">
      <h1>{t.tips}</h1>
      <p>
        {language === 'english' 
          ? 'Mental health tips and resources will be available here.' 
          : 'سيتم توفير نصائح وموارد الصحة النفسية هنا.'
        }
      </p>
    </div>
  );
};

export default TipsPage;