import api from './api';

export const getAdminDashboard = async () => {
  const response = await api.get('/admin/dashboard');
  return response.data;
};

export const getAllLeaves = async (params = {}) => {
  const response = await api.get('/admin/leaves', { params });
  return response.data;
};

export const approveLeave = async (leaveId, remarks = '') => {
  const response = await api.put(`/admin/approve/${leaveId}`, { remarks });
  return response.data;
};

export const rejectLeave = async (leaveId, remarks = '') => {
  const response = await api.put(`/admin/reject/${leaveId}`, { remarks });
  return response.data;
};

export const getAllEmployees = async (params = {}) => {
  const response = await api.get('/admin/employees', { params });
  return response.data;
};

export const createEmployee = async (employeeData) => {
  const response = await api.post('/admin/employees', employeeData);
  return response.data;
};

export const updateEmployee = async (employeeId, employeeData) => {
  const response = await api.put(`/admin/employees/${employeeId}`, employeeData);
  return response.data;
};

export const deleteEmployee = async (employeeId) => {
  const response = await api.delete(`/admin/employees/${employeeId}`);
  return response.data;
};

export const toggleEmployeeStatus = async (employeeId) => {
  const response = await api.put(`/admin/employees/${employeeId}/status`);
  return response.data;
};

export const resetEmployeePassword = async (employeeId, newPassword) => {
  const response = await api.put(`/admin/employees/${employeeId}/reset-password`, { newPassword });
  return response.data;
};

export const getPasswordAudits = async (params = {}) => {
  const response = await api.get('/admin/password-audits', { params });
  return response.data;
};
