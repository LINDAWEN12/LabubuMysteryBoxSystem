import api from './index';

export const getBlindBoxes = async () => {
  try {
    // 添加时间戳防止缓存
    const response = await api.get('/blindboxes', {
      params: {
        _: new Date().getTime() // 防止缓存
      }
    });
    
    console.log('盲盒API完整响应:', response); // 调试
    
    // 兼容多种响应格式
    const responseData = response.data?.data || response.data;
    
    if (Array.isArray(responseData)) {
      return responseData.map(box => ({
        ...box,
        // 确保图片路径完整
        coverImage: box.coverImage?.startsWith('http') 
          ? box.coverImage 
          : `${process.env.REACT_APP_API_URL || 'http://localhost:3001'}${box.coverImage}`
      }));
    }
    
    throw new Error('无效的盲盒数据格式');
  } catch (error) {
    console.error('获取盲盒列表失败:', {
      error: error.message,
      response: error.response?.data
    });
    throw error;
  }
};

export const getBlindBoxById = async (id) => {
  try {
    const response = await api.get(`/blindboxes/${id}`);
    if (response.data?.success) {
      const box = response.data.data;
      return {
        ...box,
        coverImage: box.coverImage?.startsWith('http') 
          ? box.coverImage 
          : `${process.env.REACT_APP_API_URL}${box.coverImage}`,
        items: box.items?.map(item => ({
          ...item,
          image: item.image?.startsWith('http')
            ? item.image
            : `${process.env.REACT_APP_API_URL}${item.image}`
        }))
      };
    }
    throw new Error(response.data?.message || '获取盲盒详情失败');
  } catch (error) {
    console.error('获取盲盒详情错误:', error);
    throw error;
  }
};

export const drawBlindBox = async (id) => {
  try {
    const response = await api.post(`/blindboxes/${id}/draw`);
    if (response.data?.success) {
      const result = response.data.data;
      return {
        ...result,
        item: {
          ...result.item,
          image: result.item.image?.startsWith('http')
            ? result.item.image
            : `${process.env.REACT_APP_API_URL}${result.item.image}`
        }
      };
    }
    throw new Error(response.data?.message || '抽取盲盒失败');
  } catch (error) {
    console.error('抽取盲盒错误:', error);
    throw error;
  }
};