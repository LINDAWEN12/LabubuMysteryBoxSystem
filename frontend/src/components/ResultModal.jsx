export default function ResultModal({ isOpen, onClose, result }) {
  if (!isOpen || !result) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-center text-purple-800 mb-4">抽奖结果</h2>
        
        <div className="flex flex-col items-center mb-6">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <img 
              src={result.item.image} 
              alt={result.item.name}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <h3 className="text-xl font-semibold">{result.item.name}</h3>
          <p className="text-gray-600">稀有度: {result.item.rarity}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <p className="text-gray-700">订单号: {result.order.id}</p>
          <p className="text-gray-700">价格: ¥{result.order.price.toFixed(2)}</p>
          <p className="text-gray-700">时间: {new Date(result.order.createdAt).toLocaleString()}</p>
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-purple-500 text-white rounded-full"
          >
            查看订单详情
          </button>
        </div>
      </div>
    </div>
  );
}