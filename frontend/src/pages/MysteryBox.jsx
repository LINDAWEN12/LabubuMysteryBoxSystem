import { useState, useEffect } from 'react';
import { getBlindBoxes } from '../api/blindboxes';
import { useNavigate } from 'react-router-dom';

export default function MysteryBox() {
  const [boxes, setBoxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBoxes = async () => {
      try {
        setLoading(true);
        setError('');
        
        // 直接获取数据数组，不检查success字段
        const boxesData = await getBlindBoxes();
        console.log('获取到的盲盒数据:', boxesData); // 调试用
        
        if (boxesData && boxesData.length > 0) {
          setBoxes(boxesData);
        } else {
          setError('暂无盲盒系列');
        }
      } catch (error) {
        console.error('获取盲盒失败:', error);
        setError('获取盲盒列表失败');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBoxes();
  }, []);

  const handleDraw = (id) => {
    navigate(`/draw/${id}`);
  };

  if (loading) {
    return (
      <div className="pb-16 p-4">
        <h1 className="text-2xl font-bold mb-6 text-purple-800">选择盲盒系列</h1>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-2xl h-40 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pb-16 p-4">
        <h1 className="text-2xl font-bold mb-6 text-purple-800">选择盲盒系列</h1>
        <div className="text-red-500 text-center py-8">{error}</div>
      </div>
    );
  }

  return (
    <div className="pb-16 p-4">
      <h1 className="text-2xl font-bold mb-6 text-purple-800">选择盲盒系列</h1>
      
      {boxes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">暂无盲盒系列</div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {boxes.map(box => (
            <BoxCard key={box.id} box={box} onDraw={handleDraw} />
          ))}
        </div>
      )}
    </div>
  );
}
function BoxCard({ box, onDraw }) {
  const colors = ['bg-pink-200', 'bg-purple-200', 'bg-pink-300', 'bg-purple-300'];
  const color = colors[box.id % colors.length] || 'bg-pink-200';

  return (
    <div className={`${color} rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all`}>
      <div className="h-32 flex items-center justify-center">
        <span className="text-4xl">🎁</span>
      </div>
      <div className="p-3 bg-white">
        <h2 className="font-semibold text-pink-900">{box.name}</h2>
        <div className="flex justify-between items-center mt-2">
          <span className="text-purple-700 font-bold">¥{box.price}</span>
          <button 
            onClick={() => onDraw(box.id)}
            className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-3 py-1 rounded-full text-sm"
          >
            抽取
          </button>
        </div>
      </div>
    </div>
  );
}