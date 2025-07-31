import api from "./index";

/**
 * 获取用户余额
 * @returns 用户余额
 * @throws 当获取失败时抛出错误
 */
export const getUserBalance = async () => {
  try {
    // 使用统一的API响应格式
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
 * @param {number} amount 充值金额
 * @returns 更新后的用户信息
 */
export const rechargeBalance = async (amount = 100) => {
  try {
    const response = await api.post('/user/recharge', { amount });
    
    return {
      ...response.data.data,
      balance: parseFloat(response.data.data.balance) || 0
    };
  } catch (error) {
    console.error('充值失败:', error);
    throw new Error(error.response?.data?.message || '充值失败');
  }
};