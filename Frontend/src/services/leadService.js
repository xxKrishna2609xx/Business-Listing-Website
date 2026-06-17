import api from './api';

export const leadService = {
  /**
   * Submit a quote/lead request.
   * Requires the user to be logged in (JWT sent automatically via interceptor).
   * @param {object} leadData - { businessId, businessName, customerName, phone, email, serviceRequired, message }
   */
  async submitLead(leadData) {
    const { data } = await api.post('/leads', leadData);
    return data;
  },

  /** Fetch the current user's own lead history. */
  async getMyLeads() {
    const { data } = await api.get('/leads/my');
    return data;
  },
};
