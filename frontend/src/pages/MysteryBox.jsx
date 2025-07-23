import { useState } from 'react'

export default function MysteryBox() {
  const [boxes] = useState([
    { id: 1, name: '甜心动物系列', price: 79, color: 'bg-pink-200' },
    { id: 2, name: '魔法少女系列', price: 99, color: 'bg-purple-200' },
    { id: 3, name: '梦幻独角兽', price: 89, color: 'bg-pink-300' },
    { id: 4, name: '星空仙子', price: 109, color: 'bg-purple-300' },
  ])

  return (
    <div className="pb-16 p-4">
      <h1 className="text-2xl font-bold mb-6 text-purple-800">选择盲盒系列</h1>
      
      <div className="grid grid-cols-2 gap-4">
        {boxes.map(box => (
          <BoxCard key={box.id} box={box} />
        ))}
      </div>
    </div>
  )
}

function BoxCard({ box }) {
  return (
    <div className={`${box.color} rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all`}>
      <div className="h-32 flex items-center justify-center">
        <span className="text-4xl">🎀</span>
      </div>
      <div className="p-3 bg-white">
        <h2 className="font-semibold text-pink-900">{box.name}</h2>
        <div className="flex justify-between items-center mt-2">
          <span className="text-purple-700 font-bold">¥{box.price}</span>
          <button className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-3 py-1 rounded-full text-sm">
            抽取
          </button>
        </div>
      </div>
    </div>
  )
}