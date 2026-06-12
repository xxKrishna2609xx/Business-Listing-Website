import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, Mail, Lock, Eye, EyeOff, Shield, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please enter credentials'); return; }
    setLoading(true);
    try {
      await loginAdmin(email, password);
      toast.success('Welcome back, Admin!');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-4">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-400 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/30">
              <Building2 size={30} className="text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-lg">Right Ads Digital</div>
              <div className="text-blue-300 text-xs">Admin Panel</div>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="glass rounded-3xl p-8 shadow-2xl border border-white/10">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-3 py-1.5 rounded-full text-xs font-semibold mb-3 border border-blue-500/30">
              <Shield size={12} /> Secure Admin Access
            </div>
            <h1 className="text-2xl font-black text-white">Sign In</h1>
            <p className="text-slate-400 text-sm mt-1">Authorized personnel only</p>
          </div>

          {/* Demo credentials hint */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 mb-5">
            <div className="flex items-start gap-2">
              <AlertCircle size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-300">
                <strong>Demo credentials:</strong><br />
                Email: admin@rightads.digital<br />
                Password: Admin@123
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@rightads.digital"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 pl-10 pr-10 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white py-3 rounded-xl text-sm font-bold transition-all duration-200 shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing In...</>
              ) : (
                <><Shield size={15} /> Sign In to Admin Panel</>
              )}
            </button>
          </form>

          <div className="text-center mt-5">
            <Link to="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
              ← Back to main website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
