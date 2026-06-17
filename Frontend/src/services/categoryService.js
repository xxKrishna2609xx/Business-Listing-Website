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

  /** Fetch all subcategories. */
  async getAllSubcategories() {
    const { data } = await api.get('/categories/subcategories/all');
    return data;
  },

  /** Admin — create a new category. */
  async createCategory(catData) {
    const { data } = await api.post('/categories', catData);
    return data;
  },

  /** Admin — update an existing category. */
  async updateCategory(id, catData) {
    const { data } = await api.put(`/categories/${id}`, catData);
    return data;
  },

  /** Admin — delete a category and its subcategories. */
  async deleteCategory(id) {
    const { data } = await api.delete(`/categories/${id}`);
    return data;
  },

  /** Admin — create a new subcategory under a category. */
  async createSubcategory(subData) {
    const { data } = await api.post('/categories/subcategories/new', subData);
    return data;
  },

  /** Admin — delete a subcategory by ID. */
  async deleteSubcategory(id) {
    const { data } = await api.delete(`/categories/subcategories/${id}`);
    return data;
  },
};
