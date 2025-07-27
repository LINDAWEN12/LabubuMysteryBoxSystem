export default function SettingItem({ icon, title }) {
  return (
    <div className="flex items-center p-2 bg-white rounded-lg shadow-sm">
      <span className="text-xl mr-3">{icon}</span>
      <span className="flex-1">{title}</span>
      <span>›</span>
    </div>
  );
}