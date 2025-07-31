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
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // 获取用户余额
        const userBalance = await getUserBalance();
        setBalance(userBalance);
        
        // 获取盲盒价格
        const boxData = await getBlindBoxById(id);
        setBoxPrice(boxData.price);
        
        // 检查余额是否足够
        if (userBalance < boxData.price) {
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
      
      // 调用抽奖API
      const drawResult = await drawBlindBox(id);
      
      // 更新本地余额
      setBalance(prev => prev - boxPrice);
      
      // 显示抽奖结果
      setResult(drawResult);
      setShowResult(true);
    } catch (err) {
      console.error('抽奖失败:', err);
      setError(err.message || '抽奖失败');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !showResult) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-xl font-bold text-red-500 mb-4">{error}</h2>
          <button
            onClick={() => navigate('/blindboxes')}
            className="px-4 py-2 bg-purple-500 text-white rounded-md"
          >
            返回盲盒列表
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
        <h2 className="text-xl font-bold text-purple-800 mb-4">盲盒抽奖</h2>
        
        <div className="mb-4">
          <p className="text-gray-600">当前余额: <span className="font-bold">¥{balance.toFixed(2)}</span></p>
          <p className="text-gray-600">盲盒价格: <span className="font-bold">¥{boxPrice.toFixed(2)}</span></p>
        </div>
        
        <div className="flex justify-center mb-6">
          <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">盲盒封面</span>
          </div>
        </div>
        
        <button
          onClick={handleDraw}
          disabled={balance < boxPrice}
          className={`w-full py-3 rounded-full text-white font-bold ${balance >= boxPrice ? 
            'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700' : 
            'bg-gray-400 cursor-not-allowed'}`}
        >
          {balance >= boxPrice ? '立即抽取' : '余额不足'}
        </button>
      </div>
      
      {/* 抽奖结果弹窗 */}
      <ResultModal 
        isOpen={showResult}
        onClose={() => {
          setShowResult(false);
          navigate(`/order/${result.order.id}`);
        }}
        result={result}
      />
    </div>
  );
}