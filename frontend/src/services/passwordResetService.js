import api from './api';

export const createResetRequest = async (requestData) => {
  const response = await api.post('/password-resets', requestData);
  return response.data;
};

export const getResetRequests = async (params = {}) => {
  const response = await api.get('/password-resets', { params });
  return response.data;
};

export const approveResetRequest = async (id, adminRemarks = '') => {
  const response = await api.put(`/password-resets/${id}/approve`, { adminRemarks });
  return response.data;
};

export const rejectResetRequest = async (id, adminRemarks = '') => {
  const response = await api.put(`/password-resets/${id}/reject`, { adminRemarks });
  return response.data;
};

export const checkResetStatus = async (employeeId) => {
  const response = await api.get(`/password-resets/check/${employeeId}`);
  return response.data;
};

export const completePasswordReset = async (data) => {
  const response = await api.post('/password-resets/complete', data);
  return response.data;
};
