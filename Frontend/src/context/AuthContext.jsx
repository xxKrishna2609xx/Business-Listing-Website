import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for persisted session
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Admin login utility
  const loginAdmin = (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'admin@rightads.digital' && password === 'Admin@123') {
          const adminUser = { email, role: 'admin', name: 'Admin User', uid: 'admin-001' };
          setUser(adminUser);
          localStorage.setItem('auth_user', JSON.stringify(adminUser));
          resolve(adminUser);
        } else {
          reject(new Error('Invalid credentials. Use admin@rightads.digital / Admin@123'));
        }
      }, 800);
    });
  };

  // Regular user/owner login
  const loginUser = (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // If it's the admin, use admin login
        if (email === 'admin@rightads.digital') {
          if (password === 'Admin@123') {
            const adminUser = { email, role: 'admin', name: 'Admin User', uid: 'admin-001' };
            setUser(adminUser);
            localStorage.setItem('auth_user', JSON.stringify(adminUser));
            resolve(adminUser);
          } else {
            reject(new Error('Invalid admin credentials.'));
          }
          return;
        }

        // Get users list
        const users = JSON.parse(localStorage.getItem('local_users') || '[]');
        const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (foundUser) {
          if (foundUser.password === password) {
            // Don't persist password in memory
            const { password: _, ...safeUser } = foundUser;
            setUser(safeUser);
            localStorage.setItem('auth_user', JSON.stringify(safeUser));
            resolve(safeUser);
          } else {
            reject(new Error('Invalid password.'));
          }
        } else {
          reject(new Error('No account found with this email.'));
        }
      }, 800);
    });
  };

  // Regular user registration
  const signupUser = (name, email, phone, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('local_users') || '[]');
        
        // Check if email already exists
        const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase() || u.phone === phone);
        if (exists) {
          reject(new Error('Account with this email or phone number already exists.'));
          return;
        }

        // Create new user (structured like a MongoDB document)
        const newUser = {
          uid: 'usr-' + Date.now().toString(36),
          name,
          email,
          phone,
          password,
          role: 'user',
          bookmarks: [],
          createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('local_users', JSON.stringify(users));

        // Log in the user immediately
        const { password: _, ...safeUser } = newUser;
        setUser(safeUser);
        localStorage.setItem('auth_user', JSON.stringify(safeUser));
        resolve(safeUser);
      }, 800);
    });
  };

  // Toggle bookmark listing
  const toggleBookmark = (businessId) => {
    if (!user) return false;

    // Admin cannot bookmark
    if (user.role === 'admin') return false;

    const users = JSON.parse(localStorage.getItem('local_users') || '[]');
    const userIndex = users.findIndex(u => u.uid === user.uid);

    if (userIndex !== -1) {
      const userRecord = users[userIndex];
      const bookmarks = userRecord.bookmarks || [];
      const isBookmarked = bookmarks.includes(businessId);

      let newBookmarks;
      if (isBookmarked) {
        newBookmarks = bookmarks.filter(id => id !== businessId);
      } else {
        newBookmarks = [...bookmarks, businessId];
      }

      userRecord.bookmarks = newBookmarks;
      users[userIndex] = userRecord;
      localStorage.setItem('local_users', JSON.stringify(users));

      // Update in-memory user and active session
      const updatedUser = { ...user, bookmarks: newBookmarks };
      setUser(updatedUser);
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      loginAdmin, 
      loginUser,
      signupUser,
      toggleBookmark,
      logout, 
      isAdmin: user?.role === 'admin',
      isLoggedIn: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
