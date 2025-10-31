// خدمات الدردشة مع الذكاء الاصطناعي
class ChatService {
  // بدء محادثة جديدة
  static startNewConversation(userProfile) {
    console.log('Starting new conversation for user:', userProfile);
    // هنا يمكنك إضافة كود الاتصال بالذكاء الاصطناعي
    return true;
  }

  // إرسال رسالة والحصول على رد
  static async sendMessage(message, userId) {
    console.log('Sending message:', message, 'for user:', userId);
    
    // محاكاة استجابة الذكاء الاصطناعي (مؤقتة)
    return this.getMockAIResponse(message);
  }

  // استجابة وهمية للذكاء الاصطناعي (مؤقتة)
  static getMockAIResponse(message) {
    const responses = {
      english: [
        "I understand you're reaching out. How have you been feeling lately?",
        "Thank you for sharing. Could you tell me more about what's on your mind?",
        "I'm here to listen. What would you like to talk about today?",
        "That sounds challenging. How has this been affecting your daily life?",
        "I appreciate you opening up. Let's explore this together.",
        "It takes courage to talk about these things. What support do you feel you need right now?",
        "I hear you. Would you like to discuss some coping strategies?",
        "Thank you for trusting me with this. How long have you been feeling this way?"
      ],
      arabic: [
        "أفهم أنك تتواصل معي. كيف كان شعورك مؤخراً؟",
        "شكراً لك على المشاركة. هل يمكنك إخباري المزيد عما يدور في ذهنك؟",
        "أنا هنا للاستماع. ما الذي تود التحدث عنه اليوم؟",
        "يبدو هذا صعباً. كيف أثر هذا على حياتك اليومية؟",
        "أقدر انفتاحك. دعنا نستكشف هذا معاً.",
        "يتطلب الأمر شجاعة للحديث عن هذه الأمور. ما نوع الدعم الذي تشعر أنك تحتاجه الآن؟",
        "أسمعك. هل تود مناقشة بعض استراتيجيات المواجهة؟",
        "شكراً لك على ثقتك بي. منذ متى وأنت تشعر بهذا الشعور؟"
      ]
    };

    // تحديد اللغة بناءً على الرسالة
    const isArabic = /[\u0600-\u06FF]/.test(message);
    const lang = isArabic ? 'arabic' : 'english';
    
    // اختيار رد عشوائي
    const randomResponse = responses[lang][Math.floor(Math.random() * responses[lang].length)];
    
    // محاكاة وقت الانتظار
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(randomResponse);
      }, 1000 + Math.random() * 2000); // بين 1-3 ثواني
    });
  }

  // الحصول على رسالة ترحيب
  static getWelcomeMessage(userProfile, language = 'english') {
    const welcomeMessages = {
      english: userProfile?.fullName 
        ? `Hello ${userProfile.fullName}! 🌟 I'm your mental health assistant. How can I help you today?`
        : `Hello! 🌟 I'm your mental health assistant. How can I help you today?`,
      arabic: userProfile?.fullName 
        ? `مرحباً ${userProfile.fullName}! 🌟 أنا مساعدك النفسي. كيف يمكنني مساعدتك اليوم؟`
        : `مرحباً! 🌟 أننا مساعدك النفسي. كيف يمكنني مساعدتك اليوم؟`
    };

    return welcomeMessages[language] || welcomeMessages.english;
  }

  // حفظ تاريخ المحادثة (مؤقت)
  static saveConversation(userId, messages) {
    try {
      const key = `chat_history_${userId}`;
      localStorage.setItem(key, JSON.stringify(messages));
      return true;
    } catch (error) {
      console.error('Error saving conversation:', error);
      return false;
    }
  }

  // تحميل تاريخ المحادثة (مؤقت)
  static loadConversation(userId) {
    try {
      const key = `chat_history_${userId}`;
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading conversation:', error);
      return [];
    }
  }

  // مسح تاريخ المحادثة
  static clearConversation(userId) {
    try {
      const key = `chat_history_${userId}`;
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error clearing conversation:', error);
      return false;
    }
  }
}

export default ChatService;