import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBlindBoxById } from '../api/blindboxes';

export default function BlindBoxDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blindBox, setBlindBox] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        console.log(`开始获取盲盒 ${id} 的详情`);
        const startTime = Date.now();
        
        const data = await getBlindBoxById(id);
        console.log('获取到的数据:', data);
        
        if (isMounted) {
          setBlindBox(data);
          setError(null);
          console.log(`获取盲盒详情成功，耗时: ${Date.now() - startTime}ms`);
        }
      } catch (err) {
        console.error('获取盲盒详情出错:', err);
        if (isMounted) {
          setError({
            message: err.message,
            details: err.response?.data
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-64 bg-gray-200 rounded-lg"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <div className="text-red-500 mb-2">加载失败: {error.message}</div>
        <div className="text-sm text-gray-500 mb-4">
          {JSON.stringify(error.details)}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          重新加载
        </button>
      </div>
    );
  }

  if (!blindBox) {
    return (
      <div className="p-4 text-center">
        <div className="text-gray-500">未找到盲盒信息</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* 盲盒封面 */}
        <div
          className="h-64 bg-cover bg-center"
          style={{ backgroundImage: `url(${blindBox.coverImage})` }}
        />
        
        {/* 盲盒信息 */}
        <div className="p-6">
          <h1 className="text-2xl font-bold">{blindBox.name}</h1>
          <p className="text-gray-600 mt-2">{blindBox.description}</p>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-xl font-bold text-pink-500">
              ¥{blindBox.price.toFixed(2)}
            </span>
            <button 
              onClick={() => navigate(`/draw/${id}`)} 
              className="px-6 py-2 bg-pink-500 text-white rounded-full font-bold hover:bg-pink-600 transition"
            >
              立即抽取
            </button>
          </div>
          
          {/* 包含物品 */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">可能包含的物品</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {blindBox.items.map((item) => (
                <div key={item.id} className="border rounded-lg p-3 text-center">
                  <div
                    className="h-24 bg-gray-100 mb-2 rounded bg-cover bg-center"
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                  <h3 className="font-medium">{item.name}</h3>
                  <span className="text-xs text-gray-500">{item.rarity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}