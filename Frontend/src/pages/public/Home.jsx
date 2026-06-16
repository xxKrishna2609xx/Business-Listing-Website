import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, MapPin, Building2, UtensilsCrossed, Home,
  Dumbbell, ArrowRight, Star, BadgeCheck, Shield,
  Zap, Users, ChevronRight, Hotel, Key, Activity, HardHat, Dog,
  BedDouble, Smile, Coins, PartyPopper, Car, Truck, Send, Grid,
  ShoppingBag, Apple, Milk, Pill, Droplet, WashingMachine, Plane, Train, Bus,
  GraduationCap, Heart, Sparkles, ChevronLeft, Locate
} from 'lucide-react';
import BusinessCard from '../../components/business/BusinessCard';
import { BusinessCardSkeleton } from '../../components/common/Skeletons';
import { categoryService } from '../../services/categoryService';
import { businessService } from '../../services/businessService';
import { metaService } from '../../services/metaService';

const iconMap = {
  UtensilsCrossed, Hotel, Sparkles, Home, Heart, GraduationCap, Key,
  Activity, HardHat, Dog, BedDouble, Building2, Smile, Dumbbell, Coins,
  PartyPopper, Car, Truck, Send, Grid
};

const quickServiceIconMap = {
  ShoppingBag, Apple, Milk, Pill, Droplet, WashingMachine, Plane, Bus, Train, Hotel, Car
};

/* ── Banner images (Unsplash CDN, free-to-use) ── */
const BANNERS = [
  {
    url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1400&q=80',
    title: 'Find Trusted Businesses Near You',
    sub: 'Discover 700+ verified local businesses across India',
  },
  {
    url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1400&q=80',
    title: 'Connect with Local Service Experts',
    sub: 'From home repairs to healthcare — all in one place',
  },
  {
    url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1400&q=80',
    title: 'Grow Your Business with Right Ads',
    sub: 'List your business free and reach thousands of customers',
  },
  {
    url: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1400&q=80',
    title: 'India\'s Premier Business Directory',
    sub: 'Restaurants, Hotels, Education, Health and more',
  },
  {
    url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1400&q=80',
    title: 'Real Reviews. Verified Listings.',
    sub: 'Make informed decisions with genuine customer feedback',
  },
];

/* ── Location API via pincode ─────────────────── */
async function detectLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) { resolve(null); return; }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude: lat, longitude: lon } = pos.coords;
          const res  = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
          );
          const data = await res.json();
          const city    = data.address?.city || data.address?.town || data.address?.village || '';
          const pincode = data.address?.postcode || '';
          resolve({ city, pincode });
        } catch { resolve(null); }
      },
      () => resolve(null),
      { timeout: 6000 }
    );
  });
}



export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [locLoading, setLocLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('featured');
  const [bannerIdx, setBannerIdx] = useState(0);
  const [bannerAnim, setBannerAnim] = useState('slide-in');
  const [categoriesList, setCategoriesList] = useState([]);
  const [businessesList, setBusinessesList] = useState([]);
  const [bannersList, setBannersList] = useState([]);
  const [quickServices, setQuickServices] = useState([]);
  const [stats, setStats] = useState({
    listingsCount: 0,
    verifiedCount: 0,
    categoriesCount: 0,
    avgRating: '4.8★',
    monthlyUsers: '10K+'
  });
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const bannerTimer = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [cats, bizes, banners, services, publicStats] = await Promise.all([
          categoryService.getCategories(),
          businessService.getBusinesses(),
          metaService.getBanners(),
          metaService.getQuickServices(),
          metaService.getPublicStats()
        ]);
        setCategoriesList(cats || []);
        setBusinessesList(bizes || []);
        setBannersList(banners || []);
        setQuickServices(services || []);
        setStats(publicStats || {
          listingsCount: 0,
          verifiedCount: 0,
          categoriesCount: 0,
          avgRating: '4.8★',
          monthlyUsers: '10K+'
        });
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  /* ── Auto-advance banner every 5s ── */
  const advanceBanner = (dir = 1) => {
    if (bannersList.length <= 1) return;
    setBannerAnim('slide-out');
    setTimeout(() => {
      setBannerIdx(i => (i + dir + bannersList.length) % bannersList.length);
      setBannerAnim('slide-in');
    }, 320);
  };

  useEffect(() => {
    if (bannersList.length > 1) {
      bannerTimer.current = setInterval(() => advanceBanner(1), 5000);
    }
    return () => clearInterval(bannerTimer.current);
  }, [bannersList]);

  const goBanner = (dir) => {
    if (bannersList.length <= 1) return;
    clearInterval(bannerTimer.current);
    advanceBanner(dir);
    bannerTimer.current = setInterval(() => advanceBanner(1), 5000);
  };

  /* ── Detect location ── */
  const handleDetectLocation = async () => {
    setLocLoading(true);
    const loc = await detectLocation();
    if (loc) {
      if (loc.city)    setSearchCity(loc.city);
      if (loc.pincode) setPincode(loc.pincode);
    }
    setLocLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}&city=${encodeURIComponent(searchCity)}`);
    }
  };

  const displayedBusinesses = activeTab === 'featured'
    ? businessesList.filter(b => b.featured)
    : businessesList.slice().reverse().slice(0, 6);

  const banner = bannersList[bannerIdx] || {
    url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1400&q=80',
    title: 'Find Trusted Businesses Near You',
    sub: 'Discover 700+ verified local businesses across India'
  };

  const dailyNeedsList = quickServices.filter(item => item.section === 'Daily Needs');
  const travelBookingsList = quickServices.filter(item => item.section === 'Travel Bookings');

  return (
    <div className="min-h-screen" style={{ background: '#fff' }}>

      {/* ══════════ HERO WITH AUTO-SLIDER ══════════ */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: 520 }}>

        {/* Background image */}
        <div key={bannerIdx} style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${banner.url})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          animation: `${bannerAnim} 0.38s ease`,
        }} />
        {/* Dark overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,20,60,0.72) 0%, rgba(10,20,60,0.55) 100%)' }} />

        {/* Arrow controls */}
        {[{ dir: -1, side: 'left', Icon: ChevronLeft }, { dir: 1, side: 'right', Icon: ChevronRight }].map(({ dir, side, Icon }) => (
          <button key={side} onClick={() => goBanner(dir)} style={{
            position: 'absolute', top: '50%', [side]: 20,
            transform: 'translateY(-50%)',
            width: 40, height: 40, borderRadius: '50%',
            background: 'rgba(255,255,255,0.18)', border: '1.5px solid rgba(255,255,255,0.3)',
            color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(4px)', zIndex: 10, transition: 'background 0.2s',
          }}>
            <Icon size={20} />
          </button>
        ))}

        {/* Dots */}
        <div style={{ position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 7, zIndex: 10 }}>
          {bannersList.map((_, i) => (
            <button key={i} onClick={() => { clearInterval(bannerTimer.current); setBannerIdx(i); bannerTimer.current = setInterval(() => advanceBanner(1), 5000); }} style={{
              width: i === bannerIdx ? 22 : 8, height: 8, borderRadius: 4,
              background: i === bannerIdx ? '#fff' : 'rgba(255,255,255,0.45)',
              border: 'none', cursor: 'pointer', transition: 'all 0.3s',
            }} />
          ))}
        </div>

        {/* Hero content */}
        <div style={{ position: 'relative', zIndex: 5, maxWidth: 1280, margin: '0 auto', padding: '80px 24px 100px', textAlign: 'center' }}>
          <h1 style={{
            fontSize: 'clamp(28px,5vw,56px)', fontWeight: 900, color: '#fff',
            lineHeight: 1.15, marginBottom: 16,
            animation: 'fadeUp 0.5s ease both',
          }}>
            {banner.title}
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.82)', marginBottom: 40, animation: 'fadeUp 0.6s ease both' }}>
            {banner.sub}
          </p>

          {/* Search form */}
          <form onSubmit={handleSearch} ref={searchRef} style={{ animation: 'fadeUp 0.7s ease both' }}>
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 8,
              background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)',
              border: '1.5px solid rgba(255,255,255,0.25)',
              borderRadius: 18, padding: 8, maxWidth: 780, margin: '0 auto',
            }}>
              {/* Query */}
              <div style={{ flex: '1 1 200px', position: 'relative', minWidth: 0 }}>
                <Search size={16} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
                <input
                  type="text"
                  placeholder="Search businesses, services..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%', paddingLeft: 38, paddingRight: 12, paddingTop: 12, paddingBottom: 12,
                    fontSize: 14, border: 'none', borderRadius: 12, outline: 'none',
                    background: '#fff', color: '#111', fontFamily: 'inherit',
                  }}
                />
              </div>
              {/* City + pincode */}
              <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 6, background: '#fff', borderRadius: 12, padding: '0 12px' }}>
                <MapPin size={14} style={{ color: '#888', flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="City"
                  value={searchCity}
                  onChange={e => setSearchCity(e.target.value)}
                  style={{ width: 90, border: 'none', outline: 'none', fontSize: 14, background: 'transparent', color: '#111', fontFamily: 'inherit' }}
                />
                <div style={{ width: 1, height: 16, background: '#ddd' }} />
                <input
                  type="text"
                  placeholder="Pincode"
                  value={pincode}
                  onChange={e => setPincode(e.target.value)}
                  style={{ width: 72, border: 'none', outline: 'none', fontSize: 14, background: 'transparent', color: '#111', fontFamily: 'inherit' }}
                />
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  title="Detect my location"
                  style={{
                    width: 28, height: 28, borderRadius: '50%', border: '1.5px solid #DDDDDD',
                    background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: locLoading ? '#1a56db' : '#555', flexShrink: 0, transition: 'color 0.2s',
                  }}
                >
                  <Locate size={13} style={{ animation: locLoading ? 'spin 1s linear infinite' : 'none' }} />
                </button>
              </div>
              <button
                type="submit"
                style={{
                  padding: '12px 28px', background: '#1a56db', color: '#fff',
                  border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 15,
                  cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0,
                  transition: 'background 0.2s, transform 0.15s',
                  display: 'flex', alignItems: 'center', gap: 7,
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#1648c0'}
                onMouseLeave={e => e.currentTarget.style.background = '#1a56db'}
              >
                <Search size={16} /> Search
              </button>
            </div>
          </form>

          {/* Trending tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 20 }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>Trending:</span>
            {categoriesList.slice(0, 5).map(cat => (
              <button key={cat.id} onClick={() => navigate(`/search?category=${encodeURIComponent(cat.slug)}`)}
                style={{
                  fontSize: 12, background: 'rgba(255,255,255,0.15)', color: '#fff',
                  border: '1px solid rgba(255,255,255,0.3)', padding: '5px 14px',
                  borderRadius: 20, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.2s',
                }}>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ STATS STRIP ══════════ */}
      <section style={{ background: '#1a56db', padding: '20px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px 60px' }}>
          {[
            { icon: Building2, value: `${stats.listingsCount}+`,  label: 'Businesses'   },
            { icon: BadgeCheck,value: `${stats.verifiedCount}+`,  label: 'Verified'     },
            { icon: Users,     value: stats.monthlyUsers,         label: 'Monthly Users'},
            { icon: Star,      value: stats.avgRating,            label: 'Avg Rating'   },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Icon size={22} color="rgba(255,255,255,0.7)" />
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>{value}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ CATEGORIES GRID ══════════ */}
      <section style={{ padding: '60px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#eff6ff', color: '#1a56db', padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, marginBottom: 12 }}>
              <Zap size={12} /> Browse By Category
            </div>
            <h2 style={{ fontSize: 'clamp(24px,4vw,38px)', fontWeight: 900, color: '#111', margin: 0 }}>
              Explore Popular Categories
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))', gap: '24px 16px' }}>
            {categoriesList.map((cat, i) => {
              const Icon = iconMap[cat.icon] || Building2;
              return (
                <Link key={cat.id} to={`/category/${cat.slug}`}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', animation: `fadeUp 0.4s ease ${i * 0.04}s both` }}>
                  <div style={{
                    width: 72, height: 72,
                    border: '1.5px solid #EBEBEB', borderRadius: 18,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: '#fff', cursor: 'pointer', transition: 'all 0.2s',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#1a56db'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(26,86,219,0.12)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#EBEBEB'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'; }}
                  >
                    <Icon size={28} style={{ color: '#1a56db' }} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#333', textAlign: 'center', marginTop: 8, lineHeight: 1.3 }}>
                    {cat.name}
                  </span>
                </Link>
              );
            })}

            {/* All categories tile */}
            <Link to="/search" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none' }}>
              <div style={{
                width: 72, height: 72, border: '1.5px solid #1a56db', borderRadius: 18,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#eff6ff', cursor: 'pointer', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#1a56db'; e.currentTarget.querySelector('svg').style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.querySelector('svg').style.color = '#1a56db'; }}
              >
                <Grid size={28} style={{ color: '#1a56db', transition: 'color 0.2s' }} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#333', textAlign: 'center', marginTop: 8, lineHeight: 1.3 }}>
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
                {dailyNeedsList.map((item, idx) => {
                  const Icon = quickServiceIconMap[item.icon] || ShoppingBag;
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
                {travelBookingsList.map((item, idx) => {
                  const Icon = quickServiceIconMap[item.icon] || Plane;
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

      {/* ══════════ FEATURED BUSINESSES ══════════ */}
      <section style={{ padding: '60px 24px', background: '#f8faff' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 32 }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#eff6ff', color: '#1a56db', padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, marginBottom: 10 }}>
                <Sparkles size={12} /> Top Picks
              </div>
              <h2 style={{ fontSize: 32, fontWeight: 900, color: '#111', margin: 0 }}>Discover Businesses</h2>
            </div>
            <div style={{ display: 'flex', background: '#fff', border: '1.5px solid #EBEBEB', borderRadius: 14, padding: 4, gap: 4 }}>
              {[{ key: 'featured', label: 'Featured' }, { key: 'latest', label: 'Latest' }].map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                  padding: '7px 18px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                  border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                  background: activeTab === tab.key ? '#1a56db' : 'transparent',
                  color: activeTab === tab.key ? '#fff' : '#717171',
                  transition: 'all 0.2s',
                }}>{tab.label}</button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <BusinessCardSkeleton key={i} />)
              : displayedBusinesses.map(biz => <BusinessCard key={biz.id} business={biz} featured={biz.featured} />)
            }
          </div>

          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <Link to="/search" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 28px', border: '1.5px solid #DDDDDD', borderRadius: 14,
              color: '#333', fontWeight: 600, fontSize: 14, textDecoration: 'none',
              background: '#fff', transition: 'border-color 0.2s, color 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#1a56db'; e.currentTarget.style.color = '#1a56db'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#DDDDDD'; e.currentTarget.style.color = '#333'; }}
            >
              View All Businesses <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════ HOW IT WORKS ══════════ */}
      <section style={{ padding: '60px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 34, fontWeight: 900, color: '#111' }}>How It Works</h2>
            <p style={{ color: '#717171', marginTop: 8 }}>Get started in three simple steps</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 32 }}>
            {[
              { step: '01', icon: Search,    title: 'Search & Discover',  desc: 'Search for any service or business by name, category, or city.', color: '#1a56db' },
              { step: '02', icon: BadgeCheck,title: 'Compare & Choose',   desc: 'Read reviews, compare ratings, view business profiles.', color: '#06b6d4' },
              { step: '03', icon: Zap,       title: 'Connect & Grow',     desc: 'Get in touch via phone, WhatsApp, or quote form within 24 hours.', color: '#1a56db' },
            ].map(({ step, icon: Icon, title, desc, color }) => (
              <div key={step} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 18, background: color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px', boxShadow: `0 8px 24px ${color}33`,
                  transition: 'transform 0.2s',
                }}>
                  <Icon size={28} color="#fff" />
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#aaa', marginBottom: 6 }}>STEP {step}</div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: '#111', marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 14, color: '#717171', lineHeight: 1.6, maxWidth: 260, margin: '0 auto' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ WHY US ══════════ */}
      <section style={{ padding: '60px 24px', background: '#f0f6ff' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 40, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#dbeafe', color: '#1a56db', padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, marginBottom: 16 }}>
              <Shield size={12} /> Why Choose Us
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 900, color: '#111', lineHeight: 1.2, marginBottom: 16 }}>
              Trusted by Thousands of Businesses & Customers
            </h2>
            <p style={{ color: '#717171', lineHeight: 1.7, marginBottom: 28 }}>
              Right Ads Digital is India's most trusted business directory with a rigorous verification process, real reviews, and a powerful lead-generation system.
            </p>
            {[
              { icon: BadgeCheck, title: 'Verified Businesses', desc: 'Every listing is manually reviewed and verified.', color: '#06b6d4' },
              { icon: Shield,     title: 'Secure & Reliable',   desc: 'Your data is protected with enterprise-grade security.', color: '#1a56db' },
              { icon: Zap,        title: 'Instant Connection',  desc: 'Connect directly via WhatsApp or quote forms.', color: '#1a56db' },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>{title}</div>
                  <div style={{ fontSize: 13, color: '#717171' }}>{desc}</div>
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
              <Link to="/apply" style={{ background: '#1a56db', color: '#fff', padding: '12px 24px', borderRadius: 12, fontWeight: 700, fontSize: 14, textDecoration: 'none', transition: 'background 0.2s' }}>
                List Your Business
              </Link>
              <Link to="/search" style={{ border: '1.5px solid #DDDDDD', color: '#333', padding: '12px 24px', borderRadius: 12, fontWeight: 600, fontSize: 14, textDecoration: 'none', transition: 'border-color 0.2s' }}>
                Browse Directory
              </Link>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { value: '700+', label: 'Verified Listings', icon: Building2, bg: 'linear-gradient(135deg,#1a56db,#1e40af)' },
              { value: '10K+', label: 'Monthly Visitors',  icon: Users,     bg: 'linear-gradient(135deg,#06b6d4,#0891b2)' },
              { value: '19+',  label: 'Categories',        icon: Zap,       bg: 'linear-gradient(135deg,#1a56db,#7c3aed)' },
              { value: '4.8★', label: 'Average Rating',    icon: Star,      bg: 'linear-gradient(135deg,#1a56db,#0891b2)' },
            ].map(({ value, label, icon: Icon, bg }) => (
              <div key={label} style={{ background: bg, borderRadius: 20, padding: '28px 20px', textAlign: 'center', boxShadow: '0 4px 20px rgba(26,86,219,0.2)' }}>
                <Icon size={26} color="rgba(255,255,255,0.7)" style={{ marginBottom: 8 }} />
                <div style={{ fontSize: 28, fontWeight: 900, color: '#fff' }}>{value}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>


      <style>{`
        @keyframes fadeUp  { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:none; } }
        @keyframes slide-in { from { opacity:0; transform:scale(1.04); } to { opacity:1; transform:none; } }
        @keyframes slide-out{ from { opacity:1; } to { opacity:0; } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
