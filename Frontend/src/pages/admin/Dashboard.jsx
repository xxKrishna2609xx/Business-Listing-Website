import { useState, useEffect } from 'react';
import {
  Building2, FileText, CheckCircle, XCircle, Sparkles,
  MessageSquare, TrendingUp, ArrowUpRight, Clock, Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import { adminService } from '../../services/adminService';

const StatCard = ({ icon: Icon, label, value, change, color, to }) => (
  <Link to={to || '#'} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all duration-200 group">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center shadow-lg`}>
        <Icon size={20} className="text-white" />
      </div>
      <ArrowUpRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
    </div>
    <div className="text-3xl font-black text-slate-900 mb-1">{value}</div>
    <div className="text-sm text-slate-500 font-medium">{label}</div>
    {change && (
      <div className="text-xs text-teal-600 font-semibold mt-1 flex items-center gap-1">
        <TrendingUp size={11} /> {change}
      </div>
    )}
  </Link>
);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({});
  const [recentApps, setRecentApps] = useState([]);
  const [recentLeads, setRecentLeads] = useState([]);
  const [topBusinesses, setTopBusinesses] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [stats, apps, leads, bizList] = await Promise.all([
          adminService.getStats(),
          adminService.getApplications(),
          adminService.getLeads(),
          adminService.getListings(),
        ]);
        setDashboardStats(stats);
        setRecentApps(apps.slice(0, 3));
        setRecentLeads(leads.slice(0, 3));
        setTopBusinesses(bizList.slice(0, 4));
      } catch {
        // silently fail — show empty state
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const stats = [
    { icon: Building2,    label: 'Total Listings',       value: dashboardStats.totalListings       ?? '—', color: 'bg-blue-600',   change: '+12 this month', to: '/admin/listings' },
    { icon: Clock,        label: 'Pending Applications', value: dashboardStats.pendingApplications ?? '—', color: 'bg-amber-500',  change: 'Needs review',   to: '/admin/applications' },
    { icon: CheckCircle,  label: 'Approved Listings',    value: dashboardStats.approvedListings    ?? '—', color: 'bg-teal-600',   change: '+8 this week',   to: '/admin/listings' },
    { icon: XCircle,      label: 'Rejected',             value: dashboardStats.rejectedListings    ?? '—', color: 'bg-red-500',    to: '/admin/applications' },
    { icon: Sparkles,     label: 'Featured Listings',    value: dashboardStats.featuredListings    ?? '—', color: 'bg-indigo-600', to: '/admin/listings' },
    { icon: MessageSquare,label: 'Total Leads',          value: dashboardStats.totalLeads          ?? '—', color: 'bg-rose-500',   change: '+5 today',       to: '/admin/leads' },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 skeleton rounded-2xl" />
          ))}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {stats.map((stat, i) => <StatCard key={i} {...stat} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Applications */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
            <h3 className="font-bold text-slate-900">Recent Applications</h3>
            <Link to="/admin/applications" className="text-xs text-blue-600 font-semibold hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentApps.map(app => (
              <div key={app.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors">
                <div>
                  <div className="font-semibold text-slate-900 text-sm">{app.businessName}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{app.city}, {app.state}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {recentApps.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-sm">No pending applications</div>
          )}
        </div>

        {/* Recent Leads */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
            <h3 className="font-bold text-slate-900">Recent Leads</h3>
            <Link to="/admin/leads" className="text-xs text-blue-600 font-semibold hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentLeads.map(lead => (
              <div key={lead.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors">
                <div>
                  <div className="font-semibold text-slate-900 text-sm">{lead.customerName}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{lead.serviceRequired} • {lead.businessName}</div>
                </div>
                <div className="text-xs text-slate-400">
                  {new Date(lead.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Rated Businesses */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
            <h3 className="font-bold text-slate-900">Top Rated Businesses</h3>
            <Link to="/admin/listings" className="text-xs text-blue-600 font-semibold hover:underline">Manage all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Business</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Category</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">City</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Rating</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {topBusinesses.map(biz => (
                  <tr key={biz.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <img src={biz.logoUrl} alt={biz.businessName} className="w-8 h-8 rounded-lg" />
                        <span className="font-semibold text-slate-800">{biz.businessName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-500 text-xs">{biz.categoryName}</td>
                    <td className="px-5 py-3 text-slate-500 text-xs">{biz.city}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <Star size={12} className="text-amber-400 fill-amber-400" />
                        <span className="font-bold text-slate-700 text-xs">{biz.rating}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        biz.status === 'APPROVED' ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {biz.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
