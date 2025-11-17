import { X, Trophy } from 'lucide-react';
import { useEffect } from 'react';
import { User } from '../lib/supabase';

interface UserModalProps {
  user: User;
  onClose: () => void;
}

export default function UserModal({ user, onClose }: UserModalProps) {
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

  const joinDate = new Date(user.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const hasQuizScore = user.quiz_score !== undefined && user.quiz_score !== null;
  const scorePercentage = hasQuizScore && user.quiz_total ? Math.round((user.quiz_score / user.quiz_total) * 100) : 0;

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscapeKey);
    return () => window.removeEventListener('keydown', handleEscapeKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-modal-title"
    >
      <div
        className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`h-32 bg-gradient-to-br ${gradientClass} relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-cyan-400"
            aria-label="Close profile"
            title="Press Escape to close"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-6 -mt-16">
          <div className={`w-24 h-24 bg-gradient-to-br ${gradientClass} rounded-full border-4 border-slate-900 flex items-center justify-center shadow-xl mb-4 overflow-hidden`}>
            {user.profile_photo_url ? (
              <img
                src={user.profile_photo_url}
                alt={`${user.x_username}'s profile photo`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.style.display = 'none';
                }}
              />
            ) : (
              <span className="text-white text-3xl font-bold" aria-hidden="true">
                {user.x_username.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <h2 id="user-modal-title" className="text-2xl font-bold text-white mb-1">
            @{user.x_username}
          </h2>

          <p className="text-gray-400 text-sm mb-6">
            Joined <time dateTime={new Date(user.created_at).toISOString()}>{joinDate}</time>
          </p>

          {hasQuizScore && (
            <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-xl p-4 border border-yellow-500/30 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-300 font-semibold">Privacy Quiz Score</span>
              </div>
              <div className="text-3xl font-bold text-yellow-300 mb-1">
                {user.quiz_score}/{user.quiz_total} ({scorePercentage}%)
              </div>
              <div className="text-sm text-yellow-200/80">
                {scorePercentage === 100 && "Perfect! You're a privacy expert!"}
                {scorePercentage >= 75 && scorePercentage < 100 && "Excellent! You know your privacy!"}
                {scorePercentage >= 50 && scorePercentage < 75 && "Good job! Keep learning!"}
                {scorePercentage < 50 && "Keep exploring Web3 privacy!"}
              </div>
            </div>
          )}

          <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
            <h3 className="text-cyan-400 font-semibold text-sm mb-3 uppercase tracking-wide">
              Why Privacy Matters
            </h3>
            <p className="text-gray-300 leading-relaxed">
              {user.privacy_answer}
            </p>
          </div>

          <a
            href={`https://twitter.com/${user.x_username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all block text-center shadow-lg hover:shadow-xl focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            View on X (opens new tab)
          </a>
        </div>
      </div>
    </div>
  );
}
