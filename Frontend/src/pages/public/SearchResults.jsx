import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, MapPin, Filter, ChevronDown, SlidersHorizontal, X, Building2 } from 'lucide-react';
import BusinessCard from '../../components/business/BusinessCard';
import { BusinessCardSkeleton } from '../../components/common/Skeletons';
import { businesses, categories } from '../../data/mockData';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      let filtered = businesses.filter(b => b.status === 'APPROVED');

      if (query) {
        filtered = filtered.filter(b =>
          b.businessName.toLowerCase().includes(query.toLowerCase()) ||
          b.description.toLowerCase().includes(query.toLowerCase()) ||
          b.services?.some(s => s.toLowerCase().includes(query.toLowerCase())) ||
          b.categoryName.toLowerCase().includes(query.toLowerCase())
        );
      }
      if (city) {
        filtered = filtered.filter(b => b.city.toLowerCase().includes(city.toLowerCase()));
      }
      if (selectedCategory) {
        filtered = filtered.filter(b => b.categoryId === selectedCategory);
      }

      if (sortBy === 'rating') filtered.sort((a, b) => b.rating - a.rating);
      else if (sortBy === 'reviews') filtered.sort((a, b) => b.reviewCount - a.reviewCount);
      else if (sortBy === 'latest') filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setResults(filtered);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [query, city, selectedCategory, sortBy, searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ query, city });
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setCity('');
    setSearchParams({ query });
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28">
      {/* Search Bar */}
      <div className="bg-white border-b border-slate-100 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search businesses, services..."
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative sm:w-40">
              <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button type="submit" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 border px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
            >
              <SlidersHorizontal size={15} /> Filters
            </button>
          </form>

          {/* Filters panel */}
          {showFilters && (
            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-3 items-center">
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
                >
                  <option value="rating">Sort: Highest Rated</option>
                  <option value="reviews">Sort: Most Reviews</option>
                  <option value="latest">Sort: Newest</option>
                </select>
              </div>
              {(selectedCategory || city) && (
                <button onClick={clearFilters} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition-colors">
                  <X size={14} /> Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Result Count */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {query ? `Results for "${query}"` : 'All Businesses'}
              {city && <span className="text-slate-500 font-normal"> in {city}</span>}
            </h1>
            {!loading && (
              <p className="text-sm text-slate-500 mt-0.5">
                {results.length} {results.length === 1 ? 'business' : 'businesses'} found
              </p>
            )}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <BusinessCardSkeleton key={i} />)}
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Building2 size={36} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">No Businesses Found</h3>
            <p className="text-slate-500 text-sm mb-6">Try adjusting your search or removing filters.</p>
            <Link to="/" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {results.map(biz => (
              <BusinessCard key={biz.id} business={biz} featured={biz.featured} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
