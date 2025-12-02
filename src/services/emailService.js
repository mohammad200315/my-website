import DatabaseService from './database';

class EmailService {
  static async sendVerificationCode(email, type = 'signup') {
    try {
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      const saved = DatabaseService.saveVerificationCode(email, verificationCode, type);
      
      if (!saved) {
        throw new Error('Failed to save verification code');
      }

      console.log(`📧 Email verification code for ${email}: ${verificationCode}`);
      
      return await this.mockEmailSending(email, verificationCode, type);
      
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw error;
    }
  }

  static async mockEmailSending(email, code, type) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const subject = type === 'reset' 
          ? 'Password Reset Verification Code' 
          : 'Email Verification Code';
        
        const message = type === 'reset'
          ? `Your password reset verification code is: ${code}`
          : `Your email verification code is: ${code}`;
        
        console.log(`✉️ Mock Email Sent:
          To: ${email}
          Subject: ${subject}
          Message: ${message}
        `);
        
        resolve(true);
      }, 1000);
    });
  }

  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static async sendWelcomeEmail(email, userName) {
    try {
      console.log(`🎉 Welcome email sent to ${email} for user ${userName}`);
      return await this.mockEmailSending(email, 'WELCOME', 'welcome');
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return false;
    }
  }

  static async sendSecurityAlert(email, action) {
    try {
      console.log(`🔒 Security alert sent to ${email} for action: ${action}`);
      return true;
    } catch (error) {
      console.error('Error sending security alert:', error);
      return false;
    }
  }
}

export default EmailService;