import api from './api';

export const authService = {
  /**
   * Register a new user account.
   * Stores the returned JWT token in localStorage and returns the user object.
   */
  async signup(name, email, phone, password) {
    const { data } = await api.post('/auth/signup', { name, email, phone, password });
    localStorage.setItem('auth_token', data.access_token);
    return data.user;
  },

  /**
   * Login with email + password.
   * Stores the returned JWT token in localStorage and returns the user object.
   */
  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('auth_token', data.access_token);
    return data.user;
  },

  /**
   * Validate the stored token and return the current user's profile.
   * Throws if the token is missing or expired.
   */
  async getMe() {
    const { data } = await api.get('/auth/me');
    return data;
  },

  /**
   * Toggle a business bookmark for the current user.
   * Returns the updated bookmarks array.
   */
  async toggleBookmark(businessId) {
    const { data } = await api.patch(`/auth/me/bookmarks/${businessId}`);
    return data.bookmarks; // string[]
  },

  /** Clear auth tokens from localStorage. */
  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  },
};
