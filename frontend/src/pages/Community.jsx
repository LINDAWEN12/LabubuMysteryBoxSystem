import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Community() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/showcases');
        // 确保使用 response.data.data 而不是 response.data
        setPosts(response.data.data || []);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="community-page">
      <h1>玩家社区</h1>
      <div className="posts-container">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="post-card">
              <img src={post.image} alt="展示图片" />
              <p>{post.comment}</p>
              <small>Posted by: {post.user?.username}</small>
            </div>
          ))
        ) : (
          <p>暂无玩家秀，快来分享你的第一个盲盒吧！</p>
        )}
      </div>
    </div>
  );
}

export default Community;