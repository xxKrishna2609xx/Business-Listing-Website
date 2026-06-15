import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, MapPin, GraduationCap, Heart, Building2, UtensilsCrossed, Home,
  Dumbbell, ArrowRight, Star, BadgeCheck, Sparkles, TrendingUp, Shield,
  Zap, Users, ChevronRight, Quote, Hotel, Key, Activity, HardHat, Dog,
  BedDouble, Smile, Coins, PartyPopper, Car, Truck, Send, Grid,
  ShoppingBag, Apple, Milk, Pill, Droplet, WashingMachine, Plane, Train, Bus
} from 'lucide-react';
import BusinessCard from '../../components/business/BusinessCard';
import { BusinessCardSkeleton } from '../../components/common/Skeletons';
import { categoryService } from '../../services/categoryService';
import { businessService } from '../../services/businessService';


const iconMap = {
  UtensilsCrossed, Hotel, Sparkles, Home, Heart, GraduationCap, Key,
  Activity, HardHat, Dog, BedDouble, Building2, Smile, Dumbbell, Coins,
  PartyPopper, Car, Truck, Send, Grid
};

const StatCard = ({ icon: Icon, value, label, color }) => (
  <div className="flex flex-col items-center text-center">
    <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center mb-3`}>
      <Icon size={22} className="text-white" />
    </div>
    <div className="text-3xl font-black text-white mb-1">{value}</div>
    <div className="text-blue-200 text-sm">{label}</div>
  </div>
);

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('featured');
  const [categoriesList, setCategoriesList] = useState([]);
  const [businessesList, setBusinessesList] = useState([]);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const allSuggestions = [
    'SEO Services', 'Web Development', 'Graphic Design', 'Social Media Marketing',
    'Mobile App Development', 'Branding', 'Cloud Services', 'UI/UX Design',
    'Content Writing', 'Digital Marketing', 'Logo Design', 'E-commerce',
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [cats, bizes] = await Promise.all([
          categoryService.getCategories(),
          businessService.getBusinesses()
        ]);
        setCategoriesList(cats || []);
        setBusinessesList(bizes || []);
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (searchQuery.length > 0) {
      setSuggestions(
        allSuggestions.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 6)
      );
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery]);

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
    }
  };

  const displayedBusinesses = activeTab === 'featured'
    ? businessesList.filter(b => b.featured)
    : businessesList.slice().reverse().slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* ───────── HERO SECTION ───────── */}
      <section className="hero-gradient relative overflow-hidden pt-16 pb-20 md:pt-28 md:pb-28">
        {/* Decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-700/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative flex flex-col items-center">
          <div className="flex flex-col items-center text-center max-w-3xl" style={{margin: '0 auto'}}>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-5">
              Find The Best{' '}
              <span className="relative">
                <span className="text-yellow-300">Local Businesses</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path d="M1 8C50 3 100 3 150 6C200 9 250 9 299 6" stroke="#FCD34D" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </span>
              {' '}Near You
            </h1>
            <p className="text-blue-100 text-lg md:text-xl mb-10 leading-relaxed">
              Discover 700+ verified businesses across 8+ categories.
              From marketing agencies to IT solutions — all in one place.
            </p>

            {/* Hero Search */}
            <div ref={searchRef} className="relative">
              <form onSubmit={handleSearch}>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-2xl">
                  <div className="flex-1 relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search businesses, services, categories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white text-slate-900 pl-11 pr-4 py-3.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                  <div className="relative sm:w-44">
                    <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="City / Location"
                      value={searchCity}
                      onChange={(e) => setSearchCity(e.target.value)}
                      className="w-full bg-white text-slate-900 pl-10 pr-4 py-3.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 px-8 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-2 justify-center shadow-lg shadow-yellow-400/30 hover:shadow-yellow-400/40 hover:scale-105"
                  >
                    <Search size={16} /> Search
                  </button>
                </div>
              </form>

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-100 z-20 overflow-hidden">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => { setSearchQuery(s); setShowSuggestions(false); }}
                      className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2 transition-colors border-b border-slate-50 last:border-0"
                    >
                      <Search size={13} className="text-slate-400" /> {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Popular tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
              <span className="text-blue-200 text-xs">Trending:</span>
              {['SEO Services', 'Web Development', 'Branding', 'Social Media'].map(tag => (
                <button
                  key={tag}
                  onClick={() => navigate(`/search?query=${encodeURIComponent(tag)}`)}
                  className="text-xs bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-1.5 rounded-full transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="max-w-7xl mx-auto px-4 mt-16">
          <div className="flex flex-wrap justify-center gap-8">
            <StatCard icon={Building2} value="700+" label="Businesses" color="bg-white/20" />
            <StatCard icon={BadgeCheck} value="500+" label="Verified" color="bg-white/20" />
            <StatCard icon={Users} value="10K+" label="Monthly Users" color="bg-white/20" />
            <StatCard icon={Star} value="4.8★" label="Avg Rating" color="bg-white/20" />
          </div>
        </div>
      </section>

      {/* ───────── CATEGORIES SECTION ───────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              <Zap size={12} /> Browse By Category
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">
              Explore Popular <span className="gradient-text">Categories</span>
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm">
              Browse through our curated business categories to find the services you need.
            </p>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-x-2 gap-y-6 md:gap-x-4">
            {categoriesList.map((cat, i) => {
              const Icon = iconMap[cat.icon] || Building2;
              return (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  className="group flex flex-col items-center w-full animate-fade-in"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white border border-slate-150 hover:border-blue-400 rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:shadow-blue-600/5 transition-all duration-200 group-hover:scale-105 cursor-pointer">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center bg-slate-50 border border-slate-50 group-hover:bg-blue-50/50 group-hover:border-blue-100/30 transition-colors">
                      <Icon size={22} className={`${cat.color.split(' ')[0]} group-hover:scale-110 transition-transform duration-200`} />
                    </div>
                  </div>
                  <span className="text-[11px] md:text-xs font-bold text-slate-700 text-center mt-2 leading-tight group-hover:text-blue-600 transition-colors px-1 line-clamp-2">
                    {cat.name}
                  </span>
                </Link>
              );
            })}

            {/* Popular Categories (as the 20th category item) */}
            <Link
              to="/search"
              className="group flex flex-col items-center w-full"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white border border-slate-150 hover:border-blue-400 rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:shadow-blue-600/5 transition-all duration-200 group-hover:scale-105 cursor-pointer">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center bg-blue-600/10 border border-blue-100/20 group-hover:bg-blue-600 group-hover:border-blue-600 transition-colors">
                  <Grid size={22} className="text-blue-600 group-hover:text-white transition-colors" />
                </div>
              </div>
              <span className="text-[11px] md:text-xs font-bold text-slate-700 text-center mt-2 leading-tight group-hover:text-blue-600 transition-colors px-1 line-clamp-2">
                Popular Categories
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ───────── QUICK SERVICES & BOOKINGS SECTION ───────── */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-8">
            
            {/* Row 1: Daily Needs */}
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start lg:items-center">
              {/* Left Column */}
              <div className="w-full lg:w-1/4 pr-4">
                <h3 className="text-2xl font-bold text-slate-900 mb-2 font-sans tracking-tight">
                  Daily Needs
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-3">
                  Find essential daily services and local supplies instantly near you
                </p>
                <Link
                  to="/search?query=Daily+Needs"
                  className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Explore More <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>

              {/* Right Column */}
              <div className="w-full lg:w-3/4 grid grid-cols-3 sm:grid-cols-6 gap-x-2 gap-y-6 md:gap-x-4">
                {[
                  { name: 'Groceries', icon: ShoppingBag, iconColor: 'text-indigo-500 fill-indigo-50', query: 'Groceries' },
                  { name: 'Fruits & Veg', icon: Apple, iconColor: 'text-emerald-500 fill-emerald-50', query: 'Vegetables' },
                  { name: 'Milk & Dairy', icon: Milk, iconColor: 'text-blue-500 fill-blue-50', query: 'Dairy' },
                  { name: 'Medicines', icon: Pill, iconColor: 'text-rose-500 fill-rose-50', query: 'Pharmacy' },
                  { name: 'Water Supplier', icon: Droplet, iconColor: 'text-cyan-500 fill-cyan-50', query: 'Water' },
                  { name: 'Laundry/Dry', icon: WashingMachine, iconColor: 'text-amber-500 fill-amber-50', query: 'Laundry' },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={idx}
                      to={`/search?query=${encodeURIComponent(item.query)}`}
                      className="group flex flex-col items-center w-full text-center"
                    >
                      <div className="w-20 h-20 bg-white border border-slate-200 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:border-blue-500 group-hover:shadow-md group-hover:-translate-y-1 cursor-pointer">
                        <Icon size={32} strokeWidth={1.5} className={`${item.iconColor} transition-transform duration-300 group-hover:scale-110`} />
                      </div>
                      <span className="text-xs sm:text-[13px] font-bold text-slate-700 mt-2 text-center group-hover:text-blue-600 transition-colors leading-tight">
                        {item.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Separator */}
            <div className="border-t border-slate-200 -mx-6 md:-mx-8" />

            {/* Row 2: Travel Bookings */}
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start lg:items-center">
              {/* Left Column */}
              <div className="w-full lg:w-1/4 pr-4">
                <h3 className="text-2xl font-bold text-slate-900 mb-2 font-sans tracking-tight">
                  Travel Bookings
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-3">
                  Instant ticket bookings for your best travel and commute experiences
                </p>
                <Link
                  to="/search?query=Travel"
                  className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Explore More <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>

              {/* Right Column */}
              <div className="w-full lg:w-3/4 grid grid-cols-3 sm:grid-cols-6 gap-x-2 gap-y-6 md:gap-x-4">
                {[
                  { name: 'Flight', icon: Plane, iconColor: 'text-sky-500 fill-sky-50', subtext: 'Powered By\nEasemytrip.com', query: 'Flights' },
                  { name: 'Bus', icon: Bus, iconColor: 'text-red-500 fill-red-50', subtext: 'Affordable Rides', query: 'Bus' },
                  { name: 'Train', icon: Train, iconColor: 'text-indigo-600 fill-indigo-50', subtext: '', query: 'Train' },
                  { name: 'Hotel', icon: Hotel, iconColor: 'text-emerald-500 fill-emerald-50', subtext: 'Budget-friendly\nStay', query: 'Hotels' },
                  { name: 'Car Rentals', icon: Car, iconColor: 'text-blue-500 fill-blue-50', subtext: 'Drive Easy\nAnywhere', query: 'Car Rentals' },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={idx}
                      to={`/search?query=${encodeURIComponent(item.query)}`}
                      className="group flex flex-col items-center w-full text-center"
                    >
                      <div className="w-20 h-20 bg-white border border-slate-200 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:border-blue-500 group-hover:shadow-md group-hover:-translate-y-1 cursor-pointer">
                        <Icon size={32} strokeWidth={1.5} className={`${item.iconColor} transition-transform duration-300 group-hover:scale-110`} />
                      </div>
                      <span className="text-xs sm:text-[13px] font-bold text-slate-700 mt-2 text-center group-hover:text-blue-600 transition-colors leading-tight">
                        {item.name}
                      </span>
                      {item.subtext && (
                        <span className="text-[10px] text-emerald-600 font-semibold mt-1 leading-tight whitespace-pre-line text-center max-w-[96px]">
                          {item.subtext}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ───────── FEATURED / LATEST BUSINESSES ───────── */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold mb-2">
                <Sparkles size={12} /> Top Picks
              </div>
              <h2 className="text-3xl font-black text-slate-900">
                Discover <span className="gradient-text">Businesses</span>
              </h2>
            </div>

            {/* Tabs */}
            <div className="flex bg-white border border-slate-200 rounded-xl p-1 gap-1">
              {[
                { key: 'featured', label: '⭐ Featured' },
                { key: 'latest', label: '🕐 Latest' },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    activeTab === tab.key
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <BusinessCardSkeleton key={i} />)
              : displayedBusinesses.map(biz => (
                  <BusinessCard key={biz.id} business={biz} featured={biz.featured} />
                ))
            }
          </div>

          <div className="text-center mt-8">
            <Link
              to="/search"
              className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-blue-400 text-slate-700 hover:text-blue-600 px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:shadow-lg"
            >
              View All Businesses <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ───────── HOW IT WORKS ───────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-600 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              <TrendingUp size={12} /> Simple Process
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">
              How It <span className="gradient-text">Works</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-16 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-blue-200 via-teal-200 to-blue-200" />

            {[
              {
                step: '01', icon: Search, title: 'Search & Discover',
                desc: 'Search for any service or business by name, category, or city. Browse through 700+ verified businesses.',
                color: 'bg-blue-600',
              },
              {
                step: '02', icon: BadgeCheck, title: 'Compare & Choose',
                desc: 'Read reviews, compare ratings, view business profiles, and contact directly or request a quote.',
                color: 'bg-teal-600',
              },
              {
                step: '03', icon: TrendingUp, title: 'Connect & Grow',
                desc: 'Get in touch via phone, WhatsApp, or quote form. Businesses respond within 24 hours.',
                color: 'bg-indigo-600',
              },
            ].map(({ step, icon: Icon, title, desc, color }) => (
              <div key={step} className="text-center group">
                <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={28} className="text-white" />
                </div>
                <div className="text-xs font-bold text-slate-400 mb-2">STEP {step}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── WHY CHOOSE US ───────── */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold mb-4">
                <Shield size={12} /> Why Choose Us
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-5">
                Trusted by Thousands of{' '}
                <span className="gradient-text">Businesses & Customers</span>
              </h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Right Ads Digital is India's most trusted business directory with a rigorous verification process, real reviews, and a powerful lead-generation system.
              </p>
              <div className="space-y-4">
                {[
                  { icon: BadgeCheck, title: 'Verified Businesses', desc: 'Every listed business is manually reviewed and verified.', color: 'text-teal-600 bg-teal-50' },
                  { icon: Shield, title: 'Secure & Reliable', desc: 'Your data is protected with enterprise-grade security.', color: 'text-blue-600 bg-blue-50' },
                  { icon: Zap, title: 'Instant Lead Connection', desc: 'Connect directly with businesses via WhatsApp or quote forms.', color: 'text-indigo-600 bg-indigo-50' },
                ].map(({ icon: Icon, title, desc, color }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{title}</h4>
                      <p className="text-slate-500 text-sm">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex gap-3">
                <Link to="/apply" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                  List Your Business
                </Link>
                <Link to="/search" className="border border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold text-sm hover:border-blue-400 hover:text-blue-600 transition-colors">
                  Browse Directory
                </Link>
              </div>
            </div>

            {/* Right side cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '700+', label: 'Verified Listings', icon: Building2, color: 'from-blue-500 to-indigo-600' },
                { value: '10K+', label: 'Monthly Visitors', icon: Users, color: 'from-teal-500 to-emerald-600' },
                { value: '8+', label: 'Categories', icon: Zap, color: 'from-violet-500 to-purple-600' },
                { value: '4.8★', label: 'Average Rating', icon: Star, color: 'from-amber-500 to-orange-600' },
              ].map(({ value, label, icon: Icon, color }) => (
                <div key={label} className={`bg-gradient-to-br ${color} p-6 rounded-2xl flex flex-col items-center text-center shadow-lg`}>
                  <Icon size={28} className="text-white/80 mb-2" />
                  <div className="text-3xl font-black text-white">{value}</div>
                  <div className="text-white/80 text-xs mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>



      {/* ───────── FINAL CTA ───────── */}
      <section className="py-16 hero-gradient">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Ready to List Your Business?
          </h2>
          <p className="text-blue-100 mb-8 max-w-xl">
            Join 700+ verified businesses on Right Ads Digital and start receiving leads from thousands of potential customers today.
          </p>
          <Link
            to="/apply"
            className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-slate-900 px-8 py-4 rounded-xl font-bold text-base transition-all duration-200 shadow-xl shadow-yellow-400/20 hover:scale-105"
          >
            List Your Business — It's Free <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
