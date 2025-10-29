import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import DatabaseService from './database';
import ChatService from './services/chatService';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import TipsPage from './components/TipsPage';
import ContactPage from './components/ContactPage';
import './App.css';

// Main App Component with Router
function App() {
  return (
    <Router>
      <div className="App">
        <AppContent />
      </div>
    </Router>
  );
}

// App Content Component
function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [language, setLanguage] = useState('english');
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState({
    fullName: '',
    age: '',
    gender: '',
    concerns: ''
  });
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showUserInfo, setShowUserInfo] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // الترجمات
  const translations = useMemo(() => ({
    english: {
      signInWithGoogle: "Continue with Google",
      continueWithGoogle: "Continue with Google",
      or: "OR",
      googleSignInSuccess: "Google sign-in successful!",
      googleSignInError: "Google sign-in failed. Please try again.",
      
      guestLogin: "Try as Guest",
      guestWelcome: "Welcome Guest!",
      guestDescription: "You are using the app as a guest. Some features may be limited.",
      temporarySession: "Temporary Session",
      viaGuest: "Via Guest",
      
      signIn: "Sign in",
      createAccount: "Create Account",
      username: "Username",
      email: "Email",
      phone: "Phone",
      password: "Password",
      confirmPassword: "Confirm Password",
      forgotPassword: "Forgot Password?",
      login: "Login",
      signup: "Signup",
      alreadyHaveAccount: "Already have an account?",
      dontHaveAccount: "Don't have an account?",
      selectCountry: "Select Country",
      invalidEmail: "Please enter a valid email address",
      invalidPhone: "Please enter a valid phone number",
      passwordTooShort: "Password must be at least 6 characters",
      requiredField: "This field is required",
      passwordsDontMatch: "Passwords do not match",
      
      personalInfo: "Personal Information",
      helpUsUnderstand: "Help us understand your needs better",
      fullName: "Full Name",
      age: "Age",
      selectAge: "Select Age",
      years: "years",
      gender: "Gender",
      selectGender: "Select Gender",
      male: "Male",
      female: "Female",
      other: "Other",
      preferNotToSay: "Prefer not to say",
      whatConcernsYou: "What concerns you?",
      tellUs: "Tell us about the things you'd like to talk about...",
      startTherapy: "Start Therapy Session",
      
      therapySession: "Therapy Session",
      online: "Online",
      typeMessage: "Type your message here...",
      send: "Send",
      remember: "Remember: This bot is for educational purposes and does not replace professional consultation",
      
      ourTeam: "Our Development Team",
      meetOurTeam: "Meet Our Team",
      frontendDev: "Frontend Developer",
      backendDev: "Backend Developer",
      aiDev: "AI Developer",
      aiSpecialist: "AI Specialist",
      fullstackDev: "Full Stack Developer",
      designer: "UI/UX Designer",
      
      logout: "Logout",
      confirmLogout: "Are you sure you want to logout?",
      cancel: "Cancel",
      resetPassword: "Reset Password",
      enterEmail: "Enter your email",
      sendResetLink: "Send Reset Link",
      userExists: "User already exists with this email or phone",
      loginError: "Invalid username or password",
      
      profile: "Profile",
      myProfile: "My Profile",
      contactInfo: "Contact Information",
      personalDetails: "Personal Details",
      concerns: "Concerns",
      close: "Close",
      registrationMethod: "Registration Method",
      viaEmail: "Via Email",
      viaPhone: "Via Phone",
      viaGoogle: "Via Google",
      hideInfo: "Hide Info",
      showInfo: "Show Info",
      
      // New translations for navigation
      home: "Home",
      about: "About",
      tips: "Tips",
      contact: "Contact",
      chat: "Chat",
      welcome: "Welcome",
      mentalHealthSupport: "Mental Health Support",
      getStarted: "Get Started",
      
      // New translations for verification
      verificationCode: "Verification Code",
      enterVerificationCode: "Enter verification code",
      sendVerificationCode: "Send Verification Code",
      verify: "Verify",
      codeSent: "Verification code sent",
      invalidCode: "Invalid verification code",
      resendCode: "Resend Code",
      codeExpired: "Verification code expired",
      
      ageOptions: Array.from({length: 63}, (_, i) => 18 + i)
    },
    arabic: {
      signInWithGoogle: "المتابعة باستخدام جوجل",
      continueWithGoogle: "المتابعة باستخدام جوجل",
      or: "أو",
      googleSignInSuccess: "تم تسجيل الدخول باستخدام جوجل بنجاح!",
      googleSignInError: "فشل تسجيل الدخول باستخدام جوجل. يرجى المحاولة مرة أخرى.",
      
      guestLogin: "جرب كضيف",
      guestWelcome: "أهلاً بك كضيف!",
      guestDescription: "أنت تستخدم التطبيق كضيف. بعض الميزات قد تكون محدودة.",
      temporarySession: "جلسة مؤقتة",
      viaGuest: "كضيف",
      
      signIn: "تسجيل الدخول",
      createAccount: "إنشاء حساب",
      username: "اسم المستخدم",
      email: "البريد الإلكتروني",
      phone: "رقم الهاتف",
      password: "كلمة المرور",
      confirmPassword: "تأكيد كلمة المرور",
      forgotPassword: "نسيت كلمة المرور؟",
      login: "دخول",
      signup: "إنشاء حساب",
      alreadyHaveAccount: "هل لديك حساب بالفعل؟",
      dontHaveAccount: "ليس لديك حساب؟",
      selectCountry: "اختر الدولة",
      invalidEmail: "الرجاء إدخال بريد إلكتروني صحيح",
      invalidPhone: "الرجاء إدخال رقم هاتف صحيح",
      passwordTooShort: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
      requiredField: "هذا الحقل مطلوب",
      passwordsDontMatch: "كلمات المرور غير متطابقة",
      
      personalInfo: "المعلومات الشخصية",
      helpUsUnderstand: "ساعدنا في فهم احتياجاتك بشكل أفضل",
      fullName: "الاسم الكامل",
      age: "العمر",
      selectAge: "اختر العمر",
      years: "سنة",
      gender: "الجنس",
      selectGender: "اختر الجنس",
      male: "ذكر",
      female: "أنثى",
      other: "أخرى",
      preferNotToSay: "أفضل عدم الإفصاح",
      whatConcernsYou: "ما الذي يقلقك؟",
      tellUs: "اخبرنا عن الأشياء التي تود التحدث عنها...",
      startTherapy: "بدء الجلسة العلاجية",
      
      therapySession: "جلسة العلاج",
      online: "متصل",
      typeMessage: "اكتب رسالتك هنا...",
      send: "إرسال",
      remember: "تذكر: هذا البوت لأغراض توعية ولا يغني عن استشارة المختصين",
      
      ourTeam: "فريق التطوير",
      meetOurTeam: "تعرف على فريقنا",
      frontendDev: "مطور واجهات أمامية",
      backendDev: "مطور خلفية",
      aiDev: "مطور ذكاء اصطناعي",
      aiSpecialist: "أخصائي ذكاء اصطناعي",
      fullstackDev: "مطور كامل",
      designer: "مصمم واجهات",
      
      logout: "تسجيل الخروج",
      confirmLogout: "هل أنت متأكد أنك تريد تسجيل الخروج؟",
      cancel: "إلغاء",
      resetPassword: "استعادة كلمة المرور",
      enterEmail: "أدخل بريدك الإلكتروني",
      sendResetLink: "إرسال الرابط",
      userExists: "يوجد مستخدم مسجل مسبقاً بهذا البريد أو الهاتف",
      loginError: "اسم المستخدم أو كلمة المرور غير صحيحة",
      
      profile: "الملف الشخصي",
      myProfile: "ملفي الشخصي",
      contactInfo: "معلومات الاتصال",
      personalDetails: "التفاصيل الشخصية",
      concerns: "المخاوف",
      close: "إغلاق",
      registrationMethod: "طريقة التسجيل",
      viaEmail: "عن طريق البريد",
      viaPhone: "عن طريق الهاتف",
      viaGoogle: "عن طريق جوجل",
      hideInfo: "إخفاء المعلومات",
      showInfo: "إظهار المعلومات",
      
      // New translations for navigation
      home: "الرئيسية",
      about: "عن الموقع",
      tips: "النصائح",
      contact: "التواصل",
      chat: "المحادثة",
      welcome: "أهلاً بك",
      mentalHealthSupport: "دعم الصحة النفسية",
      getStarted: "ابدأ الآن",
      
      // New translations for verification
      verificationCode: "رمز التحقق",
      enterVerificationCode: "أدخل رمز التحقق",
      sendVerificationCode: "إرسال رمز التحقق",
      verify: "تحقق",
      codeSent: "تم إرسال رمز التحقق",
      invalidCode: "رمز التحقق غير صحيح",
      resendCode: "إعادة إرسال الرمز",
      codeExpired: "رمز التحقق منتهي الصلاحية",
      
      ageOptions: Array.from({length: 63}, (_, i) => 18 + i)
    }
  }), []);

  const t = useMemo(() => translations[language], [language, translations]);

  // إخفاء النافبار في صفحات التسجيل والرئيسية
  const showNavbar = !['/login', '/signup', '/'].includes(location.pathname) && user;

  // دالة تسجيل الدخول بجوجل
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }).then(res => res.json());

        console.log('Google User Info:', userInfo);

        const existingUser = DatabaseService.getUser(userInfo.email);
        
        if (existingUser) {
          setUser(existingUser);
          setCurrentUserId(existingUser.id);
          
          if (existingUser.profile) {
            setUserProfile(existingUser.profile);
            navigate('/chat');
          } else {
            navigate('/profile');
          }
        } else {
          const newUser = {
            id: 'google_' + Date.now(),
            email: userInfo.email,
            fullName: userInfo.name,
            profilePicture: userInfo.picture,
            signupMethod: 'google',
            isGoogleUser: true,
            createdAt: new Date()
          };
          
          const savedUsers = DatabaseService.saveUser(newUser);
          const savedUser = savedUsers.find(user => user.id === newUser.id);
          
          setUser(savedUser);
          setCurrentUserId(savedUser.id);
          navigate('/profile');
        }
        
        alert(t.googleSignInSuccess);
      } catch (error) {
        console.error('Google login error:', error);
        alert(t.googleSignInError);
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google Login Failed:', error);
      alert(t.googleSignInError);
      setIsLoading(false);
    }
  });

  // دالة الدخول كضيف - متاحة فقط في الصفحة الرئيسية
  const handleGuestLogin = useCallback(() => {
    const guestUser = {
      id: 'guest_' + Date.now(),
      email: 'guest@example.com',
      fullName: 'Guest User',
      signupMethod: 'guest',
      isGuest: true,
      createdAt: new Date()
    };
    
    const savedUsers = DatabaseService.saveUser(guestUser);
    const savedUser = savedUsers.find(user => user.id === guestUser.id);
    
    setUser(savedUser);
    setCurrentUserId(savedUser.id);
    
    // إنشاء ملف شخصي افتراضي للضيف
    const guestProfile = {
      fullName: 'Guest User',
      age: '25',
      gender: 'prefer-not-to-say',
      concerns: language === 'english' 
        ? 'Just trying out the chat bot as a guest user' 
        : 'جرب الشات بوت كضيف'
    };
    
    setUserProfile(guestProfile);
    DatabaseService.saveUserProfile(savedUser.id, guestProfile);
    
    navigate('/chat');
    alert(t.guestWelcome);
  }, [language, t, navigate]);

  // دوال التنقل
  const handleLogin = useCallback(() => {
    navigate('/login');
  }, [navigate]);

  const handleSignup = useCallback(() => {
    navigate('/signup');
  }, [navigate]);

  const handleLogout = useCallback(() => {
    setUser(null);
    setUserProfile({
      fullName: '',
      age: '',
      gender: '',
      concerns: ''
    });
    setCurrentUserId(null);
    setShowLogoutConfirm(false); // إغلاق نافذة التأكيد
    navigate('/');
  }, [navigate]);

  // تأكيد تسجيل الخروج
  const confirmLogout = useCallback(() => {
    setShowLogoutConfirm(true);
  }, []);

  const cancelLogout = useCallback(() => {
    setShowLogoutConfirm(false);
  }, []);

  // فتح وإغلاق نافذة فريقنا
  const handleShowTeam = useCallback(() => {
    setShowTeamModal(true);
  }, []);

  const handleCloseTeam = useCallback(() => {
    setShowTeamModal(false);
  }, []);

  // نظام إرسال رمز التحقق
  const [verificationCodes, setVerificationCodes] = useState({});

  // دالة إنشاء رمز تحقق عشوائي
  const generateVerificationCode = useCallback(() => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }, []);

  // دالة إرسال رمز التحقق
  const sendVerificationCode = useCallback(async (emailOrPhone) => {
    const code = generateVerificationCode();
    
    // حفظ الرمز مع وقت انتهاء الصلاحية (10 دقائق)
    setVerificationCodes(prev => ({
      ...prev,
      [emailOrPhone]: {
        code,
        expiresAt: Date.now() + 10 * 60 * 1000 // 10 دقائق
      }
    }));

    // محاكاة إرسال الرمز (في الواقع راح ترسل للبريد أو الهاتف)
    console.log(`Verification code for ${emailOrPhone}: ${code}`);
    
    // في التطبيق الحقيقي، راح تستخدم خدمة مثل:
    // - SendGrid أو EmailJS للبريد الإلكتروني
    // - Twilio للرسائل النصية
    
    // محاكاة الإرسال
    alert(
      language === 'english' 
        ? `Verification code sent to ${emailOrPhone}: ${code}`
        : `تم إرسال رمز التحقق إلى ${emailOrPhone}: ${code}`
    );

    return true;
  }, [generateVerificationCode, language]);

  // دالة التحقق من الرمز
  const verifyCode = useCallback((emailOrPhone, code) => {
    const verificationData = verificationCodes[emailOrPhone];
    
    if (!verificationData) {
      return { success: false, message: t.codeExpired };
    }
    
    if (Date.now() > verificationData.expiresAt) {
      // إزالة الرمز المنتهي
      setVerificationCodes(prev => {
        const newCodes = { ...prev };
        delete newCodes[emailOrPhone];
        return newCodes;
      });
      return { success: false, message: t.codeExpired };
    }
    
    if (verificationData.code !== code) {
      return { success: false, message: t.invalidCode };
    }
    
    // نجاح التحقق - إزالة الرمز المستخدم
    setVerificationCodes(prev => {
      const newCodes = { ...prev };
      delete newCodes[emailOrPhone];
      return newCodes;
    });
    
    return { success: true, message: t.codeSent };
  }, [verificationCodes, t]);

  // دالة استعادة كلمة المرور
  const handlePasswordReset = useCallback(async (emailOrPhone) => {
    if (!emailOrPhone) {
      alert(language === 'english' ? 'Please enter your email or phone' : 'الرجاء إدخال بريدك الإلكتروني أو رقم هاتفك');
      return false;
    }

    // التحقق إذا المستخدم موجود
    const existingUser = DatabaseService.getUser(emailOrPhone);
    if (!existingUser) {
      alert(language === 'english' ? 'No account found with this email or phone' : 'لا يوجد حساب مرتبط بهذا البريد أو الهاتف');
      return false;
    }

    // إرسال رمز التحقق
    const sent = await sendVerificationCode(emailOrPhone);
    return sent;
  }, [sendVerificationCode, language]);

  // قائمة الدول
  const countries = [
    { code: '+1', name: 'United States', flag: '🇺🇸' },
    { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
    { code: '+966', name: 'Saudi Arabia', flag: '🇸🇦' },
    { code: '+971', name: 'UAE', flag: '🇦🇪' },
    { code: '+962', name: 'Jordan', flag: '🇯🇴' },
    { code: '+963', name: 'Syria', flag: '🇸🇾' },
    { code: '+20', name: 'Egypt', flag: '🇪🇬' },
    { code: '+961', name: 'Lebanon', flag: '🇱🇧' },
    { code: '+974', name: 'Qatar', flag: '🇶🇦' },
    { code: '+965', name: 'Kuwait', flag: '🇰🇼' }
  ];

  // دوال التحقق من الصحة
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone, countryCode) => {
    const cleanPhone = phone.replace(/[\s\-()]/g, '');
    
    if (!cleanPhone.startsWith(countryCode.replace('+', ''))) {
      return false;
    }
    
    const numberPart = cleanPhone.replace(countryCode.replace('+', ''), '');
    const phoneRegex = /^\d{7,15}$/;
    return phoneRegex.test(numberPart);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  // Login Page Component - بدون زر الضيف
  const LoginPage = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [errors, setErrors] = useState({});
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [loginError, setLoginError] = useState('');
    const [showVerification, setShowVerification] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [isSendingCode, setIsSendingCode] = useState(false);
    const usernameRef = useRef(null);
    const resetEmailRef = useRef(null);
    const verificationRef = useRef(null);

    useEffect(() => {
      if (usernameRef.current) {
        usernameRef.current.focus();
      }
    }, []);

    useEffect(() => {
      if (showForgotPassword && resetEmailRef.current) {
        resetEmailRef.current.focus();
      }
    }, [showForgotPassword]);

    useEffect(() => {
      if (showVerification && verificationRef.current) {
        verificationRef.current.focus();
      }
    }, [showVerification]);

    const validateForm = useCallback(() => {
      const newErrors = {};
      if (!credentials.username) newErrors.username = t.requiredField;
      if (!credentials.password) newErrors.password = t.requiredField;
      setErrors(newErrors);
      setLoginError('');
      return Object.keys(newErrors).length === 0;
    }, [credentials.username, credentials.password, t]);

    const handleLogin = useCallback(() => {
      if (!validateForm()) return;
      
      const loggedInUser = DatabaseService.loginUser(credentials.username, credentials.password);
      
      if (loggedInUser) {
        setUser(loggedInUser);
        setCurrentUserId(loggedInUser.id);
        
        if (loggedInUser.profile) {
          setUserProfile(loggedInUser.profile);
          navigate('/chat');
        } else {
          navigate('/profile');
        }
      } else {
        setLoginError(t.loginError);
      }
    }, [credentials, t, validateForm, navigate]);

    const handleInputChange = useCallback((field, value) => {
      setCredentials(prev => ({ ...prev, [field]: value }));
      if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
      if (loginError) setLoginError('');
    }, [errors, loginError]);

    const handleResetEmailChange = useCallback((e) => {
      setResetEmail(e.target.value);
    }, []);

    const handleVerificationCodeChange = useCallback((e) => {
      setVerificationCode(e.target.value);
    }, []);

    const handleSendVerificationCode = useCallback(async () => {
      if (!resetEmail) {
        alert(language === 'english' ? 'Please enter your email or phone' : 'الرجاء إدخال بريدك الإلكتروني أو رقم هاتفك');
        return;
      }

      setIsSendingCode(true);
      const sent = await handlePasswordReset(resetEmail);
      setIsSendingCode(false);

      if (sent) {
        setShowVerification(true);
      }
    }, [resetEmail, handlePasswordReset, language]);

    const handleVerifyCode = useCallback(() => {
      if (!verificationCode) {
        alert(language === 'english' ? 'Please enter verification code' : 'الرجاء إدخال رمز التحقق');
        return;
      }

      const result = verifyCode(resetEmail, verificationCode);
      
      if (result.success) {
        alert(
          language === 'english' 
            ? 'Password reset successful! You can now login with your new password.' 
            : 'تم استعادة كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.'
        );
        setShowForgotPassword(false);
        setShowVerification(false);
        setResetEmail('');
        setVerificationCode('');
      } else {
        alert(result.message);
      }
    }, [verificationCode, resetEmail, verifyCode, language]);

    const handleResendCode = useCallback(async () => {
      setIsSendingCode(true);
      await handlePasswordReset(resetEmail);
      setIsSendingCode(false);
      alert(t.codeSent);
    }, [resetEmail, handlePasswordReset, t]);

    const ForgotPasswordModal = () => {
      if (!showForgotPassword) return null;

      return (
        <div className="logout-modal">
          <div className="logout-content">
            <div className="logout-header">
              <h3>🔑 {t.resetPassword}</h3>
              <button className="close-btn" onClick={() => {
                setShowForgotPassword(false);
                setShowVerification(false);
                setResetEmail('');
                setVerificationCode('');
              }}>✕</button>
            </div>
            
            <div className="logout-body">
              {!showVerification ? (
                <>
                  <p>
                    {language === 'english' 
                      ? 'Enter your email or phone number and we will send you a verification code.' 
                      : 'أدخل بريدك الإلكتروني أو رقم هاتفك وسنرسل لك رمز تحقق.'
                    }
                  </p>
                  <div className="input-group">
                    <input 
                      ref={resetEmailRef}
                      type="text" 
                      placeholder={language === 'english' ? "Enter email or phone" : "أدخل البريد أو الهاتف"} 
                      value={resetEmail}
                      onChange={handleResetEmailChange}
                      className="message-input"
                    />
                  </div>
                  
                  <div className="logout-actions">
                    <button className="cancel-btn" onClick={() => {
                      setShowForgotPassword(false);
                      setResetEmail('');
                    }}>
                      {t.cancel}
                    </button>
                    <button 
                      className="confirm-btn" 
                      onClick={handleSendVerificationCode}
                      disabled={isSendingCode}
                    >
                      {isSendingCode ? 
                        (language === 'english' ? 'Sending...' : 'جاري الإرسال...') : 
                        t.sendVerificationCode
                      }
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p>
                    {language === 'english' 
                      ? `Enter the 6-digit verification code sent to ${resetEmail}` 
                      : `أدخل رمز التحقق المكون من 6 أرقام المرسل إلى ${resetEmail}`
                    }
                  </p>
                  <div className="input-group">
                    <input 
                      ref={verificationRef}
                      type="text" 
                      placeholder={t.enterVerificationCode}
                      value={verificationCode}
                      onChange={handleVerificationCodeChange}
                      className="message-input"
                      maxLength={6}
                    />
                  </div>
                  
                  <div className="verification-actions">
                    <button 
                      className="text-btn" 
                      onClick={handleResendCode}
                      disabled={isSendingCode}
                    >
                      {t.resendCode}
                    </button>
                  </div>
                  
                  <div className="logout-actions">
                    <button className="cancel-btn" onClick={() => setShowVerification(false)}>
                      {t.cancel}
                    </button>
                    <button className="confirm-btn" onClick={handleVerifyCode}>
                      {t.verify}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="login-container">
        <div className="login-card">
          <div className="language-switcher">
            <button className={`lang-btn ${language === 'english' ? 'active' : ''}`} onClick={() => setLanguage('english')}>EN</button>
            <button className={`lang-btn ${language === 'arabic' ? 'active' : ''}`} onClick={() => setLanguage('arabic')}>AR</button>
          </div>

          <h1 className="login-title">{t.signIn}</h1>
          
          <div className="google-signin-section">
            <button 
              className="google-signin-btn"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <div className="google-icon">
                <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                </svg>
              </div>
              <span>
                {isLoading ? 
                  (language === 'english' ? 'Signing in...' : 'جاري التسجيل...') : 
                  t.signInWithGoogle
                }
              </span>
            </button>
            
            <div className="or-divider">
              <span>{t.or}</span>
            </div>
          </div>
          
          <div className="login-form">
            <div className="input-group">
              <label>{t.username}</label>
              <input 
                ref={usernameRef}
                type="text" 
                placeholder={language === 'english' ? "Enter email or phone" : "أدخل البريد أو الهاتف"} 
                value={credentials.username} 
                onChange={(e) => handleInputChange('username', e.target.value)} 
                className={errors.username ? 'error' : ''} 
              />
              {errors.username && <span className="error-message">{errors.username}</span>}
            </div>

            <div className="input-group">
              <label>{t.password}</label>
              <input 
                type="password" 
                placeholder={language === 'english' ? "Enter your password" : "أدخل كلمة المرور"} 
                value={credentials.password} 
                onChange={(e) => handleInputChange('password', e.target.value)} 
                className={errors.password ? 'error' : ''} 
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            {loginError && (
              <div className="error-message" style={{textAlign: 'center', margin: '10px 0'}}>
                {loginError}
              </div>
            )}

            <div className="forgot-password">
              <button 
                type="button" 
                className="forgot-link"
                onClick={() => setShowForgotPassword(true)}
              >
                {t.forgotPassword}
              </button>
            </div>

            <div className="auth-buttons">
              <button className="login-btn" onClick={handleLogin}>{t.login}</button>
              <button className="signup-btn" onClick={handleSignup}>{t.signup}</button>
            </div>

            <div className="auth-switch">
              <span>{t.dontHaveAccount} </span>
              <button className="text-btn" onClick={handleSignup}>{t.createAccount}</button>
            </div>
          </div>

          <ForgotPasswordModal />
        </div>
      </div>
    );
  };

  // Signup Page Component - بدون زر الضيف
  const SignupPage = () => {
    const [signupMethod, setSignupMethod] = useState('email');
    const [selectedCountry, setSelectedCountry] = useState('+966');
    const [credentials, setCredentials] = useState({
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [signupError, setSignupError] = useState('');
    const emailRef = useRef(null);
    const phoneRef = useRef(null);

    useEffect(() => {
      if (signupMethod === 'email' && emailRef.current) {
        emailRef.current.focus();
      } else if (signupMethod === 'phone' && phoneRef.current) {
        phoneRef.current.focus();
      }
    }, [signupMethod]);

    const validateForm = useCallback(() => {
      const newErrors = {};
      setSignupError('');

      if (signupMethod === 'email') {
        if (!credentials.email) {
          newErrors.email = t.requiredField;
        } else if (!validateEmail(credentials.email)) {
          newErrors.email = t.invalidEmail;
        }
      } else {
        if (!credentials.phone) {
          newErrors.phone = t.requiredField;
        } else if (!validatePhone(credentials.phone, selectedCountry)) {
          newErrors.phone = t.invalidPhone;
        }
      }

      if (!credentials.password) {
        newErrors.password = t.requiredField;
      } else if (!validatePassword(credentials.password)) {
        newErrors.password = t.passwordTooShort;
      }

      if (!credentials.confirmPassword) {
        newErrors.confirmPassword = t.requiredField;
      } else if (credentials.password !== credentials.confirmPassword) {
        newErrors.confirmPassword = t.passwordsDontMatch;
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }, [signupMethod, credentials, selectedCountry, t]);

    const handleSignup = useCallback(() => {
      if (!validateForm()) {
        return;
      }

      const existingUser = DatabaseService.getUser(
        signupMethod === 'email' ? credentials.email : credentials.phone
      );

      if (existingUser) {
        setSignupError(t.userExists);
        return;
      }

      const userData = {
        ...credentials,
        signupMethod,
        countryCode: selectedCountry
      };

      const savedUsers = DatabaseService.saveUser(userData);
      const newUser = savedUsers.find(user => 
        user.email === credentials.email || user.phone === credentials.phone
      );

      setUser(newUser);
      setCurrentUserId(newUser.id);
      navigate('/profile');
    }, [credentials, signupMethod, selectedCountry, t, validateForm, navigate]);

    const handleInputChange = useCallback((field, value) => {
      setCredentials(prev => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
      if (signupError) {
        setSignupError('');
      }
    }, [errors, signupError]);

    const handlePhoneChange = useCallback((value) => {
      if (value && !value.startsWith(selectedCountry)) {
        value = selectedCountry + value.replace(selectedCountry, '');
      }
      handleInputChange('phone', value);
    }, [selectedCountry, handleInputChange]);

    const handleMethodChange = useCallback((method) => {
      setSignupMethod(method);
      setErrors({});
      setSignupError('');
    }, []);

    return (
      <div className="login-container">
        <div className="login-card">
          <div className="language-switcher">
            <button className={`lang-btn ${language === 'english' ? 'active' : ''}`} onClick={() => setLanguage('english')}>EN</button>
            <button className={`lang-btn ${language === 'arabic' ? 'active' : ''}`} onClick={() => setLanguage('arabic')}>AR</button>
          </div>
          
          <h1 className="login-title">{t.createAccount}</h1>
          
          <div className="google-signin-section">
            <button 
              className="google-signin-btn"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <div className="google-icon">
                <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                </svg>
              </div>
              <span>
                {isLoading ? 
                  (language === 'english' ? 'Signing in...' : 'جاري التسجيل...') : 
                  t.continueWithGoogle
                }
              </span>
            </button>
            
            <div className="or-divider">
              <span>{t.or}</span>
            </div>
          </div>
          
          <div className="login-form">
            <div className="signup-methods">
              <button className={`method-btn ${signupMethod === 'email' ? 'active' : ''}`} onClick={() => handleMethodChange('email')}>📧 {t.email}</button>
              <button className={`method-btn ${signupMethod === 'phone' ? 'active' : ''}`} onClick={() => handleMethodChange('phone')}>📱 {t.phone}</button>
            </div>

            {signupMethod === 'email' ? (
              <div className="input-group">
                <label>{t.email}</label>
                <input 
                  ref={emailRef}
                  type="email" 
                  placeholder="example@email.com" 
                  value={credentials.email} 
                  onChange={(e) => handleInputChange('email', e.target.value)} 
                  className={errors.email ? 'error' : ''} 
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
            ) : (
              <div className="input-group">
                <label>{t.phone}</label>
                <div className="phone-input-container">
                  <select 
                    value={selectedCountry} 
                    onChange={(e) => setSelectedCountry(e.target.value)} 
                    className="country-select"
                  >
                    {countries.map(country => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.code}
                      </option>
                    ))}
                  </select>
                  <input 
                    ref={phoneRef}
                    type="tel" 
                    placeholder="07xxxxxxxx" 
                    value={credentials.phone.replace(selectedCountry, '')} 
                    onChange={(e) => handlePhoneChange(e.target.value)} 
                    className={`phone-input ${errors.phone ? 'error' : ''}`} 
                  />
                </div>
                {errors.phone && <span className="error-message">{errors.phone}</span>}
                <div className="phone-hint">
                  {language === 'english' ? 'Example: ' : 'مثال: '}
                  {selectedCountry}512345678
                </div>
              </div>
            )}

            <div className="input-group">
              <label>{t.password}</label>
              <input 
                type="password" 
                placeholder={language === 'english' ? "At least 6 characters" : "6 أحرف على الأقل"} 
                value={credentials.password} 
                onChange={(e) => handleInputChange('password', e.target.value)} 
                className={errors.password ? 'error' : ''} 
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="input-group">
              <label>{t.confirmPassword}</label>
              <input 
                type="password" 
                placeholder={language === 'english' ? "Confirm your password" : "تأكيد كلمة المرور"} 
                value={credentials.confirmPassword} 
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)} 
                className={errors.confirmPassword ? 'error' : ''} 
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>

            {signupError && (
              <div className="error-message" style={{textAlign: 'center', margin: '10px 0'}}>
                {signupError}
              </div>
            )}

            <button className="login-btn full-width" onClick={handleSignup}>
              {t.createAccount}
            </button>

            <div className="auth-switch">
              <span>{t.alreadyHaveAccount} </span>
              <button className="text-btn" onClick={handleLogin}>{t.login}</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Profile Page Component
  const ProfilePage = () => {
    const [localProfile, setLocalProfile] = useState(userProfile);
    const [errors, setErrors] = useState({});
    const fullNameRef = useRef(null);

    useEffect(() => {
      if (user && user.isGoogleUser && user.fullName && !localProfile.fullName) {
        setLocalProfile(prev => ({ ...prev, fullName: user.fullName }));
      }
      setUserProfile(localProfile);
    }, [localProfile, user]);

    useEffect(() => {
      if (fullNameRef.current) {
        fullNameRef.current.focus();
      }
    }, []);

    const validateForm = useCallback(() => {
      const newErrors = {};
      if (!localProfile.fullName) newErrors.fullName = t.requiredField;
      if (!localProfile.age) newErrors.age = t.requiredField;
      if (!localProfile.gender) newErrors.gender = t.requiredField;
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }, [localProfile.fullName, localProfile.age, localProfile.gender, t]);

    const handleProfileComplete = useCallback(() => {
      if (!validateForm()) return;
      
      if (currentUserId) {
        DatabaseService.saveUserProfile(currentUserId, localProfile);
      }
      
      // بدء محادثة جديدة مع الذكاء الاصطناعي
      ChatService.startNewConversation(localProfile);
      
      navigate('/chat');
    }, [validateForm, localProfile, currentUserId, navigate]);

    const updateProfile = useCallback((field, value) => {
      setLocalProfile(prev => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    }, [errors]);

    const handleFullNameChange = useCallback((e) => {
      updateProfile('fullName', e.target.value);
    }, [updateProfile]);

    const handleAgeChange = useCallback((e) => {
      updateProfile('age', e.target.value);
    }, [updateProfile]);

    const handleGenderChange = useCallback((e) => {
      updateProfile('gender', e.target.value);
    }, [updateProfile]);

    const handleConcernsChange = useCallback((e) => {
      updateProfile('concerns', e.target.value);
    }, [updateProfile]);

    return (
      <div className="login-container">
        <div className="login-card">
          <div className="language-switcher">
            <button 
              type="button"
              className={`lang-btn ${language === 'english' ? 'active' : ''}`} 
              onClick={() => setLanguage('english')}
            >
              EN
            </button>
            <button 
              type="button"
              className={`lang-btn ${language === 'arabic' ? 'active' : ''}`} 
              onClick={() => setLanguage('arabic')}
            >
              AR
            </button>
          </div>

          <h1 className="login-title">{t.personalInfo}</h1>
          <p className="login-subtitle">{t.helpUsUnderstand}</p>

          {user && user.isGoogleUser && (
            <div className="google-user-badge">
              <span className="google-icon-small">G</span>
              {t.viaGoogle}
            </div>
          )}

          {user && user.isGuest && (
            <div className="guest-user-badge">
              <span className="guest-icon-small">👤</span>
              {t.temporarySession}
            </div>
          )}

          <div className="login-form">
            <div className="input-group">
              <label>{t.fullName} *</label>
              <input 
                ref={fullNameRef}
                type="text" 
                placeholder={language === 'english' ? "Enter your full name" : "أدخل اسمك الكامل"} 
                value={localProfile.fullName} 
                onChange={handleFullNameChange}
                className={errors.fullName ? 'error' : ''} 
              />
              {errors.fullName && <span className="error-message">{errors.fullName}</span>}
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>{t.age} *</label>
                <select 
                  value={localProfile.age} 
                  onChange={handleAgeChange}
                  className={errors.age ? 'error' : ''}
                >
                  <option value="">{t.selectAge}</option>
                  {t.ageOptions.map(age => (
                    <option key={age} value={age}>
                      {age} {t.years}
                    </option>
                  ))}
                </select>
                {errors.age && <span className="error-message">{errors.age}</span>}
              </div>

              <div className="input-group">
                <label>{t.gender} *</label>
                <select 
                  value={localProfile.gender} 
                  onChange={handleGenderChange}
                  className={errors.gender ? 'error' : ''}
                >
                  <option value="">{t.selectGender}</option>
                  <option value="male">{t.male}</option>
                  <option value="female">{t.female}</option>
                  <option value="other">{t.other}</option>
                  <option value="prefer-not-to-say">{t.preferNotToSay}</option>
                </select>
                {errors.gender && <span className="error-message">{errors.gender}</span>}
              </div>
            </div>

            <div className="input-group">
              <label>{t.whatConcernsYou}</label>
              <textarea 
                rows="4" 
                placeholder={t.tellUs} 
                value={localProfile.concerns} 
                onChange={handleConcernsChange}
              />
            </div>

            <button 
              type="button"
              className="login-btn full-width" 
              onClick={handleProfileComplete}
            >
              {t.startTherapy}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Chat Page Component - بدون مبدل اللغة وبدون زر logout
  const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoadingResponse, setIsLoadingResponse] = useState(false);
    const messageInputRef = useRef(null);

    useEffect(() => {
      if (currentUserId) {
        const savedChats = DatabaseService.getUserChats(currentUserId);
        if (savedChats.length > 0) {
          setMessages(savedChats);
        } else {
          const welcomeMessage = user && user.isGuest ? 
            `${language === 'english' ? 'Hello Guest! 👋 Welcome to our mental health chat. Feel free to explore and try out our features. How can I assist you today?' : 'أهلاً بك كضيف! 👋 مرحباً بك في شات الصحة النفسية. يمكنك تجربة الميزات بحرية. كيف يمكنني مساعدتك اليوم؟'}` :
            userProfile.fullName 
              ? `${language === 'english' ? 'Hello' : 'مرحباً'} ${userProfile.fullName}! 🌟 ${language === 'english' ? 'I\'m your mental health assistant. How can I help you today?' : 'أنا مساعدك النفسي. كيف يمكنني مساعدتك اليوم؟'}` 
              : `${language === 'english' ? 'Hello' : 'مرحباً'}! 🌟 ${language === 'english' ? 'I\'m your mental health assistant. How can I help you today?' : 'أنا مساعدك النفسي. كيف يمكنني مساعدتك اليوم؟'}`;
          
          setMessages([
            { 
              id: 1, 
              text: welcomeMessage,
              sender: 'bot',
              timestamp: new Date()
            }
          ]);
        }
      }
    }, [currentUserId, userProfile.fullName, language, user]);

    useEffect(() => {
      if (messageInputRef.current) {
        messageInputRef.current.focus();
      }
    }, []);

    const toggleUserInfo = useCallback(() => {
      setShowUserInfo(prev => !prev);
    }, []);

    const sendMessage = useCallback(async (e) => {
      e.preventDefault();
      if (!inputMessage.trim() || isLoadingResponse) return;

      const userMessage = {
        id: Date.now(),
        text: inputMessage,
        sender: 'user',
        timestamp: new Date()
      };

      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setInputMessage('');
      setIsLoadingResponse(true);

      if (currentUserId) {
        DatabaseService.saveChatMessage(currentUserId, userMessage);
      }

      try {
        const botResponse = await ChatService.sendMessage(inputMessage, currentUserId);
        
        const botMessage = {
          id: Date.now() + 1,
          text: botResponse,
          sender: 'bot',
          timestamp: new Date()
        };
        
        const updatedMessages = [...newMessages, botMessage];
        setMessages(updatedMessages);
        
        if (currentUserId) {
          DatabaseService.saveChatMessage(currentUserId, botMessage);
        }

      } catch (error) {
        console.error('Error getting bot response:', error);
        
        const errorResponses = language === 'english' ? [
          "I'm having trouble connecting right now. Please try again.",
          "I apologize for the inconvenience. Let's try that again.",
          "There seems to be a connection issue. Please check your internet."
        ] : [
          "أواجه مشكلة في الاتصال حالياً. يرجى المحاولة مرة أخرى.",
          "أعتذر عن هذا الإزعاج. دعنا نحاول مرة أخرى.", 
          "يبدو أن هناك مشكلة في الاتصال. يرجى التحقق من الإنترنت."
        ];
        
        const errorMessage = {
          id: Date.now() + 1,
          text: errorResponses[Math.floor(Math.random() * errorResponses.length)],
          sender: 'bot',
          timestamp: new Date()
        };
        
        const updatedMessages = [...newMessages, errorMessage];
        setMessages(updatedMessages);
        
        if (currentUserId) {
          DatabaseService.saveChatMessage(currentUserId, errorMessage);
        }
      } finally {
        setIsLoadingResponse(false);
      }
    }, [inputMessage, language, messages, currentUserId, isLoadingResponse]);

    const handleInputChange = useCallback((e) => {
      setInputMessage(e.target.value);
    }, []);

    // User Info Corner Component
    const UserInfoCorner = () => {
      if (!showUserInfo || !user) return null;

      const getGenderText = (gender) => {
        switch(gender) {
          case 'male': return t.male;
          case 'female': return t.female;
          case 'prefer-not-toSay': return t.preferNotToSay;
          default: return '-';
        }
      };

      const getContactInfo = () => {
        if (user.isGuest) {
          return language === 'english' ? 'Guest User' : 'مستخدم ضيف';
        }
        return user.signupMethod === 'email' ? user.email : 
               user.signupMethod === 'phone' ? user.phone :
               user.email;
      };

      const getRegistrationMethod = () => {
        if (user.isGuest) return t.viaGuest;
        switch(user.signupMethod) {
          case 'email': return t.viaEmail;
          case 'phone': return t.viaPhone;
          case 'google': return t.viaGoogle;
          default: return '';
        }
      };

      return (
        <div className="user-info-corner">
          <div className="user-info-content">
            <div className="user-main-info">
              <div className="user-avatar">
                {user.isGoogleUser ? <div className="google-avatar">G</div> : 
                 user.isGuest ? <div className="guest-avatar">👤</div> : '👤'}
              </div>
              <div className="user-details">
                <h4>{userProfile.fullName || (language === 'english' ? "User" : "مستخدم")}</h4>
                <p>
                  {userProfile.age ? `${userProfile.age} ${t.years}` : ''}
                  {userProfile.gender ? ` • ${getGenderText(userProfile.gender)}` : ''}
                </p>
              </div>
            </div>
            
            <div className="user-contact-info">
              <div className="contact-item">
                <span className="contact-icon">
                  {user.isGuest ? '👤' :
                   user.signupMethod === 'email' ? '📧' : 
                   user.signupMethod === 'phone' ? '📱' : 'G'}
                </span>
                <span className="contact-text">{getContactInfo()}</span>
              </div>
              <div className="registration-method">
                <small>{getRegistrationMethod()}</small>
              </div>
            </div>

            {userProfile.concerns && (
              <div className="user-concerns">
                <div className="concerns-header">
                  <span className="concerns-icon">💭</span>
                  <span>{t.concerns}</span>
                </div>
                <p className="concerns-text">{userProfile.concerns}</p>
              </div>
            )}

            {user.isGuest && (
              <div className="guest-notice">
                <p>💡 {t.guestDescription}</p>
              </div>
            )}
          </div>
        </div>
      );
    };

    return (
      <div className="chat-page">
        <UserInfoCorner />
        
        <div className="chat-container">
          <div className="chat-header">
            <div className="chat-title">
              <h2>💬 {t.therapySession}</h2>
              <span className="user-status">🟢 {t.online}</span>
            </div>
            <div className="header-controls">
              <button className="user-info-btn" onClick={toggleUserInfo}>
                {showUserInfo ? '👁️ ' + t.hideInfo : '👤 ' + t.showInfo}
              </button>
            </div>
          </div>

          <div className="messages-container">
            {messages.map(message => (
              <div key={message.id} className={`message ${message.sender}-message`}>
                <div className="message-content">
                  <p>{message.text}</p>
                  <span className="message-time">
                    {new Date(message.timestamp).toLocaleTimeString(language === 'english' ? 'en-US' : 'ar-EG', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
            ))}
            {isLoadingResponse && (
              <div className="loading-message">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={sendMessage} className="message-input-form">
            <input 
              ref={messageInputRef}
              type="text" 
              value={inputMessage} 
              onChange={handleInputChange} 
              placeholder={t.typeMessage} 
              className="message-input" 
              disabled={isLoadingResponse}
            />
            <button type="submit" className="send-btn" disabled={isLoadingResponse}>
              {t.send}
            </button>
          </form>

          <div className="chat-disclaimer">
            <p>💡 {t.remember}</p>
            {user && user.isGuest && (
              <p className="guest-disclaimer">
                {language === 'english' 
                  ? '🔸 Guest session - Your data will not be saved permanently' 
                  : '🔸 جلسة ضيف - بياناتك لن تحفظ بشكل دائم'
                }
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Team Modal Component
  const TeamModal = ({ show, onClose }) => {
    if (!show) return null;

    const teamMembers = [
      { 
        name: "Mohammad Naser", 
        role: t.frontendDev, 
        avatar: "mohammad.jpg",
        fallback: "M",
        color: "#667eea"
      },
      { 
        name: "Amer", 
        role: t.aiDev, 
        avatar: "",
        fallback: "A", 
        color: "#42b72a"
      },
      { 
        name: "Rasheed", 
        role: t.fullstackDev, 
        avatar: "Rasheed.jpg",
        fallback: "R",
        color: "#0b0203ff"
      },
      { 
        name: "Ahmad", 
        role: t.aiSpecialist, 
        avatar: "Ahmad.jpg",
        fallback: "A",
        color: "#c5751aff"
      },
    ];

    return (
      <div className="team-modal">
        <div className="team-content">
          <div className="team-header">
            <h3>👥 {t.ourTeam}</h3>
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>
          
          <div className="team-members">
            {teamMembers.map((member, index) => (
              <div key={index} className="member">
                <div className="member-avatar">
                  <img 
                    src={member.avatar} 
                    alt={member.name}
                    className="member-photo"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div 
                    className="fallback-avatar" 
                    style={{ 
                      display: 'none', 
                      background: member.color 
                    }}
                  >
                    {member.fallback}
                  </div>
                </div>
                <h4>{member.name}</h4>
                <p>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Logout Confirmation Modal
  const LogoutConfirmModal = ({ show, onClose, onConfirm }) => {
    if (!show) return null;

    return (
      <div className="logout-modal">
        <div className="logout-content">
          <div className="logout-header">
            <h3>🚪 {t.logout}</h3>
          </div>
          
          <div className="logout-body">
            <p>{t.confirmLogout}</p>
          </div>
          
          <div className="logout-actions">
            <button className="cancel-btn" onClick={onClose}>
              {t.cancel}
            </button>
            <button className="confirm-btn" onClick={onConfirm}>
              {t.logout}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {showNavbar && (
        <Navbar 
          user={user} 
          userProfile={userProfile}
          language={language}
          onLanguageChange={setLanguage}
          onLogout={confirmLogout}
          onShowTeam={handleShowTeam}
          t={t}
        />
      )}
      
      <Routes>
        <Route path="/" element={<HomePage language={language} setLanguage={setLanguage} t={t} onGetStarted={handleLogin} onGuestLogin={handleGuestLogin} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/chat" element={user ? <ChatPage /> : <Navigate to="/login" />} />
        <Route path="/about" element={<AboutPage language={language} t={t} />} />
        <Route path="/tips" element={<TipsPage language={language} t={t} />} />
        <Route path="/contact" element={<ContactPage language={language} t={t} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <TeamModal show={showTeamModal} onClose={handleCloseTeam} />
      <LogoutConfirmModal 
        show={showLogoutConfirm} 
        onClose={cancelLogout} 
        onConfirm={handleLogout} 
      />
    </>
  );
}

export default App;