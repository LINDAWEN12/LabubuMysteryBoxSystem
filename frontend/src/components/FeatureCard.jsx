import { Link } from 'react-router-dom';

export default function FeatureCard({ title, icon, bgColor, textColor, link }) {
  return (
    <Link 
      to={link}
      className={`${bgColor} ${textColor} p-4 rounded-2xl flex flex-col items-center justify-center h-32 shadow-md hover:shadow-lg transition-all`}
    >
      <span className="text-3xl mb-2">{icon}</span>
      <span className="font-semibold">{title}</span>
    </Link>
  );
}