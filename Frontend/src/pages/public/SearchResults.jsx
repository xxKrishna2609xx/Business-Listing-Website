import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, MapPin, SlidersHorizontal, X, Building2 } from 'lucide-react';
import BusinessCard from '../../components/business/BusinessCard';
import { BusinessCardSkeleton } from '../../components/common/Skeletons';
import { businessService } from '../../services/businessService';
import { categoryService } from '../../services/categoryService';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('');

  // Load categories once on mount
  useEffect(() => {
    categoryService.getCategories().then(setCategories).catch(() => {});
  }, []);

  // Reset selected brand when query or category changes
  useEffect(() => {
    setSelectedBrand('');
  }, [query, selectedCategory]);

  // Compute unique brands client-side from the current results (excluding brand filter)
  const availableBrands = (() => {
    const brandsSet = new Set();
    results.forEach(b => {
      if (b.brands) b.brands.forEach(br => brandsSet.add(br));
    });
    return [...brandsSet];
  })();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const params = { sort: sortBy };
        if (query) params.query = query;
        if (city) params.city = city;
        if (selectedCategory) params.category = selectedCategory;

        let data = await businessService.getBusinesses(params);

        // Client-side brand filter (not yet supported server-side)
        if (selectedBrand) {
          data = data.filter(b => b.brands?.includes(selectedBrand));
        }

        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [query, city, selectedCategory, selectedBrand, sortBy, searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ query, city });
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setCity('');
    setSearchParams({ query });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8faff', paddingTop: 64 }}>
      {/* Search filter bar — sticky below navbar (navbar = 64px fixed) */}
      <div style={{ background: '#fff', borderBottom: '1px solid #EBEBEB', position: 'sticky', top: 64, zIndex: 30, boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '12px 24px' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <div style={{ flex: '1 1 200px', position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
              <input type="text" value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search businesses, services..."
                style={{ width: '100%', paddingLeft: 36, paddingRight: 12, paddingTop: 10, paddingBottom: 10, fontSize: 14, border: '1.5px solid #EBEBEB', borderRadius: 12, outline: 'none', fontFamily: 'inherit', color: '#111', background: '#fff' }} />
            </div>
            <div style={{ flex: '0 0 140px', position: 'relative' }}>
              <MapPin size={13} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
              <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="City"
                style={{ width: '100%', paddingLeft: 30, paddingRight: 10, paddingTop: 10, paddingBottom: 10, fontSize: 14, border: '1.5px solid #EBEBEB', borderRadius: 12, outline: 'none', fontFamily: 'inherit', color: '#111', background: '#fff' }} />
            </div>
            <button type="submit" style={{ padding: '10px 22px', background: '#1a56db', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.2s' }}>
              Search
            </button>
            <button type="button" onClick={() => setShowFilters(!showFilters)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', border: `1.5px solid ${showFilters ? '#1a56db' : '#EBEBEB'}`, borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: showFilters ? '#eff6ff' : '#fff', color: showFilters ? '#1a56db' : '#555', fontFamily: 'inherit', transition: 'all 0.2s' }}>
              <SlidersHorizontal size={14} /> Filters
            </button>
          </form>

          {showFilters && (
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #f0f0f0' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
                <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
                  style={{ fontSize: 13, border: '1.5px solid #EBEBEB', borderRadius: 10, padding: '8px 12px', outline: 'none', fontFamily: 'inherit', color: '#111', background: '#fff', fontWeight: 600 }}>
                  <option value="">All Categories</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                  style={{ fontSize: 13, border: '1.5px solid #EBEBEB', borderRadius: 10, padding: '8px 12px', outline: 'none', fontFamily: 'inherit', color: '#111', background: '#fff', fontWeight: 600 }}>
                  <option value="rating">Highest Rated</option>
                  <option value="reviews">Most Reviews</option>
                  <option value="latest">Newest</option>
                </select>
                {(selectedCategory || city || selectedBrand) && (
                  <button onClick={clearFilters} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 700, color: '#e02020', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                    <X size={13} /> Clear
                  </button>
                )}
              </div>
              {availableBrands.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10, alignItems: 'center' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#aaa' }}>Brands:</span>
                  {['', ...availableBrands].map(brand => (
                    <button key={brand || 'all'} onClick={() => setSelectedBrand(brand)}
                      style={{ padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: 'pointer', border: `1.5px solid ${selectedBrand === brand ? '#1a56db' : '#EBEBEB'}`, background: selectedBrand === brand ? '#1a56db' : '#fff', color: selectedBrand === brand ? '#fff' : '#555', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                      {brand || 'All Brands'}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111' }}>
            {query ? `Results for "${query}"` : 'All Businesses'}
            {city && <span style={{ fontWeight: 400, color: '#717171' }}> in {city}</span>}
          </h1>
          {!loading && <p style={{ fontSize: 13, color: '#717171', marginTop: 4 }}>{results.length} {results.length === 1 ? 'business' : 'businesses'} found</p>}
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20 }}>
            {Array.from({ length: 6 }).map((_, i) => <BusinessCardSkeleton key={i} />)}
          </div>
        ) : results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ width: 72, height: 72, background: '#f0f0f0', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Building2 size={32} style={{ color: '#ccc' }} />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#333', marginBottom: 8 }}>No Businesses Found</h3>
            <p style={{ color: '#717171', fontSize: 14, marginBottom: 24 }}>Try adjusting your search or removing filters.</p>
            <Link to="/" style={{ background: '#1a56db', color: '#fff', padding: '11px 24px', borderRadius: 12, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>Back to Home</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20 }}>
            {results.map(biz => <BusinessCard key={biz.id} business={biz} featured={biz.featured} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
