import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Eye, EyeOff, Sparkles, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signupUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!name || !email || !phone || !password || !confirmPassword) {
      toast.error('All fields are required.');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      toast.error('Please enter a valid 10-digit phone number.');
      return;
    }

    setLoading(true);
    try {
      await signupUser(name, email, cleanPhone, password);
      toast.success('Registration successful! Welcome to Right Ads.');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left Column: Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 hero-gradient relative items-center justify-center p-12 text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-md relative z-10 space-y-6">
          <div className="flex items-center gap-3">
            <img src="/logo-icon-light.png" alt="Right Ads Logo" className="w-12 h-12 object-contain" />
            <div>
              <div className="text-2xl font-black leading-tight">Right Ads</div>
              <div className="text-teal-300 text-xs font-semibold tracking-wider uppercase">Business Directory</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl font-black leading-tight">
              Create Your <br />
              <span className="text-yellow-300">Free Account</span>
            </h1>
            <p className="text-blue-100 text-sm leading-relaxed">
              Register now to start listing your services, tracking quote requests, and bookmarking top businesses.
            </p>
          </div>

          <div className="pt-4 space-y-3">
            {[
              'Direct leads and phone call tracking',
              'Manually verified listings for higher trust',
              'Sleek and easy-to-use search directory dashboard',
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-2.5 text-sm font-medium">
                <Sparkles size={16} className="text-yellow-300 flex-shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-5 bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100">
          <div className="text-center lg:text-left">
            <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mx-auto lg:mx-0 mb-3">
              <Sparkles size={24} />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Create Account</h2>
            <p className="text-slate-500 text-sm">Join Right Ads Business Directory today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900"
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900"
                  required
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900"
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-bold transition-all duration-200 shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Links */}
          <div className="text-center pt-3 border-t border-slate-100 text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-bold">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
