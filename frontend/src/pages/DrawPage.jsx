import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { drawBlindBox } from '../api/blindboxes';
import { getUserBalance } from '../api/user';
import ResultModal from '../components/ResultModal';
import { getBlindBoxById } from '../api/blindboxes';

export default function DrawPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [balance, setBalance] = useState(0);
  const [boxPrice, setBoxPrice] = useState(0);
  const [boxData, setBoxData] = useState(null);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // 获取用户余额
        const userBalance = await getUserBalance();
        setBalance(userBalance);
        
        // 获取盲盒数据
        const box = await getBlindBoxById(id);
        setBoxData(box);
        setBoxPrice(box.price);
        
        // 检查余额是否足够
        if (userBalance < box.price) {
          setError('余额不足，请充值');
        }
      } catch (err) {
        console.error('获取数据失败:', err);
        setError(err.message || '获取数据失败');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const handleDraw = async () => {
    try {
      setLoading(true);
      setError('');
      setIsShaking(true);
      
      // 添加抽奖动画延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 调用抽奖API
      console.log('开始调用抽奖API，boxId:', id);
      const drawResult = await drawBlindBox(id);
      console.log('抽奖结果数据:', drawResult);
      
      // 确保drawResult有有效的数据结构
      if (!drawResult || !drawResult.item || !drawResult.order) {
        throw new Error('抽奖结果数据不完整');
      }
      
      // 更新本地余额
      setBalance(prev => prev - boxPrice);
      
      // 显示抽奖结果
      setResult({
      item: {
        id: drawResult.item.id,
        name: drawResult.item.name || '未知物品',
        rarity: drawResult.item.rarity || 'common',
        image: drawResult.item.image || '/images/default-item.jpg'
      },
      order: {
        id: drawResult.order.id,
        price: drawResult.order.price,
        createdAt: drawResult.order.createdAt || new Date().toISOString()
      }
    });
      setShowResult(true);
      console.log('设置showResult为true，应该显示弹窗');
    } catch (err) {
      console.error('抽奖失败:', err);
      // 添加详细的错误信息日志
      if (err.response) {
        console.error('错误响应状态:', err.response.status);
        console.error('错误响应数据:', err.response.data);
      }
      setError(err.message || '抽奖失败');
    } finally {
      setLoading(false);
      setIsShaking(false);
    }
  };

  if (loading && !showResult) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center max-w-md w-full">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">{error}</h2>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate('/profile')}
              className="px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition"
            >
              去充值
            </button>
            <button
              onClick={() => navigate('/blindboxes')}
              className="px-4 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition"
            >
              返回盲盒列表
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* 顶部装饰条 */}
        <div className="h-2 bg-gradient-to-r from-pink-400 to-purple-500"></div>
        
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center text-purple-800 mb-6">盲盒抽奖</h2>
          
          {/* 盲盒展示区域 */}
          <div className="relative mb-8">
            <div className={`w-full h-64 rounded-xl overflow-hidden shadow-lg transition-all duration-500 ${isShaking ? 'animate-shake' : ''}`}>
              {boxData?.coverImage ? (
                <img 
                  src={boxData.coverImage} 
                  alt={boxData.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                  <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <p className="mt-2 text-purple-500">神秘盲盒</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* 盲盒标签 */}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md border border-purple-100">
              <span className="font-bold text-purple-600">{boxData?.name || '神秘盲盒'}</span>
            </div>
          </div>
          
          {/* 价格信息 */}
          <div className="bg-purple-50 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-purple-700">当前余额</p>
                <p className="text-2xl font-bold text-purple-800">¥{balance.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-purple-700">盲盒价格</p>
                <p className="text-2xl font-bold text-purple-800">¥{boxPrice.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          {/* 抽奖按钮 */}
          <button
            onClick={handleDraw}
            disabled={balance < boxPrice || loading}
            className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all duration-300 ${
              balance >= boxPrice 
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 hover:shadow-xl' 
                : 'bg-gray-300 cursor-not-allowed'
            } ${loading ? 'opacity-70' : ''}`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                正在抽取...
              </span>
            ) : balance >= boxPrice ? (
              '立即抽取'
            ) : (
              '余额不足'
            )}
          </button>
          
          {/* 返回按钮 */}
          <button
            onClick={() => navigate('/mystery-box')}
            className="w-full mt-4 py-2 text-purple-600 font-medium rounded-lg hover:bg-purple-50 transition"
          >
            返回盲盒列表
          </button>
        </div>
      </div>
      
      {/* 抽奖结果弹窗 */}
      {showResult && (
        <ResultModal 
          isOpen={showResult}
          onClose={() => {
            console.log('关闭弹窗');
            setShowResult(false);
            navigate(`/order/${result?.order?.id || ''}`);
          }}
          result={result}
        />
      )}
    </div>
  );
}