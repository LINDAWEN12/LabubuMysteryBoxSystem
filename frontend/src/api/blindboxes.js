import api from "./index";

// 使用import.meta.env获取环境变量（Vite）
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// 统一图片URL处理
const formatImageUrl = (path, defaultPath = '/images/default.jpg') => {
  if (!path) return `${API_BASE_URL}${defaultPath}`;
  return path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
};

export const getBlindBoxes = async () => {
  try {
    const response = await api.get('/blindboxes');
    console.log('完整API响应:', response);
    
    const responseData = response.data?.data || response.data;
    
    if (!responseData) {
      throw new Error('未获取到有效的盲盒数据');
    }
    
    const boxesArray = Array.isArray(responseData) ? responseData : [responseData];
    
    return boxesArray.map(box => ({
      id: box.id,
      name: box.name,
      description: box.description,
      price: parseFloat(box.price) || 0,
      coverImage: formatImageUrl(box.coverImage, '/images/default-box.jpg'),
      items: box.items?.map(item => ({
        ...item,
        image: formatImageUrl(item.image, '/images/default-item.jpg')
      })) || []
    }));
    
  } catch (error) {
    console.error('获取盲盒列表失败:', error);
    throw error;
  }
};

export const getBlindBoxById = async (id) => {
  try {
    const response = await api.get(`/blindboxes/${id}`);
    console.log('详情API响应:', response);
    
    const boxData = response.data?.data || response.data;
    
    if (!boxData?.id) {
      throw new Error('盲盒数据不完整');
    }
    
    return {
      id: boxData.id,
      name: boxData.name || '未知盲盒',
      description: boxData.description || '暂无描述',
      price: parseFloat(boxData.price) || 0,
      coverImage: formatImageUrl(boxData.coverImage, '/images/default-box.jpg'),
      items: boxData.items?.map(item => ({
        ...item,
        image: formatImageUrl(item.image, '/images/default-item.jpg')
      })) || []
    };
    
  } catch (error) {
    console.error('获取盲盒详情失败:', error);
    throw error;
  }
};