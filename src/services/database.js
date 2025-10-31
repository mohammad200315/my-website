// database.js - الملف المعدل كاملاً
// خدمة قاعدة البيانات المحلية مع نظام التحقق
class DatabaseService {
  // المفاتيح الرئيسية للتخزين
  static STORAGE_KEYS = {
    USERS: 'therapy_chat_users',
    VERIFICATION_CODES: 'therapy_verification_codes',
    SESSIONS: 'therapy_sessions'
  };

  // الحصول على جميع المستخدمين
  static getUsers() {
    try {
      const users = localStorage.getItem(this.STORAGE_KEYS.USERS);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  }

  // حفظ مستخدم
  static saveUser(userData) {
    try {
      const users = this.getUsers();
      
      // التحقق من عدم وجود مستخدم بنفس البريد أو الهاتف
      const existingUser = users.find(user => 
        user.email === userData.email || 
        user.phone === userData.phone
      );

      if (existingUser && !userData.id) {
        throw new Error('User already exists');
      }

      if (userData.id) {
        // تحديث مستخدم موجود
        const index = users.findIndex(user => user.id === userData.id);
        if (index !== -1) {
          users[index] = { ...users[index], ...userData };
        } else {
          users.push(userData);
        }
      } else {
        // إنشاء مستخدم جديد
        const newUser = {
          id: 'user_' + Date.now(),
          ...userData,
          createdAt: new Date().toISOString()
        };
        users.push(newUser);
      }

      localStorage.setItem(this.STORAGE_KEYS.USERS, JSON.stringify(users));
      return users;
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  }

  // الحصول على مستخدم بالإيميل أو الهاتف
  static getUser(identifier) {
    const users = this.getUsers();
    return users.find(user => 
      user.email === identifier || 
      user.phone === identifier
    );
  }

  // الحصول على مستخدم بالرقم
  static getUserById(userId) {
    const users = this.getUsers();
    return users.find(user => user.id === userId);
  }

  // تسجيل الدخول
  static loginUser(username, password) {
    const user = this.getUser(username);
    
    if (user && user.password === password) {
      // حفظ الجلسة
      this.saveSession(user.id);
      return user;
    }
    
    return null;
  }

  // تحديث كلمة المرور
  static updateUserPassword(identifier, newPassword) {
    try {
      const users = this.getUsers();
      const userIndex = users.findIndex(user => 
        user.email === identifier || user.phone === identifier
      );
      
      if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        users[userIndex].updatedAt = new Date().toISOString();
        localStorage.setItem(this.STORAGE_KEYS.USERS, JSON.stringify(users));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error updating password:', error);
      return false;
    }
  }

  // حفظ الملف الشخصي
  static saveUserProfile(userId, profile) {
    try {
      const users = this.getUsers();
      const userIndex = users.findIndex(user => user.id === userId);
      
      if (userIndex !== -1) {
        users[userIndex].profile = profile;
        users[userIndex].profileUpdatedAt = new Date().toISOString();
        localStorage.setItem(this.STORAGE_KEYS.USERS, JSON.stringify(users));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error saving user profile:', error);
      return false;
    }
  }

  // حفظ رسالة محادثة
  static saveChatMessage(userId, message) {
    try {
      const key = `user_chats_${userId}`;
      const existingChats = this.getUserChats(userId);
      const updatedChats = [...existingChats, message];
      
      localStorage.setItem(key, JSON.stringify(updatedChats));
      return true;
    } catch (error) {
      console.error('Error saving chat message:', error);
      return false;
    }
  }

  // الحصول على محادثات المستخدم
  static getUserChats(userId) {
    try {
      const key = `user_chats_${userId}`;
      const chats = localStorage.getItem(key);
      return chats ? JSON.parse(chats) : [];
    } catch (error) {
      console.error('Error getting user chats:', error);
      return [];
    }
  }

  // مسح محادثات المستخدم
  static clearUserChats(userId) {
    try {
      const key = `user_chats_${userId}`;
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error clearing user chats:', error);
      return false;
    }
  }

  // نظام التحقق - حفظ رمز التحقق
  static saveVerificationCode(emailOrPhone, code, type = 'signup') {
    try {
      const verificationData = {
        code,
        type,
        expiresAt: Date.now() + 10 * 60 * 1000, // 10 دقائق
        attempts: 0,
        createdAt: new Date().toISOString()
      };

      const existingCodes = this.getVerificationCodes();
      existingCodes[emailOrPhone] = verificationData;
      
      localStorage.setItem(this.STORAGE_KEYS.VERIFICATION_CODES, JSON.stringify(existingCodes));
      return true;
    } catch (error) {
      console.error('Error saving verification code:', error);
      return false;
    }
  }

  // الحصول على رموز التحقق
  static getVerificationCodes() {
    try {
      const codes = localStorage.getItem(this.STORAGE_KEYS.VERIFICATION_CODES);
      return codes ? JSON.parse(codes) : {};
    } catch (error) {
      console.error('Error getting verification codes:', error);
      return {};
    }
  }

  // التحقق من الرمز
  static verifyCode(emailOrPhone, code) {
    try {
      const codes = this.getVerificationCodes();
      const verificationData = codes[emailOrPhone];

      if (!verificationData) {
        throw new Error('Verification code not found');
      }

      // التحقق من انتهاء الصلاحية
      if (Date.now() > verificationData.expiresAt) {
        this.clearVerificationCode(emailOrPhone);
        throw new Error('Verification code expired');
      }

      // زيادة عدد المحاولات
      verificationData.attempts += 1;
      codes[emailOrPhone] = verificationData;
      localStorage.setItem(this.STORAGE_KEYS.VERIFICATION_CODES, JSON.stringify(codes));

      // التحقق من الرمز
      if (verificationData.code === code) {
        // مسح الرمز بعد التحقق الناجح
        this.clearVerificationCode(emailOrPhone);
        return true;
      }

      // التحقق من عدد المحاولات
      if (verificationData.attempts >= 3) {
        this.clearVerificationCode(emailOrPhone);
        throw new Error('Too many attempts');
      }

      return false;
    } catch (error) {
      console.error('Error verifying code:', error);
      throw error;
    }
  }

  // مسح رمز التحقق
  static clearVerificationCode(emailOrPhone) {
    try {
      const codes = this.getVerificationCodes();
      delete codes[emailOrPhone];
      localStorage.setItem(this.STORAGE_KEYS.VERIFICATION_CODES, JSON.stringify(codes));
      return true;
    } catch (error) {
      console.error('Error clearing verification code:', error);
      return false;
    }
  }

  // إدارة الجلسات - حفظ الجلسة
  static saveSession(userId) {
    try {
      const session = {
        userId,
        loggedInAt: new Date().toISOString(),
        lastActivity: Date.now()
      };
      
      localStorage.setItem(this.STORAGE_KEYS.SESSIONS, JSON.stringify(session));
      return true;
    } catch (error) {
      console.error('Error saving session:', error);
      return false;
    }
  }

  // الحصول على الجلسة الحالية
  static getCurrentSession() {
    try {
      const session = localStorage.getItem(this.STORAGE_KEYS.SESSIONS);
      return session ? JSON.parse(session) : null;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  // مسح الجلسة
  static clearSession() {
    try {
      localStorage.removeItem(this.STORAGE_KEYS.SESSIONS);
      return true;
    } catch (error) {
      console.error('Error clearing session:', error);
      return false;
    }
  }

  // تنظيف الرموز المنتهية
  static cleanupExpiredCodes() {
    try {
      const codes = this.getVerificationCodes();
      const now = Date.now();
      let cleaned = false;

      Object.keys(codes).forEach(emailOrPhone => {
        if (codes[emailOrPhone].expiresAt < now) {
          delete codes[emailOrPhone];
          cleaned = true;
        }
      });

      if (cleaned) {
        localStorage.setItem(this.STORAGE_KEYS.VERIFICATION_CODES, JSON.stringify(codes));
      }

      return cleaned;
    } catch (error) {
      console.error('Error cleaning expired codes:', error);
      return false;
    }
  }
}

// تنظيف الرموز المنتهية تلقائياً عند تحميل الخدمة
DatabaseService.cleanupExpiredCodes();

export default DatabaseService;