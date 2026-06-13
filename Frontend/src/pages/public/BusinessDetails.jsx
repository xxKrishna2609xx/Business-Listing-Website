import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin, Phone, Mail, Globe, BadgeCheck, Star,
  MessageCircle, Send, ChevronRight, Building2, Shield, Sparkles, CheckCircle, Heart
} from 'lucide-react';
import { Facebook, Instagram, Linkedin, Twitter } from '../../components/common/SocialIcons';

import LeadFormModal from '../../components/business/LeadFormModal';
import { businesses } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const BusinessDetails = () => {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const { user, isLoggedIn, toggleBookmark } = useAuth();
  const isBookmarked = user?.bookmarks?.includes(id) || false;

  const handleBookmarkToggle = () => {
    if (!isLoggedIn) {
      toast.error('Please sign in to save listings.');
      return;
    }
    toggleBookmark(id);
    toast.success(isBookmarked ? 'Removed from bookmarks' : 'Saved to bookmarks');
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const biz = businesses.find(b => b.id === id);
      setBusiness(biz || null);
      setLoading(false);
    }, 800);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-28">
        <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse space-y-4">
          <div className="h-48 skeleton rounded-2xl" />
          <div className="h-6 skeleton rounded-lg w-1/3" />
          <div className="h-4 skeleton rounded-lg w-1/2" />
          <div className="h-4 skeleton rounded-lg w-full" />
          <div className="h-4 skeleton rounded-lg w-4/5" />
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-slate-50 pt-28 flex items-center justify-center">
        <div className="text-center">
          <Building2 size={60} className="text-slate-200 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-700">Business Not Found</h2>
          <Link to="/" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const whatsappUrl = `https://wa.me/${business.phone.replace(/\D/g, '')}?text=Hi, I found your listing on Right Ads Digital. I'm interested in your services.`;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-2 text-xs text-slate-400">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <ChevronRight size={12} />
          <Link to={`/category/${business.categoryId}`} className="hover:text-blue-600">{business.categoryName}</Link>
          <ChevronRight size={12} />
          <span className="text-slate-700">{business.businessName}</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Main Info */}
          <div className="lg:col-span-2 space-y-5">
            {/* Header Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              {/* Cover */}
              <div className={`h-32 bg-gradient-to-r from-blue-600 to-teal-500 relative`}>
                {business.featured && (
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-yellow-400 text-slate-900 px-3 py-1 rounded-full text-xs font-bold">
                    <Sparkles size={11} /> FEATURED
                  </div>
                )}
              </div>

              <div className="px-5 pb-5">
                <div className="flex items-end gap-4 -mt-8 mb-4">
                  <div className="relative">
                    <img
                      src={business.logoUrl}
                      alt={business.businessName}
                      className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg object-cover"
                    />
                    {business.verified && (
                      <div className="absolute -bottom-1.5 -right-1.5 bg-teal-500 rounded-full p-1 shadow">
                        <BadgeCheck size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 pb-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-xl font-black text-slate-900">{business.businessName}</h1>
                      {business.verified && (
                        <span className="flex items-center gap-1 bg-teal-50 text-teal-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-teal-200">
                          <BadgeCheck size={11} /> Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium border border-blue-100">
                        {business.subcategoryName || business.categoryName}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star size={13} className="text-amber-400 fill-amber-400" />
                        <span className="text-sm font-bold text-slate-800">{business.rating}</span>
                        <span className="text-xs text-slate-400">({business.reviewCount} reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-600 text-sm leading-relaxed">{business.description}</p>

                {/* Location */}
                <div className="flex items-center gap-1.5 mt-3 text-sm text-slate-500">
                  <MapPin size={14} className="text-blue-400" />
                  {business.address}, {business.city}, {business.state}
                </div>
              </div>
            </div>

            {/* Services */}
            {business.services?.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle size={16} className="text-teal-500" /> Services Offered
                </h2>
                <div className="flex flex-wrap gap-2">
                  {business.services.map((service, i) => (
                    <span key={i} className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-blue-600 hover:text-white transition-colors cursor-default">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Brands Serviced */}
            {business.brands?.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Shield size={16} className="text-blue-500" /> Brands Serviced
                </h2>
                <div className="flex flex-wrap gap-2">
                  {business.brands.map((brand, i) => (
                    <span key={i} className="bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-1.5 rounded-xl text-xs font-semibold hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors cursor-default">
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social */}
            {business.socialMediaLinks && Object.keys(business.socialMediaLinks).length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <h2 className="font-bold text-slate-900 mb-4">Social Media</h2>
                <div className="flex gap-3">
                  {[
                    { key: 'facebook', Icon: Facebook, color: 'hover:bg-blue-600' },
                    { key: 'instagram', Icon: Instagram, color: 'hover:bg-pink-500' },
                    { key: 'linkedin', Icon: Linkedin, color: 'hover:bg-blue-700' },
                    { key: 'twitter', Icon: Twitter, color: 'hover:bg-sky-500' },
                  ].map(({ key, Icon, color }) => business.socialMediaLinks[key] && (
                    <a
                      key={key}
                      href={business.socialMediaLinks[key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 bg-slate-100 ${color} hover:text-white text-slate-600 rounded-xl flex items-center justify-center transition-colors`}
                    >
                      <Icon size={18} />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Contact Sidebar */}
          <div className="space-y-4">
            {/* CTA Buttons */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
              <button
                onClick={() => setLeadModalOpen(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 cursor-pointer"
              >
                <Send size={15} /> Request a Quote
              </button>
              <button
                onClick={handleBookmarkToggle}
                className={`w-full py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 border cursor-pointer ${
                  isBookmarked
                    ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white hover:bg-slate-50'
                }`}
              >
                <Heart size={15} className={isBookmarked ? 'fill-red-500 text-red-500' : ''} />
                {isBookmarked ? 'Saved to Bookmarks' : 'Save / Bookmark'}
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl text-sm font-bold transition-colors"
              >
                <MessageCircle size={15} /> WhatsApp
              </a>
              <a
                href={`tel:${business.phone}`}
                className="w-full flex items-center justify-center gap-2 border border-slate-200 hover:border-blue-400 text-slate-700 hover:text-blue-600 py-3 rounded-xl text-sm font-semibold transition-colors"
              >
                <Phone size={15} /> {business.phone}
              </a>
            </div>

            {/* Contact Details */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <h3 className="font-bold text-slate-900 text-sm mb-4">Business Details</h3>
              <div className="space-y-3">
                {business.email && (
                  <div className="flex items-start gap-2.5">
                    <Mail size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-600 break-all">{business.email}</span>
                  </div>
                )}
                {business.website && (
                  <div className="flex items-start gap-2.5">
                    <Globe size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
                    <a href={business.website} target="_blank" rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline break-all">
                      {business.website}
                    </a>
                  </div>
                )}
                <div className="flex items-start gap-2.5">
                  <MapPin size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-600">{business.address}, {business.city}, {business.state}</span>
                </div>
              </div>
            </div>

            {/* Verified Badge */}
            {business.verified && (
              <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield size={18} className="text-white" />
                </div>
                <div>
                  <div className="font-bold text-teal-800 text-sm">Verified Business</div>
                  <div className="text-teal-600 text-xs">Manually verified by our team</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <LeadFormModal
        business={business}
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
      />
    </div>
  );
};

export default BusinessDetails;
