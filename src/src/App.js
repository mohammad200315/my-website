import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import DatabaseService from './database';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('signup');
  const [language, setLanguage] = useState('english');
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState({
    fullName: '',
    age: '',
    gender: '',
    concerns: ''
  });
  const [currentUserId, setCurrentUserId] = useState(null);

  // الترجمات
  const translations = useMemo(() => ({
    english: {
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
      loginError: "Invalid username or password"
    },
    arabic: {
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
      loginError: "اسم المستخدم أو كلمة المرور غير صحيحة"
    }
  }), []);

  const t = useMemo(() => translations[language], [language, translations]);

  // قائمة الدول مع أكوادها
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

  // Create Account Page
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

      // التحقق من وجود المستخدم مسبقاً
      const existingUser = DatabaseService.getUser(
        signupMethod === 'email' ? credentials.email : credentials.phone
      );

      if (existingUser) {
        setSignupError(t.userExists);
        return;
      }

      // حفظ المستخدم في قاعدة البيانات
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
      setCurrentPage('profile');
    }, [credentials, signupMethod, selectedCountry, t, validateForm]);

    const handleLogin = useCallback(() => {
      setCurrentPage('login');
    }, []);

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
        
        // تحميل الملف الشخصي إذا موجود
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
      
      // محاكاة إرسال رابط استعادة كلمة السر
      alert(
        language === 'english' 
          ? `Password reset link sent to ${resetEmail}` 
          : `تم إرسال رابط استعادة كلمة المرور إلى ${resetEmail}`
      );
      setShowForgotPassword(false);
      setResetEmail('');
    }, [resetEmail, language]);

    // نافذة نسيت كلمة السر
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
      setUserProfile(localProfile);
    }, [localProfile]);

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
      
      // حفظ الملف الشخصي في قاعدة البيانات
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
                <input 
                  type="number" 
                  placeholder={t.age} 
                  value={localProfile.age} 
                  onChange={handleAgeChange}
                  className={errors.age ? 'error' : ''} 
                  min="1"
                  max="120"
                />
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
      avatar: "mohammad.jpg",
      fallback: "A", 
      color: "#42b72a"
    },
    { 
      name: "Rasheed", 
      role: t.fullstackDev, 
      avatar: "mohammad.jpg",
      fallback: "R",
      color: "#ff4757"
    },
    { 
      name: "Ahmad", 
      role: t.aiSpecialist, 
      avatar: "mohammad.jpg",
      fallback: "A",
      color: "#ff8902ff"
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

  // Chat Page
  const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [showTeam, setShowTeam] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const messageInputRef = useRef(null);

    // تحميل المحادثات السابقة من قاعدة البيانات
    useEffect(() => {
      if (currentUserId) {
        const savedChats = DatabaseService.getUserChats(currentUserId);
        if (savedChats.length > 0) {
          setMessages(savedChats);
        } else {
          // رسالة ترحيب إذا لا توجد محادثات سابقة
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

    // دالة تسجيل الخروج
    const handleLogout = useCallback(() => {
      // إعادة تعيين جميع البيانات
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
      
      // العودة لصفحة تسجيل الدخول
      setCurrentPage('login');
      
      // إغلاق نافذة التأكيد
      setShowLogoutConfirm(false);
    }, []);

    // تأكيد تسجيل الخروج
    const confirmLogout = useCallback(() => {
      setShowLogoutConfirm(true);
    }, []);

    // إلغاء تسجيل الخروج
    const cancelLogout = useCallback(() => {
      setShowLogoutConfirm(false);
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

      // حفظ رسالة المستخدم في قاعدة البيانات
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
        
        // حفظ رسالة البوت في قاعدة البيانات
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
              <div className="user-info">
                <span>👤 {userProfile.fullName || (language === 'english' ? "User" : "مستخدم")}</span>
              </div>
              <button className="team-btn" onClick={toggleTeamModal}>👥 {t.meetOurTeam}</button>
              
              {/* زر تسجيل الخروج */}
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
      {currentPage === 'signup' && <SignupPage />}
      {currentPage === 'login' && <LoginPage />}
      {currentPage === 'profile' && <ProfilePage />}
      {currentPage === 'chat' && <ChatPage />}
    </div>
  );
}

export default App;
