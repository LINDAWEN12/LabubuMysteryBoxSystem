/**
 * 玩家秀API模块
 * 处理玩家秀相关的API请求，包括获取列表、创建和删除功能
 */
import api from "./index";

/**
 * API基础URL
 * 从环境变量获取，默认使用本地开发服务器地址
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

/**
 * 统一图片URL处理
 * @param {string|null} path - 图片路径
 * @param {string} defaultPath - 默认图片路径
 * @returns {string} 格式化后的完整图片URL
 */
const formatImageUrl = (path, defaultPath = '/images/default-showcase.jpg') => {
  if (!path) return `${API_BASE_URL}${defaultPath}`;
  return path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
};

/**
 * 处理用户头像URL
 * @param {string|null} path - 头像路径
 * @returns {string} 格式化后的完整头像URL
 */
const formatAvatarUrl = (path) => {
  if (!path) return `${API_BASE_URL}/images/default.jpg`;
  return path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
};

/**
 * 获取玩家秀列表
 * @returns {Promise<Array>} 玩家秀列表
 * @throws {Error} 当获取失败时抛出错误
 * @example
 * ```javascript
 * try {
 *   const showcases = await getShowcases();
 *   console.log('玩家秀列表:', showcases);
 * } catch (error) {
 *   console.error('获取玩家秀失败:', error.message);
 * }
 * ```
 */
export const getShowcases = async () => {
  try {
    // 发送获取玩家秀列表的请求
    const response = await api.get('/showcases');
    console.log('完整API响应:', response);
    
    // 处理响应数据
    const responseData = response.data?.data || response.data;
    
    if (!responseData) {
      throw new Error('未获取到有效的玩家秀数据');
    }
    
    // 确保数据是数组格式
    const showcasesArray = Array.isArray(responseData) ? responseData : [responseData];
    
    // 格式化玩家秀数据
    return showcasesArray.map(showcase => ({
      id: showcase.id,
      image: formatImageUrl(showcase.image),
      comment: showcase.comment || '',
      userId: showcase.userId,
      // 提取并格式化用户信息
      user: showcase.user ? {
        id: showcase.user.id,
        username: showcase.user.username || '匿名用户',
        avatar: formatAvatarUrl(showcase.user.avatar)
      } : null,
      itemId: showcase.itemId,
      createdAt: showcase.createdAt || new Date().toISOString()
    }));
    
  } catch (error) {
    console.error('获取玩家秀列表失败:', error);
    throw error;
  }
};

/**
 * 创建玩家秀
 * @param {FormData} formData - 包含玩家秀信息的FormData对象
 * @returns {Promise<object>} 创建的玩家秀信息
 * @throws {Error} 当创建失败时抛出错误
 * @example
 * ```javascript
 * try {
 *   const formData = new FormData();
 *   formData.append('image', file);
 *   formData.append('comment', '我的新收藏');
 *   formData.append('itemId', '123');
 *   
 *   const showcase = await createShowcase(formData);
 *   console.log('创建成功:', showcase);
 * } catch (error) {
 *   console.error('创建失败:', error.message);
 * }
 * ```
 */
export const createShowcase = async (formData) => {
  try {
    // 发送创建玩家秀的请求
    const response = await api.post('/showcases', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log('创建API响应:', response);
    
    // 处理响应数据
    const showcaseData = response.data?.data || response.data;
    
    if (!showcaseData?.id) {
      throw new Error('创建玩家秀失败');
    }
    
    // 格式化返回的玩家秀数据
    return {
      id: showcaseData.id,
      image: formatImageUrl(showcaseData.image),
      comment: showcaseData.comment || '',
      userId: showcaseData.userId,
      // 提取并格式化用户信息
      user: showcaseData.user ? {
        id: showcaseData.user.id,
        username: showcaseData.user.username || '匿名用户',
        avatar: formatAvatarUrl(showcaseData.user.avatar)
      } : null,
      itemId: showcaseData.itemId,
      createdAt: showcaseData.createdAt || new Date().toISOString()
    };
    
  } catch (error) {
    console.error('创建玩家秀失败:', error);
    throw error;
  }
};

/**
 * 删除玩家秀
 * @param {number|string} id - 玩家秀ID
 * @returns {Promise<object>} 删除操作的响应
 * @throws {Error} 当删除失败时抛出错误
 * @example
 * ```javascript
 * try {
 *   await deleteShowcase(123);
 *   console.log('删除成功');
 * } catch (error) {
 *   console.error('删除失败:', error.message);
 * }
 * ```
 */
export const deleteShowcase = async (id) => {
  try {
    // 发送删除玩家秀的请求
    const response = await api.delete(`/showcases/${id}`);
    return response.data;
  } catch (error) {
    console.error('删除玩家秀失败:', error);
    throw error;
  }
};