import { useState } from 'react';
import { Trophy, Clock, Search, Award, Star } from 'lucide-react';
import { Attempt, QuizCategory } from '../types';

interface LeaderboardProps {
  attempts: Attempt[];
  categories: QuizCategory[];
}

const USER_AVATARS: Record<string, string> = {
  'alicelearner': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  'bobpioneer': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  'tamanashdev': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
};

const RANDOM_MOCK_AVATARS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80'
];

export default function Leaderboard({ attempts, categories }: LeaderboardProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAttempts = attempts.filter(a => {
    const matchesCategory = selectedCategory ? a.category === selectedCategory : true;
    const matchesSearch = a.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          a.quizTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const rankedAttempts = [...filteredAttempts].sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.timeTaken - b.timeTaken;
  });

  const podiumTop3 = rankedAttempts.slice(0, 3);

  const getAvatarForUser = (username: string, idx: number) => {
    const cleaned = username.toLowerCase().replace(/\s/g, '');
    if (USER_AVATARS[cleaned]) {
      return USER_AVATARS[cleaned];
    }
    return RANDOM_MOCK_AVATARS[idx % RANDOM_MOCK_AVATARS.length];
  };

  const getGenZCategoryName = (name: string) => {
    switch (name) {
      case 'General Knowledge': return 'Vibe Check 🌍';
      case 'NEET/JEE Prep': return 'NEET/JEE Grind 🧠';
      case 'Science': return 'Science, Spicy 🧪';
      case 'Computer Science': return 'Code/Die 💻';
      case 'AI/ML Essentials': return 'AI or Cap? 🤖';
      default: return name;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in py-4">
      
      {/* Hero card */}
      <div className="p-6 sm:p-8 rounded-2xl border-4 border-black bg-[#161e2e] shadow-[6px_6px_0px_0px_#000] relative text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-yellow-400 border-2 border-black text-black text-xs font-black uppercase tracking-wider mb-2 shadow-[1.5px_1.5px_0px_0px_#000]">
              <Trophy className="w-4 h-4 text-black animate-bounce" />
              <span>REAL-TIME SQUAD RANKINGS</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              HONOUR BOARD LEADERBOARD
            </h1>
            <p className="text-xs text-slate-350 mt-1.5 max-w-lg leading-relaxed font-semibold">
              Force your squad to bow! Compete across General Knowledge channels, NEET/JEE test blocks, and coding challenges to secure the absolute throne. No cap, speed decides ties.
            </p>
          </div>

          <div className="flex items-center gap-2 self-center bg-slate-800 border-3 border-black p-3.5 rounded-xl shadow-[3px_3px_0px_0px_#000]">
            <span className="text-3xl font-black text-yellow-400">#1</span>
            <div className="text-left">
              <span className="block text-[8px] font-mono text-slate-400 font-black uppercase">CURRENT APEX</span>
              <span className="text-xs font-black text-white truncate max-w-[120px] block">
                {podiumTop3[0] ?`@${podiumTop3[0].username}` : 'Slay some tests...'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Category selection bar */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider border-2 border-black transition-all cursor-pointer shadow-[2px_2px_0px_0px_#000] active:translate-y-[1.5px] ${
                selectedCategory === null
                  ? 'bg-yellow-400 text-black'
                  : 'bg-slate-80s bg-slate-800 text-slate-300 hover:bg-slate-705 hover:bg-slate-700'
              }`}
            >
              Overall
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider border-2 border-black transition-all cursor-pointer shadow-[2px_2px_0px_0px_#000] active:translate-y-[1.5px] ${
                  selectedCategory === cat.name
                    ? 'bg-pink-500 text-white'
                    : 'bg-slate-805 bg-slate-800 text-slate-300 hover:bg-slate-705 hover:bg-slate-700'
                }`}
              >
                {getGenZCategoryName(cat.name)}
              </button>
            ))}
          </div>

          {/* search bar */}
          <div className="relative w-full sm:w-64 border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000] overflow-hidden flex-shrink-0">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Find rival participant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#161e2e] text-xs font-black placeholder-slate-500"
            />
          </div>

        </div>
      </section>

      {/* Podium Grid (Top 3 Visual Medals) */}
      {podiumTop3.length > 0 && (
        <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-4 max-w-xl mx-auto items-end">
          
          {/* #2 Place Metal Card */}
          {podiumTop3[1] && (
            <div className="p-4 rounded-xl border-3 border-black bg-[#161e2e] shadow-[3px_3px_0px_0px_#000] flex flex-col items-center text-center space-y-2 relative order-1 hover:scale-[1.02] transition-all">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded border-2 border-black bg-slate-300 text-black font-black text-[9px] uppercase shadow-[1px_1px_0px_0px_#000]">2nd</span>
              
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-black p-0.5 mt-2 bg-slate-800">
                <img src={getAvatarForUser(podiumTop3[1].username, 1)} alt="" className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
              </div>
              <div>
                <span className="block text-xs font-black text-white truncate max-w-[80px] sm:max-w-[120px]">@{podiumTop3[1].username}</span>
                <span className="text-[10px] font-mono font-black text-pink-500">{podiumTop3[1].score} pts</span>
              </div>
              <span className="text-[9px] font-mono text-slate-400 flex items-center justify-center gap-0.5 leading-none">
                <Clock className="w-3 h-3 text-slate-400" />
                {podiumTop3[1].timeTaken}s
              </span>
            </div>
          )}

          {/* #1 Place Metal Card */}
          {podiumTop3[0] && (
            <div className="p-5 rounded-xl border-4 border-black bg-[#161e2e] shadow-[4px_4px_0px_0px_#000] flex flex-col items-center text-center space-y-3 relative order-2 z-10 scale-[1.06] hover:scale-[1.08] transition-all">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded border-2 border-black bg-yellow-400 text-black font-black text-xs tracking-wider shadow-[2.5px_2.5px_0px_0px_#000] animate-pulse flex items-center gap-1 uppercase">
                <Star className="w-3.5 h-3.5 fill-current text-black" /> APEX
              </span>
              
              <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-black p-0.5 mt-2 shadow-[2px_2px_0px_0px_#000] bg-slate-800">
                <img src={getAvatarForUser(podiumTop3[0].username, 0)} alt="" className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
              </div>
              <div>
                <span className="block text-sm font-black text-white truncate max-w-[95px] sm:max-w-[135px]">@{podiumTop3[0].username}</span>
                <div className="flex items-center justify-center gap-1 mt-0.5">
                  <span className="text-xs font-black font-mono text-yellow-400">{podiumTop3[0].score} <span className="text-[9px] font-sans text-slate-450">pts</span></span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-yellow-450 font-black p-1 flex items-center justify-center gap-0.5 leading-none">
                <Clock className="w-3.5 h-3.5 text-yellow-500" />
                {podiumTop3[0].timeTaken}s
              </span>
            </div>
          )}

          {/* #3 Place Metal Card */}
          {podiumTop3[2] && (
            <div className="p-4 rounded-xl border-3 border-black bg-[#161e2e] shadow-[3px_3px_0px_0px_#000] flex flex-col items-center text-center space-y-2 relative order-3 hover:scale-[1.02] transition-all">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded border-2 border-black bg-[#d97706] text-white font-black text-[9px] uppercase shadow-[1px_1px_0px_0px_#000]">3rd</span>
              
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-black p-0.5 mt-2 bg-slate-800">
                <img src={getAvatarForUser(podiumTop3[2].username, 2)} alt="" className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
              </div>
              <div>
                <span className="block text-xs font-black text-white truncate max-w-[80px] sm:max-w-[120px]">@{podiumTop3[2].username}</span>
                <span className="text-[10px] font-mono font-black text-pink-500">{podiumTop3[2].score} pts</span>
              </div>
              <span className="text-[9px] font-mono text-slate-400 flex items-center justify-center gap-0.5 leading-none">
                <Clock className="w-3 h-3 text-slate-400" />
                {podiumTop3[2].timeTaken}s
              </span>
            </div>
          )}

        </div>
      )}

      {/* Rankings List Table with Neo-Brutalist borders and headers */}
      <div className="p-6 rounded-2xl border-4 border-black bg-[#161e2e] shadow-[6px_6px_0px_0px_#000000] overflow-hidden">
        <h3 className="text-xs uppercase font-mono tracking-widest font-black text-slate-300 mb-4 flex items-center gap-2">
          <Award className="w-4 h-4 text-pink-500" />
          ARENA RANKINGS ({rankedAttempts.length} entries)
        </h3>

        {rankedAttempts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-black text-[10px] font-mono tracking-widest uppercase text-slate-400">
                  <th className="py-3.5 px-2 font-black w-12 text-center">RANK</th>
                  <th className="py-3.5 px-4 font-black">SPAWNED ALIAS</th>
                  <th className="py-3.5 px-4 font-black">SOLVED ARENA</th>
                  <th className="py-3.5 px-4 font-black">CHANNEL</th>
                  <th className="py-3.5 px-4 font-black text-center">SCORE</th>
                  <th className="py-3.5 px-4 font-black text-center">SPEEDRUN</th>
                </tr>
              </thead>
              <tbody>
                {rankedAttempts.map((attempt, index) => {
                  const medalRank = index + 1;
                  return (
                    <tr 
                      key={attempt.id} 
                      className="border-b-2 border-black last:border-0 hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Rank Indicator */}
                      <td className="py-4 px-2 text-center font-black">
                        {medalRank === 1 ? (
                          <span className="text-yellow-400 text-base font-black">1</span>
                        ) : medalRank === 2 ? (
                          <span className="text-slate-300 text-sm font-black">2</span>
                        ) : medalRank === 3 ? (
                          <span className="text-amber-650 text-amber-600 text-sm font-black">3</span>
                        ) : (
                          <span className="text-slate-400 font-mono text-xs font-semibold">{medalRank}</span>
                        )}
                      </td>

                      {/* Participant Info */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={getAvatarForUser(attempt.username, index)} 
                            alt="" 
                            className="w-8 h-8 rounded-lg object-cover border-2 border-black shadow-[1px_1px_0px_0px_#000] bg-slate-800" 
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="font-extrabold text-white text-xs block">@{attempt.username}</span>
                          </div>
                        </div>
                      </td>

                      {/* Quiz Title */}
                      <td className="py-4 px-4 font-bold text-slate-200 max-w-[160px] sm:max-w-xs truncate">
                        {attempt.quizTitle}
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded bg-slate-800 border border-black text-[9px] font-mono text-yellow-500 uppercase font-black">
                          {getGenZCategoryName(attempt.category)}
                        </span>
                      </td>

                      {/* Score */}
                      <td className="py-4 px-4 text-center font-black text-pink-500 text-sm">
                        {attempt.score} <span className="text-[10px] text-slate-500 font-normal">/{attempt.totalPoints}</span>
                      </td>

                      {/* Solver speed */}
                      <td className="py-4 px-4 text-center font-mono text-white text-xs font-extrabold">
                        {attempt.timeTaken}s
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center border-4 border-dashed border-black bg-slate-900 rounded-xl">
            <Trophy className="w-12 h-12 text-slate-650 mx-auto mb-2 animate-pulse" />
            <h4 className="font-black text-white uppercase text-xs">STANDINGS EMPTY</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto pl-1 pr-1 font-semibold leading-normal">
              Be the first squad member to slay these assessments to declare yourself ruler!
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
