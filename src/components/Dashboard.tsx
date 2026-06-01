import { useState } from 'react';
import { 
  Globe, 
  GraduationCap, 
  Atom, 
  Cpu, 
  BrainCircuit, 
  Search, 
  Play, 
  Trophy, 
  Plus, 
  HelpCircle, 
  Flame, 
  RefreshCw,
  Layers,
  Sparkles,
  Download
} from 'lucide-react';
import { Quiz, QuizCategory, Attempt, User } from '../types';

interface DashboardProps {
  currentUser: User;
  categories: QuizCategory[];
  quizzes: Quiz[];
  attempts: Attempt[];
  onSelectQuiz: (quiz: Quiz) => void;
  setActiveTab: (tab: string) => void;
  pwaInstallPrompt: any;
  triggerPwaInstall: () => void;
}

export default function Dashboard({
  currentUser,
  categories,
  quizzes,
  attempts,
  onSelectQuiz,
  setActiveTab,
  pwaInstallPrompt,
  triggerPwaInstall
}: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'official' | 'custom'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  // Compute stats for current user
  const userAttempts = attempts.filter(a => a.userId === currentUser.id);
  const totalGamesPlayed = userAttempts.length;
  const highAttempt = [...userAttempts].sort((a, b) => b.score - a.score)[0];
  
  // Calculate category averages
  const getCategoryCount = (catName: string) => {
    return quizzes.filter(q => q.category === catName).length;
  };

  // Filter quizzes
  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          quiz.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? (quiz.category === selectedCategory) : true;
    
    const isOfficial = quiz.createdBy.startsWith('System');
    const matchesFilterType = 
      filterType === 'all' ? true :
      filterType === 'official' ? isOfficial :
      !isOfficial;

    const matchesDifficulty = selectedDifficulty === 'all'
      ? true
      : (quiz.difficulty || 'medium') === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesFilterType && matchesDifficulty;
  });

  // Render Category Icon helper
  const renderCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe': return <Globe className="w-5 h-5 text-cyan-400" />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5 text-pink-400" />;
      case 'Atom': return <Atom className="w-5 h-5 text-teal-400" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-orange-400" />;
      case 'BrainCircuit': return <BrainCircuit className="w-5 h-5 text-rose-450" />;
      default: return <HelpCircle className="w-5 h-5 text-indigo-400" />;
    }
  };

  // Maps legacy names to custom fun Gen Z names
  const getGenZCategoryName = (name: string) => {
    switch (name) {
      case 'General Knowledge': return 'Vibe Check 🌍';
      case 'NEET/JEE Prep': return 'NEET/JEE Grind 🧠';
      case 'Science': return 'Science, But Spicy 🧪';
      case 'Computer Science': return 'Code or Die 💻';
      case 'AI/ML Essentials': return 'AI or Cap? 🤖';
      default: return name;
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Neo-Brutalist Dripping Hero Board */}
      <div className="p-6 sm:p-8 rounded-2xl border-4 border-black bg-[#161e2e] shadow-[6px_6px_0px_0px_#000000] relative overflow-hidden">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-slate-800 border-2 border-black flex items-center justify-center text-3xl shadow-[3px_3px_0px_0px_#000] shrink-0">
              {currentUser.emoji || '🔥'}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-1 text-[9px] font-mono font-black text-black bg-yellow-400 border-2 border-black rounded-md shadow-[1px_1px_0px_0px_#000] uppercase">
                  LEVEL {currentUser.level || 1} • {currentUser.xp ?? 0} XP
                </span>
                <span className="flex items-center gap-0.5 text-[9px] font-mono font-black text-black bg-pink-500 border-2 border-black px-2.5 py-1 rounded-md shadow-[1px_1px_0px_0px_#000] uppercase">
                  <Flame className="w-3.5 h-3.5 fill-current animate-pulse text-yellow-300" />
                  {currentUser.streak ?? 0} Day Streak
                </span>
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight sm:text-4xl mb-2">
                Welcome back, <span className="underline decoration-pink-500 decoration-wavy">{currentUser.username}</span>!
              </h1>
              <p className="text-xs text-slate-300 max-w-xl italic font-semibold">
                "{currentUser.bio || 'Low-key ready to destroy some high scores today. No cap. 💅'}"
              </p>
              
              {/* Duolingo style Level Progress Bar */}
              <div className="mt-4 max-w-md">
                <div className="flex items-center justify-between text-[9px] font-mono font-black text-slate-400 uppercase mb-1.5 pl-0.5">
                  <span>LEVEL {(currentUser.level || 1)} PROGRESS</span>
                  <span className="text-pink-500 font-bold">{((currentUser.xp ?? 0) % 300)} / 300 XP ({Math.round(((currentUser.xp ?? 0) % 300) / 300 * 100)}%)</span>
                </div>
                <div className="w-full h-3 bg-slate-800 border-2 border-black rounded-full overflow-hidden shadow-[1px_1px_0px_0px_#000]">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-400 to-pink-500 transition-all duration-300"
                    style={{ width: `${Math.round(((currentUser.xp ?? 0) % 300) / 300 * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Slaying Stats Card */}
          <div className="grid grid-cols-2 gap-3 min-w-[280px]">
            <div className="p-4 rounded-xl border-3 border-black bg-[#1f2a3d] shadow-[3px_3px_0px_0px_#000] flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-400 text-black border-2 border-black shadow-[1px_1px_0px_0px_#000]">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[9px] font-mono text-slate-400 font-extrabold uppercase">BEST SCORE</span>
                <span className="text-base font-black text-white leading-none">
                  {highAttempt ? `${highAttempt.score}` : '0'} <span className="text-[10px] text-slate-400 font-normal">pts</span>
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl border-3 border-black bg-[#1f2a3d] shadow-[3px_3px_0px_0px_#000] flex items-center gap-3">
              <div className="p-2 rounded-lg bg-pink-500 text-white border-2 border-black shadow-[1px_1px_0px_0px_#000]">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[9px] font-mono text-slate-400 font-extrabold uppercase">COMPLETED</span>
                <span className="text-base font-black text-white leading-none">
                  {totalGamesPlayed} <span className="text-[10px] text-slate-450 font-normal">Quizzes</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* PWA Installer */}
        {pwaInstallPrompt && (
          <div className="mt-6 p-4 rounded-xl border-2 border-black bg-pink-550/20 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[3px_3px_0px_0px_#000]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400 animate-spin" />
              <div className="text-xs font-semibold">
                <span className="font-black text-yellow-300">Quizora is installable!</span> Drop it on your screen for instant offline quiz loading. Low-key revolutionary.
              </div>
            </div>
            <button
              onClick={triggerPwaInstall}
              className="px-4 py-2 border-2 border-black bg-yellow-450 text-black font-extrabold text-xs rounded-xl shadow-[2px_2px_0px_0px_#000] active:translate-y-[2px] transition-all w-full sm:w-auto text-center cursor-pointer uppercase"
            >
              Install Mobile App 📱
            </button>
          </div>
        )}
      </div>

      {/* Subject categories filter bar */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase font-mono tracking-wider text-slate-400 font-bold flex items-center gap-1.5 pl-0.5">
          <Layers className="w-3.5 h-3.5 text-pink-500" />
          CHOOSE YOUR ASSESSMENT ARENA:
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`p-3.5 rounded-xl border-3 text-left transition-all duration-150 cursor-pointer ${
              selectedCategory === null
                ? 'bg-yellow-400 border-black text-black shadow-[3px_3px_0px_0px_#000] font-black'
                : 'bg-[#161e2e] border-black text-slate-300 shadow-[2px_2px_0px_0px_#000] hover:bg-slate-800'
            }`}
          >
            <div className="font-black text-xs uppercase tracking-wide">ALL CHANNELS</div>
            <div className="text-[9px] opacity-75 mt-1 font-semibold">
              {quizzes.length} live arenas
            </div>
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(isSelected ? null : cat.name)}
                className={`p-3.5 rounded-xl border-3 text-left transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-pink-500 border-black text-white shadow-[3px_3px_0px_0px_#000] font-black'
                    : 'bg-[#161e2e] border-black text-slate-350 shadow-[2px_2px_0px_0px_#000] hover:bg-[#1f2a3d]'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-black text-xs uppercase tracking-wide truncate">{getGenZCategoryName(cat.name)}</span>
                </div>
                <div className="text-[9px] text-slate-450 font-semibold font-mono">
                  {getCategoryCount(cat.name)} arenas
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main filter segment */}
      <div className="space-y-4">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Quick Filters */}
            <div className="flex items-center gap-1.5 bg-black p-1 border-2 border-slate-800 rounded-xl">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  filterType === 'all'
                    ? 'bg-yellow-400 text-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All Matches
              </button>
              <button
                onClick={() => setFilterType('official')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  filterType === 'official'
                    ? 'bg-indigo-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Academy (Official)
              </button>
              <button
                onClick={() => setFilterType('custom')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  filterType === 'custom'
                    ? 'bg-pink-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                UGC Duels (UGC)
              </button>
            </div>

            {/* Difficulty Filters */}
            <div className="flex items-center gap-1 bg-black p-1 border-2 border-slate-800 rounded-xl">
              <span className="text-[9px] font-mono font-black text-slate-400 px-1.5 uppercase hidden sm:inline">Difficulty:</span>
              {(['all', 'easy', 'medium', 'hard'] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                    selectedDifficulty === diff
                      ? diff === 'all'
                        ? 'bg-indigo-505 bg-indigo-500 text-white'
                        : diff === 'easy'
                          ? 'bg-emerald-500 text-black'
                          : diff === 'medium'
                            ? 'bg-yellow-405 bg-yellow-400 text-black'
                            : 'bg-pink-550 bg-pink-500 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Search Input bar */}
          <div className="relative w-full xl:w-72 shadow-[2px_2px_0px_0px_#000] border-2 border-black rounded-xl overflow-hidden">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search assessment tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#161e2e] text-xs font-bold font-mono focus:bg-[#1f2a3d]"
            />
          </div>
        </div>

        {/* Quizzes Grid Layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.length > 0 ? (
            filteredQuizzes.map((quiz) => {
              const quizAttempts = attempts.filter(a => a.quizId === quiz.id && a.userId === currentUser.id);
              const isAttempted = quizAttempts.length > 0;
              const maxScore = isAttempted ? Math.max(...quizAttempts.map(a => a.score)) : null;
              const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);

              return (
                <div
                  key={quiz.id}
                  className="p-5 rounded-xl border-3 border-black bg-[#161e2e] hover:bg-[#1a2335] shadow-[4px_4px_0px_0px_#000] relative flex flex-col justify-between transition-all"
                >
                  <div>
                    {/* Category Pin */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3 text-xs">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="vibe-pill">
                          {getGenZCategoryName(quiz.category)}
                        </span>
                        <span className={`px-1.5 py-0.5 text-[8px] font-mono font-black border-2 border-black rounded shadow-[1px_1px_0px_0px_#000] uppercase ${
                          (quiz.difficulty || 'medium') === 'easy'
                            ? 'bg-emerald-500 text-black'
                            : (quiz.difficulty || 'medium') === 'medium'
                              ? 'bg-yellow-405 bg-yellow-400 text-black'
                              : 'bg-pink-500 text-white'
                        }`}>
                          {quiz.difficulty || 'medium'}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-black text-rose-400">
                        ⚡ {quiz.timeLimit}s timer
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-white mb-1.5 leading-snug">
                      {quiz.title}
                    </h3>
                    
                    <p className="text-[10px] text-slate-400 mb-4 font-mono">
                      Spawned by: <span className="text-yellow-400 font-bold">@{quiz.createdBy}</span>
                    </p>

                    <div className="flex items-center gap-3 mb-5 border-t-2 border-b-2 border-black py-3">
                      <div>
                        <span className="block text-[8px] font-mono text-slate-500 font-black uppercase">ITEMS</span>
                        <span className="text-xs font-black text-white">{quiz.questions.length} Quest-Blocks</span>
                      </div>
                      <div className="border-l-2 border-black pl-3">
                        <span className="block text-[8px] font-mono text-slate-500 font-black uppercase">TOTAL WORTH</span>
                        <span className="text-xs font-black text-white">{totalPoints} Pts</span>
                      </div>
                      {isAttempted && maxScore !== null && (
                        <div className="border-l-2 border-black pl-3">
                          <span className="block text-[8px] font-mono text-slate-500 font-black uppercase">HIGHEST SLAY</span>
                          <span className="text-xs font-black text-yellow-300 flex items-center gap-0.5">
                            👑 {maxScore}/{totalPoints}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 mt-auto pt-2">
                    <button
                      onClick={() => onSelectQuiz(quiz)}
                      className="flex-1 neo-btn cursor-pointer font-black text-xs py-2 bg-yellow-400 text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      {isAttempted ? 'REPLAY DUEL' : 'SLAY ASSESSMENT'}
                    </button>
                    
                    <button
                      onClick={() => {
                        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(quiz, null, 2));
                        const downloadAnchor = document.createElement('a');
                        downloadAnchor.setAttribute("href", dataStr);
                        downloadAnchor.setAttribute("download", `quizora-arena-${quiz.id}.json`);
                        document.body.appendChild(downloadAnchor);
                        downloadAnchor.click();
                        downloadAnchor.remove();
                      }}
                      className="p-2.5 rounded-xl border-2 border-black bg-slate-805 bg-slate-800 text-slate-400 hover:text-yellow-400 hover:bg-slate-700 transition-all shadow-[1.5px_1.5px_0px_0px_#000] active:translate-y-[1px]"
                      title="Download Offline Sandbox File"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-12 text-center border-4 border-dashed border-black bg-[#161e2e] rounded-xl shadow-[4px_4px_0px_0px_#000]">
              <RefreshCw className="w-12 h-12 text-yellow-400 mx-auto mb-3 animate-spin" />
              <h3 className="font-black text-white uppercase text-sm">NO CAP, RESULTS ARE DRY</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto pl-2 pr-2">
                Try widening your filtering parameters or create a custom combat match for your squad!
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory(null);
                  setFilterType('all');
                }}
                className="mt-4 neo-btn text-xs py-2"
              >
                Reset Filter Vibe
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Category Specific Leaderboard banner */}
      {selectedCategory && (
        <div className="p-6 rounded-2xl border-4 border-black bg-[#161e2e] shadow-[6px_6px_0px_0px_#000000] space-y-4 mt-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-black">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-pink-500 border-2 border-black text-black text-[9px] font-mono font-black uppercase shadow-[1px_1px_0px_0px_#000] mb-1">
                CATEGORY LEADERBOARD
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-wider">
                🏆 {getGenZCategoryName(selectedCategory)} Rankings
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase block">
              Top Scores in This Channel
            </span>
          </div>

          {(() => {
            const categoryAttempts = attempts
              .filter(a => a.category === selectedCategory)
              .sort((a, b) => {
                if (b.score !== a.score) return b.score - a.score;
                return a.timeTaken - b.timeTaken;
              });
            const top5 = categoryAttempts.slice(0, 5);

            if (top5.length > 0) {
              return (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b-2 border-black text-[10px] font-mono uppercase text-slate-400">
                        <th className="py-2.5 px-2 font-black w-12 text-center">RANK</th>
                        <th className="py-2.5 px-4 font-black">USER ALIAS</th>
                        <th className="py-2.5 px-4 font-black">QUIZ DUEL</th>
                        <th className="py-2.5 px-4 font-black text-center">SCORE</th>
                        <th className="py-2.5 px-4 font-black text-center">SPEED RUN</th>
                        <th className="py-2.5 px-4 font-black text-right">COMPLETED AT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {top5.map((att, idx) => (
                        <tr key={idx} className="border-b border-slate-750 last:border-0 hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-2 text-center font-black">
                            {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                          </td>
                          <td className="py-3 px-4 font-bold text-white">@{att.username}</td>
                          <td className="py-3 px-4 text-slate-300 font-semibold">{att.quizTitle}</td>
                          <td className="py-3 px-4 text-center font-extrabold text-pink-500">
                            {att.score} <span className="text-[10px] text-slate-500 font-normal">/{att.totalPoints}</span>
                          </td>
                          <td className="py-3 px-4 text-center font-mono text-white font-extrabold">{att.timeTaken}s</td>
                          <td className="py-3 px-4 text-right text-[10px] text-slate-500 font-mono">
                            {new Date(att.completedAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            } else {
              return (
                <div className="py-10 text-center border-4 border-dashed border-black rounded-xl bg-slate-900/40 text-xs font-semibold font-mono text-slate-400">
                  No duels completed in this category yet. Be the first to conquer this arena! 🤺
                </div>
              );
            }
          })()}
        </div>
      )}

      {/* Shortcuts */}
      <div className="grid md:grid-cols-2 gap-6 pt-4">
        {/* Play & Create Quiz promo */}
        <div className="p-6 rounded-2xl border-4 border-black bg-[#161e2e] shadow-[6px_6px_0px_0px_#000] flex flex-col justify-between">
          <div>
            <span className="px-2.5 py-1 text-[9px] font-mono text-black bg-pink-500 border-2 border-black rounded font-black uppercase shadow-[1px_1px_0px_0px_#000]">UGC CREATOR MODE</span>
            <h3 className="text-xl font-black text-white mt-3">Custom Quiz Builder</h3>
            <p className="text-xs text-slate-350 mt-2 mb-4 leading-relaxed font-semibold">
              Design custom assessments and flash cards in 3 taps. Drop the challenge link straight into the group chat and force your friends to prove who really understands ML or science. Bet. ✨
            </p>
          </div>
          <button
            onClick={() => setActiveTab('create')}
            className="self-start mt-2 neo-btn-pink neo-btn font-extrabold text-xs py-2.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Squad Duel
          </button>
        </div>

        {/* Generate Memes Promo */}
        <div className="p-6 rounded-2xl border-4 border-black bg-[#161e2e] shadow-[6px_6px_0px_0px_#000] flex flex-col justify-between">
          <div>
            <span className="px-2.5 py-1 text-[9px] font-mono text-black bg-yellow-400 border-2 border-black rounded font-black uppercase shadow-[1px_1px_0px_0px_#000]">MEMETIC SYNTHESIS</span>
            <h3 className="text-xl font-black text-white mt-3">Meme Forge Generator</h3>
            <p className="text-xs text-slate-350 mt-2 mb-4 leading-relaxed font-semibold">
              Synthesize actual memes on-the-fly. Choose Distracted Boyfriend, Drake, or custom tags to overlay your high scores and share your absolute triumph directly to your Instagram status. 👽
            </p>
          </div>
          <button
            onClick={() => setActiveTab('meme')}
            className="self-start mt-2 neo-btn-indigo neo-btn font-extrabold text-xs py-2.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 animate-bounce" />
            Enter Meme Forge
          </button>
        </div>
      </div>
    </div>
  );
}
