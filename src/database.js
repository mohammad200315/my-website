// src/database.js

// خدمة قاعدة البيانات المحلية المحسنة
const DatabaseService = {
  // تخزين المستخدمين مع تحسينات
  saveUser: (userData) => {
    try {
      const users = JSON.parse(localStorage.getItem('therapyUsers') || '[]');
      
      // منع التكرار
      const existingUserIndex = users.findIndex(user => 
        (userData.email && user.email === userData.email) || 
        (userData.phone && user.phone === userData.phone)
      );
      
      const userToSave = {
        ...userData,
        id: userData.id || Date.now().toString(),
        createdAt: userData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      if (existingUserIndex === -1) {
        users.push(userToSave);
      } else {
        users[existingUserIndex] = { ...users[existingUserIndex], ...userToSave };
      }
      
      localStorage.setItem('therapyUsers', JSON.stringify(users));
      console.log('✅ User saved:', userData.email || userData.phone);
      return users;
    } catch (error) {
      console.error('❌ Error saving user:', error);
      return [];
    }
  },

  // الحصول على مستخدم بواسطة البريد أو الهاتف أو ID
  getUser: (identifier) => {
    try {
      const users = JSON.parse(localStorage.getItem('therapyUsers') || '[]');
      const user = users.find(user => 
        user.email === identifier || 
        user.phone === identifier ||
        user.id === identifier
      );
      return user;
    } catch (error) {
      console.error('❌ Error getting user:', error);
      return null;
    }
  },

  // التحقق من تسجيل الدخول
  loginUser: (username, password) => {
    try {
      const users = JSON.parse(localStorage.getItem('therapyUsers') || '[]');
      const user = users.find(user => 
        (user.email === username || user.phone === username) && 
        user.password === password
      );
      return user;
    } catch (error) {
      console.error('❌ Error logging in:', error);
      return null;
    }
  },

  // حفظ الملف الشخصي
  saveUserProfile: (userId, profileData) => {
    try {
      const users = JSON.parse(localStorage.getItem('therapyUsers') || '[]');
      const userIndex = users.findIndex(user => user.id === userId);
      
      if (userIndex !== -1) {
        users[userIndex].profile = {
          ...users[userIndex].profile,
          ...profileData,
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem('therapyUsers', JSON.stringify(users));
        console.log('✅ Profile saved for user:', userId);
        return users[userIndex];
      }
      return null;
    } catch (error) {
      console.error('❌ Error saving profile:', error);
      return null;
    }
  },

  // حفظ محادثات الشات
  saveChatMessage: (userId, message) => {
    try {
      const chats = JSON.parse(localStorage.getItem('therapyChats') || '{}');
      if (!chats[userId]) {
        chats[userId] = [];
      }
      
      chats[userId].push({
        ...message,
        id: message.id || Date.now().toString(),
        timestamp: message.timestamp || new Date().toISOString()
      });
      
      // حفظ آخر 100 رسالة فقط لكل مستخدم
      if (chats[userId].length > 100) {
        chats[userId] = chats[userId].slice(-100);
      }
      
      localStorage.setItem('therapyChats', JSON.stringify(chats));
      return chats[userId];
    } catch (error) {
      console.error('❌ Error saving chat message:', error);
      return [];
    }
  },

  // جلب محادثات المستخدم
  getUserChats: (userId) => {
    try {
      const chats = JSON.parse(localStorage.getItem('therapyChats') || '{}');
      const userChats = chats[userId] || [];
      return userChats;
    } catch (error) {
      console.error('❌ Error getting user chats:', error);
      return [];
    }
  },

  // جلب إحصائيات الاستخدام
  getUsageStats: () => {
    try {
      const users = JSON.parse(localStorage.getItem('therapyUsers') || '[]');
      const chats = JSON.parse(localStorage.getItem('therapyChats') || '{}');
      
      const stats = {
        totalUsers: users.length,
        totalChats: Object.values(chats).reduce((acc, chat) => acc + chat.length, 0),
        activeUsers: users.filter(user => user.profile).length
      };
      
      return stats;
    } catch (error) {
      console.error('❌ Error getting stats:', error);
      return { totalUsers: 0, totalChats: 0, activeUsers: 0 };
    }
  },

  // حذف جميع البيانات (للتطوير)
  clearAllData: () => {
    try {
      localStorage.removeItem('therapyUsers');
      localStorage.removeItem('therapyChats');
      console.log('🧹 All data cleared');
    } catch (error) {
      console.error('❌ Error clearing data:', error);
    }
  }
};

export default DatabaseService;