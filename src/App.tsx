import { useState, useEffect } from 'react';
import { Brain, Users, LogOut, UserPlus, Menu, X } from 'lucide-react';
import { supabase, User } from './lib/supabase';
import OnboardingModal from './components/OnboardingModal';
import InfiniteCanvas from './components/InfiniteCanvas';
import UserModal from './components/UserModal';
import QuizModal from './components/QuizModal';

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showOnboardingForm, setShowOnboardingForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    checkUser();
    loadUsers();

    const channel = supabase
      .channel('users-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => {
        loadUsers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const checkUser = () => {
    const userId = localStorage.getItem('inco_user_id');
    if (userId) {
      setCurrentUser(userId);
    }
    setLoading(false);
  };

  const loadUsers = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: true });

    if (data && !error) {
      const usersWithScores = await Promise.all(
        data.map(async (user) => {
          const { data: attempts } = await supabase
            .from('quiz_attempts')
            .select('score, total_questions')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          return {
            ...user,
            quiz_score: attempts?.score,
            quiz_total: attempts?.total_questions,
          };
        })
      );

      setUsers(usersWithScores);
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setShowOnboardingForm(false);
    const userId = localStorage.getItem('inco_user_id');
    setCurrentUser(userId);
    loadUsers();
  };

  const handleLogout = () => {
    localStorage.removeItem('inco_user_id');
    localStorage.removeItem('inco_x_username');
    setCurrentUser(null);
  };

  const openJoinModal = () => {
    setShowOnboarding(true);
    setShowOnboardingForm(false);
    setMobileMenuOpen(false);
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 relative">
      <header className="fixed top-0 left-0 right-0 z-40 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">IC</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-white">Inco Circle</h1>
                <p className="text-xs md:text-sm text-gray-400">Privacy Advocates in Web3</p>
              </div>
            </div>

            <nav className="flex items-center gap-2 md:gap-4">
              <div className="hidden md:flex items-center gap-2 text-gray-400 bg-slate-800 px-4 py-2 rounded-lg">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">{users.length} Members</span>
              </div>

              <button
                onClick={() => { setShowQuiz(true); closeMenu(); }}
                className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-3 md:px-4 py-2 rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl text-sm"
                aria-label="Take Quiz"
              >
                <Brain className="w-4 h-4" />
                <span className="hidden md:inline font-medium">Take Quiz</span>
              </button>

              {!currentUser && (
                <button
                  onClick={openJoinModal}
                  className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-3 md:px-4 py-2 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl text-sm"
                  aria-label="Join Circle"
                >
                  <UserPlus className="w-4 h-4" />
                  <span className="hidden md:inline font-medium">Join Circle</span>
                </button>
              )}

              {currentUser && (
                <button
                  onClick={() => { handleLogout(); closeMenu(); }}
                  className="hidden sm:flex items-center gap-2 text-gray-400 hover:text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-all"
                  title="Logout"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="sm:hidden flex items-center justify-center w-10 h-10 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </nav>
          </div>

          {mobileMenuOpen && (
            <nav className="sm:hidden mt-4 pb-4 space-y-2 border-t border-slate-700 pt-4">
              <div className="flex items-center gap-2 text-gray-400 bg-slate-800 px-4 py-2 rounded-lg mb-2">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">{users.length} Members</span>
              </div>

              <button
                onClick={() => { setShowQuiz(true); closeMenu(); }}
                className="w-full flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 py-3 rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl text-sm font-medium"
              >
                <Brain className="w-4 h-4" />
                <span>Take Quiz</span>
              </button>

              {!currentUser && (
                <button
                  onClick={openJoinModal}
                  className="w-full flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-3 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl text-sm font-medium"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Join Circle</span>
                </button>
              )}

              {currentUser && (
                <button
                  onClick={() => { handleLogout(); closeMenu(); }}
                  className="w-full flex items-center gap-2 text-gray-400 hover:text-white hover:bg-slate-800 px-4 py-3 rounded-lg transition-all text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              )}
            </nav>
          )}
        </div>
      </header>

      <main className="pt-20 h-screen">
        <InfiniteCanvas users={users} onUserClick={setSelectedUser} />
      </main>

      {showOnboarding && <OnboardingModal onComplete={handleOnboardingComplete} onShowForm={() => setShowOnboardingForm(true)} showForm={showOnboardingForm} />}
      {selectedUser && <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
      {showQuiz && <QuizModal onClose={() => setShowQuiz(false)} />}
    </div>
  );
}

export default App;
