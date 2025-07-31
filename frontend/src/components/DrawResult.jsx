import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DrawResult({ result, onClose }) {
  const navigate = useNavigate();

  // 稀有度颜色映射
  const rarityColors = {
    common: 'bg-gray-100 text-gray-800',
    rare: 'bg-blue-100 text-blue-800',
    epic: 'bg-purple-100 text-purple-800',
    legendary: 'bg-yellow-100 text-yellow-800'
  };

  // 自动关闭弹窗
  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // 3秒后自动关闭
      return () => clearTimeout(timer);
    }
  }, [result, onClose]);

  if (!result) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-sm w-full animate-pop-in">
        {/* 顶部装饰条 */}
        <div className="h-2 bg-gradient-to-r from-pink-400 to-purple-500"></div>
        
        <div className="p-6 text-center">
          {/* 恭喜标题 */}
          <div className="mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-800 mt-2">恭喜获得!</h2>
          </div>
          
          {/* 奖品展示 */}
          <div className="mb-4">
            <div className="w-32 h-32 mx-auto rounded-lg overflow-hidden border-4 border-yellow-300 shadow-md">
              <img 
                src={result.item.image} 
                alt={result.item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-lg font-semibold mt-3">{result.item.name}</h3>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${rarityColors[result.item.rarity] || 'bg-gray-100'}`}>
              {result.item.rarity || '普通'}
            </span>
          </div>
          
          {/* 操作按钮 */}
          <div className="flex justify-center space-x-3 mt-4">
            <button
              onClick={() => navigate(`/order/${result.order.id}`)}
              className="px-4 py-2 bg-purple-500 text-white rounded-full text-sm hover:bg-purple-600 transition"
            >
              查看详情
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-pink-500 text-white rounded-full text-sm hover:bg-pink-600 transition"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}