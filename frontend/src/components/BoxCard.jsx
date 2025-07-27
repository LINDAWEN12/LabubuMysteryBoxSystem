import { useState } from 'react';

export default function BoxCard({ box }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`bg-white rounded-2xl overflow-hidden shadow-md transition-all ${
        isHovered ? 'shadow-lg transform scale-105' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="h-40 flex items-center justify-center bg-gray-100">
        {box.coverImage ? (
          <img 
            src={box.coverImage} 
            alt={box.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-4xl">🎁</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800">{box.name}</h3>
        <div className="flex justify-between items-center mt-2">
          <span className="text-purple-600 font-bold">¥{box.price}</span>
          <button className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-3 py-1 rounded-full text-sm">
            抽取
          </button>
        </div>
      </div>
    </div>
  );
}