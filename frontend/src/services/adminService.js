import api from './api';

export const getAdminDashboard = async () => {
  const response = await api.get('/admin/dashboard');
  return response.data;
};

export const getAllEmployees = async (params = {}) => {
  const response = await api.get('/admin/employees', { params });
  return response.data;
};

export const getEmployees = getAllEmployees;

export const createEmployee = async (employeeData) => {
  const response = await api.post('/admin/employees', employeeData);
  return response.data;
};

export const updateEmployee = async (id, employeeData) => {
  const response = await api.put(`/admin/employees/${id}`, employeeData);
  return response.data;
};

export const toggleEmployeeStatus = async (id) => {
  const response = await api.put(`/admin/employees/${id}/status`);
  return response.data;
};

export const resetEmployeePassword = async (id, newPassword) => {
  const response = await api.put(`/admin/employees/${id}/reset-password`, { newPassword });
  return response.data;
};

export const deleteEmployee = async (id) => {
  const response = await api.delete(`/admin/employees/${id}`);
  return response.data;
};

export const getAllLeaveRequests = async (params = {}) => {
  const response = await api.get('/admin/leaves', { params });
  return response.data;
};

export const getAllLeaves = getAllLeaveRequests;

export const approveLeave = async (id, remarks = '') => {
  const response = await api.put(`/admin/approve/${id}`, { remarks });
  return response.data;
};

export const rejectLeave = async (id, remarks = '') => {
  const response = await api.put(`/admin/reject/${id}`, { remarks });
  return response.data;
};

export const getPasswordAudits = async (params = {}) => {
  const response = await api.get('/admin/password-audits', { params });
  return response.data;
};
