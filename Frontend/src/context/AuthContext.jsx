import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for persisted admin session (mock)
    const savedUser = localStorage.getItem('admin_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const loginAdmin = (email, password) => {
    // Mock admin login — replace with Firebase Auth
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'admin@rightads.digital' && password === 'Admin@123') {
          const adminUser = { email, role: 'admin', name: 'Admin User', uid: 'admin-001' };
          setUser(adminUser);
          localStorage.setItem('admin_user', JSON.stringify(adminUser));
          resolve(adminUser);
        } else {
          reject(new Error('Invalid credentials. Use admin@rightads.digital / Admin@123'));
        }
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('admin_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginAdmin, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
