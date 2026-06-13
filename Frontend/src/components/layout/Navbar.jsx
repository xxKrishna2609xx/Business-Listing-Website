import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search, MapPin, Menu, X, ChevronDown, Building2,
  Phone, LogIn, Bell, Sparkles
} from 'lucide-react';
import { categories } from '../../data/mockData';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [catDropdown, setCatDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);

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
      <div className={`hidden md:block text-xs py-1.5 transition-all duration-300 ${
        isScrolled || !isHome ? 'bg-blue-600 text-white' : 'bg-blue-900/50 text-blue-100'
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

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
              <Building2 size={20} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <div className={`text-base font-bold leading-tight transition-colors ${
                isScrolled || !isHome ? 'text-slate-900' : 'text-white'
              }`}>
                Right Ads
              </div>
              <div className={`text-[10px] font-medium leading-tight transition-colors ${
                isScrolled || !isHome ? 'text-blue-600' : 'text-blue-200'
              }`}>
                DIGITAL DIRECTORY
              </div>
            </div>
          </Link>

          {/* Desktop Search – hidden on homepage hero (hero has its own) */}
          <div ref={searchRef} className={`hidden flex-1 max-w-xl mx-6 relative ${isScrolled || !isHome ? 'lg:flex' : ''}`}>
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

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            <div className="relative" onMouseEnter={() => setCatDropdown(true)} onMouseLeave={() => setCatDropdown(false)}>
              <button className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isScrolled || !isHome ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'
              }`}>
                Categories <ChevronDown size={14} className={`transition-transform ${catDropdown ? 'rotate-180' : ''}`} />
              </button>
              {catDropdown && (
                <div className="absolute top-full right-0 mt-1 w-64 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 p-2">
                  {categories.map(cat => (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.slug}`}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
                    >
                      <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${cat.color}`} />
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link
              to="/apply"
              className="ml-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30"
            >
              List Business
            </Link>
            <Link
              to="/admin/login"
              className={`ml-1 flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isScrolled || !isHome ? 'text-slate-500 hover:text-slate-700' : 'text-white/70 hover:text-white'
              }`}
            >
              <LogIn size={15} /> Admin
            </Link>
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

            {/* Mobile Links */}
            <div className="space-y-1 border-t border-slate-100 pt-3">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide px-2 mb-2">Categories</p>
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg"
                >
                  <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${cat.color}`} /> {cat.name}
                </Link>
              ))}
            </div>
            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <Link to="/apply" onClick={() => setMobileOpen(false)} className="flex-1 bg-blue-600 text-white text-center py-2.5 rounded-xl text-sm font-semibold">
                List Business
              </Link>
              <Link to="/admin/login" onClick={() => setMobileOpen(false)} className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50">
                <LogIn size={15} /> Admin
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
