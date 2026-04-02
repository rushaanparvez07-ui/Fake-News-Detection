import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Loader2, ShieldCheck, Lock, Check } from 'lucide-react';
import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID"; 
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";

export const Login: React.FC = () => {
  const [loginMode, setLoginMode] = useState<'user' | 'admin'>('user');
  const [step, setStep] = useState<'email' | 'verify' | 'create_account'>('email');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [userEnteredCode, setUserEnteredCode] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'simulated' | 'real' | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { login, loginAdmin, checkEmailExists } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY.length > 20 && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
        try {
            emailjs.init(EMAILJS_PUBLIC_KEY);
        } catch (e) {
            console.warn("EmailJS warning:", e);
        }
    }
  }, []);

  const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const cleanEmail = email.trim();
    if (cleanEmail) {
      setIsSending(true);
      const code = generateOTP();
      setVerificationCode(code);
      
      const isConfigured = EMAILJS_SERVICE_ID !== "YOUR_SERVICE_ID";
      const tempName = cleanEmail.split('@')[0];

      if (!isConfigured) {
          setTimeout(() => {
              setEmailStatus('simulated');
              setStep('verify');
              setIsSending(false);
          }, 800);
          return;
      }

      try {
          await emailjs.send(
              EMAILJS_SERVICE_ID,
              EMAILJS_TEMPLATE_ID,
              { to_name: tempName, to_email: cleanEmail, otp: code, reply_to: "security@factpulse.com" },
              EMAILJS_PUBLIC_KEY
          );
          setEmailStatus('real');
          setStep('verify');
      } catch (error) {
          setEmailStatus('simulated');
          setStep('verify');
      } finally {
          setIsSending(false);
      }
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (userEnteredCode === verificationCode) {
        const userExists = checkEmailExists(email);
        if (userExists) {
            login(email, undefined, rememberMe);
            navigate('/');
        } else {
            setStep('create_account');
        }
    } else {
      setErrorMsg("Invalid code. Please try again.");
    }
  };

  const handleCreateAccount = (e: React.FormEvent) => {
      e.preventDefault();
      if (name.trim()) {
          login(email, name, rememberMe);
          navigate('/');
      }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
      e.preventDefault();
      const success = loginAdmin(adminPassword);
      if (success) {
          navigate('/admin');
      } else {
          setErrorMsg("Access denied. Incorrect password.");
      }
  };

  return (
    <div className="flex items-center justify-center p-4 min-h-[80vh]">
      <div className="w-full max-w-md bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="h-1.5 bg-primary-600 w-full"></div>
        
        <div className="p-8">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
                <p className="text-slate-400 text-sm mt-1">Sign in to your account</p>
            </div>

            {/* Toggle */}
            <div className="flex p-1 bg-slate-950 rounded-lg mb-6 border border-slate-800">
                <button 
                    onClick={() => { setLoginMode('user'); setStep('email'); setErrorMsg(null); }}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${loginMode === 'user' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    User Login
                </button>
                <button 
                    onClick={() => { setLoginMode('admin'); setErrorMsg(null); }}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${loginMode === 'admin' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Admin Login
                </button>
            </div>

            {errorMsg && (
                <div className="mb-4 bg-red-900/20 border border-red-800 text-red-400 p-3 rounded-md text-sm flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    {errorMsg}
                </div>
            )}

            {/* ADMIN FORM */}
            {loginMode === 'admin' && (
                <form onSubmit={handleAdminLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                            <input
                                type="password"
                                required
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm transition-all placeholder-slate-600"
                                placeholder="Enter admin password"
                                value={adminPassword}
                                onChange={(e) => setAdminPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-white text-slate-900 font-bold py-2.5 rounded-lg hover:bg-slate-200 transition-all shadow-md">
                        Login as Admin
                    </button>
                    <p className="text-center text-xs text-slate-600 mt-2">Demo Password: admin123</p>
                </form>
            )}

            {/* USER FORM */}
            {loginMode === 'user' && (
                <>
                    {step === 'email' && (
                        <form onSubmit={handleSendCode} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                    <input
                                        type="email"
                                        required
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm transition-all placeholder-slate-600"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    id="remember" 
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="rounded border-slate-600 bg-slate-950 text-primary-600 focus:ring-primary-500"
                                />
                                <label htmlFor="remember" className="text-sm text-slate-400">Remember me on this device</label>
                            </div>

                            <button
                                type="submit"
                                disabled={isSending}
                                className="w-full bg-primary-600 text-white font-bold py-2.5 rounded-lg hover:bg-primary-700 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {isSending ? <Loader2 className="w-4 h-4 animate-spin"/> : "Send Verification Code"}
                            </button>
                        </form>
                    )}

                    {step === 'verify' && (
                        <form onSubmit={handleVerify} className="space-y-6">
                            <div className="bg-primary-900/20 border border-primary-800 text-primary-300 p-4 rounded-lg text-center">
                                <p className="text-sm">We sent a code to <span className="font-bold text-primary-100">{email}</span></p>
                                {emailStatus === 'simulated' && (
                                    <div className="mt-3 bg-slate-950 p-2 rounded border border-primary-900 inline-block">
                                        <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Demo Code</p>
                                        <span className="text-xl font-mono font-bold text-primary-400 tracking-widest">{verificationCode}</span>
                                    </div>
                                )}
                                {emailStatus === 'real' && (
                                    <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer" className="mt-3 inline-block px-4 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-md transition-colors shadow-sm">
                                        Open Gmail
                                    </a>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2 text-center uppercase">Enter Code</label>
                                <input
                                    type="text"
                                    maxLength={4}
                                    className="w-full text-center py-3 text-2xl font-mono font-bold tracking-widest bg-slate-950 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                    value={userEnteredCode}
                                    onChange={(e) => setUserEnteredCode(e.target.value)}
                                    placeholder="0000"
                                    autoFocus
                                />
                            </div>

                            <button type="submit" className="w-full bg-primary-600 text-white font-bold py-2.5 rounded-lg hover:bg-primary-700 shadow-md transition-all">
                                Verify & Login
                            </button>

                            <button type="button" onClick={() => setStep('email')} className="w-full text-sm text-slate-500 hover:text-slate-300">
                                ← Change Email
                            </button>
                        </form>
                    )}

                    {step === 'create_account' && (
                         <form onSubmit={handleCreateAccount} className="space-y-4">
                            <div className="text-center">
                                <h3 className="text-lg font-bold text-white">Finish Setting Up</h3>
                                <p className="text-sm text-slate-400">Tell us what to call you</p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm placeholder-slate-600"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    autoFocus
                                />
                            </div>

                            <button type="submit" className="w-full bg-primary-600 text-white font-bold py-2.5 rounded-lg hover:bg-primary-700 shadow-md transition-all">
                                Create Account
                            </button>
                        </form>
                    )}
                </>
            )}
        </div>
      </div>
    </div>
  );
};