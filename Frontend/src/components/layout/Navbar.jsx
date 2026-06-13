import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search, MapPin, Menu, X,
  Phone, LogIn, Bell, Sparkles, User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  const suggestions = [
    'SEO Services', 'Web Development', 'Graphic Design', 'Social Media Marketing',
    'Mobile App Development', 'Branding', 'Cloud Services', 'UI/UX Design',
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}&city=${encodeURIComponent(searchCity)}`);
      setShowSuggestions(false);
      setMobileOpen(false);
    }
  };

  const isHome = location.pathname === '/';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled || !isHome
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-100'
        : 'bg-transparent'
    }`}>
      {/* Top bar */}
      {isHome && (
        <div className={`hidden md:block text-xs py-1.5 transition-all duration-300 ${
          isScrolled ? 'bg-blue-600 text-white' : 'bg-blue-900/50 text-blue-100'
        }`}>
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Phone size={11} /> +91 98765 00000
              </span>
              <span>|</span>
              <span>support@rightadsdigital.com</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Sparkles size={11} /> 700+ Verified Businesses
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img
              src={isScrolled || !isHome ? '/logo.png' : '/logo-light.png'}
              alt="Right Ads Logo"
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Search – hidden on homepage hero (hero has its own) */}
          {isHome && isScrolled && (
            <div ref={searchRef} className="hidden flex-1 max-w-xl mx-6 relative lg:flex">
              <form onSubmit={handleSearch} className="w-full flex">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search businesses, services..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                    onFocus={() => setShowSuggestions(true)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900"
                  />
                </div>
                <div className="relative border-l border-slate-200">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="City"
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    className="pl-8 pr-3 py-2.5 text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900 w-28"
                  />
                </div>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-r-xl text-sm font-medium transition-colors">
                  Search
                </button>
              </form>

              {/* Search Suggestions */}
              {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 overflow-hidden">
                  <div className="px-3 py-2 text-xs text-slate-400 font-medium uppercase tracking-wide border-b border-slate-50">
                    Popular Searches
                  </div>
                  {suggestions
                    .filter(s => !searchQuery || s.toLowerCase().includes(searchQuery.toLowerCase()))
                    .slice(0, 5)
                    .map((s, i) => (
                      <button
                        key={i}
                        onClick={() => { setSearchQuery(s); setShowSuggestions(false); }}
                        className="w-full text-left px-3 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2 transition-colors"
                      >
                        <Search size={13} className="text-slate-400" /> {s}
                      </button>
                    ))}
                </div>
              )}
            </div>
          )}

          <div className="hidden lg:flex items-center gap-2">
            <Link
              to="/apply"
              className="ml-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30"
            >
              List Business
            </Link>
            
            {/* User Dropdown / Sign In */}
            {isLoggedIn ? (
              <div className="relative ml-2" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 focus:outline-none cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-blue-600/10 transition-colors">
                    {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
                  </div>
                  <span className={`text-sm font-semibold hidden sm:inline ${
                    isScrolled || !isHome ? 'text-slate-700' : 'text-white/95'
                  }`}>
                    {user?.name?.split(' ')[0]}
                  </span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-scale-in">
                    <div className="px-4 py-2 border-b border-slate-50">
                      <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Logged in as</p>
                      <p className="text-xs font-bold text-slate-800 truncate mt-0.5">{user?.name}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 font-semibold transition-colors"
                    >
                      My Dashboard
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-xs text-blue-600 hover:bg-blue-50 font-bold transition-colors"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                        toast.success('Logged out successfully');
                        navigate('/login');
                      }}
                      className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-xs text-red-500 hover:bg-red-50 font-semibold transition-colors border-t border-slate-50 mt-1 pt-2"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className={`ml-2 flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  isScrolled || !isHome ? 'text-slate-600 hover:text-blue-600' : 'text-white/80 hover:text-white'
                }`}
              >
                <LogIn size={15} /> Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              isScrolled || !isHome ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'
            }`}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 shadow-xl">
          <div className="p-4 space-y-4">
            {/* Mobile Search */}
            {isHome && (
              <form onSubmit={handleSearch} className="space-y-2">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search businesses, services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-xl text-sm font-semibold">
                  Search
                </button>
              </form>
            )}

            {/* Mobile Links */}
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
              <Link 
                to="/apply" 
                onClick={() => setMobileOpen(false)} 
                className="w-full bg-blue-600 text-white text-center py-2.5 rounded-xl text-sm font-semibold"
              >
                List Business
              </Link>
              {isLoggedIn ? (
                <>
                  <Link 
                    to="/dashboard" 
                    onClick={() => setMobileOpen(false)} 
                    className="w-full text-center py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    My Dashboard
                  </Link>
                  {user?.role === 'admin' && (
                    <Link 
                      to="/admin/dashboard" 
                      onClick={() => setMobileOpen(false)} 
                      className="w-full text-center py-2.5 rounded-xl text-sm font-semibold border border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button 
                    onClick={() => {
                      setMobileOpen(false);
                      logout();
                      toast.success('Logged out successfully');
                      navigate('/login');
                    }} 
                    className="w-full text-center py-2.5 rounded-xl text-sm font-semibold border border-red-200 text-red-500 hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link 
                  to="/login" 
                  onClick={() => setMobileOpen(false)} 
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50"
                >
                  <LogIn size={15} /> Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
