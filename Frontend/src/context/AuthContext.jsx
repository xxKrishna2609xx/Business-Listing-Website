import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: validate any stored JWT and hydrate user state
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setLoading(false);
      return;
    }

    authService
      .getMe()
      .then((userData) => {
        setUser(userData);
        localStorage.setItem('auth_user', JSON.stringify(userData));
      })
      .catch(() => {
        // Token invalid / expired — clear storage
        authService.logout();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  /** Login with email + password. Works for both regular users and admin. */
  const loginUser = async (email, password) => {
    const userData = await authService.login(email, password);
    setUser(userData);
    localStorage.setItem('auth_user', JSON.stringify(userData));
    return userData;
  };

  /** Alias used by AdminLogin page. */
  const loginAdmin = loginUser;

  /** Register a new user account. */
  const signupUser = async (name, email, phone, password) => {
    const userData = await authService.signup(name, email, phone, password);
    setUser(userData);
    localStorage.setItem('auth_user', JSON.stringify(userData));
    return userData;
  };

  /**
   * Toggle bookmark for a business.
   * Calls the backend and updates local state with the new bookmarks list.
   */
  const toggleBookmark = async (businessId) => {
    if (!user || user.role === 'admin') return false;

    try {
      const newBookmarks = await authService.toggleBookmark(businessId);
      const updatedUser = { ...user, bookmarks: newBookmarks };
      setUser(updatedUser);
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginUser,
        loginAdmin,
        signupUser,
        toggleBookmark,
        logout,
        isAdmin: user?.role === 'admin',
        isLoggedIn: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
