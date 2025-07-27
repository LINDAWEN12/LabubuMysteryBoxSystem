import { useState } from 'react';

export default function PostCard({ post }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-md">
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-xl mr-3">
          {post.avatar || '👤'}
        </div>
        <div>
          <p className="font-semibold">{post.user || '匿名用户'}</p>
          <p className="text-gray-500 text-xs">{post.time || '刚刚'}</p>
        </div>
      </div>
      <p className="mb-3">{post.content}</p>
      {post.image && (
        <div className="h-40 rounded-xl overflow-hidden mb-3">
          <img
            src={post.image}
            alt="玩家分享"
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="flex items-center text-gray-500">
        <button
          className={`flex items-center mr-4 ${liked ? 'text-pink-500' : ''}`}
          onClick={handleLike}
        >
          <span className="mr-1">❤️</span>
          <span>{likeCount}</span>
        </button>
        <button className="flex items-center">
          <span className="mr-1">💬</span>
          <span>评论</span>
        </button>
      </div>
    </div>
  );
}