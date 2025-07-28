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
        // 确保有token存在
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('未找到认证令牌');
        }
        
        const boxes = await getBlindBoxes();
        setFeaturedBox(boxes[0]); // 获取第一个盲盒作为推荐
      } catch (error) {
        console.error('获取推荐盲盒失败:', error);
        setError('获取数据失败，请检查登录状态');
        
        // 如果是401错误，由axios拦截器处理跳转
        if (error.response?.status !== 401) {
          // 对于非401错误，显示错误信息但不自动跳转
          setError(error.message || '获取数据失败');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeaturedBox();
  }, []);

  if (loading) return <div className="text-center py-8">加载中...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!featuredBox) return <div className="text-center py-8">暂无推荐盲盒哈</div>;
  return (
    <div className="pb-16">
      <div className="bg-gradient-to-br from-pink-400 to-purple-500 text-white p-6 rounded-b-3xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2">梦幻盲盒屋</h1>
        <p className="opacity-90">开启你的惊喜收集之旅</p>
      </div>

      <div className="p-4">
        <h2 className="text-xl font-bold mb-4 text-purple-800">今日推荐</h2>
        
        {loading ? (
          <div className="h-48 rounded-2xl bg-gray-100 animate-pulse"></div>
        ) : featuredBox ? (
          <div 
            className="relative h-48 rounded-2xl overflow-hidden mb-6"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(236, 72, 153, 0.7), rgba(168, 85, 247, 0.7))`,
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div className="text-center text-white">
                <h3 className="text-xl font-bold mb-1">{featuredBox.name}</h3>
                <p className="text-sm opacity-90 mb-3">{featuredBox.description}</p>
                <button className="bg-white text-pink-600 px-4 py-1 rounded-full text-sm font-medium">
                  立即探索
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-48 bg-gray-100 rounded-2xl flex items-center justify-center">
            <span className="text-gray-500">暂无推荐</span>
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