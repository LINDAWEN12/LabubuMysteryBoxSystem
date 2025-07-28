import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBlindBoxes } from '../api/blindboxes';
import FeatureCard from '../components/FeatureCard';

export default function Home() {
  const [featuredBox, setFeaturedBox] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

 useEffect(() => {
  const fetchFeaturedBox = async () => {
    try {
      setLoading(true);
      setError('');
      
      const boxes = await getBlindBoxes();
      console.log('获取到的盲盒数据:', boxes); // 调试
      
      if (boxes?.length > 0) {
        setFeaturedBox(boxes[0]);
      } else {
        setError('暂无推荐盲盒');
      }
    } catch (error) {
      console.error('获取推荐盲盒失败:', error);
      setError(error.message || '获取盲盒列表失败');
      
      // 特殊处理304状态码
      if (error.response?.status === 304) {
        console.log('使用缓存数据');
        // 可以在这里尝试从本地存储获取缓存数据
      }
    } finally {
      setLoading(false);
    }
  };
  
  fetchFeaturedBox();
}, []);

  if (loading) return <div className="text-center py-8">加载中...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="pb-16">
      {/* 头部 */}
      <div className="bg-gradient-to-br from-pink-400 to-purple-500 text-white p-6 rounded-b-3xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2">梦幻盲盒屋</h1>
        <p className="opacity-90">开启你的惊喜收集之旅</p>
      </div>

      <div className="p-4">
        <h2 className="text-xl font-bold mb-4 text-purple-800">今日推荐</h2>
        
        {featuredBox ? (
          <div 
            className="relative h-48 rounded-2xl overflow-hidden mb-6 bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${featuredBox.coverImage})`
            }}
            onClick={() => navigate(`/blindbox/${featuredBox.id}`)}
          >
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div className="text-center text-white">
                <h3 className="text-xl font-bold mb-1">{featuredBox.name}</h3>
                <p className="text-sm opacity-90 mb-3">{featuredBox.description}</p>
                <button 
                  className="bg-white text-pink-600 px-4 py-1 rounded-full text-sm font-medium hover:bg-pink-50 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/blindbox/${featuredBox.id}`);
                  }}
                >
                  立即探索
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-48 bg-gray-100 rounded-2xl flex items-center justify-center">
            <span className="text-gray-500">暂无推荐盲盒</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <FeatureCard 
            title="立即抽盒" 
            icon="🎁"
            bgColor="bg-pink-100"
            textColor="text-pink-700"
            link="/mystery-box"
          />
          <FeatureCard 
            title="玩家秀" 
            icon="👥"
            bgColor="bg-purple-100"
            textColor="text-purple-700"
            link="/community"
          />
        </div>
      </div>
    </div>
  );
}