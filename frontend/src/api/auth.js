import api from './index';

// 使用import.meta.env获取环境变量（Vite）
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// 统一图片URL处理
const formatImageUrl = (path, defaultPath = '/images/default.jpg') => {
  if (!path) return `${API_BASE_URL}${defaultPath}`;
  return path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
};

export const register = (data) => api.post('auth/register', data);
export const login = (data) => api.post('auth/login', data);

export const getProfile = async () => {
  try {
    const response = await api.get('profile');
    const profileData = response.data?.data || response.data;
    
    return {
      ...response,
      data: {
        ...profileData,
        avatar: profileData.avatar ? formatImageUrl(profileData.avatar, '/images/default-avatar.jpg') : ''
      }
    };
  } catch (error) {
    console.error('获取用户信息失败:', error);
    throw error;
  }
};

export const updateAvatar = async (formData) => {
  try {
    const response = await api.post('auth/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    const updatedData = response.data?.data || response.data;
    
    return {
      ...response,
      data: {
        ...updatedData,
        avatar: updatedData.avatar ? formatImageUrl(updatedData.avatar, '/images/default-avatar.jpg') : ''
      }
    };
  } catch (error) {
    console.error('更新头像失败:', error);
    throw error;
  }
};