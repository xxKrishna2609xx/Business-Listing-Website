import api from './api';

export const categoryService = {
  /** Fetch all categories. */
  async getCategories() {
    const { data } = await api.get('/categories');
    return data;
  },

  /** Fetch subcategories for a given category slug. */
  async getSubcategories(slug) {
    const { data } = await api.get(`/categories/${slug}/subcategories`);
    return data;
  },
};
