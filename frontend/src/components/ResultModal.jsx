export default function ResultModal({ isOpen, onClose, result }) {
  if (!isOpen || !result) return null;

  // 确保 price 是数字类型
  const price = typeof result.order.price === 'string' 
    ? parseFloat(result.order.price)
    : result.order.price;

  const rarityColors = {
    common: 'bg-gray-100 text-gray-800',
    rare: 'bg-blue-100 text-blue-800',
    epic: 'bg-purple-100 text-purple-800',
    legendary: 'bg-yellow-100 text-yellow-800'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl overflow-hidden shadow-2xl max-w-md w-full">
        {/* 顶部装饰 */}
        <div className="h-2 bg-gradient-to-r from-pink-400 to-purple-500"></div>
        
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">恭喜获得!</h3>
          </div>
          
          {/* 奖品展示 */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6 flex flex-col items-center justify-center text-center">
            <div className="mb-3">
              <h4 className="font-bold text-xl">{result.item.name}</h4>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full ${rarityColors[result.item.rarity] || 'bg-gray-100'}`}>
              {result.item.rarity || '普通'}
            </span>
          </div>
          
          {/* 订单信息 */}
          <div className="border-t border-gray-200 pt-4 mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">订单号:</span>
              <span className="font-medium">#{result.order.id}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">价格:</span>
              <span className="font-bold text-purple-600">
                ¥{!isNaN(price) ? price.toFixed(2) : '0.00'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">时间:</span>
              <span>
                {result.order.createdAt 
                  ? new Date(result.order.createdAt).toLocaleString() 
                  : '未知时间'}
              </span>
            </div>
          </div>
          
          {/* 操作按钮 - 修改为返回盲盒界面 */}
          <button
            onClick={() => {
              onClose(); // 先关闭弹窗
              window.location.href = '/mystery-box'; // 跳转到盲盒界面
            }}
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-bold hover:from-pink-600 hover:to-purple-600 transition"
          >
            返回盲盒界面
          </button>
        </div>
      </div>
    </div>
  );
}