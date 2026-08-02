import api from './api';

export const getHolidays = async () => {
  const response = await api.get('/holidays');
  return response.data;
};

export const createHoliday = async (holidayData) => {
  const response = await api.post('/holidays', holidayData);
  return response.data;
};

export const updateHoliday = async (id, holidayData) => {
  const response = await api.put(`/holidays/${id}`, holidayData);
  return response.data;
};

export const deleteHoliday = async (id) => {
  const response = await api.delete(`/holidays/${id}`);
  return response.data;
};
