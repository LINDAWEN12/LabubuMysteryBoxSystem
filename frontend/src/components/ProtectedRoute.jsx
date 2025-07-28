// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  // 从localStorage获取token（不要用useState存储，避免异步问题）
  const token = localStorage.getItem('token');
  
  // 如果有token，渲染子路由；否则重定向到登录页
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}