import api from "./index";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// 统一图片URL处理
const formatImageUrl = (path, defaultPath = '/images/default-showcase.jpg') => {
  if (!path) return `${API_BASE_URL}${defaultPath}`;
  return path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
};

export const getShowcases = async () => {
  try {
    const response = await api.get('/showcases');
    console.log('完整API响应:', response);
    
    const responseData = response.data?.data || response.data;
    
    if (!responseData) {
      throw new Error('未获取到有效的玩家秀数据');
    }
    
    const showcasesArray = Array.isArray(responseData) ? responseData : [responseData];
    
    return showcasesArray.map(showcase => ({
      id: showcase.id,
      image: formatImageUrl(showcase.image),
      comment: showcase.comment || '',
      userId: showcase.userId,
      itemId: showcase.itemId,
      createdAt: showcase.createdAt || new Date().toISOString()
    }));
    
  } catch (error) {
    console.error('获取玩家秀列表失败:', error);
    throw error;
  }
};

export const createShowcase = async (formData) => {
  try {
    const response = await api.post('/showcases', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log('创建API响应:', response);
    
    const showcaseData = response.data?.data || response.data;
    
    if (!showcaseData?.id) {
      throw new Error('创建玩家秀失败');
    }
    
    return {
      id: showcaseData.id,
      image: formatImageUrl(showcaseData.image),
      comment: showcaseData.comment || '',
      userId: showcaseData.userId,
      itemId: showcaseData.itemId,
      createdAt: showcaseData.createdAt || new Date().toISOString()
    };
    
  } catch (error) {
    console.error('创建玩家秀失败:', error);
    throw error;
  }
};

export const deleteShowcase = async (id) => {
  try {
    const response = await api.delete(`/showcases/${id}`);
    return response.data;
  } catch (error) {
    console.error('删除玩家秀失败:', error);
    throw error;
  }
};