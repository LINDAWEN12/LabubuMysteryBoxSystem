/**
 * 玩家社区页面组件
 * 展示玩家分享的盲盒图片和评论，支持上传和删除功能
 */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getShowcases, createShowcase, deleteShowcase } from '../api/showcases';
import './Community.css';

/**
 * 社区页面组件
 * @returns {JSX.Element} 社区页面渲染结果
 */
function Community() {
  // 玩家秀列表状态
  const [posts, setPosts] = useState([]);
  // 加载状态
  const [loading, setLoading] = useState(true);
  // 错误信息状态
  const [error, setError] = useState(null);
  // 上传模态框显示状态
  const [showUploadModal, setShowUploadModal] = useState(false);
  // 上传数据状态
  const [uploadData, setUploadData] = useState({
    image: null,
    comment: '',
    itemId: '',
    previewImage: null
  });
  // 上传中状态
  const [uploading, setUploading] = useState(false);

  /**
   * 获取玩家秀列表
   * 使用useEffect在组件挂载时执行
   */
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // 调用API获取玩家秀数据
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
  }, []); // 空依赖数组表示只在组件挂载时执行一次

  /**
   * 处理图片选择
   * @param {Event} e - 文件选择事件
   */
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

  /**
   * 提交上传表单
   * @param {Event} e - 表单提交事件
   * @returns {Promise<void>} - 返回Promise
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!uploadData.image) {
      setError('请选择要上传的图片');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      
      // 准备表单数据
      const formData = new FormData();
      formData.append('image', uploadData.image);
      formData.append('comment', uploadData.comment);
      if (uploadData.itemId.trim()) {
        formData.append('itemId', uploadData.itemId);
      }

      // 调用API创建新玩家秀
      const newShowcase = await createShowcase(formData);
      
      // 更新玩家秀列表（添加到开头）
      setPosts([newShowcase, ...posts]);
      // 关闭模态框
      setShowUploadModal(false);
      // 重置上传表单
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

  /**
   * 删除玩家秀
   * @param {number|string} postId - 玩家秀ID
   * @returns {Promise<void>} - 返回Promise
   */
  const handleDelete = async (postId) => {
    if (window.confirm('确定要删除这条展示吗？')) {
      try {
        // 调用API删除玩家秀
        await deleteShowcase(postId);
        // 更新玩家秀列表（过滤掉已删除项）
        setPosts(posts.filter(post => post.id !== postId));
      } catch (err) {
        console.error('Error deleting showcase:', err);
        // 显示具体错误信息
        setError(err.response?.data?.message || '删除失败：' + (err.message || '无权操作或服务器错误'));
        // 3秒后自动清除错误提示
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  // 加载中状态渲染
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>加载中...</p>
      </div>
    );
  }

  // 错误状态且没有数据时渲染
  if (error && posts.length === 0) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>重新加载</button>
      </div>
    );
  }

  // 主组件渲染
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
                  <img 
                    src={post.user?.avatar || '/images/default.jpg'} 
                    alt="用户头像" 
                    className="user-avatar"
                  />
                  <div>
                    <span className="username">{post.user?.username || '匿名用户'}</span>
                    <span className="post-time">
                      {new Date(post.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <button 
                    className="delete-button"
                    onClick={() => handleDelete(post.id)}
                  >
                    删除
                  </button>
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