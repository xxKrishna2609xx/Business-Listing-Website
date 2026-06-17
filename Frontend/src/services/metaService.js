import { api } from './api';

export const metaService = {
  /** Fetch banners for the homepage slider. */
  async getBanners() {
    const { data } = await api.get('/banners');
    return data;
  },

  /** Fetch quick services lists (Daily Needs, Travel Bookings). */
  async getQuickServices() {
    const { data } = await api.get('/quick-services');
    return data;
  },

  /** Fetch public counters/statistics for the landing page. */
  async getPublicStats() {
    const { data } = await api.get('/public-stats');
    return data;
  },
};
