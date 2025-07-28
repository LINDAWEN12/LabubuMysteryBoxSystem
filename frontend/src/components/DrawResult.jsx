import { useLocation } from 'react-router-dom';

export default function DrawResult() {
  const { state } = useLocation();
  const { result } = state || {};

  if (!result) {
    return <div className="text-center py-8">无效的抽取结果</div>;
  }

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-2xl font-bold mb-6">恭喜获得！</h1>
      
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div 
          className="h-64 bg-cover bg-center"
          style={{ backgroundImage: `url(${result.item.image})` }}
        ></div>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-2">{result.item.name}</h2>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
            result.item.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800' :
            result.item.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
            result.item.rarity === 'rare' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {result.item.rarity}
          </span>
          
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600">来自: {result.order.box.name}</p>
            <p className="text-gray-600">时间: {new Date(result.order.createdAt).toLocaleString()}</p>
          </div>
          
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-bold transition"
          >
            再抽一次
          </button>
        </div>
      </div>
    </div>
  );
}