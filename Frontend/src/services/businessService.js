import api from './api';

export const businessService = {
  /**
   * List businesses with optional filters.
   * @param {object} params - { query, city, category, subcategory, featured, sort, limit, skip }
   */
  async getBusinesses(params = {}) {
    const { data } = await api.get('/businesses', { params });
    return data;
  },

  /**
   * Fetch featured businesses for the home page hero section.
   */
  async getFeatured() {
    const { data } = await api.get('/businesses', { params: { featured: true } });
    return data;
  },

  /**
   * Fetch a single business by its ID.
   */
  async getBusinessById(id) {
    const { data } = await api.get(`/businesses/${id}`);
    return data;
  },
};
