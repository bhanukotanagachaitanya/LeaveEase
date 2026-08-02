import api from './api';

export const applyLeave = async (leaveData) => {
  const response = await api.post('/leave', leaveData);
  return response.data;
};

export const getLeaveHistory = async (params = {}) => {
  const response = await api.get('/leave/history', { params });
  return response.data;
};

export const cancelLeave = async (leaveId) => {
  const response = await api.delete(`/leave/${leaveId}`);
  return response.data;
};
