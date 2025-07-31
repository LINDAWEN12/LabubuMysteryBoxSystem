import api from "./index";

export const drawBlindBox = async (boxId) => {
  try {
    const response = await api.post(`/draw/${boxId}`);
    
    if (!response.data?.success) {
      throw new Error(response.data?.message || '抽奖失败');
    }
    
    // 格式化返回数据
    return {
      item: {
        id: response.data.data.item.id,
        name: response.data.data.item.name,
        rarity: response.data.data.item.rarity,
        image: response.data.data.item.image,
        weight: response.data.data.item.weight
      },
      order: {
        id: response.data.data.order.id,
        price: response.data.data.order.price,
        createdAt: response.data.data.order.createdAt,
        itemId: response.data.data.order.itemId,
        boxId: response.data.data.order.boxId
      }
    };
  } catch (error) {
    console.error('抽奖API错误:', error);
    
    // 处理特定错误状态码
    if (error.response?.status === 400) {
      throw new Error('余额不足，请充值');
    } else if (error.response?.status === 404) {
      throw new Error('盲盒不存在');
    } else {
      throw new Error(error.response?.data?.message || '抽奖失败，请重试');
    }
  }
};