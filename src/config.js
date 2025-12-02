// config.js - الملف المعدل
export const GOOGLE_CLIENT_ID = '856778154315-nuldh9rtsej6s0v17n8d6t0jc9gfrns6.apps.googleusercontent.com';

// إعدادات التحقق
export const VERIFICATION_CONFIG = {
  CODE_LENGTH: 6,
  CODE_EXPIRY: 10 * 60 * 1000, // 10 دقائق
  MAX_ATTEMPTS: 3,
  RESEND_DELAY: 60 * 1000 // 60 ثانية
};

// إعدادات البريد الإلكتروني
export const EMAIL_CONFIG = {
  PROVIDER: 'mock', // 'sendgrid', 'emailjs', 'mock'
  FROM_EMAIL: 'noreply@therapychat.com',
  FROM_NAME: 'Therapy Chat App'
};

// إعدادات الرسائل النصية
export const SMS_CONFIG = {
  PROVIDER: 'mock', // 'twilio', 'mock'
  COUNTRY_CODE: '+966'
};

// إعدادات التطبيق
export const APP_CONFIG = {
  NAME: 'Therapy Chat Bot',
  VERSION: '1.0.0',
  SUPPORT_EMAIL: 'support@therapychat.com',
  SUPPORT_PHONE: '+966500000000'
};

// إعدادات الذكاء الاصطناعي
export const AI_CONFIG = {
  API_URL: 'https://api.openai.com/v1/chat/completions',
  MODEL: 'gpt-3.5-turbo',
  MAX_TOKENS: 500,
  TEMPERATURE: 0.7
};

// إعدادات الخصوصية
export const PRIVACY_CONFIG = {
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 دقيقة
  DATA_RETENTION_DAYS: 365,
  AUTO_LOGOUT: true
};