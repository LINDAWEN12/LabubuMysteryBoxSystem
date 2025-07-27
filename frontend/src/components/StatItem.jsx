export default function StatItem({ value, label }) {
  return (
    <div className="px-2">
      <p className="font-bold text-lg text-purple-800">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}