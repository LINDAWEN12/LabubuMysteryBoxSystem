export default function Home() {
  return (
    <div className="pb-16">
      <div className="bg-gradient-to-br from-pink-400 to-purple-500 text-white p-6 rounded-b-3xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2">梦幻盲盒屋</h1>
        <p className="opacity-90">开启你的惊喜收集之旅</p>
      </div>

      <div className="p-4">
        <h2 className="text-xl font-bold mb-4 text-purple-800">今日推荐</h2>
        <div className="relative h-48 rounded-2xl overflow-hidden mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-300 to-purple-400 flex items-center justify-center">
            <span className="text-white font-bold text-lg">新品盲盒预告</span>
          </div>
        </div>

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
  )
}

function FeatureCard({ title, icon, bgColor, textColor, link }) {
  return (
    <a 
      href={link}
      className={`${bgColor} ${textColor} p-4 rounded-2xl flex flex-col items-center justify-center h-32 shadow-md hover:shadow-lg transition-all`}
    >
      <span className="text-3xl mb-2">{icon}</span>
      <span className="font-semibold">{title}</span>
    </a>
  )
}