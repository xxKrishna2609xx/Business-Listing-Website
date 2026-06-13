import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Public Pages
import HomePage from './pages/public/Home';
import SearchResults from './pages/public/SearchResults';
import CategoryBrowse from './pages/public/CategoryBrowse';
import BusinessDetails from './pages/public/BusinessDetails';
import ApplyListing from './pages/public/ApplyListing';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import UserDashboard from './pages/user/UserDashboard';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import ManageApplications from './pages/admin/ManageApplications';
import ManageListings from './pages/admin/ManageListings';
import ManageCategories from './pages/admin/ManageCategories';
import ManageLeads from './pages/admin/ManageLeads';

// Protected Route for Admin
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );
  return user?.role === 'admin' ? children : <Navigate to="/admin/login" replace />;
};

// User Protected Route
const UserProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
};

// Public layout wrapper
const PublicLayout = ({ children }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  return (
    <>
      <Navbar />
      {/* On non-home pages, add top padding to clear the simplified fixed navbar (64px) */}
      <main className={!isHome ? 'pt-16' : ''}>{children}</main>
      <Footer />
    </>
  );
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
      <Route path="/search" element={<PublicLayout><SearchResults /></PublicLayout>} />
      <Route path="/category/:categorySlug" element={<PublicLayout><CategoryBrowse /></PublicLayout>} />
      <Route path="/category/:categorySlug/:subcategorySlug" element={<PublicLayout><CategoryBrowse /></PublicLayout>} />
      <Route path="/business/:id" element={<PublicLayout><BusinessDetails /></PublicLayout>} />
      <Route path="/apply" element={<PublicLayout><ApplyListing /></PublicLayout>} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* User Dashboard Route */}
      <Route path="/dashboard" element={<PublicLayout><UserProtectedRoute><UserDashboard /></UserProtectedRoute></PublicLayout>} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/admin/applications" element={<ProtectedRoute><ManageApplications /></ProtectedRoute>} />
      <Route path="/admin/listings" element={<ProtectedRoute><ManageListings /></ProtectedRoute>} />
      <Route path="/admin/categories" element={<ProtectedRoute><ManageCategories /></ProtectedRoute>} />
      <Route path="/admin/leads" element={<ProtectedRoute><ManageLeads /></ProtectedRoute>} />

      {/* Redirect /admin → /admin/dashboard */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

      {/* 404 */}
      <Route path="*" element={
        <PublicLayout>
          <div className="min-h-screen flex items-center justify-center pt-24">
            <div className="text-center">
              <div className="text-8xl font-black text-slate-100 mb-4">404</div>
              <h1 className="text-2xl font-bold text-slate-700">Page Not Found</h1>
              <a href="/" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold">Go Home</a>
            </div>
          </div>
        </PublicLayout>
      } />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: { fontFamily: 'Outfit, sans-serif', fontSize: '13px', borderRadius: '12px' },
            success: { iconTheme: { primary: '#0d9488', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
