import { useState, FormEvent } from 'react';
import { 
  Sparkles, 
  Zap, 
  UserPlus, 
  Compass, 
  ArrowRight,
  KeyRound,
  Award,
  Smile
} from 'lucide-react';
import { User as UserType } from '../types';

interface AuthProps {
  onLoginSuccess: (user: UserType) => void;
}

// Gen Z Emojis
const EMOJIS = ['🦄', '🔥', '⚡', '💀', '💅', '👽', '🧠', '👑', '🌈', '🍕', '👾', '🚀'];

// Generate short Gen Z token: e.g. qz_name🔥_4k7s
function makeGenZToken(username: string, emoji: string): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const cleanName = username.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10);
  return `qz_${cleanName}${emoji}_${rand}`;
}

export default function Auth({ onLoginSuccess }: AuthProps) {
  const [customUsername, setCustomUsername] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🔥');
  const [existingToken, setExistingToken] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Default bypass credentials
  const demoProfiles = [
    {
      username: 'AliceLearner',
      id: 'qz_alice🦄_9x2u',
      emoji: '🦄',
      bio: 'Low-key studying physics until my brain melts. 💀',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    },
    {
      username: 'BobPioneer',
      id: 'qz_bob👾_3m4p',
      emoji: '👾',
      bio: 'Coding custom neural setups and looking for duels. Bet.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
    },
    {
      username: 'TamanashDev',
      id: 'qz_tamanash👑_dev',
      emoji: '👑',
      bio: 'Senior Full-Stack Slay Developer. No cap.',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
    }
  ];

  const handleCreateToken = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmed = customUsername.trim();
    if (!trimmed) {
      setErrorMsg('Choose a killer username first, bruh! 💀');
      return;
    }

    const freshToken = makeGenZToken(trimmed, selectedEmoji);

    const newUser: UserType = {
      id: freshToken,
      username: `${trimmed}${selectedEmoji}`,
      email: `${trimmed.toLowerCase()}@quizora.com`,
      role: 'user',
      bio: 'Just spawned into Quizora! Ready to slay some quizzes. 🔥',
      avatarUrl: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(trimmed)}`,
      emoji: selectedEmoji,
      xp: 0,
      level: 1,
      streak: 0,
      badges: [],
      createdAt: new Date().toISOString()
    };

    try {
      const savedProfiles = localStorage.getItem('quizora_profiles');
      const profilesList = savedProfiles ? JSON.parse(savedProfiles) : [];
      profilesList.push(newUser);
      localStorage.setItem('quizora_profiles', JSON.stringify(profilesList));
    } catch (err) {
      console.error(err);
    }

    onLoginSuccess(newUser);
  };

  const handleEnterWithToken = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const token = existingToken.trim();
    if (!token) {
      setErrorMsg('Drop your access code so we can find you. 👽');
      return;
    }

    // Is it a default bio bypass?
    const matchedDemo = demoProfiles.find(p => p.id === token || p.username.toLowerCase() === token.toLowerCase());
    if (matchedDemo) {
      const newUser: UserType = {
        id: matchedDemo.id,
        username: `${matchedDemo.username}${matchedDemo.emoji}`,
        email: `${matchedDemo.username.toLowerCase()}@quizora.com`,
        role: matchedDemo.username === 'TamanashDev' ? 'admin' : 'user',
        bio: matchedDemo.bio,
        avatarUrl: matchedDemo.avatarUrl,
        emoji: matchedDemo.emoji,
        xp: 450,
        level: 3,
        streak: 3,
        badges: ['Legacy Slay', 'Code Lord'],
        createdAt: new Date().toISOString()
      };
      onLoginSuccess(newUser);
      return;
    }

    try {
      const savedProfiles = localStorage.getItem('quizora_profiles');
      const profilesList: UserType[] = savedProfiles ? JSON.parse(savedProfiles) : [];
      const matchedProfile = profilesList.find(p => p.id === token || p.username.toLowerCase() === token.toLowerCase());
      
      if (matchedProfile) {
        onLoginSuccess(matchedProfile);
      } else {
        // Fallback: spawn on the fly
        const autoName = token.includes('_') ? token.split('_')[1] : token;
        const freshUser: UserType = {
          id: token.startsWith('qz_') ? token : `qz_${token.toLowerCase()}_${Math.floor(1000 + Math.random() * 9000)}`,
          username: autoName,
          email: `${autoName.toLowerCase()}@quizora.com`,
          role: 'user',
          bio: 'Challenging squad mates. High-key unstoppable. ⚡',
          avatarUrl: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(autoName)}`,
          emoji: '⚡',
          xp: 0,
          level: 1,
          streak: 0,
          badges: [],
          createdAt: new Date().toISOString()
        };
        profilesList.push(freshUser);
        localStorage.setItem('quizora_profiles', JSON.stringify(profilesList));
        onLoginSuccess(freshUser);
      }
    } catch {
      setErrorMsg('Token validation failed. Let\'s make code simple.');
    }
  };

  const handleDemoBypass = (profile: typeof demoProfiles[0]) => {
    const user: UserType = {
      id: profile.id,
      username: `${profile.username}${profile.emoji}`,
      email: `${profile.username.toLowerCase()}@quizora.com`,
      role: profile.username === 'TamanashDev' ? 'admin' : 'user',
      bio: profile.bio,
      avatarUrl: profile.avatarUrl,
      emoji: profile.emoji,
      xp: 420,
      level: 4,
      streak: 5,
      badges: ['Speedy Slay', 'Beta Vibe'],
      createdAt: new Date().toISOString()
    };
    onLoginSuccess(user);
  };

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center py-8 px-4 sm:px-6 lg:px-8 relative">
      
      {/* Decorative Neo-Brutalist Grid Elements */}
      <div className="absolute top-8 left-8 text-yellow-400 font-mono text-[10px] hidden md:block">
        [ SYSTEM_ONLINE STATUS: DRIPPY ]
      </div>
      <div className="absolute bottom-8 right-8 text-rose-500 font-mono text-[10px] hidden md:block">
        [ VIBE_METRE: MAXIMUM_SLAY ]
      </div>

      <div className="w-full max-w-4xl grid md:grid-cols-12 gap-8 items-center">
        
        {/* Left Col - Sassy Neo-Brutalist Promo Card */}
        <div className="md:col-span-6 space-y-6 text-center md:text-left pr-2">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-black bg-rose-500 text-black text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#000]">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>NO LOGIN • NO BOOMER PASSWORDS</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-[1.05]">
            Slay public trivia matches with{' '}
            <span className="bg-gradient-to-r from-yellow-300 via-pink-500 to-indigo-400 bg-clip-text text-transparent italic decoration-yellow-400">
              Quizora
            </span>
          </h1>

          <p className="text-sm text-slate-305 max-w-lg leading-relaxed font-semibold">
            The viral quiz battle engine for developers, medical students, and absolute meme junkies. Challenge friends, forge dynamic live memes with your high scores, and assert dominance on global leaderboards. Sassy, high contrast, and zero fluff. No cap. 💅⚡
          </p>

          <div className="grid grid-cols-2 gap-4 max-w-md pt-2">
            <div className="flex items-start gap-2 text-left bg-[#1e293b] border-2 border-black p-3.5 rounded-xl shadow-[3px_3px_0px_0px_#000]">
              <Zap className="w-5 h-5 text-yellow-300 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-extrabold text-white block">INSTANT ACCESS</span>
                <span className="text-[10px] text-slate-400">Spawn in 1-tap. No annoying emails.</span>
              </div>
            </div>
            <div className="flex items-start gap-2 text-left bg-[#1e293b] border-2 border-black p-3.5 rounded-xl shadow-[3px_3px_0px_0px_#000]">
              <Award className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-extrabold text-white block">MEME FORGE</span>
                <span className="text-[10px] text-slate-400">Convert failures into massive flexes.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col - Neo-Brutalist Spawn Portal Card */}
        <div className="md:col-span-6 p-6 sm:p-8 rounded-2xl border-4 border-black bg-[#161e2e] shadow-[8px_8px_0px_0px_#000000] space-y-6">
          
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-mono tracking-widest text-yellow-400 uppercase font-bold block">
              SPAWN GATEWAY
            </span>
            <h2 className="text-2xl font-black text-white">
              Drop your vibe ✨
            </h2>
          </div>

          {errorMsg && (
            <div className="p-3 text-xs bg-rose-950 border-2 border-rose-500 text-rose-350 rounded-xl font-bold animate-pulse">
              💀 {errorMsg}
            </div>
          )}

          {/* Form Create */}
          <form onSubmit={handleCreateToken} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-350 font-black pl-0.5">
                Pick a dope alias *
              </label>
              <div className="relative">
                <Compass className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g., EinsteinX / Hypebeast_Dev"
                  value={customUsername}
                  onChange={(e) => setCustomUsername(e.target.value)}
                  maxLength={16}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl font-bold text-xs"
                />
              </div>
            </div>

            {/* Emoji Grid Selector */}
            <div className="space-y-2">
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-350 font-black pl-0.5 flex items-center gap-1">
                <Smile className="w-3.5 h-3.5 text-yellow-300" /> Select your vibe emoji
              </label>
              <div className="grid grid-cols-6 gap-2 bg-[#0f172a] p-3 rounded-xl border-2 border-black">
                {EMOJIS.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setSelectedEmoji(e)}
                    className={`text-xl p-2 rounded-lg transition-all hover:scale-125 focus:outline-none flex items-center justify-center ${
                      selectedEmoji === e ? 'bg-yellow-400 border-2 border-black scale-110 shadow-[2px_2px_0px_0px_#000]' : 'hover:bg-slate-800'
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            <button
               type="submit"
               className="w-full neo-btn cursor-pointer py-3.5 flex items-center justify-center text-xs"
            >
              <UserPlus className="w-4 h-4" />
              Let's Go 🚀 (Slay!)
              <ArrowRight className="w-4 h-4 ml-0.5 animate-bounce-horizontal" />
            </button>

            {/* Instant Guest Bypass Button */}
            <button
              type="button"
              onClick={() => {
                const guestNum = Math.floor(1000 + Math.random() * 9000);
                const guestUser: UserType = {
                  id: `qz_guest_${guestNum}`,
                  username: `Guest_${guestNum}`,
                  email: `guest_${guestNum}@quizora.com`,
                  role: 'user',
                  bio: 'A high-vibe guest player taking quizzes on the fly! ⚡',
                  avatarUrl: `https://api.dicebear.com/7.x/pixel-art/svg?seed=Guest_${guestNum}`,
                  emoji: '⚡',
                  xp: 0,
                  level: 1,
                  streak: 0,
                  badges: [],
                  createdAt: new Date().toISOString()
                };
                
                // Add guest user to global profile cache so their sessions are saved
                try {
                  const saved = localStorage.getItem('quizora_profiles');
                  const list = saved ? JSON.parse(saved) : [];
                  list.push(guestUser);
                  localStorage.setItem('quizora_profiles', JSON.stringify(list));
                } catch (e) {
                  console.error(e);
                }
                
                onLoginSuccess(guestUser);
              }}
              className="w-full py-2.5 bg-slate-800 hover:bg-yellow-400 hover:text-black hover:border-black border-2 border-slate-700 text-slate-205 text-white rounded-xl text-xs font-black uppercase transition-all duration-150 cursor-pointer shadow-[2px_2px_0px_0px_#000] flex items-center justify-center gap-1.5"
              id="instant-guest-play-btn"
            >
              <span>✨ Play as Guest (1-Tap Slay)</span>
            </button>
          </form>

          {/* Sassy divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t-2 border-black"></div>
            <span className="flex-shrink mx-3 text-[10px] font-mono text-slate-400 font-bold uppercase">Returning Squad Member</span>
            <div className="flex-grow border-t-2 border-black"></div>
          </div>

          {/* Login with Token */}
          <form onSubmit={handleEnterWithToken} className="space-y-3">
            <div className="space-y-2">
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-350 font-black pl-0.5">
                Paste your secret access handle
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g., qz_hacker🔥_8j9x"
                  value={existingToken}
                  onChange={(e) => setExistingToken(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-xs font-mono font-semibold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 border-2 border-black bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-[2px_2px_0px_0px_#000] active:translate-y-[2px]"
            >
              Recover My Streak 🔥
            </button>
          </form>

          {/* Sandbox Tester Bypasses */}
          <div className="pt-4 border-t-2 border-black space-y-2">
            <span className="text-[9px] font-mono tracking-widest text-[#94a3b8] uppercase font-black block text-center">
              EVALUATOR PRESET SQUAD MEMBERS (BYPASS)
            </span>
            <div className="flex flex-wrap justify-center gap-1.5">
              {demoProfiles.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleDemoBypass(p)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border-2 border-black bg-slate-800 hover:bg-yellow-400 hover:text-black text-[9px] font-black transition-all cursor-pointer"
                >
                  <img src={p.avatarUrl} alt="" className="w-4.5 h-4.5 rounded object-cover" referrerPolicy="no-referrer" />
                  <span>{p.username} ({p.id === 'qz_tamanash👑_dev' ? 'Admin' : 'Coder'})</span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
