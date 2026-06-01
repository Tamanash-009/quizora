import { useState, useEffect } from 'react';
import { Sparkles, Star, Smartphone, RefreshCw, Compass, Trophy, User as UserIcon, Image as ImageIcon, PlusSquare, Flame, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';

import { User, Quiz, Attempt } from './types';
import { INITIAL_CATEGORIES, INITIAL_QUIZZES, INITIAL_ATTEMPTS } from './initialData';

import Header from './components/Header';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import QuizPlay from './components/QuizPlay';
import QuizCreate from './components/QuizCreate';
import MemeGenerator from './components/MemeGenerator';
import AdminPanel from './components/AdminPanel';
import UserProfile from './components/UserProfile';
import Leaderboard from './components/Leaderboard';
import Scoreboard from './components/Scoreboard';
import { AboutView, ContactView, ReviewsView, PrivacyView, TermsView } from './components/AboutContactReviews';
import VentureStartupSuite from './components/VentureStartupSuite';

export default function App() {
  // Session states
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const persisted = localStorage.getItem('quizora_curr_user');
      return persisted ? JSON.parse(persisted) : null;
    } catch {
      return null;
    }
  });

  // Database lists
  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    try {
      const persisted = localStorage.getItem('quizora_quizzes');
      return persisted ? JSON.parse(persisted) : INITIAL_QUIZZES;
    } catch {
      return INITIAL_QUIZZES;
    }
  });

  const [attempts, setAttempts] = useState<Attempt[]>(() => {
    try {
      const persisted = localStorage.getItem('quizora_attempts');
      return persisted ? JSON.parse(persisted) : INITIAL_ATTEMPTS;
    } catch {
      return INITIAL_ATTEMPTS;
    }
  });

  // Routing and selections
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [memeScorePrefill, setMemeScorePrefill] = useState<string>('');
  const [levelUpAlert, setLevelUpAlert] = useState<{ oldLevel: number; newLevel: number; username: string } | null>(null);

  // Theme support
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const persisted = localStorage.getItem('quizora_dark_mode');
      return persisted === 'true' || (!persisted && window.matchMedia('(prefers-color-scheme: dark)').matches);
    } catch {
      return true; // Default to dark mode for elegant glassmorphic glows!
    }
  });

  // PWA installation prompts
  const [pwaInstallPrompt, setPwaInstallPrompt] = useState<any>(null);

  // Sync state back to local storage and update browser query parameters
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('quizora_curr_user', JSON.stringify(currentUser));
        
        // Ensure browser URL query parameter stays synchronized with current user's token
        const params = new URLSearchParams(window.location.search);
        if (params.get('token') !== currentUser.id) {
          params.set('token', currentUser.id);
          const newUrl = `${window.location.pathname}?${params.toString()}`;
          window.history.replaceState({}, '', newUrl);
        }
      } else {
        localStorage.removeItem('quizora_curr_user');
        
        // Clear token query parameter upon logout
        const params = new URLSearchParams(window.location.search);
        params.delete('token');
        params.delete('quiz');
        const searchStr = params.toString();
        const newUrl = `${window.location.pathname}${searchStr ? `?${searchStr}` : ''}`;
        window.history.replaceState({}, '', newUrl);
      }
    } catch {
      // silently handle localStorage errors
    }
  }, [currentUser]);

  // Initial Onboarding & URL Link-Sharing Sync
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const queryToken = params.get('token');
      const queryQuizId = params.get('quiz');
      const adminKey = params.get('key');

      if (adminKey === 'MASTER_SECRET') {
        setActiveTab('admin');
        const profilesListStr = localStorage.getItem('quizora_profiles');
        const list: User[] = profilesListStr ? JSON.parse(profilesListStr) : [];
        let devUser = list.find(p => p.id === 'mock_usr_tamanash');
        if (!devUser) {
          devUser = {
            id: 'mock_usr_tamanash',
            username: 'TamanashDev',
            email: 'tamanashdev@quizora.com',
            role: 'admin',
            bio: 'Senior Full-Stack Developer & Advisor on AI/ML system layers.',
            avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
            xp: 900,
            level: 4,
            streak: 5,
            badges: ['First Blood 🩸', 'Speed Demon ⚡', 'Terminal Guru 💻', 'Code Guru 👑'],
            createdAt: new Date().toISOString()
          };
          list.push(devUser);
          localStorage.setItem('quizora_profiles', JSON.stringify(list));
        }
        setCurrentUser(devUser);
        localStorage.setItem('quizora_curr_user', JSON.stringify(devUser));
      } else if (queryToken) {
        const savedProfiles = localStorage.getItem('quizora_profiles');
        const profilesList: User[] = savedProfiles ? JSON.parse(savedProfiles) : [];
        let matched = profilesList.find(p => p.id === queryToken || p.username.toLowerCase() === queryToken.toLowerCase());

        // Support standard preset demo accounts
        if (!matched) {
          const demos = [
            { id: 'mock_usr_alice', username: 'AliceLearner', bio: 'Preparing heavily for competitive medical standards.', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
            { id: 'mock_usr_bob', username: 'BobPioneer', bio: 'Loves generative physics engines and deep transformer structures.', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
            { id: 'mock_usr_tamanash', username: 'TamanashDev', bio: 'Senior Full-Stack Developer & Advisor on AI/ML system layers.', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' }
          ];
          const foundDemo = demos.find(d => d.id === queryToken || d.username.toLowerCase() === queryToken.toLowerCase());
          if (foundDemo) {
            matched = {
              id: foundDemo.id,
              username: foundDemo.username,
              email: `${foundDemo.username.toLowerCase()}@quizora.com`,
              role: foundDemo.id === 'mock_usr_tamanash' ? 'admin' : 'user',
              bio: foundDemo.bio,
              avatarUrl: foundDemo.avatarUrl,
              createdAt: new Date().toISOString()
            };
          }
        }

        if (matched) {
          setCurrentUser(matched);
        } else {
          // Zero-friction profile generation on unrecognized token query parameter
          const fallbackName = queryToken.startsWith('tok_') ? `Scholar_${queryToken.slice(4, 9)}` : queryToken;
          const freshUser: User = {
            id: queryToken,
            username: fallbackName,
            email: `${fallbackName.toLowerCase()}@quizora.com`,
            role: 'user',
            bio: 'Exploring competitive trivia matches with a shared token link!',
            avatarUrl: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(fallbackName)}`,
            emoji: '🔥',
            xp: 0,
            level: 1,
            streak: 0,
            badges: [],
            createdAt: new Date().toISOString()
          };
          profilesList.push(freshUser);
          localStorage.setItem('quizora_profiles', JSON.stringify(profilesList));
          setCurrentUser(freshUser);
        }
      } else {
        // Fallback to checking existing session state when no query token exists
        const cachedUser = localStorage.getItem('quizora_curr_user');
        if (cachedUser) {
          const parsed = JSON.parse(cachedUser);
          params.set('token', parsed.id);
          const newUrl = `${window.location.pathname}?${params.toString()}`;
          window.history.replaceState({}, '', newUrl);
        }
      }

      // Handle direct quiz landing route
      if (queryQuizId) {
        const matchingQuiz = quizzes.find(q => q.id === queryQuizId);
        if (matchingQuiz) {
          setSelectedQuiz(matchingQuiz);
        }
      }
    } catch {
      // URL sync error - continue
    }
  }, [quizzes]);

  useEffect(() => {
    try {
      localStorage.setItem('quizora_quizzes', JSON.stringify(quizzes));
    } catch {
      // silently handle localStorage errors
    }
  }, [quizzes]);

  useEffect(() => {
    try {
      localStorage.setItem('quizora_attempts', JSON.stringify(attempts));
    } catch {
      // silently handle localStorage errors
    }
  }, [attempts]);

  // Handle Dark Mode document tagging
  useEffect(() => {
    try {
      const docEl = document.documentElement;
      if (darkMode) {
        docEl.classList.add('dark');
        docEl.style.background = 'radial-gradient(circle at 10% 10%, #1e1b4b 0%, #312e81 25%, #1e1b4b 50%, #0f172a 100%)';
        docEl.style.backgroundAttachment = 'fixed';
        localStorage.setItem('quizora_dark_mode', 'true');
      } else {
        docEl.classList.remove('dark');
        docEl.style.background = 'radial-gradient(circle at 0% 0%, #f0fafc 0%, #e0e7ff 25%, #f1f3fd 50%, #f8fafc 100%)';
        docEl.style.backgroundAttachment = 'fixed';
        localStorage.setItem('quizora_dark_mode', 'false');
      }
    } catch {
      // silently handle theme errors
    }
  }, [darkMode]);

  // Capture standard browser beforeinstallprompt triggers
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setPwaInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const triggerPwaInstall = () => {
    if (!pwaInstallPrompt) return;
    pwaInstallPrompt.prompt();
    pwaInstallPrompt.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === 'accepted') {
        setPwaInstallPrompt(null);
      }
    });
  };

  // State mutators
  const handleAddNewQuiz = (newQuiz: Quiz) => {
    setQuizzes(prev => {
      const updated = [newQuiz, ...prev];
      localStorage.setItem('quizora_quizzes', JSON.stringify(updated));
      return updated;
    });
    setActiveTab('dashboard');
  };

  const handleDeleteQuiz = (quizId: string) => {
    setQuizzes(prev => {
      const updated = prev.filter(q => q.id !== quizId);
      localStorage.setItem('quizora_quizzes', JSON.stringify(updated));
      return updated;
    });
    setAttempts(prev => {
      const updated = prev.filter(a => a.quizId !== quizId);
      localStorage.setItem('quizora_attempts', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSaveAttempt = (newAttempt: Attempt) => {
    setAttempts(prev => [newAttempt, ...prev]);

    if (currentUser) {
      // 1. Calculate XP Gained: range is 10-50 XP
      const ratio = newAttempt.totalPoints > 0 ? (newAttempt.score / newAttempt.totalPoints) : 0;
      const gainedXp = Math.min(50, Math.max(10, 10 + Math.round(ratio * 40)));

      const oldXp = currentUser.xp ?? 0;
      const newXp = oldXp + gainedXp;
      
      // Level = every 300 XP
      const oldLevel = currentUser.level ?? 1;
      const newLevel = Math.floor(newXp / 300) + 1;

      // 2. Track daily attendance streaks with fire emojis
      let nextStreak = currentUser.streak ?? 0;
      const todayStr = new Date().toDateString();
      const savedActiveDate = localStorage.getItem(`quizora_active_dt_${currentUser.id}`);

      if (savedActiveDate) {
        if (savedActiveDate !== todayStr) {
          const savedDate = new Date(savedActiveDate);
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          
          if (savedDate.toDateString() === yesterday.toDateString()) {
            nextStreak += 1;
          } else {
            nextStreak = 1; // broken streak reset
          }
          localStorage.setItem(`quizora_active_dt_${currentUser.id}`, todayStr);
        }
      } else {
        localStorage.setItem(`quizora_active_dt_${currentUser.id}`, todayStr);
      }

      // 3. Dynamic Badge Unlocks
      const currentBadges = [...(currentUser.badges || ['First Spawn', 'Vibe Checked'])];
      const addedBadges: string[] = [];

      // Badge: First Blood 🩸
      const playerOtherAttempts = attempts.filter(a => a.userId === currentUser.id);
      if (playerOtherAttempts.length === 0 && !currentBadges.includes('First Blood 🩸')) {
        addedBadges.push('First Blood 🩸');
      }

      // Badge: Speed Demon ⚡ (Finished in <15s with high accuracy)
      if (newAttempt.timeTaken < 15 && ratio >= 0.8 && !currentBadges.includes('Speed Demon ⚡')) {
        addedBadges.push('Speed Demon ⚡');
      }

      // Badge: NEET Ninja 💪 (Perfect score on NEET/JEE channel)
      if (newAttempt.category === 'NEET/JEE Prep' && ratio === 1.0 && !currentBadges.includes('NEET Ninja 💪')) {
        addedBadges.push('NEET Ninja 💪');
      }

      const updatedBadges = Array.from(new Set([...currentBadges, ...addedBadges]));

      const updatedUser: User = {
        ...currentUser,
        xp: newXp,
        level: newLevel,
        streak: nextStreak,
        badges: updatedBadges
      };

      setCurrentUser(updatedUser);
      localStorage.setItem('quizora_curr_user', JSON.stringify(updatedUser));

      // Synchronize back to standard profiles database list
      const savedProfiles = localStorage.getItem('quizora_profiles');
      const profilesList: User[] = savedProfiles ? JSON.parse(savedProfiles) : [];
      const index = profilesList.findIndex(p => p.id === updatedUser.id);
      if (index !== -1) {
        profilesList[index] = updatedUser;
      } else {
        profilesList.push(updatedUser);
      }
      localStorage.setItem('quizora_profiles', JSON.stringify(profilesList));

      // Trigger level-up modal popup & special colorful confetti!
      if (newLevel > oldLevel) {
        setLevelUpAlert({
          oldLevel,
          newLevel,
          username: currentUser.username
        });

        setTimeout(() => {
          try {
            confetti({
              particleCount: 160,
              spread: 120,
              colors: ['#FF00FF', '#00FFFF', '#CCFF00', '#FF6600'],
              origin: { y: 0.5 }
            });
          } catch {
            // confetti rendering failed
          }
        }, 150);
      }
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedQuiz(null);
    setActiveTab('dashboard');
  };

  const triggerMemeWithScore = (scoreMsg: string) => {
    setMemeScorePrefill(scoreMsg);
    setSelectedQuiz(null);
    setActiveTab('meme');
  };

  const handleClearMetrics = () => {
    if (window.confirm("Are you sure you want to clear all attempt session logs from the local registry?")) {
      setAttempts([]);
    }
  };

  const handleResetAllData = () => {
    if (window.confirm("Are you sure you want to completely reset all your user stats (XP, Level, Streak) and assessment attempts back to zero? This action cannot be undone.")) {
      if (currentUser) {
        const resetUser: User = {
          ...currentUser,
          xp: 0,
          level: 1,
          streak: 0,
          badges: []
        };
        setCurrentUser(resetUser);
        localStorage.setItem('quizora_curr_user', JSON.stringify(resetUser));

        const savedProfiles = localStorage.getItem('quizora_profiles');
        const profilesList: User[] = savedProfiles ? JSON.parse(savedProfiles) : [];
        const index = profilesList.findIndex(p => p.id === currentUser.id);
        if (index !== -1) {
          profilesList[index] = resetUser;
          localStorage.setItem('quizora_profiles', JSON.stringify(profilesList));
        }
      }
      setAttempts([]);
      localStorage.setItem('quizora_attempts', JSON.stringify([]));
      alert("All your game progress has been reset to zero! Let the true progression begin! 🚀");
    }
  };

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-100 font-sans transition-all duration-300">
      
      {/* Decorative Blur Spheres (Only visible in Dark Mode for high contrast glowing elegance) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] aspect-square rounded-full bg-gradient-to-br from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/10 blur-[130px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[45%] aspect-square rounded-full bg-gradient-to-br from-pink-500/5 to-indigo-500/5 dark:from-pink-500/8 dark:to-indigo-500/5 blur-[120px]"></div>
      </div>

      {/* Glass navigation header bar */}
      <Header
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        onLogout={handleLogout}
        pwaInstallPrompt={pwaInstallPrompt}
        triggerPwaInstall={triggerPwaInstall}
      />

      {/* Main workspace controller with bottom spacing for mobile navbar support */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 sm:pb-8">
        
        {!currentUser ? (
          <Auth onLoginSuccess={(user) => setCurrentUser(user)} />
        ) : selectedQuiz ? (
          <QuizPlay
            quiz={selectedQuiz}
            userId={currentUser.id}
            username={currentUser.username}
            onSaveAttempt={handleSaveAttempt}
            onExit={() => setSelectedQuiz(null)}
            onOpenMemeWithScore={triggerMemeWithScore}
          />
        ) : (
          <div>
            {/* Screen Router */}
            {activeTab === 'dashboard' && (
              <Dashboard
                currentUser={currentUser}
                categories={INITIAL_CATEGORIES}
                quizzes={quizzes}
                attempts={attempts}
                onSelectQuiz={(quiz) => setSelectedQuiz(quiz)}
                setActiveTab={setActiveTab}
                pwaInstallPrompt={pwaInstallPrompt}
                triggerPwaInstall={triggerPwaInstall}
              />
            )}

            {activeTab === 'create' && (
              <QuizCreate
                categories={INITIAL_CATEGORIES}
                username={currentUser.username}
                onAddQuiz={handleAddNewQuiz}
                onCancel={() => setActiveTab('dashboard')}
              />
            )}

            {activeTab === 'meme' && (
              <MemeGenerator 
                initialScoreText={memeScorePrefill} 
              />
            )}

            {activeTab === 'admin' && (
              <AdminPanel
                attempts={attempts}
                quizzes={quizzes}
                onClearLogs={handleClearMetrics}
              />
            )}

            {activeTab === 'leaderboards' && (
              <Leaderboard
                attempts={attempts}
                categories={INITIAL_CATEGORIES}
              />
            )}

            {activeTab === 'profile' && (
              <UserProfile
                currentUser={currentUser}
                attempts={attempts}
                onUpdateUser={(updatedUser) => {
                  setCurrentUser(updatedUser);
                  localStorage.setItem('quizora_curr_user', JSON.stringify(updatedUser));
                  // Synchronize names across real attempts
                  setAttempts(prev => prev.map(a => a.userId === updatedUser.id ? { ...a, username: updatedUser.username } : a));
                }}
                onCancel={() => setActiveTab('dashboard')}
                onResetAllData={handleResetAllData}
              />
            )}

            {activeTab === 'venture' && (
              <VentureStartupSuite
                currentUser={currentUser}
                onUpdateUser={(updatedUser) => {
                  setCurrentUser(updatedUser);
                  localStorage.setItem('quizora_curr_user', JSON.stringify(updatedUser));
                }}
                quizzes={quizzes}
                onAddQuiz={handleAddNewQuiz}
                attempts={attempts}
                onResetAllData={handleResetAllData}
              />
            )}

            {activeTab === 'scoreboard' && (
              <Scoreboard
                currentUser={currentUser}
                quizzes={quizzes}
                attempts={attempts}
                onDeleteQuiz={handleDeleteQuiz}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'about' && (
              <AboutView />
            )}

            {activeTab === 'contact' && (
              <ContactView />
            )}

            {activeTab === 'reviews' && (
              <ReviewsView />
            )}

            {activeTab === 'privacy' && (
              <PrivacyView />
            )}

            {activeTab === 'terms' && (
              <TermsView />
            )}
          </div>
        )}
      </main>

      {/* Bottom 4-Column Neo-Brutalist Footer with Live Redis Metrics & Security Badges */}
      <footer className="w-full bg-[#0a0f1d] border-t-4 border-black text-slate-300 py-12 px-6 sm:px-12 mt-12 pb-24 sm:pb-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Community */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-white uppercase tracking-wider border-b-2 border-black pb-1.5 flex items-center gap-1.5">
              <span>🌐</span> COMMUNITY CHAINS
            </h4>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <a href="#instagram" onClick={(e) => { e.preventDefault(); alert("Redirecting to Quizora Official Instagram: @quizora.app"); }} className="hover:text-yellow-405 hover:underline flex items-center gap-1">
                  📸 Instagram Feed <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="#discord" onClick={(e) => { e.preventDefault(); alert("Joining our Discord server: Quizora Squad!"); }} className="hover:text-yellow-405 hover:underline flex items-center gap-1">
                  💬 Discord Lounge <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="#twitter" onClick={(e) => { e.preventDefault(); alert("Viewing Twitter: @QuizoraApp"); }} className="hover:text-yellow-450 hover:underline flex items-center gap-1">
                  🐦 X / Twitter Hub <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Tools */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-white uppercase tracking-wider border-b-2 border-black pb-1.5">
              🛠️ SYNERGY UTILITIES
            </h4>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <button onClick={() => { alert("Love Calculator is loading... Calculate your squad synergy index!"); }} className="hover:text-pink-500 hover:underline text-left cursor-pointer">
                  💖 Love Calculator Coeff
                </button>
              </li>
              <li>
                <button onClick={() => { alert("Host Personality Test... Load rare neuro profile archetypes."); }} className="hover:text-cyan-400 hover:underline text-left cursor-pointer">
                  🧠 Aura Personality Test
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('leaderboards')} className="hover:text-emerald-400 hover:underline text-left cursor-pointer">
                  ⚡ Squad Compatibility Board
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Popular Quizzes (8+ Predefined) */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-white uppercase tracking-wider border-b-2 border-black pb-1.5">
              🔥 SQUAD FAVORITES
            </h4>
            <ul className="grid grid-cols-1 gap-1 text-[11px] font-mono">
              <li><button onClick={() => setActiveTab('dashboard')} className="hover:text-yellow-400 text-left cursor-pointer">👉 Best Friend Quiz (BFF)</button></li>
              <li><button onClick={() => setActiveTab('dashboard')} className="hover:text-yellow-400 text-left cursor-pointer">👉 BFF Challenge Vibe-check</button></li>
              <li><button onClick={() => setActiveTab('dashboard')} className="hover:text-yellow-400 text-left cursor-pointer">👉 Friendship Dare 2026</button></li>
              <li><button onClick={() => setActiveTab('dashboard')} className="hover:text-yellow-400 text-left cursor-pointer">👉 Chemistry Crush Slay</button></li>
              <li><button onClick={() => setActiveTab('dashboard')} className="hover:text-yellow-400 text-left cursor-pointer">👉 GigaChad CS Fundamentals</button></li>
              <li><button onClick={() => setActiveTab('dashboard')} className="hover:text-yellow-400 text-left cursor-pointer">👉 Spicy Quantum Science</button></li>
              <li><button onClick={() => setActiveTab('dashboard')} className="hover:text-yellow-400 text-left cursor-pointer">👉 High School Aura Standard</button></li>
              <li><button onClick={() => setActiveTab('dashboard')} className="hover:text-yellow-400 text-left cursor-pointer">👉 NEET General Biology Grind</button></li>
            </ul>
          </div>

          {/* Column 4: Explore */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-white uppercase tracking-wider border-b-2 border-black pb-1.5">
              🧭 EXPLORATION GRID
            </h4>
            <ul className="grid grid-cols-2 gap-2 text-xs font-mono">
              <li><button onClick={() => setActiveTab('create')} className="hover:text-pink-500 text-left cursor-pointer">Create Quiz</button></li>
              <li><button onClick={() => setActiveTab('leaderboards')} className="hover:text-emerald-400 text-left cursor-pointer">Leaderboard</button></li>
              <li><button onClick={() => setActiveTab('reviews')} className="hover:text-cyan-400 text-left cursor-pointer">Reviews</button></li>
              <li><button onClick={() => setActiveTab('about')} className="hover:text-indigo-400 text-left cursor-pointer">About Us</button></li>
              <li><button onClick={() => setActiveTab('contact')} className="hover:text-amber-500 text-left cursor-pointer">Contact</button></li>
              <li><button onClick={() => setActiveTab('privacy')} className="hover:text-pink-400 text-left cursor-pointer">Privacy</button></li>
              <li><button onClick={() => setActiveTab('terms')} className="hover:text-yellow-400 text-left cursor-pointer">Terms</button></li>
              <li><button onClick={() => setActiveTab('profile')} className="hover:text-indigo-400 text-left cursor-pointer">My Profile</button></li>
            </ul>
          </div>
        </div>

        {/* Platform Telemetry Stats Display Row */}
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t-2 border-black flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono font-black text-black">
            <span className="px-3 py-1 bg-yellow-400 border-2 border-black rounded shadow-[2px_2px_0px_0px_#000]">
              REDIS CLOUD VIEWS: 92.0K+ 📈
            </span>
            <span className="px-3 py-1 bg-[#25D366] border-2 border-black rounded shadow-[2px_2px_0px_0px_#000]">
              SAFETY SHIELD: 100% PRIVATE 🛡️
            </span>
            <span className="px-3 py-1 bg-cyan-400 border-2 border-black rounded shadow-[2px_2px_0px_0px_#000]">
              CREATIONS IN DATABASE: 5,282 ✍️
            </span>
          </div>

          <div className="text-center md:text-right font-mono text-[10px] text-slate-500">
            <span>Quizora App Engine PWA v1.0.8 • Local Database Active</span>
            <p className="mt-1">All rights reserved © {new Date().getFullYear()} Quizora Global Inc.</p>
          </div>
        </div>
      </footer>

      {/* Mobile-first Bottom navigation bar */}
      {currentUser && !selectedQuiz && (
        <nav className="sm:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#111827] border-t-3 border-black flex items-center justify-around z-40 px-2 shadow-[0_-3px_0px_0px_#000]">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all ${
              activeTab === 'dashboard' ? 'text-yellow-400 font-extrabold translate-y-[-2px]' : 'text-slate-400 font-semibold'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[9px] font-mono tracking-wide uppercase">Slay</span>
          </button>

          <button
            onClick={() => setActiveTab('leaderboards')}
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all ${
              activeTab === 'leaderboards' ? 'text-pink-500 font-extrabold translate-y-[-2px]' : 'text-slate-400 font-semibold'
            }`}
          >
            <Trophy className="w-5 h-5" />
            <span className="text-[9px] font-mono tracking-wide uppercase">Arena</span>
          </button>

          {/* Central quick action Creator FAB key */}
          <button
            onClick={() => setActiveTab('create')}
            className="flex items-center justify-center mx-1.5 w-11 h-11 rounded-xl bg-pink-500 text-white border-2 border-black shadow-[2px_2px_0px_0px_#000] -translate-y-2.5 active:translate-y-0 transition-transform cursor-pointer"
            title="Slay New Quiz!"
          >
            <PlusSquare className="w-5.5 h-5.5 shrink-0" />
          </button>

          <button
            onClick={() => setActiveTab('meme')}
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all ${
              activeTab === 'meme' ? 'text-cyan-400 font-extrabold translate-y-[-2px]' : 'text-slate-400 font-semibold'
            }`}
          >
            <ImageIcon className="w-5 h-5" />
            <span className="text-[9px] font-mono tracking-wide uppercase">Forge</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all ${
              activeTab === 'profile' ? 'text-indigo-400 font-extrabold translate-y-[-2px]' : 'text-slate-400 font-semibold'
            }`}
          >
            <UserIcon className="w-5 h-5" />
            <span className="text-[9px] font-mono tracking-wide uppercase">Profile</span>
          </button>
        </nav>
      )}

      {/* Level-Up Celebration Modal Dialog */}
      {levelUpAlert && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#111827] border-4 border border-black p-6 rounded-2xl max-w-sm w-full relative shadow-[6px_6px_0px_0px_#FF00FF] hover:shadow-[6px_6px_0px_0px_#00FFFF] transition-all text-center space-y-4">
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded border-2 border-black bg-yellow-400 text-black font-black text-xs tracking-widest uppercase shadow-[2px_2px_0px_0px_#000] animate-pulse">
              LEVEL UP! 🎉
            </span>
            
            <div className="pt-4 flex justify-center">
              <div className="relative">
                <span className="text-6xl select-none">👑</span>
                <span className="absolute -bottom-1 -right-1 text-2xl animate-bounce">🔥</span>
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-black text-white uppercase tracking-tight">YOU'RE ABSOLUTELY OP!</h2>
              <p className="text-[11px] text-slate-400 font-semibold">
                @{levelUpAlert.username} just transcended mortal boundaries!
              </p>
            </div>

            <div className="flex items-center justify-center gap-6 py-2 bg-slate-900 border-2 border-black rounded-xl max-w-[240px] mx-auto">
              <div className="text-center">
                <span className="block text-[8px] font-mono text-slate-400 font-bold uppercase">OLD LEVEL</span>
                <span className="text-base font-mono text-slate-400 font-black">{levelUpAlert.oldLevel}</span>
              </div>
              <span className="text-base text-pink-500 font-black">➔</span>
              <div className="text-center">
                <span className="block text-[8px] font-mono text-pink-500 font-extrabold uppercase">NEW level</span>
                <span className="text-lg font-mono text-cyan-450 text-cyan-400 font-black tracking-wide">{levelUpAlert.newLevel}</span>
              </div>
            </div>

            <button
              onClick={() => setLevelUpAlert(null)}
              className="w-full py-2.5 bg-[#CCFF00] hover:bg-[#b5e000] text-black border-2 border-black font-black uppercase text-[11px] rounded-xl shadow-[2px_2px_0px_0px_#000] active:translate-y-[1px] cursor-pointer tracking-wider"
            >
              No Cap, let's Slay More! 💅
            </button>
          </div>
        </div>
      )}
      {renderView()}
    </main>
    <PwaInstallPrompt />
  </div>
);
}

export default App;
