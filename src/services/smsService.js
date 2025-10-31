import DatabaseService from './database';

class SMSService {
  static async sendVerificationCode(phoneNumber, type = 'signup') {
    try {
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      const saved = DatabaseService.saveVerificationCode(phoneNumber, verificationCode, type);
      
      if (!saved) {
        throw new Error('Failed to save verification code');
      }

      console.log(`📱 SMS verification code for ${phoneNumber}: ${verificationCode}`);
      
      return await this.mockSMSSending(phoneNumber, verificationCode, type);
      
    } catch (error) {
      console.error('Error sending verification SMS:', error);
      throw error;
    }
  }

  static async mockSMSSending(phoneNumber, code, type) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const message = type === 'reset'
          ? `Your password reset code is: ${code}`
          : `Your verification code is: ${code}`;
        
        console.log(`📲 Mock SMS Sent:
          To: ${phoneNumber}
          Message: ${message}
        `);
        
        resolve(true);
      }, 1000);
    });
  }

  static validatePhoneNumber(phoneNumber) {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phoneNumber);
  }

  static cleanPhoneNumber(phoneNumber) {
    return phoneNumber.replace(/[\s\-\(\)]/g, '');
  }

  static formatPhoneNumber(phoneNumber, countryCode = '+966') {
    const cleanNumber = this.cleanPhoneNumber(phoneNumber);
    
    if (!cleanNumber.startsWith('+')) {
      return countryCode + cleanNumber;
    }
    
    return cleanNumber;
  }

  static async sendWelcomeSMS(phoneNumber, userName) {
    try {
      console.log(`🎉 Welcome SMS sent to ${phoneNumber} for user ${userName}`);
      return true;
    } catch (error) {
      console.error('Error sending welcome SMS:', error);
      return false;
    }
  }

  static async sendSecurityAlertSMS(phoneNumber, action) {
    try {
      console.log(`🔒 Security alert SMS sent to ${phoneNumber} for action: ${action}`);
      return true;
    } catch (error) {
      console.error('Error sending security alert SMS:', error);
      return false;
    }
  }
}

export default SMSService;