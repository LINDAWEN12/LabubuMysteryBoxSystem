/**
 * 用户API模块
 * 处理用户相关的API请求，包括获取余额和充值功能
 */
import api from "./index";

/**
 * 获取用户余额
 * @returns {Promise<number>} 用户余额
 * @throws {Error} 当获取失败时抛出错误
 * @example
 * ```javascript
 * try {
 *   const balance = await getUserBalance();
 *   console.log('用户余额:', balance);
 * } catch (error) {
 *   console.error('获取余额失败:', error.message);
 * }
 * ```
 */
export const getUserBalance = async () => {
  try {
    // 使用统一的API响应格式获取用户资料
    const response = await api.get('/profile');

    // 确保balance是数字类型
    const balance = Number(response.data.balance);
    if (isNaN(balance)) {
      console.warn('获取到的余额不是有效数字:', response.data.balance);
      return 0;
    }

    return balance;
  } catch (error) {
    console.error('获取用户余额失败:', error);

    // 统一错误处理
    const errorMessage = error.response?.data?.message 
      || error.message 
      || '获取用户余额失败';
    throw new Error(errorMessage);
  }
};

/**
 * 用户充值
 * @param {number} amount - 充值金额，默认为100
 * @returns {Promise<object>} 更新后的用户信息
 * @throws {Error} 当充值失败时抛出错误
 * @example
 * ```javascript
 * try {
 *   const result = await rechargeBalance(50);
 *   console.log('充值成功，当前余额:', result.data.balance);
 * } catch (error) {
 *   console.error('充值失败:', error.message);
 * }
 * ```
 */
export const rechargeBalance = async (amount = 100) => {
  try {
    // 发送充值请求
    const response = await api.post('/user/recharge', { amount });
    
    // 确保获取正确的用户数据
    const userData = response.data?.data || response.data;
    
    // 保持与getProfile函数一致的返回格式
    return {
      ...response,
      data: {
        ...userData,
        balance: parseFloat(userData.balance) || 0 // 确保余额是数字类型
      }
    };
  } catch (error) {
    console.error('充值失败:', error);
    throw new Error(error.response?.data?.message || '充值失败');
  }
};