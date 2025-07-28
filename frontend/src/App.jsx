import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import MysteryBox from './pages/MysteryBox';
import Community from './pages/Community';
import Profile from './pages/Profile';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
function App() {
  return (
    <Router>
      <Routes>
        {/* 默认路径重定向到登录页 */}
        <Route path="/" element={<Navigate to="/Login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
         <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/mystery-box" element={<MysteryBox />} />
          <Route path="/community" element={<Community />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;