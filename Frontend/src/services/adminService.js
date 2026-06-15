import api from './api';

export const adminService = {
  // ─── Dashboard ──────────────────────────────────────────

  /** Dashboard summary statistics. */
  async getStats() {
    const { data } = await api.get('/admin/stats');
    return data;
  },

  // ─── Listings ───────────────────────────────────────────

  /** All business listings (admin view — includes all statuses). */
  async getListings() {
    const { data } = await api.get('/admin/listings');
    return data;
  },

  /**
   * Update a business listing field(s).
   * @param {string} id
   * @param {object} updates - e.g. { featured: true } or { verified: false }
   */
  async updateListing(id, updates) {
    const { data } = await api.patch(`/admin/listings/${id}`, updates);
    return data;
  },

  /** Permanently delete a listing. */
  async deleteListing(id) {
    const { data } = await api.delete(`/admin/listings/${id}`);
    return data;
  },

  // ─── Applications ────────────────────────────────────────

  /** All business applications. */
  async getApplications() {
    const { data } = await api.get('/applications');
    return data;
  },

  /**
   * Approve or reject an application.
   * @param {string} id
   * @param {'APPROVED'|'REJECTED'} status
   */
  async updateApplication(id, status) {
    const { data } = await api.patch(`/applications/${id}`, { status });
    return data;
  },

  /**
   * Submit a new business application (public — also callable from admin).
   */
  async submitApplication(formData) {
    const { data } = await api.post('/applications', formData);
    return data;
  },

  // ─── Leads ───────────────────────────────────────────────

  /** All leads (admin view). */
  async getLeads() {
    const { data } = await api.get('/leads');
    return data;
  },
};
