import api from './index';

export const getOrders = () => api.get('orders');
export const getOrderById = (id) => api.get(`orders/${id}`);
export const createOrder = (data) => api.post('orders', data);