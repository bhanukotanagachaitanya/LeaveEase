import api from './api';

export const checkSetupStatus = async () => {
  const response = await api.get('/auth/setup-status');
  return response.data;
};

export const setupFirstAdmin = async (adminData) => {
  const response = await api.post('/auth/setup-admin', adminData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const logoutUser = async () => {
  try {
    await api.post('/auth/logout');
  } catch (err) {
    console.error('Logout error:', err);
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.put('/employee/profile', profileData);
  return response.data;
};
