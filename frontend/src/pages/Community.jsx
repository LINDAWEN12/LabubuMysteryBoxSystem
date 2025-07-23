import { useState } from 'react'

export default function Community() {
  const [posts] = useState([
    { 
      id: 1, 
      user: '小甜心', 
      avatar: '🌸', 
      content: '今天抽到了隐藏款的独角兽！太幸运了！', 
      likes: 24,
      time: '2小时前'
    },
    { 
      id: 2, 
      user: '梦幻少女', 
      avatar: '✨', 
      content: '这个系列的盲盒设计太戳我了，已经收集全套了！', 
      likes: 15,
      time: '5小时前'
    },
    { 
      id: 3, 
      user: '星星糖', 
      avatar: '⭐', 
      content: '有没有人想交换重复的款式呀？', 
      likes: 8,
      time: '1天前'
    },
  ])

  return (
    <div className="pb-16 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-purple-800">玩家秀</h1>
        <button className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-4 py-2 rounded-full text-sm">
          发布动态
        </button>
      </div>

      <div className="space-y-4">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}

function PostCard({ post }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-md">
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-xl mr-3">
          {post.avatar}
        </div>
        <div>
          <p className="font-semibold">{post.user}</p>
          <p className="text-gray-500 text-xs">{post.time}</p>
        </div>
      </div>
      <p className="mb-3">{post.content}</p>
      <div className="h-40 bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl flex items-center justify-center mb-3">
        <span className="text-gray-500">玩家分享图片</span>
      </div>
      <div className="flex items-center text-gray-500">
        <button className="flex items-center mr-4">
          <span className="mr-1">❤️</span>
          <span>{post.likes}</span>
        </button>
        <button className="flex items-center">
          <span className="mr-1">💬</span>
          <span>评论</span>
        </button>
      </div>
    </div>
  )
}