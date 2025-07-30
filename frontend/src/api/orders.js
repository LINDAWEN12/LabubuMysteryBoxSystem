import api from './index';

// 使用import.meta.env获取环境变量（Vite）
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// 统一图片URL处理
const formatImageUrl = (path, defaultPath = '/images/default.jpg') => {
  if (!path) return `${API_BASE_URL}${defaultPath}`;
  return path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
};

export const getOrders = async () => {
  try {
    const response = await api.get('orders');
    const ordersData = response.data?.data || response.data;
    
    const formattedOrders = Array.isArray(ordersData) ? ordersData.map(order => ({
      ...order,
      box: order.box ? {
        ...order.box,
        coverImage: formatImageUrl(order.box.coverImage, '/images/default-box.jpg')
      } : null,
      item: order.item ? {
        ...order.item,
        image: formatImageUrl(order.item.image, '/images/default-item.jpg')
      } : null
    })) : [];
    
    return {
      ...response,
      data: formattedOrders
    };
  } catch (error) {
    console.error('获取订单失败:', error);
    throw error;
  }
};

export const getOrderById = async (id) => {
  try {
    const response = await api.get(`orders/${id}`);
    const orderData = response.data?.data || response.data;
    
    return {
      ...response,
      data: {
        ...orderData,
        box: orderData.box ? {
          ...orderData.box,
          coverImage: formatImageUrl(orderData.box.coverImage, '/images/default-box.jpg')
        } : null,
        item: orderData.item ? {
          ...orderData.item,
          image: formatImageUrl(orderData.item.image, '/images/default-item.jpg')
        } : null
      }
    };
  } catch (error) {
    console.error('获取订单详情失败:', error);
    throw error;
  }
};

export const createOrder = (data) => api.post('orders', data);