export default function TabButton({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 font-medium ${
        active ? 'text-pink-600 border-b-2 border-pink-600' : 'text-gray-500'
      }`}
    >
      {children}
    </button>
  );
}