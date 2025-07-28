import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  withCredentials: true // 确保后端允许跨域凭证
});

// ----------------- 请求拦截器 -----------------
api.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 Token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ----------------- 响应拦截器 (唯一一个) -----------------
api.interceptors.response.use(
  (response) => {
    // 成功响应处理
    console.log('API成功:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    
    return {
      success: true,
      status: response.status,
      data: response.data.data ?? response.data, // 兼容不同后端格式
      headers: response.headers
    };
  },
  (error) => {
    // 统一错误处理
    const errorInfo = {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.response?.data?.message || error.message
    };
    console.error('API失败:', errorInfo);

    // 处理 401 未授权
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // 避免重复跳转
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?expired=1';
      }
    }

    // 返回统一错误格式
    return Promise.reject({
      success: false,
      ...errorInfo
    });
  }
);

export default api;