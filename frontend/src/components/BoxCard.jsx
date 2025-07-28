function BoxCard({ box, onDraw }) {
  const colors = ['bg-pink-200', 'bg-purple-200', 'bg-blue-200', 'bg-yellow-200'];
  const color = colors[box.id % colors.length] || 'bg-pink-200';

  return (
    <div className={`${color} rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all`}>
      {/* 显示盲盒封面图 */}
      <div 
        className="h-32 flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${box.coverImage})` }}
      >
        {!box.coverImage && <span className="text-4xl">🎁</span>}
      </div>
      <div className="p-3 bg-white">
        <h2 className="font-semibold text-gray-900">{box.name}</h2>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{box.description}</p>
        <div className="flex justify-between items-center mt-2">
          <span className="text-purple-700 font-bold">¥{box.price}</span>
          <button 
            onClick={() => onDraw(box.id)}
            className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-3 py-1 rounded-full text-sm hover:from-pink-500 hover:to-purple-600 transition"
          >
            抽取
          </button>
        </div>
      </div>
    </div>
  );
}