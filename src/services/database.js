// خدمة قاعدة البيانات المحلية
class DatabaseService {
  // المفتاح الرئيسي للتخزين
  static STORAGE_KEY = 'therapy_chat_users';

  // الحصول على جميع المستخدمين
  static getUsers() {
    try {
      const users = localStorage.getItem(this.STORAGE_KEY);
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

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
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
      return user;
    }
    
    return null;
  }

  // حفظ الملف الشخصي
  static saveUserProfile(userId, profile) {
    try {
      const users = this.getUsers();
      const userIndex = users.findIndex(user => user.id === userId);
      
      if (userIndex !== -1) {
        users[userIndex].profile = profile;
        users[userIndex].profileUpdatedAt = new Date().toISOString();
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
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
}

export default DatabaseService;