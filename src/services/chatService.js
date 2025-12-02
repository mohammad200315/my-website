// خدمات الدردشة مع الذكاء الاصطناعي - محدثة للاتصال بـ ASP.NET Backend
class ChatService {
  // بدء محادثة جديدة
  static startNewConversation(userProfile) {
    console.log('Starting new conversation for user:', userProfile);
    // يمكن عمل طلب لإنشاء جلسة في الـ backend لاحقًا
    return true;
  }

  // إرسال رسالة والحصول على رد (يحاول الاتصال بالـ API ثم يرجع إلى mock)
  static async sendMessage(message, userId) {
    console.log('Sending message:', message, 'for user:', userId);

    // محاولة الاتصال بالـ Backend (ASP.NET) أولاً
    try {
      const token = localStorage.getItem('token'); // يجب أن يتم حفظ التوكن بعد تسجيل الدخول
      const res = await fetch('https://localhost:5001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ message })
      });

      if (res.ok) {
        const data = await res.json();
        return data.reply || data?.replyText || data;
      } else {
        console.warn('Backend returned non-OK, using mock response');
        return this.getMockAIResponse(message);
      }
    } catch (err) {
      console.warn('Error calling backend, using mock response', err);
      return this.getMockAIResponse(message);
    }
  }

  // محاكاة استجابة الذكاء الاصطناعي (مؤقتة)
  static getMockAIResponse(message) {
    const responses = [
      "أنا هنا لأستمع إليك. حدثني أكثر.",
      "فهمت. هل يمكنك توضيح ذلك؟",
      "هذا يبدو مهمًا — كيف تشعر حيال هذا؟",
      "شكرًا لمشاركتك. هل جربت أن..."
    ];
    const idx = Math.floor(Math.random() * responses.length);
    return responses[idx];
  }

  // حفظ رسالة محلياً (لا يزال موجوداً للاحتياط)
  static saveMessageLocal(message, userId) {
    try {
      const key = `user_chats_${userId}`;
      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      existing.push({ text: message, time: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(existing));
      return true;
    } catch (error) {
      console.error('Error saving chat message:', error);
      return false;
    }
  }

  // بقية الدوال (كما كانت)
  static getUserChats(userId) {
    try {
      const key = `user_chats_${userId}`;
      return JSON.parse(localStorage.getItem(key) || "[]");
    } catch (error) {
      console.error('Error getting user chats:', error);
      return [];
    }
  }

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
