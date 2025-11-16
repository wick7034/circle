import { User } from '../lib/supabase';

interface UserCardProps {
  user: User;
  onClick: () => void;
}

export default function UserCard({ user, onClick }: UserCardProps) {
  const colors = [
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-teal-500',
    'from-rose-500 to-pink-500',
    'from-amber-500 to-orange-500',
    'from-sky-500 to-blue-500',
    'from-violet-500 to-purple-500',
  ];

  const colorIndex = user.x_username.charCodeAt(0) % colors.length;
  const gradientClass = colors[colorIndex];

  return (
    <div
      onClick={onClick}
      className="w-40 h-40 cursor-pointer group"
    >
      <div className="relative w-full h-full transition-all duration-300 group-hover:scale-125">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} rounded-full shadow-lg group-hover:shadow-2xl transition-all overflow-hidden`}>
          <div className="absolute inset-[3px] bg-slate-900 rounded-full p-4 flex flex-col items-center justify-center overflow-hidden backdrop-blur-sm bg-slate-900/80">
            {user.profile_photo_url ? (
              <img
                src={user.profile_photo_url}
                alt={user.x_username}
                className="w-14 h-14 rounded-full object-cover mb-2 shadow-lg border-2 border-white/20"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.style.display = 'none';
                }}
              />
            ) : null}

            <h3 className="text-white font-semibold text-xs text-center truncate w-full px-2">
              @{user.x_username}
            </h3>

            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    </div>
  );
}
