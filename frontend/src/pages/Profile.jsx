import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../api/auth';
import { getOrders } from '../api/orders';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('collection');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, ordersData] = await Promise.all([
          getProfile(),
          getOrders()
        ]);
        
        setUser(profileData);
        setOrders(ordersData);
        
        // 模拟心愿单数据
        setWishlist([
          { id: 1, name: '甜心动物系列' },
          { id: 2, name: '魔法少女系列' },
          { id: 3, name: '梦幻独角兽' }
        ]);
      } catch (error) {
        console.error('获取数据失败:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading || !user) {
    return (
      <div className="pb-16">
        <div className="bg-gradient-to-r from-pink-400 to-purple-500 p-6 pt-12 rounded-b-3xl text-white">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-3xl mr-4">
              👤
            </div>
            <div>
              <h1 className="text-xl font-bold">加载中...</h1>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-16">
      <div className="bg-gradient-to-r from-pink-400 to-purple-500 p-6 pt-12 rounded-b-3xl text-white">
        <div className="flex items-center">
          <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-3xl mr-4">
            {user.username?.charAt(0) || '👤'}
          </div>
          <div>
            <h1 className="text-xl font-bold">{user.username}</h1>
            <p className="text-sm opacity-80">
              {user.balance ? `余额: ¥${user.balance.toFixed(2)}` : '新用户'}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="bg-white rounded-2xl shadow-md p-4 -mt-8 mb-6">
          <div className="grid grid-cols-3 divide-x divide-gray-200 text-center py-2">
            <StatItem 
              value={orders.length} 
              label="已收集" 
            />
            <StatItem 
              value={wishlist.length} 
              label="心愿单" 
            />
            <StatItem 
              value={new Date(user.createdAt).toLocaleDateString()} 
              label="加入日期" 
            />
          </div>
        </div>

        <div className="flex border-b border-gray-200 mb-4">
          <TabButton 
            active={activeTab === 'collection'}
            onClick={() => setActiveTab('collection')}
          >
            我的收藏
          </TabButton>
          <TabButton 
            active={activeTab === 'wishlist'}
            onClick={() => setActiveTab('wishlist')}
          >
            心愿单
          </TabButton>
          <TabButton 
            active={activeTab === 'settings'}
            onClick={() => setActiveTab('settings')}
          >
            设置
          </TabButton>
        </div>

        {activeTab === 'collection' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                您还没有任何收藏
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {orders.map(order => (
                  <div 
                    key={order.id} 
                    className="bg-pink-50 rounded-lg p-3 flex flex-col items-center"
                  >
                    <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center text-2xl mb-2">
                      🎁
                    </div>
                    <p className="font-medium text-sm text-center">
                      {order.item?.name || '未知物品'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'wishlist' && (
          <div className="space-y-3">
            {wishlist.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                您的心愿单是空的
              </div>
            ) : (
              wishlist.map(item => (
                <div 
                  key={item.id} 
                  className="bg-purple-50 p-3 rounded-lg flex justify-between items-center"
                >
                  <span className="font-medium">{item.name}</span>
                  <button 
                    className="text-pink-500 text-sm"
                    onClick={() => navigate('/mystery-box')}
                  >
                    去抽取
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4">
            <SettingItem 
              icon="⚙️" 
              title="账户设置" 
              onClick={() => console.log('账户设置')}
            />
            <SettingItem 
              icon="🔔" 
              title="通知设置" 
              onClick={() => console.log('通知设置')}
            />
            <SettingItem 
              icon="🛡️" 
              title="隐私设置" 
              onClick={() => console.log('隐私设置')}
            />
            <SettingItem 
              icon="❓" 
              title="帮助中心" 
              onClick={() => console.log('帮助中心')}
            />
            <button 
              className="w-full text-red-500 py-3 border-t border-gray-200 mt-4 text-left"
              onClick={handleLogout}
            >
              退出登录
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function StatItem({ value, label }) {
  return (
    <div className="px-2">
      <p className="font-bold text-lg text-purple-800">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

function TabButton({ children, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`flex-1 py-2 font-medium text-sm ${
        active ? 'text-pink-600 border-b-2 border-pink-600' : 'text-gray-500'
      }`}
    >
      {children}
    </button>
  );
}

function SettingItem({ icon, title, onClick }) {
  return (
    <button 
      className="flex items-center p-3 bg-white rounded-lg shadow-sm w-full text-left"
      onClick={onClick}
    >
      <span className="text-xl mr-3">{icon}</span>
      <span className="flex-1">{title}</span>
      <span>›</span>
    </button>
  );
}