import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowRight, Heart } from 'lucide-react';
import { Facebook, Instagram, Linkedin, Twitter } from '../common/SocialIcons';
import { categoryService } from '../../services/categoryService';

const Footer = () => {
  const [categoriesList, setCategoriesList] = useState([]);

  useEffect(() => {
    categoryService.getCategories()
      .then(data => setCategoriesList(data || []))
      .catch(err => console.error('Footer categories load failed:', err));
  }, []);

  return (
    <footer style={{ background: '#0f172a', color: '#94a3b8', fontFamily: "'Outfit', sans-serif" }}>

      {/* CTA strip */}
      <div style={{ background: 'linear-gradient(90deg,#1a56db,#1648c0)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '36px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <h3 style={{ color: '#fff', fontSize: 20, fontWeight: 800, margin: 0 }}>Ready to grow your business?</h3>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, marginTop: 4 }}>Join 700+ verified businesses on Right Ads Digital</p>
          </div>
          <Link to="/apply" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#fff', color: '#1a56db', fontWeight: 700, fontSize: 14,
            padding: '12px 24px', borderRadius: 12, textDecoration: 'none',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)', transition: 'transform 0.2s',
          }}>
            List Your Business Free <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      {/* Main */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '52px 24px 40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 40 }}>

        {/* Brand */}
        <div>
          <Link to="/" style={{ display: 'inline-block', marginBottom: 16 }}>
            <img src="/logo-light.png" alt="Right Ads" style={{ height: 38, width: 'auto' }} />
          </Link>
          <p style={{ fontSize: 13, lineHeight: 1.7, marginBottom: 20, color: '#64748b' }}>
            India's premier digital business directory connecting customers with verified local businesses.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            {[Facebook, Instagram, Linkedin, Twitter].map((Icon, i) => (
              <a key={i} href="#" style={{
                width: 34, height: 34, background: '#1e293b', borderRadius: 9,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#94a3b8', transition: 'background 0.2s, color 0.2s', textDecoration: 'none',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#1a56db'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#1e293b'; e.currentTarget.style.color = '#94a3b8'; }}>
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 style={{ color: '#fff', fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>Categories</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {categoriesList.slice(0, 6).map(cat => (
              <li key={cat.id}>
                <Link to={`/category/${cat.slug}`} style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  fontSize: 13, color: '#64748b', textDecoration: 'none', transition: 'color 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.color = '#06b6d4'}
                  onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>
                  <ArrowRight size={11} /> {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

      {/* Quick links */}
      <div>
        <h4 style={{ color: '#fff', fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>Quick Links</h4>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: 'Home',               to: '/'            },
            { label: 'Search Businesses',  to: '/search'      },
            { label: 'List Your Business', to: '/apply'       },
            { label: 'Admin Panel',        to: '/admin/login' },
            { label: 'Privacy Policy',     to: '#'            },
            { label: 'Terms of Service',   to: '#'            },
          ].map((lnk, i) => (
            <li key={i}>
              <Link to={lnk.to} style={{
                display: 'flex', alignItems: 'center', gap: 7,
                fontSize: 13, color: '#64748b', textDecoration: 'none', transition: 'color 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.color = '#06b6d4'}
                onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>
                <ArrowRight size={11} /> {lnk.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Contact */}
      <div>
        <h4 style={{ color: '#fff', fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>Contact</h4>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <li style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: '#64748b' }}>
            <MapPin size={14} style={{ marginTop: 2, color: '#06b6d4', flexShrink: 0 }} />
            80 Feet Link Road, Kota, Rajasthan 324001
          </li>
          <li>
            <a href="tel:+918377072990" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#64748b', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#06b6d4'}
              onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>
              <Phone size={14} style={{ color: '#06b6d4' }} /> +91 8377072990
            </a>
          </li>
          <li>
            <a href="mailto:support@rightadsdigital.com" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#64748b', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#06b6d4'}
              onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>
              <Mail size={14} style={{ color: '#06b6d4' }} /> support@rightadsdigital.com
            </a>
          </li>
        </ul>
      </div>
    </div>

    {/* Bottom bar */}
    <div style={{ borderTop: '1px solid #1e293b' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '18px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <p style={{ fontSize: 12, color: '#475569', margin: 0 }}>© 2024 Right Ads Digital. All rights reserved.</p>
        <p style={{ fontSize: 12, color: '#475569', margin: 0, display: 'flex', alignItems: 'center', gap: 5 }}>
          Made with <Heart size={11} style={{ color: '#e02020', fill: '#e02020' }} /> by Right Ads Digital Team
        </p>
      </div>
    </div>
  </footer>
  );
};

export default Footer;
