import { Link } from 'react-router-dom';
import { MapPin, Star, BadgeCheck, Phone, ExternalLink, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const BusinessCard = ({ business, featured = false }) => {
  const { _id, id, businessName, city, state, categoryName, subcategoryName,
    logoUrl, description, rating, reviewCount, verified, phone, brands } = business;

  const { user, isLoggedIn, toggleBookmark } = useAuth();
  const isBookmarked = user?.bookmarks?.includes(id) || false;

  const handleBookmark = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (!isLoggedIn) { toast.error('Please sign in to save listings.'); return; }
    toggleBookmark(id);
    toast.success(isBookmarked ? 'Removed from bookmarks' : 'Saved to bookmarks');
  };

  return (
    <div style={{
      background: '#fff',
      border: featured ? '1.5px solid #bfdbfe' : '1.5px solid #EBEBEB',
      borderRadius: 18,
      overflow: 'hidden',
      boxShadow: featured ? '0 4px 20px rgba(26,86,219,0.08)' : '0 1px 6px rgba(0,0,0,0.04)',
      transition: 'transform 0.25s ease, box-shadow 0.25s ease',
      position: 'relative',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(26,86,219,0.12)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = featured ? '0 4px 20px rgba(26,86,219,0.08)' : '0 1px 6px rgba(0,0,0,0.04)'; }}
    >
      {/* Bookmark */}
      <button onClick={handleBookmark} style={{
        position: 'absolute', right: 12, top: featured ? 44 : 12, zIndex: 10,
        width: 32, height: 32, borderRadius: 10,
        background: 'rgba(255,255,255,0.9)', border: '1px solid #EBEBEB',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.2s',
      }}>
        <Heart size={14} style={{ color: isBookmarked ? '#e02020' : '#aaa', fill: isBookmarked ? '#e02020' : 'none', transition: 'all 0.2s' }} />
      </button>

      {/* Featured banner */}
      {featured && (
        <div style={{
          background: 'linear-gradient(90deg,#1a56db,#1d4ed8)',
          padding: '7px 16px', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#06b6d4', flexShrink: 0 }} />
          <span style={{ color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em' }}>FEATURED</span>
        </div>
      )}

      <div style={{ padding: '18px 18px 16px' }}>
        {/* Header */}
<<<<<<< HEAD
        <div className="flex items-start gap-3 mb-3">
          <div className="relative flex-shrink-0">
            <img
              src={
                logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  businessName
                )}&background=2563eb&color=fff&size=64&rounded=false`
                
              }
              alt={businessName}
              className="w-14 h-14 rounded-xl object-cover border-2 border-slate-100"
              onError={(e) => {
                e.target.src =
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    businessName
                  )}&background=2563eb&color=fff&size=64&rounded=false`;
              }}
=======
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <img src={logoUrl} alt={businessName}
              style={{ width: 52, height: 52, borderRadius: 12, objectFit: 'cover', border: '1.5px solid #EBEBEB' }}
              onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(businessName)}&background=1a56db&color=fff&size=64`; }}
>>>>>>> a4297bdae2499bb3b73fbce6bc1a29aa71b14594
            />
            {verified && (
              <div style={{ position: 'absolute', bottom: -3, right: -3, background: '#06b6d4', borderRadius: '50%', padding: 2 }}>
                <BadgeCheck size={11} color="#fff" />
              </div>
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ fontWeight: 800, color: '#111', fontSize: 15, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {businessName}
            </h3>
            <span style={{
              display: 'inline-block', marginTop: 4,
              fontSize: 11, fontWeight: 600, color: '#1a56db',
              background: '#eff6ff', padding: '2px 10px', borderRadius: 20,
            }}>
              {subcategoryName || categoryName}
            </span>
          </div>
        </div>

        {/* Description */}
        <p style={{ fontSize: 13, color: '#717171', lineHeight: 1.55, marginBottom: 10,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {description}
        </p>

        {/* Brands */}
        {brands?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
            {brands.slice(0, 3).map((b, i) => (
              <span key={i} style={{ fontSize: 10, fontWeight: 700, border: '1px solid #EBEBEB', borderRadius: 6, padding: '2px 7px', color: '#555' }}>{b}</span>
            ))}
            {brands.length > 3 && <span style={{ fontSize: 10, color: '#aaa', alignSelf: 'center' }}>+{brands.length - 3}</span>}
          </div>
        )}

        {/* Meta */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#717171' }}>
            <MapPin size={12} style={{ color: '#1a56db' }} />
            {city}, {state}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Star size={12} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
            <span style={{ fontSize: 12, fontWeight: 800, color: '#111' }}>{rating}</span>
            <span style={{ fontSize: 11, color: '#aaa' }}>({reviewCount})</span>
          </div>
        </div>

<<<<<<< HEAD
        {/* CTA Row */}
        <div className="flex gap-2">
          <Link
            to={`/business/${business._id}`}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1"
=======
        {/* CTA */}
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to={`/business/${id}`} style={{
            flex: 1, background: '#1a56db', color: '#fff',
            textAlign: 'center', padding: '9px 0', borderRadius: 10,
            fontSize: 12, fontWeight: 700, textDecoration: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            transition: 'background 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#1648c0'}
            onMouseLeave={e => e.currentTarget.style.background = '#1a56db'}
>>>>>>> a4297bdae2499bb3b73fbce6bc1a29aa71b14594
          >
            View Details <ExternalLink size={11} />
          </Link>
          <a href={`tel:${phone}`} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 36, border: '1.5px solid #EBEBEB', borderRadius: 10,
            color: '#717171', transition: 'border-color 0.2s, color 0.2s',
            textDecoration: 'none',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#06b6d4'; e.currentTarget.style.color = '#06b6d4'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#EBEBEB'; e.currentTarget.style.color = '#717171'; }}
          >
            <Phone size={13} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
