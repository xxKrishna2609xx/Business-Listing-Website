import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Phone, ArrowLeft, CheckCircle2, XCircle, Building2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

/* ─── OTP digit state ─────────────────────────────────
   Each digit has a visual state:
   'idle'    → default light-gray border
   'focused' → dark-blue border
   'correct' → green border + bg
   'wrong'   → red border + bg (shakes)
──────────────────────────────────────────────────── */
const STEPS = { PHONE: 'phone', OTP: 'otp', SUCCESS: 'success' };
const OTP_LENGTH = 4;
const MOCK_OTP = '1234'; // simulated correct OTP

export default function Login() {
  const { loginUser } = useAuth();
  const navigate      = useNavigate();
  const location      = useLocation();
  const from          = location.state?.from?.pathname || '/';

  const [step,        setStep]        = useState(STEPS.PHONE);
  const [phone,       setPhone]       = useState('');
  const [phoneError,  setPhoneError]  = useState('');
  const [otp,         setOtp]         = useState(['', '', '', '']);
  const [otpState,    setOtpState]    = useState(['idle', 'idle', 'idle', 'idle']);
  const [loading,     setLoading]     = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [shake,       setShake]       = useState(false);

  const digitRefs = [useRef(), useRef(), useRef(), useRef()];
  const timerRef  = useRef(null);

  /* ── countdown timer ── */
  useEffect(() => {
    if (step === STEPS.OTP) {
      setResendTimer(30);
      timerRef.current = setInterval(() => {
        setResendTimer(t => { if (t <= 1) { clearInterval(timerRef.current); return 0; } return t - 1; });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [step]);

  /* ── focus first box on OTP step ── */
  useEffect(() => {
    if (step === STEPS.OTP) setTimeout(() => digitRefs[0].current?.focus(), 80);
  }, [step]);

  /* ── phone validation ── */
  const validatePhone = (v) => {
    const clean = v.replace(/\D/g, '');
    if (!clean) return 'Phone number is required.';
    if (clean.length < 10) return 'Enter a valid 10-digit phone number.';
    return '';
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
<<<<<<< HEAD

    if (!email || !password) {
      toast.error('Please fill in all fields.');
      return;
    }
 
    setLoading(true);
    try {
      const user = await loginUser(email, password);
      toast.success(`Welcome back, ${user.name}!`);
      
      // If admin, redirect to admin dashboard
      if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
        if (err.response?.status === 401) {

          toast.error('Invalid email or password');

          return;
        }
        toast.error(err.response?.data?.detail || 'Login failed. Please try again.');
      
    } finally {
      setLoading(false);
=======
    const err = validatePhone(phone);
    if (err) { setPhoneError(err); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900)); // simulate API
    setLoading(false);
    toast.success('OTP sent! (Use 1234 to test)');
    setStep(STEPS.OTP);
    setOtp(['', '', '', '']);
    setOtpState(['idle', 'idle', 'idle', 'idle']);
  };

  /* ── OTP input handling ── */
  const handleOtpChange = (idx, val) => {
    if (!/^\d?$/.test(val)) return; // digits only
    const next = [...otp];
    next[idx] = val;
    setOtp(next);

    // update state to focused while typing
    const ns = [...otpState];
    ns[idx] = 'focused';
    setOtpState(ns);

    // auto-advance
    if (val && idx < OTP_LENGTH - 1) {
      setTimeout(() => digitRefs[idx + 1].current?.focus(), 0);
    }

    // auto-verify when all filled
    if (next.every(d => d !== '')) {
      setTimeout(() => verifyOtp(next), 60);
>>>>>>> a4297bdae2499bb3b73fbce6bc1a29aa71b14594
    }
  };

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      digitRefs[idx - 1].current?.focus();
    }
  };

  const handleOtpFocus = (idx) => {
    const ns = [...otpState];
    ns[idx] = 'focused';
    setOtpState(ns);
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!text) return;
    const next = text.split('').concat(['', '', '', '']).slice(0, OTP_LENGTH);
    setOtp(next);
    const ns = next.map(d => d ? 'focused' : 'idle');
    setOtpState(ns);
    if (next.every(d => d !== '')) setTimeout(() => verifyOtp(next), 60);
    else digitRefs[Math.min(text.length, OTP_LENGTH - 1)].current?.focus();
  };

  const verifyOtp = async (digits) => {
    const entered = digits.join('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    setLoading(false);

    if (entered === MOCK_OTP) {
      // All correct → green
      setOtpState(['correct', 'correct', 'correct', 'correct']);
      await new Promise(r => setTimeout(r, 600));
      setStep(STEPS.SUCCESS);
      // Simulate login with phone number
      try {
        await loginUser('demo@rightads.digital', 'Demo@123').catch(() => {});
      } catch (_) {}
      toast.success('Verified! Welcome back.');
      setTimeout(() => navigate(from, { replace: true }), 800);
    } else {
      // Wrong — mark each digit wrong, shake, then reset
      setOtpState(['wrong', 'wrong', 'wrong', 'wrong']);
      setShake(true);
      setTimeout(() => setShake(false), 600);
      toast.error('Incorrect OTP. Try again.');
      await new Promise(r => setTimeout(r, 1000));
      setOtp(['', '', '', '']);
      setOtpState(['idle', 'idle', 'idle', 'idle']);
      digitRefs[0].current?.focus();
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setOtp(['', '', '', '']);
    setOtpState(['idle', 'idle', 'idle', 'idle']);
    setResendTimer(30);
    timerRef.current = setInterval(() => {
      setResendTimer(t => { if (t <= 1) { clearInterval(timerRef.current); return 0; } return t - 1; });
    }, 1000);
    toast.success('OTP resent! (Use 1234)');
    setTimeout(() => digitRefs[0].current?.focus(), 80);
  };

  /* ── OTP box visual styles ── */
  const boxStyle = (state, shakeActive) => {
    const base = {
      width: 64, height: 64,
      fontSize: 26, fontWeight: 700,
      textAlign: 'center',
      border: '2px solid',
      borderRadius: 14,
      outline: 'none',
      fontFamily: 'inherit',
      transition: 'border-color 0.2s, background 0.2s, transform 0.1s',
      cursor: 'text',
    };
    if (state === 'correct') return { ...base, borderColor: '#16a34a', background: '#f0fdf4', color: '#15803d' };
    if (state === 'wrong')   return { ...base, borderColor: '#dc2626', background: '#fef2f2', color: '#dc2626',
      animation: shakeActive ? 'otp-shake 0.5s ease' : 'none' };
    if (state === 'focused') return { ...base, borderColor: '#1a56db', background: '#eff6ff', color: '#1a56db' };
    return { ...base, borderColor: '#DDDDDD', background: '#fafafa', color: '#222' };
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#fff', fontFamily: "'Outfit', sans-serif" }}>

      {/* ── Left branding panel (desktop) ──────────── */}
      <div className="auth-left-panel" style={{
        display: 'none',
        flex: '0 0 46%',
        background: 'linear-gradient(145deg, #1e3a8a 0%, #1a56db 55%, #1d4ed8 100%)',
        position: 'relative', overflow: 'hidden',
        flexDirection: 'column', justifyContent: 'center',
        padding: '64px 56px',
      }}>
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: -100, right: -80, width: 360, height: 360, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

        <Link to="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: 52 }}>
          <img src="/logo-light.png" alt="Right Ads" style={{ height: 40, width: 'auto' }} />
        </Link>

        <h1 style={{ fontSize: 40, fontWeight: 800, color: '#fff', lineHeight: 1.18, marginBottom: 18 }}>
          Find the best local<br />businesses near you.
        </h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', lineHeight: 1.75, marginBottom: 52, maxWidth: 360 }}>
          Sign in to manage listings, get direct quotes, and connect with thousands of verified businesses across India.
        </p>

        {[
          { icon: Building2,   text: '700+ verified businesses' },
          { icon: ShieldCheck, text: 'Secure OTP-based login' },
          { icon: Phone,       text: 'Direct WhatsApp & call leads' },
        ].map(({ icon: Icon, text }, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={18} color="#fff" />
            </div>
            <span style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.88)' }}>{text}</span>
          </div>
        ))}
      </div>

      {/* ── Right: form panel ─────────────────────── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          {/* Mobile logo */}
          <div className="auth-mobile-logo" style={{ display: 'flex', justifyContent: 'center', marginBottom: 36 }}>
            <Link to="/"><img src="/logo.png" alt="Right Ads" style={{ height: 40, width: 'auto' }} /></Link>
          </div>

          <div style={{
            background: '#fff',
            border: '1.5px solid #EBEBEB',
            borderRadius: 20,
            padding: '40px 36px',
            boxShadow: '0 4px 32px rgba(0,0,0,0.07)',
          }}>

            {/* ── STEP: PHONE ──────────────────────── */}
            {step === STEPS.PHONE && (
              <>
                <div style={{ marginBottom: 28 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 12, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                    <Phone size={22} color="#1a56db" />
                  </div>
                  <h2 style={{ fontSize: 24, fontWeight: 800, color: '#111', marginBottom: 4 }}>Sign In</h2>
                  <p style={{ fontSize: 14, color: '#717171' }}>Enter your phone number to continue</p>
                </div>

                <form onSubmit={handleSendOtp}>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#333', marginBottom: 7 }}>
                      Phone Number
                    </label>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '0 14px', height: 48,
                        border: '1.5px solid #DDDDDD', borderRadius: 12,
                        fontSize: 14, fontWeight: 600, color: '#333',
                        background: '#fafafa', flexShrink: 0,
                      }}>+91</div>
                      <div style={{ flex: 1, position: 'relative' }}>
                        <Phone size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
                        <input
                          type="tel"
                          maxLength={10}
                          value={phone}
                          onChange={e => { setPhone(e.target.value.replace(/\D/g, '')); setPhoneError(''); }}
                          placeholder="9876543210"
                          style={{
                            width: '100%', height: 48,
                            paddingLeft: 38, paddingRight: 14,
                            fontSize: 15, fontWeight: 500,
                            border: `1.5px solid ${phoneError ? '#dc2626' : '#DDDDDD'}`,
                            borderRadius: 12, outline: 'none',
                            fontFamily: 'inherit', color: '#111', background: '#fff',
                            transition: 'border-color 0.2s',
                          }}
                          onFocus={e => { if (!phoneError) e.target.style.borderColor = '#1a56db'; }}
                          onBlur={e  => { if (!phoneError) e.target.style.borderColor = '#DDDDDD'; }}
                        />
                      </div>
                    </div>
                    {phoneError && (
                      <p style={{ color: '#dc2626', fontSize: 12, marginTop: 6, fontWeight: 500 }}>{phoneError}</p>
                    )}
                  </div>

                  <button
                    type="submit" disabled={loading}
                    style={{
                      width: '100%', height: 48,
                      background: loading ? '#93c5fd' : '#1a56db',
                      color: '#fff', fontSize: 15, fontWeight: 700,
                      border: 'none', borderRadius: 12,
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontFamily: 'inherit',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      transition: 'background 0.2s',
                    }}
                  >
                    {loading
                      ? <><Spinner /> Sending OTP...</>
                      : 'Continue'}
                  </button>
                </form>

                <p style={{ marginTop: 24, textAlign: 'center', fontSize: 13, color: '#717171' }}>
                  Don't have an account?{' '}
                  <Link to="/signup" style={{ color: '#1a56db', fontWeight: 700, textDecoration: 'none' }}>Sign Up</Link>
                </p>
              </>
            )}

            {/* ── STEP: OTP ────────────────────────── */}
            {step === STEPS.OTP && (
              <>
                <button
                  onClick={() => setStep(STEPS.PHONE)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#717171', fontSize: 13, fontWeight: 600, marginBottom: 24, padding: 0, fontFamily: 'inherit' }}
                >
                  <ArrowLeft size={15} /> Back
                </button>

                <div style={{ marginBottom: 28 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 12, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                    <ShieldCheck size={22} color="#1a56db" />
                  </div>
                  <h2 style={{ fontSize: 24, fontWeight: 800, color: '#111', marginBottom: 4 }}>Enter OTP</h2>
                  <p style={{ fontSize: 14, color: '#717171' }}>
                    Sent to <strong style={{ color: '#111' }}>+91 {phone}</strong>
                  </p>
                </div>

                {/* OTP boxes */}
                <div
                  style={{
                    display: 'flex', gap: 12, justifyContent: 'center',
                    marginBottom: 28,
                    animation: shake ? 'otp-shake 0.5s ease' : 'none',
                  }}
                  onPaste={handleOtpPaste}
                >
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={digitRefs[idx]}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(idx, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(idx, e)}
                      onFocus={() => handleOtpFocus(idx)}
                      style={boxStyle(otpState[idx], shake)}
                      disabled={loading}
                    />
                  ))}
                </div>

                {/* Status message */}
                {otpState[0] === 'correct' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginBottom: 16, color: '#16a34a', fontWeight: 600, fontSize: 14 }}>
                    <CheckCircle2 size={18} /> Verified!
                  </div>
                )}
                {otpState[0] === 'wrong' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginBottom: 16, color: '#dc2626', fontWeight: 600, fontSize: 14 }}>
                    <XCircle size={18} /> Incorrect OTP. Try again.
                  </div>
                )}

                {loading && (
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                    <Spinner color="#1a56db" size={22} />
                  </div>
                )}

                {/* Resend */}
                <p style={{ textAlign: 'center', fontSize: 13, color: '#717171' }}>
                  Didn't receive it?{' '}
                  {resendTimer > 0
                    ? <span style={{ color: '#aaa', fontWeight: 600 }}>Resend in {resendTimer}s</span>
                    : <button onClick={handleResend} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1a56db', fontWeight: 700, fontSize: 13, fontFamily: 'inherit', padding: 0 }}>Resend OTP</button>
                  }
                </p>
              </>
            )}

            {/* ── STEP: SUCCESS ─────────────────────── */}
            {step === STEPS.SUCCESS && (
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <CheckCircle2 size={36} color="#16a34a" />
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', marginBottom: 8 }}>Verified!</h2>
                <p style={{ fontSize: 14, color: '#717171' }}>Redirecting you now...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes otp-shake {
          0%,100% { transform: translateX(0); }
          20%      { transform: translateX(-8px); }
          40%      { transform: translateX(8px); }
          60%      { transform: translateX(-6px); }
          80%      { transform: translateX(6px); }
        }
        @media (min-width: 1024px) {
          .auth-left-panel  { display: flex !important; }
          .auth-mobile-logo { display: none !important; }
        }
      `}</style>
    </div>
  );
}

/* tiny spinner component */
function Spinner({ color = '#fff', size = 16 }) {
  return (
    <div style={{
      width: size, height: size,
      border: `2px solid ${color === '#fff' ? 'rgba(255,255,255,0.3)' : 'rgba(26,86,219,0.2)'}`,
      borderTopColor: color,
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
      flexShrink: 0,
    }} />
  );
}
