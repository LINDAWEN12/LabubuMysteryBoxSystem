import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import MysteryBox from './pages/MysteryBox'
import Community from './pages/Community'
import Profile from './pages/Profile'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-pink-50 to-purple-50">
      <main className="flex-grow container py-8 pb-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mystery-box" element={<MysteryBox />} />
          <Route path="/community" element={<Community />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
      <Navbar />
    </div>
  )
}