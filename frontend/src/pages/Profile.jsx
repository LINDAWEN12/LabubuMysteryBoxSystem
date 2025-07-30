import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { getProfile, updateAvatar } from '../api/auth';
import { getOrders } from '../api/orders';

// 使用import.meta.env获取环境变量（Vite）
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// 统一图片URL处理（与您的习惯保持一致）
const formatImageUrl = (path, defaultPath = '/images/default.jpg') => {
  if (!path) return `${API_BASE_URL}${defaultPath}`;
  return path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
};

export default function Profile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileResponse, ordersResponse] = await Promise.all([
          getProfile(),
          getOrders()
        ]);
        
        // 处理用户数据
        const userData = profileResponse.data?.data || profileResponse.data;
        setUser({
          ...userData,
          avatar: userData.avatar ? formatImageUrl(userData.avatar, '/images/default-avatar.jpg') : ''
        });
        
        if (userData.avatar) {
          setAvatarPreview(formatImageUrl(userData.avatar, '/images/default-avatar.jpg'));
        }

        // 处理订单数据
        const ordersData = ordersResponse.data?.data || ordersResponse.data;
        setOrders(Array.isArray(ordersData) ? ordersData.map(order => ({
          ...order,
          box: order.box ? {
            ...order.box,
            coverImage: formatImageUrl(order.box.coverImage, '/images/default-box.jpg')
          } : null,
          item: order.item ? {
            ...order.item,
            image: formatImageUrl(order.item.image, '/images/default-item.jpg')
          } : null
        })) : []);
        
      } catch (error) {
        console.error('获取数据失败:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      
      const response = await updateAvatar(formData);
      const updatedUser = response.data?.data || response.data;
      
      setUser({
        ...updatedUser,
        avatar: formatImageUrl(updatedUser.avatar, '/images/default-avatar.jpg')
      });
      setAvatarPreview(formatImageUrl(updatedUser.avatar, '/images/default-avatar.jpg'));
      setAvatarFile(null);
    } catch (error) {
      console.error('头像上传失败:', error);
    }
  };

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
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center overflow-hidden mr-4">
              {avatarPreview ? (
                <img 
                  src={avatarPreview} 
                  alt="用户头像" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl">
                  {user.username?.charAt(0)?.toUpperCase() || '👤'}
                </span>
              )}
            </div>
            <label 
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 bg-white rounded-full w-6 h-6 flex items-center justify-center text-xs cursor-pointer"
            >
              ✏️
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          <div>
            <h1 className="text-xl font-bold">{user.username}</h1>
            <p className="text-sm opacity-80">
              余额: ¥{user.balance?.toFixed(2) || '0.00'}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4">
        {avatarFile && (
          <div className="mb-4 flex items-center justify-between bg-white p-3 rounded-lg shadow">
            <span className="text-sm">新头像已选择</span>
            <button
              onClick={handleAvatarUpload}
              className="bg-pink-500 text-white px-3 py-1 rounded text-sm"
            >
              上传头像
            </button>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3">订单历史</h2>
          
          {orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              您还没有任何订单记录
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map(order => (
                <div 
                  key={order.id} 
                  className="bg-white rounded-lg shadow-sm p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">订单 #{order.id}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span className="font-bold text-pink-600">
                      ¥{order.price?.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex items-center mt-3 pt-3 border-t border-gray-100">
                    <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mr-3 overflow-hidden">
                      <img 
                        src={order.item?.image || `${API_BASE_URL}/images/default-item.jpg`} 
                        alt={order.item?.name || '未知物品'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{order.item?.name || '未知物品'}</p>
                      <p className="text-xs text-gray-500">
                        来自: {order.box?.name || '未知盲盒'}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      order.item?.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                      order.item?.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                      order.item?.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.item?.rarity || '普通'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button 
          className="w-full bg-gray-100 text-gray-800 py-3 rounded-lg text-center mt-6"
          onClick={handleLogout}
        >
          退出登录
        </button>
      </div>
    </div>
  );
}