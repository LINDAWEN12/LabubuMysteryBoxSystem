import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getShowcases, createShowcase } from '../api/showcases';
import './Community.css';

function Community() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    image: null,
    comment: '',
    itemId: '',
    previewImage: null
  });
  const [uploading, setUploading] = useState(false);

  // 获取玩家秀列表
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await getShowcases();
        setPosts(data);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('获取玩家秀失败，请稍后重试');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // 处理图片选择
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadData({
          ...uploadData,
          image: file,
          previewImage: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // 提交上传表单
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!uploadData.image) {
      setError('请选择要上传的图片');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('image', uploadData.image);
      formData.append('comment', uploadData.comment);
      formData.append('itemId', uploadData.itemId);

      const newShowcase = await createShowcase(formData);
      
      setPosts([newShowcase, ...posts]);
      setShowUploadModal(false);
      setUploadData({
        image: null,
        comment: '',
        itemId: '',
        previewImage: null
      });
    } catch (err) {
      console.error('Error uploading showcase:', err);
      setError(err.message || '上传失败，请稍后重试');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>加载中...</p>
      </div>
    );
  }

  if (error && posts.length === 0) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>重新加载</button>
      </div>
    );
  }

  return (
    <div className="community-page">
      {/* 上传模态框 */}
      {showUploadModal && (
        <div className="modal-overlay">
          <div className="upload-modal">
            <div className="modal-header">
              <h3>上传我的盲盒</h3>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="close-button"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="showcase-image">选择图片</label>
                <input
                  id="showcase-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />
                {uploadData.previewImage && (
                  <img 
                    src={uploadData.previewImage} 
                    alt="预览" 
                    className="image-preview"
                  />
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="showcase-comment">描述</label>
                <textarea
                  id="showcase-comment"
                  value={uploadData.comment}
                  onChange={(e) => setUploadData({
                    ...uploadData,
                    comment: e.target.value
                  })}
                  placeholder="分享你的盲盒体验..."
                  rows="3"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="showcase-item">关联物品ID</label>
                <input
                  id="showcase-item"
                  type="text"
                  value={uploadData.itemId}
                  onChange={(e) => setUploadData({
                    ...uploadData,
                    itemId: e.target.value
                  })}
                  placeholder="输入物品ID (可选)"
                />
              </div>
              
              {error && <p className="error-message">{error}</p>}
              
              <button 
                type="submit" 
                className="submit-button"
                disabled={uploading}
              >
                {uploading ? '上传中...' : '确认上传'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 主内容区 */}
      <div className="community-header">
        <h1 className="community-title">玩家社区</h1>
        <button 
          className="upload-button"
          onClick={() => setShowUploadModal(true)}
        >
          <i className="fas fa-plus"></i> 上传我的盲盒
        </button>
      </div>
      
      <div className="posts-list">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="post-item">
              <div className="post-content">
                <div className="post-user-info">
                  <div className="user-avatar-placeholder"></div>
                  <div>
                    <span className="username">用户{post.userId || '匿名'}</span>
                    <span className="post-time">
                      {new Date(post.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <p className="post-comment">{post.comment}</p>
                
                <div className="post-image-container">
                  <img 
                    src={post.image} 
                    alt="玩家展示" 
                    className="post-image"
                    onError={(e) => {
                      e.target.src = '/default-showcase.jpg';
                    }}
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <img src="/empty-showcase.svg" alt="暂无内容" className="empty-image" />
            <h3>社区空空如也</h3>
            <p>成为第一个分享盲盒的玩家吧！</p>
            <button 
              className="upload-button"
              onClick={() => setShowUploadModal(true)}
            >
              <i className="fas fa-plus"></i> 立即上传
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Community;