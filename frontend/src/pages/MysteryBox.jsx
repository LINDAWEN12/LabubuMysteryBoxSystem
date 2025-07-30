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
        
        console.log('开始获取盲盒数据...'); // 调试
        const boxesData = await getBlindBoxes();
        console.log('获取到的盲盒数据:', boxesData); // 调试
        
        if (boxesData && boxesData.length > 0) {
          setBoxes(boxesData);
        } else {
          setError('暂无盲盒系列');
          console.warn('获取到的盲盒数据为空'); // 调试
        }
      } catch (error) {
        console.error('获取盲盒失败:', error);
        setError(error.message || '获取盲盒列表失败');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBoxes();
  }, []);

  const handleDraw = (id) => {
  navigate(`/draw/${id}`);
};

const handleViewDetail = (id) => {
  navigate(`/blindbox/${id}`);
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
        <div className="text-red-500 text-center py-8">
          {error}
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-md"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-16 p-4">
      <h1 className="text-2xl font-bold mb-6 text-purple-800">选择盲盒系列</h1>
      
      {boxes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          暂无盲盒系列
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-md"
          >
            刷新
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {boxes.map(box => (
            <BoxCard key={box.id} box={box} onDraw={handleDraw} onViewDetail={handleViewDetail} />
          ))}
        </div>
      )}
    </div>
  );
}

function BoxCard({ box, onDraw, onViewDetail }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer" onClick={() => onViewDetail(box.id)}>
      {/* 使用实际封面图片 */}
      <div 
        className="h-32 bg-cover bg-center"
        style={{ backgroundImage: `url(${box.coverImage})` }}
      ></div>
      <div className="p-3">
        <h2 className="font-semibold text-lg text-pink-900">{box.name}</h2>
        <p className="text-sm text-gray-600 mt-1">{box.description}</p>
        <div className="flex justify-between items-center mt-3">
          <span className="text-purple-700 font-bold">¥{box.price.toFixed(2)}</span>
          <button 
            onClick={(e) => { e.stopPropagation(); onDraw(box.id); }}
            className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-4 py-1 rounded-full text-sm hover:from-pink-500 hover:to-purple-600 transition"
          >
            抽取
          </button>
        </div>
      </div>
    </div>
  );
}