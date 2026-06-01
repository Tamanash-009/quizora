import React, { useState, useRef, DragEvent } from 'react';
import { User, Attempt } from '../types';
import { Camera, Save, User as UserIcon, Calendar, BookOpen, Clock, Trophy, Upload, Flame, Award } from 'lucide-react';

interface UserProfileProps {
  currentUser: User;
  attempts: Attempt[];
  onUpdateUser: (updatedUser: User) => void;
  onCancel: () => void;
  onResetAllData?: () => void;
}

const EMOJIS = ['🦄', '🔥', '⚡', '💀', '💅', '👽', '🧠', '👑', '🌈', '🍕', '👾', '🚀'];

export default function UserProfile({ currentUser, attempts, onUpdateUser, onCancel, onResetAllData }: UserProfileProps) {
  const [username, setUsername] = useState(currentUser.username.replace(/[^a-zA-Z0-9]/g, ''));
  const [bio, setBio] = useState(currentUser.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl || '');
  const [selectedEmoji, setSelectedEmoji] = useState(currentUser.emoji || '🔥');
  const [dragActive, setDragActive] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compute profile statistics
  const userAttempts = attempts.filter(a => a.userId === currentUser.id);
  const totalCorrect = userAttempts.reduce((sum, a) => sum + a.score, 0);
  const totalPoints = userAttempts.reduce((sum, a) => sum + a.totalPoints, 0);
  const averageAccuracy = totalPoints > 0 ? Math.round((totalCorrect / totalPoints) * 100) : 0;
  const averageTime = userAttempts.length > 0 ? Math.round(userAttempts.reduce((sum, a) => sum + a.timeTaken, 0) / userAttempts.length) : 0;

  // Group and compute category rankings for current user
  const uniqueCategories = Array.from(new Set(attempts.map(a => a.category)));
  
  const userRankings = uniqueCategories.map(catName => {
    // Rank all attempts in this category
    const catAttempts = [...attempts]
      .filter(a => a.category === catName)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.timeTaken - b.timeTaken;
      });

    // Find current user's best attempt in this category
    const userCatAttempts = catAttempts.filter(a => a.userId === currentUser.id);
    if (userCatAttempts.length === 0) return null;

    // The user's highest placing attempt
    const bestUserAttempt = userCatAttempts[0];
    const rank = catAttempts.findIndex(a => a.id === bestUserAttempt.id) + 1;

    return {
      category: catName,
      bestAttempt: bestUserAttempt,
      rank,
      totalCompetitors: catAttempts.length
    };
  }).filter((r): r is NonNullable<typeof r> => r !== null);

  const globalAttempts = [...attempts].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.timeTaken - b.timeTaken;
  });
  const userGlobalAttempts = globalAttempts.filter(a => a.userId === currentUser.id);
  const bestGlobalAttempt = userGlobalAttempts[0];
  const globalRank = bestGlobalAttempt ? globalAttempts.findIndex(a => a.id === bestGlobalAttempt.id) + 1 : null;

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

  // Render badges list (Gamified badges)
  const defaultBadges = currentUser.badges || ['First Spawn', 'Vibe Checked'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Upload an image file, bruh! (PNG/JPG)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setAvatarUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      alert('Username cannot be dry, bruh! 💀');
      return;
    }
    
    onUpdateUser({
      ...currentUser,
      username: `${username.trim()}${selectedEmoji}`,
      bio: bio.trim(),
      avatarUrl,
      emoji: selectedEmoji
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in py-4">
      
      {/* Profile and Stats Columns */}
      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Left column - Visual Identity Card */}
        <div className="md:col-span-1 p-6 rounded-2xl border-4 border-black bg-[#161e2e] shadow-[6px_6px_0px_0px_#000000] flex flex-col items-center text-center justify-between">
          <div className="w-full space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
              PROFILE VIBE
            </h3>

            {/* Avatar block with customizable gradient border frames */}
            <div className="relative group w-32 h-32 mx-auto">
              <div className="w-full h-full rounded-2xl overflow-hidden border-4 border-black bg-slate-800 flex items-center justify-center shadow-[4px_4px_0px_0px_#000] relative">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={username} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <UserIcon className="w-12 h-12 text-slate-500" />
                )}
                {/* Embedded Emoji sticker */}
                <div className="absolute right-1 bottom-1 w-8 h-8 rounded-full bg-yellow-405 bg-yellow-450 border-2 border-black flex items-center justify-center text-sm shadow-[1.5px_1.5px_0px_0px_#000]">
                  {selectedEmoji}
                </div>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 p-2 rounded-xl bg-pink-500 text-white border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-pink-600 transition-all cursor-pointer"
                title="Change Avatar image"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-black text-white truncate max-w-full">
                {username}{selectedEmoji}
              </h2>
              <span className="inline-block px-2.5 py-1 text-[9px] font-mono tracking-widest font-black uppercase text-black bg-yellow-400 border-2 border-black rounded-md shadow-[1px_1px_0px_0px_#000]">
                LEVEL {currentUser.level || 1} • {currentUser.xp ?? 0} XP
              </span>
            </div>

            {bio ? (
              <p className="text-xs text-slate-300 italic px-2.5 py-3.5 bg-slate-800 rounded-xl border-2 border-black max-h-32 overflow-y-auto leading-relaxed shadow-[2px_2px_0px_0px_#000]">
                "{bio}"
              </p>
            ) : (
              <p className="text-xs text-slate-500 italic px-2.5 py-3.5 bg-slate-800 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                "No bio added yet. Studying astronomy until my head explodes, no cap. 💀"
              </p>
            )}
          </div>

          <div className="w-full pt-4 mt-6 border-t-2 border-black flex items-center justify-center gap-1.5 text-[10px] font-mono text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-pink-500" />
            <span>Spawned on {new Date(currentUser.createdAt || Date.now()).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Right column - Settings Form and Achievements */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Main User Settings Sheet */}
          <div className="p-6 sm:p-8 rounded-2xl border-4 border-black bg-[#161e2e] shadow-[6px_6px_0px_0px_#000000]">
            <h3 className="text-xl font-black text-white mb-6 uppercase tracking-tight">
              ACCOUNT CUSTOMIZER
            </h3>

            {saveSuccess && (
              <div className="p-3 mb-6 text-xs bg-emerald-950 border-2 border-emerald-500 text-emerald-400 rounded-xl font-bold">
                ✓ Account details saved successfully and synchronized across the space! Bet.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 animate-fade-in">
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-350 font-black pl-0.5">
                    Your Username alias
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={14}
                    value={username}
                    onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                    className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold placeholder-slate-500"
                    placeholder="Enter visual handle nickname"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold pl-0.5">
                    Your Identity Token (Locked)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={currentUser.id}
                    className="w-full px-4 py-2.5 rounded-xl border-3 border-black bg-slate-800/60 text-sm font-mono text-slate-400 opacity-60 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Emoji Selection Ring */}
              <div className="space-y-2">
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-350 font-black pl-0.5">
                  Change Vibe Emoji
                </label>
                <div className="grid grid-cols-6 gap-2 bg-[#0f172a] p-3 rounded-xl border-2 border-black max-w-md">
                  {EMOJIS.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setSelectedEmoji(e)}
                      className={`text-xl p-1.5 rounded-lg transition-all focus:outline-none flex items-center justify-center ${
                        selectedEmoji === e ? 'bg-yellow-405 bg-yellow-400 border-2 border-black scale-105 shadow-[1.5px_1.5px_0px_0px_#000]' : 'hover:bg-slate-800'
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-350 font-black pl-0.5">
                  Your Bio Tagline
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-xs placeholder-slate-500"
                  placeholder="Low-key studying competitive fields..."
                />
              </div>

              {/* Custom Image Uploader */}
              <div className="space-y-2">
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-350 font-black pl-0.5">
                  Upload custom launcher avatar
                </label>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-3 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                    dragActive
                      ? 'border-pink-500 bg-pink-500/10'
                      : 'border-black hover:border-yellow-400 bg-slate-800'
                  }`}
                >
                  <p className="text-xs font-black text-white">
                    Drop avatar file or <span className="text-pink-400 underline decoration-pink-500">browse</span>
                  </p>
                  <p className="text-[9px] text-slate-400 mt-1 font-mono">
                    Automatically processed local file format. (PNG, JPG)
                  </p>
                </div>
              </div>

              {/* Actions Form */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t-2 border-black sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2">
                  {onResetAllData && (
                    <button
                      type="button"
                      onClick={onResetAllData}
                      className="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-rose-100 hover:text-black hover:border-black border-2 border-black rounded-xl text-[11px] font-black uppercase transition-all duration-150 cursor-pointer shadow-[2px_2px_0px_0px_#000]"
                    >
                      💀 Reset Progress
                    </button>
                  )}
                  {currentUser.role !== 'admin' && (
                    <button
                      type="button"
                      onClick={() => {
                        onUpdateUser({
                          ...currentUser,
                          role: 'admin',
                          badges: Array.from(new Set([...(currentUser.badges || []), 'Premium 💎', 'Administrator 🛡️', 'Plus Founder']))
                        });
                        alert("DEVELOPER MODE: Seamlessly promoted to Administrator! Admin tab is now unlocked and visible in the sticky global header navigation. 🛡️🔥");
                      }}
                      className="px-3 py-2 bg-cyan-400 hover:bg-cyan-300 text-black border-2 border-black rounded-xl text-[11px] font-black uppercase transition-all duration-155 cursor-pointer shadow-[2px_2px_0px_0px_#000]"
                    >
                      🛡️ Activate Admin Mode
                    </button>
                  )}
                </div>
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={onCancel}
                    className="px-5 py-2.5 border-2 border-black bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-slate-300 rounded-xl transition-colors cursor-pointer"
                  >
                    Close Settings
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 neo-btn text-xs hover:brightness-110 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes ✨
                  </button>
                </div>
              </div>

            </form>
          </div>

          {/* Gamified Stat Grid Blocks */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border-3 border-black bg-[#161e2e] shadow-[3px_3px_0px_0px_#000] text-center">
              <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-1 animate-pulse" />
              <span className="block text-[8px] font-mono text-slate-400 font-black uppercase">AVERAGE ACCURACY</span>
              <span className="text-xl font-black text-white mt-1 block">
                {averageAccuracy}%
              </span>
            </div>

            <div className="p-4 rounded-xl border-3 border-black bg-[#161e2e] shadow-[3px_3px_0px_0px_#000] text-center">
              <BookOpen className="w-6 h-6 text-pink-500 mx-auto mb-1" />
              <span className="block text-[8px] font-mono text-slate-400 font-black uppercase">DUELS PLAYED</span>
              <span className="text-xl font-black text-white mt-1 block">
                {userAttempts.length}
              </span>
            </div>

            <div className="p-4 rounded-xl border-3 border-black bg-[#161e2e] shadow-[3px_3px_0px_0px_#000] text-center">
              <Clock className="w-6 h-6 text-indigo-400 mx-auto mb-1" />
              <span className="block text-[8px] font-mono text-slate-400 font-black uppercase">AVG SPEED</span>
              <span className="text-xl font-black text-white mt-1 block font-mono">
                {averageTime}s
              </span>
            </div>
          </div>

          {/* My Leaderboard Standings */}
          <div className="p-5 rounded-2xl border-4 border-black bg-[#161e2e] shadow-[4px_4px_0px_0px_#000] space-y-4">
            <h4 className="text-xs font-mono tracking-wider text-slate-300 font-black uppercase flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-yellow-450 text-yellow-500 animate-bounce" />
              YOUR ARENA STANDINGS & LEADERBOARD PLACEMENTS ({userRankings.length})
            </h4>

            {userRankings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b-2 border-black text-[10px] font-mono uppercase text-slate-450 text-slate-400">
                      <th className="py-2.5 px-3 font-black">CHANNEL / ARENA</th>
                      <th className="py-2.5 px-3 font-black text-center">BEST SCORE</th>
                      <th className="py-2.5 px-3 font-black text-center">SPEEDRUN</th>
                      <th className="py-2.5 px-3 font-black text-center">STAND PLACE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Global Placement first */}
                    {globalRank && bestGlobalAttempt && (
                      <tr className="border-b border-slate-750 bg-slate-800/30">
                        <td className="py-3 px-3 text-white font-extrabold flex items-center gap-1.5">
                          <span>🌍</span> Global Overall Ranking
                        </td>
                        <td className="py-3 px-3 text-center text-yellow-400 font-extrabold bg-slate-800/10">
                          {bestGlobalAttempt.score} <span className="text-[10px] text-slate-500 font-normal">/{bestGlobalAttempt.totalPoints}</span>
                        </td>
                        <td className="py-3 px-3 text-center text-slate-300 font-mono font-medium">
                          {bestGlobalAttempt.timeTaken}s
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="px-2.5 py-0.5 rounded border-2 border-black bg-yellow-400 text-black text-[9px] font-mono font-black uppercase shadow-[1.5px_1.5px_0px_0px_#000]">
                            RANK #{globalRank}
                          </span>
                        </td>
                      </tr>
                    )}
                    
                    {userRankings.map((ranking, idx) => (
                      <tr key={idx} className="border-b border-slate-850 last:border-0 hover:bg-slate-800/20 transition-colors">
                        <td className="py-3 px-3 text-slate-300 font-semibold">
                          {getGenZCategoryName(ranking.category)}
                        </td>
                        <td className="py-3 px-3 text-center text-pink-500 font-extrabold bg-slate-800/10">
                          {ranking.bestAttempt.score} <span className="text-[10px] text-slate-500 font-normal">/{ranking.bestAttempt.totalPoints}</span>
                        </td>
                        <td className="py-3 px-3 text-center text-slate-300 font-mono font-medium">
                          {ranking.bestAttempt.timeTaken}s
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className={`px-2.5 py-0.5 rounded border-2 border-black text-[9px] font-mono font-black uppercase shadow-[1.5px_1.5px_0px_0px_#000] ${
                            ranking.rank === 1
                              ? 'bg-yellow-405 bg-yellow-400 text-black'
                              : ranking.rank === 2
                                ? 'bg-slate-300 text-black'
                                : 'bg-pink-500 text-white'
                          }`}>
                            RANK #{ranking.rank} <span className="text-[8px] font-sans font-normal text-opacity-80">/ {ranking.totalCompetitors}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-6 text-center border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/20 text-xs font-semibold text-slate-400 font-mono">
                No completed assessments found. Slay some tests to assert your group placements! 🚀
              </div>
            )}
          </div>

          {/* Slashed Badges Display Rack */}
          <div className="p-5 rounded-2xl border-4 border-black bg-[#161e2e] shadow-[4px_4px_0px_0px_#000]">
            <h4 className="text-xs font-mono tracking-wider text-slate-300 font-black uppercase mb-4 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-yellow-450 text-yellow-500" />
              SQUAD CHALLENGE BADGES ({defaultBadges.length})
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {defaultBadges.map((badge, idx) => {
                let badgeEmoji = '🏅';
                let colors = 'bg-slate-800 text-slate-300';
                if (badge.includes('First') || badge.includes('Spawn')) {
                  badgeEmoji = '🚀';
                  colors = 'bg-rose-950 text-rose-300 border-rose-500';
                } else if (badge.includes('Vibe') || badge.includes('Meme')) {
                  badgeEmoji = '💅';
                  colors = 'bg-indigo-950 text-indigo-300 border-indigo-500';
                } else if (badge.includes('Slay') || badge.includes('Streak')) {
                  badgeEmoji = '🔥';
                  colors = 'bg-yellow-950 text-yellow-300 border-yellow-500';
                } else {
                  badgeEmoji = '🎮';
                  colors = 'bg-[#1e293b] text-slate-300 border-black';
                }

                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border-2 text-center flex flex-col items-center justify-center gap-1 shadow-[2px_2px_0px_0px_#000] ${colors}`}
                  >
                    <span className="text-2xl">{badgeEmoji}</span>
                    <span className="text-[10px] font-black uppercase tracking-wide leading-none">{badge}</span>
                    <span className="text-[8px] font-mono opacity-80">UNLOCKED</span>
                  </div>
                );
              })}
              
              {/* Lock badges placeholders for fun gamified goals */}
              <div className="p-3 rounded-xl border-2 border-dashed border-slate-700 bg-[#0f172a]/40 text-center flex flex-col items-center justify-center gap-1 opacity-50">
                <span className="text-xl">🏆</span>
                <span className="text-[9px] font-black uppercase tracking-wide leading-none">Meme God</span>
                <span className="text-[7.5px] font-mono">STREAK &gt; 5</span>
              </div>
              <div className="p-3 rounded-xl border-2 border-dashed border-slate-700 bg-[#0f172a]/40 text-center flex flex-col items-center justify-center gap-1 opacity-50">
                <span className="text-xl">🩺</span>
                <span className="text-[9px] font-black uppercase tracking-wide leading-none">JEE Slay</span>
                <span className="text-[7.5px] font-mono">100% IN BIO</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
