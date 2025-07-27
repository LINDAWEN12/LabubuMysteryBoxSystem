import { useState, useEffect } from 'react';
import { getShowcases } from '../api/showcases';

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShowcases = async () => {
      try {
        const data = await getShowcases();
        setPosts(data);
      } catch (error) {
        console.error('获取玩家秀失败:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchShowcases();
  }, []);

  if (loading) {
    return (
      <div className="pb-16 p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-purple-800">玩家秀</h1>
        </div>
        <div>加载中...</div>
      </div>
    );
  }

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
  );
}

function PostCard({ post }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-md">
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-xl mr-3">
          {post.user?.username?.charAt(0) || '👤'}
        </div>
        <div>
          <p className="font-semibold">{post.user?.username || '匿名用户'}</p>
          <p className="text-gray-500 text-xs">
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
      <p className="mb-3">{post.comment}</p>
      {post.image && (
        <div className="h-40 bg-gray-100 rounded-xl flex items-center justify-center mb-3 overflow-hidden">
          <img 
            src={post.image} 
            alt="玩家分享" 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="flex items-center text-gray-500">
        <button className="flex items-center mr-4">
          <span className="mr-1">❤️</span>
          <span>{post.likes || 0}</span>
        </button>
        <button className="flex items-center">
          <span className="mr-1">💬</span>
          <span>评论</span>
        </button>
      </div>
    </div>
  );
}