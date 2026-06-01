import { Sparkles, User as UserIcon, LogOut, ShieldAlert, Sun, Moon } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  onLogout: () => void;
  pwaInstallPrompt: any;
  triggerPwaInstall: () => void;
}

export default function Header({
  currentUser,
  activeTab,
  setActiveTab,
  darkMode,
  toggleDarkMode,
  onLogout,
  pwaInstallPrompt,
  triggerPwaInstall
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b-4 border-black bg-[#111827] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo Section */}
        <div 
          onClick={() => setActiveTab('dashboard')} 
          className="flex items-center gap-3 cursor-pointer group"
          id="quizora-logo"
        >
          <div className="w-10 h-10 rounded-xl bg-yellow-400 border-2 border-black flex items-center justify-center text-black font-extrabold shadow-[2px_2px_0px_0px_#000] group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-black" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter text-white">
              Quizora🔥
            </span>
            <span className="text-[9px] font-mono tracking-widest uppercase text-yellow-400 font-extrabold">
              LOW-KEY THE BEST QUIZ APP
            </span>
          </div>
        </div>

        {/* Global Navigation - Only shown when logged in */}
        {currentUser && (
          <nav className="hidden lg:flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setActiveTab('venture')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all border-2 border-black cursor-pointer ${
                activeTab === 'venture'
                  ? 'bg-yellow-405 bg-yellow-400 text-black shadow-[2px_2px_0px_0px_#000]'
                  : 'text-slate-200 hover:bg-slate-800'
              }`}
              title="Venture Startup Suite"
            >
              🚀 Venture Suite
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all border-2 border-black cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-yellow-400 text-black shadow-[2px_2px_0px_0px_#000]'
                  : 'text-slate-200 hover:bg-slate-800'
              }`}
              title="My Quizzes Dashboard"
            >
              🔥 My Quiz
            </button>
            <button
              onClick={() => setActiveTab('scoreboard')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all border-2 border-black cursor-pointer ${
                activeTab === 'scoreboard'
                  ? 'bg-pink-500 text-white shadow-[2px_2px_0px_0px_#000]'
                  : 'text-slate-200 hover:bg-slate-800'
              }`}
              title="Personal Scoreboard Stats"
            >
              📊 Scoreboard
            </button>
            <button
              onClick={() => setActiveTab('leaderboards')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all border-2 border-black cursor-pointer ${
                activeTab === 'leaderboards'
                  ? 'bg-emerald-500 text-black shadow-[2px_2px_0px_0px_#000]'
                  : 'text-slate-200 hover:bg-slate-800'
              }`}
              title="Leaderboard standings"
            >
              🏆 Leaderboards
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all border-2 border-black cursor-pointer ${
                activeTab === 'reviews'
                  ? 'bg-cyan-400 text-black shadow-[2px_2px_0px_0px_#000]'
                  : 'text-slate-200 hover:bg-slate-800'
              }`}
              title="Quiz Reviews & Comments"
            >
              💬 Reviews
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all border-2 border-black cursor-pointer ${
                activeTab === 'about'
                  ? 'bg-mediumpurple bg-indigo-600 text-white shadow-[2px_2px_0px_0px_#000]'
                  : 'text-slate-200 hover:bg-slate-800'
              }`}
              title="About Quizora"
            >
              ℹ️ About
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all border-2 border-black cursor-pointer ${
                activeTab === 'contact'
                  ? 'bg-amber-550 bg-amber-500 text-black shadow-[2px_2px_0px_0px_#000]'
                  : 'text-slate-200 hover:bg-slate-800'
              }`}
              title="Contact Support"
            >
              📞 Contact
            </button>
            <button
              onClick={() => setActiveTab('meme')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all border-2 border-black cursor-pointer ${
                activeTab === 'meme'
                  ? 'bg-purple-650 bg-purple-500 text-white shadow-[2px_2px_0px_0px_#000]'
                  : 'text-slate-200 hover:bg-slate-800'
              }`}
              title="Meme Forge"
            >
              🎨 Meme Forge
            </button>
            {currentUser.role === 'admin' && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all border-2 border-black cursor-pointer flex items-center gap-1 ${
                  activeTab === 'admin'
                    ? 'bg-rose-500 text-white shadow-[2px_2px_0px_0px_#000]'
                    : 'text-rose-450 hover:bg-slate-850'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Admin
              </button>
            )}
          </nav>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Black & White mode vs Dark mode toggler */}
          <button
            onClick={toggleDarkMode}
            className="p-2 border-2 border-black rounded-lg transition-all cursor-pointer shadow-[2px_2px_0px_0px_#000] active:translate-y-[2px] bg-slate-800 text-yellow-400 hover:bg-slate-700 flex items-center justify-center"
            title={darkMode ? "Switch to High-Contrast B&W Light Theme" : "Switch to Space Dark Theme"}
            id="theme-toggler-btn"
          >
            {darkMode ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* PWA Install Button */}
          {pwaInstallPrompt && (
            <button
              onClick={triggerPwaInstall}
              className="relative hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-black bg-pink-500 text-black text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              Install App 📱
            </button>
          )}

          {/* User Status / Logout Card */}
          {currentUser ? (
            <div className="flex items-center gap-2.5 pl-3 border-l-2 border-black">
              {currentUser.avatarUrl && (
                <div 
                  onClick={() => setActiveTab('profile')} 
                  className="w-10 h-10 rounded-lg overflow-hidden border-2 border-black cursor-pointer shadow-[2px_2px_0px_0px_#000] focus:scale-110 transition-transform bg-slate-800"
                  title="View Profile Vibe"
                >
                  <img src={currentUser.avatarUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              )}
              <div 
                onClick={() => setActiveTab('profile')} 
                className="hidden md:flex flex-col text-right cursor-pointer"
                title="View Profile"
              >
                <div className="flex items-center gap-1.5 justify-end">
                  <span className="text-xs font-extrabold text-white">
                    {currentUser.username.includes(currentUser.emoji || '') ? currentUser.username : `${currentUser.username} ${currentUser.emoji || ''}`}
                  </span>
                </div>
                <span className="text-[9px] font-mono text-slate-400">LVL {currentUser.level || 1} • {currentUser.xp ?? 0} XP</span>
              </div>
              <button
                onClick={onLogout}
                className="p-2 border-2 border-black bg-slate-850 hover:bg-rose-600 text-rose-500 hover:text-black rounded-lg transition-all cursor-pointer shadow-[2px_2px_0px_0px_#000] active:translate-y-[2px]"
                title="Log Out (Stop Slaying)"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-black bg-slate-850 border-2 border-black text-yellow-400 px-3 py-1.5 rounded-lg shadow-[2px_2px_0px_0px_#000]">
              <UserIcon className="w-3.5 h-3.5 text-yellow-400" />
              <span>GUEST VIBE</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
