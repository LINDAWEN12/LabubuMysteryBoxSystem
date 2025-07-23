import { useState } from 'react'

export default function Profile() {
  const [user] = useState({
    name: '梦幻少女',
    level: '黄金收藏家',
    collected: 28,
    wishlist: 5,
    joined: '2025-03-15'
  })

  const [activeTab, setActiveTab] = useState('collection')

  return (
    <div className="pb-16">
      <div className="bg-gradient-to-r from-pink-400 to-purple-500 p-6 pt-12 rounded-b-3xl text-white">
        <div className="flex items-center">
          <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-3xl mr-4">
            👑
          </div>
          <div>
            <h1 className="text-xl font-bold">{user.name}</h1>
            <p className="text-sm opacity-80">{user.level}</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="bg-white rounded-2xl shadow-md p-4 -mt-8 mb-6">
          <div className="grid grid-cols-3 divide-x divide-gray-200 text-center py-2">
            <StatItem value={user.collected} label="已收集" />
            <StatItem value={user.wishlist} label="心愿单" />
            <StatItem value={user.joined} label="加入日期" />
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
          <div className="grid grid-cols-3 gap-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-pink-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🎁</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'wishlist' && (
          <div className="space-y-3">
            {['甜心动物', '魔法少女', '梦幻独角兽'].map(item => (
              <div key={item} className="bg-purple-50 p-3 rounded-lg flex justify-between items-center">
                <span>{item}</span>
                <button className="text-pink-500">去抽取</button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4">
            <SettingItem icon="⚙️" title="账户设置" />
            <SettingItem icon="🔔" title="通知设置" />
            <SettingItem icon="🛡️" title="隐私设置" />
            <SettingItem icon="❓" title="帮助中心" />
            <button className="w-full text-red-500 py-3 border-t border-gray-200 mt-4">
              退出登录
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function StatItem({ value, label }) {
  return (
    <div className="px-2">
      <p className="font-bold text-lg text-purple-800">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  )
}

function TabButton({ children, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`flex-1 py-2 font-medium ${active ? 'text-pink-600 border-b-2 border-pink-600' : 'text-gray-500'}`}
    >
      {children}
    </button>
  )
}

function SettingItem({ icon, title }) {
  return (
    <div className="flex items-center p-2 bg-white rounded-lg shadow-sm">
      <span className="text-xl mr-3">{icon}</span>
      <span className="flex-1">{title}</span>
      <span>›</span>
    </div>
  )
}