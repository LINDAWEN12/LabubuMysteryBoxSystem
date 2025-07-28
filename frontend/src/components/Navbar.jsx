import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-100 z-50">
      <div className="flex justify-around items-center h-16">
        <NavLink 
          to="/home" 
          icon="🏠" 
          label="首页" 
          active={location.pathname === '/'} 
        />
        <NavLink 
          to="/mystery-box" 
          icon="🎁" 
          label="盲盒" 
          active={location.pathname === '/mystery-box'} 
        />
        <NavLink 
          to="/community" 
          icon="👥" 
          label="玩家秀" 
          active={location.pathname === '/community'} 
        />
        <NavLink 
          to="/profile" 
          icon="👑" 
          label="我的" 
          active={location.pathname === '/profile'} 
        />
      </div>
    </nav>
  )
}

function NavLink({ to, icon, label, active }) {
  return (
    <Link 
      to={to}
      className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
        active ? 'text-purple-600' : 'text-gray-500 hover:text-pink-500'
      }`}
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-xs mt-1">{label}</span>
      {active && (
        <div className="absolute top-0 w-1/2 h-1 bg-gradient-to-r from-pink-400 to-purple-500 rounded-b-full" />
      )}
    </Link>
  )
}