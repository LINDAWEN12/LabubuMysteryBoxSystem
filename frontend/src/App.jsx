import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import MysteryBox from './pages/MysteryBox';
import Community from './pages/Community';
import Profile from './pages/Profile';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import BlindBoxDetail from './pages/BlindBoxDetail';
// 创建带有导航栏的布局组件
const LayoutWithNavbar = () => {
  return (
    <>
      <Outlet /> {/* 这里是子路由的内容 */}
      <Navbar /> {/* 导航栏固定在底部 */}
    </>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* 默认路径重定向到登录页 */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* 需要导航栏的受保护路由 */}
        <Route element={<ProtectedRoute />}>
          <Route element={<LayoutWithNavbar />}>
            <Route path="/home" element={<Home />} />
            <Route path="/mystery-box" element={<MysteryBox />} />
            <Route path="/blindbox/:id" element={<BlindBoxDetail />} />
            <Route path="/community" element={<Community />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;