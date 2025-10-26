import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import DatabaseService from './database';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('language');
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
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);

  // توليد كود تحقق عشوائي
  const generateVerificationCode = useCallback(() => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }, []);

  // إرسال كود التحقق للبريد (محاكاة)
  const sendVerificationCode = useCallback(async (email, code) => {
    setIsLoading(true);
    try {
      console.log(`📧 Sending verification code to ${email}: ${code}`);
      
      // محاكاة إرسال الإيميل
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(
        language === 'english' 
          ? `Verification code sent to ${email}` 
          : `تم إرسال كود التحقق إلى ${email}`
      );
      return true;
    } catch (error) {
      console.error('Error sending verification code:', error);
      alert(
        language === 'english'
          ? 'Failed to send verification code'
          : 'فشل إرسال كود التحقق'
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [language]);

  // الترجمات الكاملة
  const translations = useMemo(() => ({
    english: {
      selectLanguage: "Select Language",
      chooseLanguage: "Please choose your preferred language",
      continue: "Continue",
      
      signInWithGoogle: "Continue with Google",
      continueWithGoogle: "Continue with Google",
      or: "OR",
      googleSignInSuccess: "Google sign-in successful!",
      googleSignInError: "Google sign-in failed. Please try again.",
      
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
      
      verificationCode: "Verification Code",
      enterVerificationCode: "Enter verification code",
      codeSentTo: "Code sent to",
      verify: "Verify",
      resendCode: "Resend Code",
      invalidCode: "Invalid verification code",
      codeExpired: "Verification code expired",
      
      ageOptions: Array.from({length: 63}, (_, i) => 18 + i)
    },
    arabic: {
      selectLanguage: "اختر اللغة",
      chooseLanguage: "الرجاء اختيار اللغة المفضلة",
      continue: "متابعة",
      
      signInWithGoogle: "المتابعة باستخدام جوجل",
      continueWithGoogle: "المتابعة باستخدام جوجل",
      or: "أو",
      googleSignInSuccess: "تم تسجيل الدخول باستخدام جوجل بنجاح!",
      googleSignInError: "فشل تسجيل الدخول باستخدام جوجل. يرجى المحاولة مرة أخرى.",
      
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
      
      verificationCode: "كود التحقق",
      enterVerificationCode: "أدخل كود التحقق",
      codeSentTo: "تم إرسال الكود إلى",
      verify: "تحقق",
      resendCode: "إعادة إرسال الكود",
      invalidCode: "كود التحقق غير صحيح",
      codeExpired: "انتهت صلاحية كود التحقق",
      
      ageOptions: Array.from({length: 63}, (_, i) => 18 + i)
    }
  }), []);

  const t = useMemo(() => translations[language], [language, translations]);

  // دوال التحقق من الصحة
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone, countryCode) => {
    if (!phone) return false;
    const cleanPhone = phone.replace(/\D/g, '');
    const cleanCountryCode = countryCode.replace('+', '');
    const numberPart = cleanPhone.startsWith(cleanCountryCode) 
      ? cleanPhone.slice(cleanCountryCode.length)
      : cleanPhone;
    return numberPart.length >= 7 && numberPart.length <= 15;
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  // دالة تسجيل الدخول بجوجل
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }).then(res => res.json());

        const existingUser = DatabaseService.getUser(userInfo.email);
        
        if (existingUser) {
          setUser(existingUser);
          setCurrentUserId(existingUser.id);
          
          if (existingUser.profile) {
            setUserProfile(existingUser.profile);
            setCurrentPage('chat');
          } else {
            setCurrentPage('profile');
          }
        } else {
          const newUser = {
            id: 'google_' + Date.now(),
            email: userInfo.email,
            fullName: userInfo.name,
            profilePicture: userInfo.picture,
            signupMethod: 'google',
            isGoogleUser: true,
            isVerified: true,
            createdAt: new Date().toISOString()
          };
          
          const savedUsers = DatabaseService.saveUser(newUser);
          const savedUser = savedUsers.find(user => user.id === newUser.id);
          
          setUser(savedUser);
          setCurrentUserId(savedUser.id);
          setCurrentPage('profile');
        }
        
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

  // Language Selection Page
  const LanguageSelectionPage = () => {
    const handleLanguageSelect = useCallback((selectedLanguage) => {
      setLanguage(selectedLanguage);
      setCurrentPage('signup');
    }, []);

    return (
      <div className="language-selection-container">
        <div className="language-selection-card">
          <div className="language-header">
            <h1>🌐 {t.selectLanguage}</h1>
            <p className="language-subtitle">{t.chooseLanguage}</p>
          </div>
          
          <div className="language-options">
            <button 
              className="language-option english-option"
              onClick={() => handleLanguageSelect('english')}
            >
              <div className="language-flag">🇺🇸</div>
              <div className="language-info">
                <h3>English</h3>
                <p>English Language</p>
              </div>
              <div className="language-selector">→</div>
            </button>
            
            <button 
              className="language-option arabic-option"
              onClick={() => handleLanguageSelect('arabic')}
            >
              <div className="language-flag">🇸🇦</div>
              <div className="language-info">
                <h3>العربية</h3>
                <p>اللغة العربية</p>
              </div>
              <div className="language-selector">→</div>
            </button>
          </div>
          
          <div className="language-footer">
            <p>You can change the language later from the settings</p>
            <p>يمكنك تغيير اللغة لاحقاً من الإعدادات</p>
          </div>
        </div>
      </div>
    );
  };

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

  // Verification Page
  const VerificationPage = ({ email, onVerify, onResend }) => {
    const [code, setCode] = useState('');
    const [timeLeft, setTimeLeft] = useState(60);

    useEffect(() => {
      if (timeLeft > 0) {
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
      }
    }, [timeLeft]);

    const handleVerify = () => {
      if (code === verificationCode) {
        onVerify();
      } else {
        alert(t.invalidCode);
      }
    };

    const handleResend = async () => {
      const newCode = generateVerificationCode();
      setVerificationCode(newCode);
      setTimeLeft(60);
      await onResend(newCode);
      setCode('');
    };

    return (
      <div className="login-container">
        <div className="login-card">
          <div className="language-switcher">
            <button className={`lang-btn ${language === 'english' ? 'active' : ''}`} 
              onClick={() => setLanguage('english')}>EN</button>
            <button className={`lang-btn ${language === 'arabic' ? 'active' : ''}`} 
              onClick={() => setLanguage('arabic')}>AR</button>
          </div>

          <h1 className="login-title">🔐 {t.verificationCode}</h1>
          <p className="login-subtitle">
            {t.codeSentTo} <strong>{email}</strong>
          </p>

          <div className="login-form">
            <div className="input-group">
              <label>{t.enterVerificationCode}</label>
              <input 
                type="text" 
                placeholder="123456" 
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                className="verification-input"
              />
            </div>

            <button 
              className="login-btn full-width" 
              onClick={handleVerify}
              disabled={code.length !== 6}
            >
              {t.verify}
            </button>

            <div className="resend-section">
              {timeLeft > 0 ? (
                <p>
                  {language === 'english' ? 'Resend code in' : 'إعادة الإرسال خلال'} 
                  <strong> {timeLeft}s</strong>
                </p>
              ) : (
                <button className="text-btn" onClick={handleResend}>
                  {t.resendCode}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Signup Page
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

    const handleSignup = useCallback(async () => {
      if (!validateForm()) return;

      const existingUser = DatabaseService.getUser(
        signupMethod === 'email' ? credentials.email : credentials.phone
      );

      if (existingUser) {
        setSignupError(t.userExists);
        return;
      }

      if (signupMethod === 'email') {
        const code = generateVerificationCode();
        setVerificationCode(code);
        
        const sent = await sendVerificationCode(credentials.email, code);
        if (sent) {
          setPendingUser({
            ...credentials,
            signupMethod,
            countryCode: selectedCountry
          });
          setShowVerification(true);
        }
      } else {
        const userData = {
          ...credentials,
          signupMethod,
          countryCode: selectedCountry,
          isVerified: true,
          createdAt: new Date().toISOString()
        };

        const savedUsers = DatabaseService.saveUser(userData);
        const newUser = savedUsers.find(user => 
          user.email === credentials.email || user.phone === credentials.phone
        );

        setUser(newUser);
        setCurrentUserId(newUser.id);
        setCurrentPage('profile');
      }
    }, [credentials, signupMethod, selectedCountry, t, validateForm, generateVerificationCode, sendVerificationCode]);

    const handleVerificationSuccess = useCallback(() => {
      const userData = {
        ...pendingUser,
        isVerified: true,
        createdAt: new Date().toISOString()
      };

      const savedUsers = DatabaseService.saveUser(userData);
      const newUser = savedUsers.find(user => 
        user.email === userData.email || user.phone === userData.phone
      );

      setUser(newUser);
      setCurrentUserId(newUser.id);
      setCurrentPage('profile');
      setShowVerification(false);
      setPendingUser(null);
    }, [pendingUser]);

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
      const cleanValue = value.replace(/\D/g, '');
      handleInputChange('phone', cleanValue);
    }, [handleInputChange]);

    const handleMethodChange = useCallback((method) => {
      setSignupMethod(method);
      setErrors({});
      setSignupError('');
    }, []);

    const handleLogin = useCallback(() => {
      setCurrentPage('login');
    }, []);

    if (showVerification && signupMethod === 'email') {
      return (
        <VerificationPage 
          email={credentials.email}
          onVerify={handleVerificationSuccess}
          onResend={(newCode) => sendVerificationCode(credentials.email, newCode)}
        />
      );
    }

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
                    placeholder="512345678" 
                    value={credentials.phone} 
                    onChange={(e) => handlePhoneChange(e.target.value)} 
                    className={`phone-input ${errors.phone ? 'error' : ''}`} 
                  />
                </div>
                {errors.phone && <span className="error-message">{errors.phone}</span>}
                <div className="phone-hint">
                  {selectedCountry}<strong>512345678</strong>
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

  // Login Page
  const LoginPage = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [errors, setErrors] = useState({});
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [loginError, setLoginError] = useState('');
    const usernameRef = useRef(null);
    const resetEmailRef = useRef(null);

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
          setCurrentPage('chat');
        } else {
          setCurrentPage('profile');
        }
      } else {
        setLoginError(t.loginError);
      }
    }, [credentials, t, validateForm]);

    const handleSignup = useCallback(() => {
      setCurrentPage('signup');
    }, []);

    const handleInputChange = useCallback((field, value) => {
      setCredentials(prev => ({ ...prev, [field]: value }));
      if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
      if (loginError) setLoginError('');
    }, [errors, loginError]);

    const handleResetEmailChange = useCallback((e) => {
      setResetEmail(e.target.value);
    }, []);

    const handleForgotPassword = useCallback(() => {
      if (!resetEmail) {
        alert(language === 'english' ? 'Please enter your email' : 'الرجاء إدخال بريدك الإلكتروني');
        return;
      }
      
      if (!validateEmail(resetEmail)) {
        alert(language === 'english' ? 'Please enter a valid email address' : 'الرجاء إدخال بريد إلكتروني صحيح');
        return;
      }
      
      alert(
        language === 'english' 
          ? `Password reset link sent to ${resetEmail}` 
          : `تم إرسال رابط استعادة كلمة المرور إلى ${resetEmail}`
      );
      setShowForgotPassword(false);
      setResetEmail('');
    }, [resetEmail, language]);
// أضف هذه الدالة في App.js (بعد useState)
const sendVerificationCode = useCallback(async (email, code) => {
  setIsLoading(true);
  try {
    // استخدام خدمة إيميل مجانية - EmailJS
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: 'YOUR_SERVICE_ID',
        template_id: 'YOUR_TEMPLATE_ID',
        user_id: 'YOUR_PUBLIC_KEY',
        template_params: {
          to_email: email,
          verification_code: code,
          subject: 'كود التحقق - Therapist Chatbot'
        }
      })
    });

    if (response.ok) {
      alert(
        language === 'english' 
          ? `Verification code sent to ${email}` 
          : `تم إرسال كود التحقق إلى ${email}`
      );
      return true;
    } else {
      throw new Error('Failed to send email');
    }
  } catch (error) {
    console.error('Error sending verification code:', error);
    
    // إذا فشل الإرسال، عرض الكود للمستخدم (للتطوير)
    alert(
      language === 'english'
        ? `Development Mode: Your verification code is ${code}`
        : `وضع التطوير: كود التحقق الخاص بك هو ${code}`
    );
    return true;
  } finally {
    setIsLoading(false);
  }
}, [language]);
    const ForgotPasswordModal = () => {
      if (!showForgotPassword) return null;

      return (
        <div className="logout-modal">
          <div className="logout-content">
            <div className="logout-header">
              <h3>🔑 {t.resetPassword}</h3>
              <button className="close-btn" onClick={() => setShowForgotPassword(false)}>✕</button>
            </div>
            
            <div className="logout-body">
              <p>
                {language === 'english' 
                  ? 'Enter your email address and we will send you a password reset link.' 
                  : 'أدخل بريدك الإلكتروني وسنرسل لك رابط استعادة كلمة المرور.'
                }
              </p>
              <div className="input-group">
                <input 
                  ref={resetEmailRef}
                  type="email" 
                  placeholder={t.enterEmail} 
                  value={resetEmail}
                  onChange={handleResetEmailChange}
                  className="message-input"
                />
              </div>
            </div>
            
            <div className="logout-actions">
              <button className="cancel-btn" onClick={() => setShowForgotPassword(false)}>
                {t.cancel}
              </button>
              <button className="confirm-btn" onClick={handleForgotPassword}>
                {t.sendResetLink}
              </button>
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
              <button className="signup-btn" onClick={handleSignup}>{t.signup}</button>
              <button className="login-btn" onClick={handleLogin}>{t.login}</button>
            </div>
          </div>

          <ForgotPasswordModal />
        </div>
      </div>
    );
  };

  // Profile Page
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
      
      setCurrentPage('chat');
    }, [validateForm, localProfile, currentUserId]);

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

  // Team Modal
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
        role: t.frontendDev, 
        avatar: "Rasheed.jpg",
        fallback: "R",
        color: "#c41227ff"
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

  // User Info Corner Component
  const UserInfoCorner = () => {
    if (!showUserInfo || !user) return null;

    const getGenderText = (gender) => {
      switch(gender) {
        case 'male': return t.male;
        case 'female': return t.female;
        case 'other': return t.other;
        case 'prefer-not-to-say': return t.preferNotToSay;
        default: return '-';
      }
    };

    const getContactInfo = () => {
      return user.signupMethod === 'email' ? user.email : 
             user.signupMethod === 'phone' ? user.phone :
             user.email;
    };

    const getRegistrationMethod = () => {
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
              {user.isGoogleUser ? <div className="google-avatar">G</div> : '👤'}
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
                {user.signupMethod === 'email' ? '📧' : 
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
        </div>
      </div>
    );
  };

  // Chat Page
  const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [showTeam, setShowTeam] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const messageInputRef = useRef(null);

    useEffect(() => {
      if (currentUserId) {
        const savedChats = DatabaseService.getUserChats(currentUserId);
        if (savedChats.length > 0) {
          setMessages(savedChats);
        } else {
          setMessages([
            { 
              id: 1, 
              text: userProfile.fullName 
                ? `${language === 'english' ? 'Hello' : 'مرحباً'} ${userProfile.fullName}! 🌟 ${language === 'english' ? 'I\'m your mental health assistant. How can I help you today?' : 'أنا مساعدك النفسي. كيف يمكنني مساعدتك اليوم؟'}` 
                : `${language === 'english' ? 'Hello' : 'مرحباً'}! 🌟 ${language === 'english' ? 'I\'m your mental health assistant. How can I help you today?' : 'أنا مساعدك النفسي. كيف يمكنني مساعدتك اليوم؟'}`,
              sender: 'bot',
              timestamp: new Date()
            }
          ]);
        }
      }
    }, [currentUserId, userProfile.fullName, language]);

    useEffect(() => {
      if (messageInputRef.current) {
        messageInputRef.current.focus();
      }
    }, []);

    const handleLogout = useCallback(async () => {
      if (user && user.isGoogleUser) {
        // يمكنك إضافة تسجيل خروج من جوجل هنا إذا أردت
      }
      
      setUser(null);
      setUserProfile({
        fullName: '',
        age: '',
        gender: '',
        concerns: ''
      });
      setMessages([]);
      setInputMessage('');
      setCurrentUserId(null);
      setCurrentPage('language');
      setShowLogoutConfirm(false);
    }, [user]);

    const confirmLogout = useCallback(() => {
      setShowLogoutConfirm(true);
    }, []);

    const cancelLogout = useCallback(() => {
      setShowLogoutConfirm(false);
    }, []);

    const toggleUserInfo = useCallback(() => {
      setShowUserInfo(prev => !prev);
    }, []);

    const sendMessage = useCallback((e) => {
      e.preventDefault();
      if (!inputMessage.trim()) return;

      const userMessage = {
        id: Date.now(),
        text: inputMessage,
        sender: 'user',
        timestamp: new Date()
      };

      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setInputMessage('');

      if (currentUserId) {
        DatabaseService.saveChatMessage(currentUserId, userMessage);
      }

      setTimeout(() => {
        const responses = language === 'english' ? [
          "I understand what you mean. Can you tell me more about this feeling?",
          "Thank you for sharing this with me. How does this affect your daily life?",
          "This is very important. When did you start feeling this way?",
          "I appreciate your honesty. Is there something specific that triggers these feelings?",
          "That sounds challenging. How have you been coping with this?",
          "I'm here to listen. What would you like to focus on today?"
        ] : [
          "أفهم ما تقصد. هل يمكنك أن تخبرني المزيد عن هذا الشعور؟",
          "شكراً لمشاركتي هذا. كيف يؤثر هذا على حياتك اليومية؟",
          "هذا مهم جداً. متى بدأت تشعر بهذا الشعور؟",
          "أقدر صراحتك. هل هناك شيء محدد يثير هذه المشاعر؟",
          "هذا يبدو صعباً. كيف تتعامل مع هذا؟",
          "أنا هنا لأستمع. ما الذي تود التركيز عليه اليوم؟"
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const botMessage = {
          id: Date.now() + 1,
          text: randomResponse,
          sender: 'bot',
          timestamp: new Date()
        };
        
        const updatedMessages = [...newMessages, botMessage];
        setMessages(updatedMessages);
        
        if (currentUserId) {
          DatabaseService.saveChatMessage(currentUserId, botMessage);
        }
      }, 1000);
    }, [inputMessage, language, messages, currentUserId]);

    const handleInputChange = useCallback((e) => {
      setInputMessage(e.target.value);
    }, []);

    const toggleTeamModal = useCallback(() => {
      setShowTeam(prev => !prev);
    }, []);

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
              <div className="language-switcher-small">
                <button className={`lang-btn ${language === 'english' ? 'active' : ''}`} onClick={() => setLanguage('english')}>EN</button>
                <button className={`lang-btn ${language === 'arabic' ? 'active' : ''}`} onClick={() => setLanguage('arabic')}>AR</button>
              </div>
              
              <button className="user-info-btn" onClick={toggleUserInfo}>
                {showUserInfo ? '👁️ ' + t.hideInfo : '👤 ' + t.showInfo}
              </button>
              
              <button className="team-btn" onClick={toggleTeamModal}>👥 {t.meetOurTeam}</button>
              
              <button className="logout-btn" onClick={confirmLogout}>
                🚪 {t.logout}
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
          </div>

          <form onSubmit={sendMessage} className="message-input-form">
            <input 
              ref={messageInputRef}
              type="text" 
              value={inputMessage} 
              onChange={handleInputChange} 
              placeholder={t.typeMessage} 
              className="message-input" 
            />
            <button type="submit" className="send-btn">{t.send}</button>
          </form>

          <div className="chat-disclaimer">
            <p>💡 {t.remember}</p>
          </div>

          <TeamModal show={showTeam} onClose={toggleTeamModal} />
          <LogoutConfirmModal 
            show={showLogoutConfirm} 
            onClose={cancelLogout} 
            onConfirm={handleLogout} 
          />
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      {currentPage === 'language' && <LanguageSelectionPage />}
      {currentPage === 'signup' && <SignupPage />}
      {currentPage === 'login' && <LoginPage />}
      {currentPage === 'profile' && <ProfilePage />}
      {currentPage === 'chat' && <ChatPage />}
    </div>
  );
}

export default App;