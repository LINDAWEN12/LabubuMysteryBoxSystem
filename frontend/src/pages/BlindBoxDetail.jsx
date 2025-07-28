import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBlindBoxById } from '../api/blindboxes';
import { drawBlindBox } from '../api/blindboxes';

export default function BlindBoxDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blindBox, setBlindBox] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    const fetchBlindBox = async () => {
      try {
        const box = await getBlindBoxById(id);
        setBlindBox(box);
      } catch (error) {
        setError(error.message || '获取盲盒详情失败');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlindBox();
  }, [id]);

  const handleDraw = async () => {
    try {
      setDrawing(true);
      const result = await drawBlindBox(id);
      navigate(`/result/${result.item.id}`, { state: { result } });
    } catch (error) {
      setError(error.message || '抽取盲盒失败');
    } finally {
      setDrawing(false);
    }
  };

  if (loading) return <div className="text-center py-8">加载中...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!blindBox) return <div className="text-center py-8">盲盒不存在</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* 盲盒封面 */}
        <div 
          className="h-64 bg-cover bg-center"
          style={{ backgroundImage: `url(${blindBox.coverImage})` }}
        ></div>
        
        {/* 盲盒信息 */}
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">{blindBox.name}</h1>
          <p className="text-gray-600 mb-4">{blindBox.description}</p>
          <div className="flex justify-between items-center mb-6">
            <span className="text-xl font-bold text-pink-500">¥{blindBox.price}</span>
            <button 
              onClick={handleDraw}
              disabled={drawing}
              className={`px-6 py-2 rounded-full font-bold ${drawing ? 'bg-gray-400' : 'bg-pink-500 hover:bg-pink-600'} text-white transition`}
            >
              {drawing ? '抽取中...' : '立即抽取'}
            </button>
          </div>
          
          {/* 包含物品预览 */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">可能包含的物品</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {blindBox.items?.map(item => (
                <div key={item.id} className="border rounded-lg p-3 text-center">
                  <div className="h-24 bg-gray-100 mb-2 rounded-md bg-cover bg-center"
                    style={{ backgroundImage: `url(${item.image})` }}></div>
                  <h3 className="font-medium">{item.name}</h3>
                  <span className={`text-xs ${
                    item.rarity === 'legendary' ? 'text-yellow-500' :
                    item.rarity === 'epic' ? 'text-purple-500' :
                    item.rarity === 'rare' ? 'text-blue-500' : 'text-gray-500'
                  }`}>
                    {item.rarity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}