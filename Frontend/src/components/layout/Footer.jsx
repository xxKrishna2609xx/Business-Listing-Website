import { Link } from 'react-router-dom';
import {
  Building2, Mail, Phone, MapPin, ArrowRight, Heart
} from 'lucide-react';
import { Facebook, Instagram, Linkedin, Twitter } from '../common/SocialIcons';

import { categories } from '../../data/mockData';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* CTA Strip */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-500">
        <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-white text-xl font-bold">Ready to grow your business?</h3>
            <p className="text-blue-100 text-sm mt-1">Join 700+ verified businesses on Right Ads Digital</p>
          </div>
          <Link
            to="/apply"
            className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors shadow-lg"
          >
            List Your Business Free <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-400 rounded-xl flex items-center justify-center">
                <Building2 size={22} className="text-white" />
              </div>
              <div>
                <div className="text-white font-bold text-base">Right Ads Digital</div>
                <div className="text-blue-400 text-xs">Business Directory</div>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-5">
              India's premier digital business directory connecting customers with verified local businesses across all categories.
            </p>
            <div className="flex items-center gap-3">
              {[Facebook, Instagram, Linkedin, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Categories</h4>
            <ul className="space-y-2.5">
              {categories.slice(0, 6).map(cat => (
                <li key={cat.id}>
                  <Link
                    to={`/category/${cat.slug}`}
                    className="text-sm text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-1.5"
                  >
                    <ArrowRight size={12} /> {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Home', to: '/' },
                { label: 'Search Businesses', to: '/search' },
                { label: 'List Your Business', to: '/apply' },
                { label: 'Admin Panel', to: '/admin/login' },
                { label: 'Privacy Policy', to: '#' },
                { label: 'Terms of Service', to: '#' },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.to}
                    className="text-sm text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-1.5"
                  >
                    <ArrowRight size={12} /> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-slate-400">
                <MapPin size={15} className="mt-0.5 text-blue-400 flex-shrink-0" />
                14, Business Hub, Sector 21, Mumbai, Maharashtra 400001
              </li>
              <li>
                <a href="tel:+919876500000" className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-blue-400 transition-colors">
                  <Phone size={15} className="text-blue-400" /> +91 98765 00000
                </a>
              </li>
              <li>
                <a href="mailto:support@rightadsdigital.com" className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-blue-400 transition-colors">
                  <Mail size={15} className="text-blue-400" /> support@rightadsdigital.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>© 2024 Right Ads Digital. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart size={11} className="text-rose-400 fill-rose-400" /> by Right Ads Digital Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
