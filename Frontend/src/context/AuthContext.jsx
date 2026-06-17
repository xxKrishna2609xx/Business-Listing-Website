import { createContext, useContext, useState, useEffect } from 'react';
<<<<<<< HEAD
import {
  registerUser,
  loginUserApi
} from '../services/api';

import {
  addBookmark,
  removeBookmark,
  getBookmarks
} from '../services/api';
=======
import { authService } from '../services/authService';
>>>>>>> a4297bdae2499bb3b73fbce6bc1a29aa71b14594

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

<<<<<<< HEAD
  // Regular user/owner login
  const loginUser = async (email, password) => {

    const data = await loginUserApi(email, password);

    localStorage.setItem(
      'access_token',
      data.access_token
    );

    localStorage.setItem(
      'refresh_token',
      data.refresh_token
    );

    const bookmarks = await getBookmarks(data.user.id);
    const bookmarkIds =bookmarks.map(b => b.businessId);

    data.user.bookmarks =bookmarkIds;
    setUser(data.user);

    localStorage.setItem(
      'auth_user',
      JSON.stringify(data.user)
    );

    return data.user;
  };



  // Regular user registration
  const signupUser = async (
    name,
    email,
    phone,
    password
  ) => {

    await registerUser({
      name,
      email,
      phone,
      password
    });

    const loginData = await loginUserApi(email, password);

    localStorage.setItem(
      'access_token',
      loginData.access_token
    );

    localStorage.setItem(
      'refresh_token',
      loginData.refresh_token
    );

    const bookmarks = await getBookmarks(loginData.user.id);

    loginData.user.bookmarks = bookmarks.map(b => b.businessId);

    setUser(loginData.user);

    localStorage.setItem(
      'auth_user',
      JSON.stringify(loginData.user)
    );

    return loginData.user;
  };

  // Toggle bookmark listing
  const toggleBookmark = async (
    businessId
  ) => {

    if (!user) return false;

    const bookmarked =user.bookmarks?.includes(businessId);

    try {

      if (bookmarked) {

        await removeBookmark(
          user.id,
          businessId
        );

      } else {

        await addBookmark(
          user.id,
          businessId
        );

      }

      const updatedBookmarks = bookmarked ? user.bookmarks.filter(id => id !== businessId): [...(user.bookmarks || []),businessId];

      const updatedUser = {
        ...user,
        bookmarks:
          updatedBookmarks
      };

=======
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
>>>>>>> a4297bdae2499bb3b73fbce6bc1a29aa71b14594
      setUser(updatedUser);

      localStorage.setItem(
        "auth_user",
        JSON.stringify(updatedUser)
      );

      return true;
<<<<<<< HEAD

    } catch (err) {

      console.error(err);

=======
    } catch {
>>>>>>> a4297bdae2499bb3b73fbce6bc1a29aa71b14594
      return false;
    }
  };

  const setLoggedInUser = (
      userData
    ) => {

      setUser(userData);

      localStorage.setItem(
        'auth_user',
        JSON.stringify(userData)
      );
    };

  const logout = () => {
<<<<<<< HEAD

    setUser(null);

    localStorage.removeItem(
      'auth_user'
    );

    localStorage.removeItem(
      'access_token'
    );

    localStorage.removeItem(
      'refresh_token'
    );
  };

  return (
    <AuthContext.Provider value={{ 
      user,
      loading,
      setLoggedInUser,
      loginUser,
      signupUser,
      toggleBookmark,
      logout,
      isAdmin: user?.role === 'admin',
      isLoggedIn: !!user
    }}>
=======
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
>>>>>>> a4297bdae2499bb3b73fbce6bc1a29aa71b14594
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
