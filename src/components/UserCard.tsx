import { User } from '../lib/supabase';

interface UserCardProps {
  user: User;
  onClick: () => void;
}

export default function UserCard({ user, onClick }: UserCardProps) {
  const colors = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-yellow-500 to-orange-500',
    'from-teal-500 to-blue-500',
  ];

  const colorIndex = user.x_username.charCodeAt(0) % colors.length;
  const gradientClass = colors[colorIndex];

  return (
    <div
      onClick={onClick}
      className="w-40 h-40 cursor-pointer group"
    >
      <div className="relative w-full h-full transition-transform duration-300 group-hover:scale-110">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} rounded-2xl shadow-lg group-hover:shadow-2xl transition-all overflow-hidden`}>
          <div className="absolute inset-[2px] bg-slate-900 rounded-2xl p-4 flex flex-col items-center justify-center overflow-hidden">
            {user.profile_photo_url ? (
              <img
                src={user.profile_photo_url}
                alt={user.x_username}
                className="w-16 h-16 rounded-full object-cover mb-2 shadow-lg border-2 border-slate-800"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.style.display = 'none';
                }}
              />
            ) : null}

            <h3 className="text-white font-semibold text-sm text-center truncate w-full px-2">
              @{user.x_username}
            </h3>

            <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    </div>
  );
}
