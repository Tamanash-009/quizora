import { useState, useEffect, useRef } from 'react';
import { 
  Trophy, 
  Copy, 
  QrCode, 
  Download, 
  Trash2, 
  RefreshCw, 
  Clock, 
  Check, 
  ExternalLink, 
  Share2, 
  ShieldAlert, 
  Smartphone, 
  Laptop, 
  Globe, 
  Plus, 
  Sparkles,
  ChevronRight,
  Info,
  Shield,
  Eye,
  Settings
} from 'lucide-react';
import { Quiz, Attempt, User } from '../types';
import confetti from 'canvas-confetti';

interface ScoreboardProps {
  currentUser: User;
  quizzes: Quiz[];
  attempts: Attempt[];
  onDeleteQuiz: (quizId: string) => void;
  setActiveTab: (tab: string) => void;
}

// Analytics tracking logs state interface
interface EventLog {
  id: string;
  eventName: string;
  timestamp: string;
  details: string;
}

export default function Scoreboard({
  currentUser,
  quizzes,
  attempts,
  onDeleteQuiz,
  setActiveTab
}: ScoreboardProps) {
  // Current quiz focused on the scoreboard. Default to user's first quiz, otherwise first public quiz
  const userQuizzes = quizzes.filter(q => q.createdBy === currentUser.username || q.creatorId === currentUser.id);
  const [selectedQuizId, setSelectedQuizId] = useState<string>(() => {
    if (userQuizzes.length > 0) return userQuizzes[0].id;
    if (quizzes.length > 0) return quizzes[0].id;
    return '';
  });

  const activeQuiz = quizzes.find(q => q.id === selectedQuizId) || quizzes[0];

  // Scoring timeframe filter
  const [leaderboardFilter, setLeaderboardFilter] = useState<'all' | 'weekly' | 'today'>('all');
  const [geoFilter, setGeoFilter] = useState<'global' | 'asia' | 'india'>('global');
  const [loadLimit, setLoadLimit] = useState<number>(5);

  // Simulated live state
  const [playsModifier, setPlaysModifier] = useState<number>(0);
  const [pollingActive, setPollingActive] = useState<boolean>(true);
  const [recentNotification, setRecentNotification] = useState<string | null>(null);
  
  // Custom states for dialogs & settings
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showGdprModal, setShowGdprModal] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  
  // Cookie / Ads toggler settings
  const [showAds, setShowAds] = useState<boolean>(true);
  const [analyticsLogs, setAnalyticsLogs] = useState<EventLog[]>([
    { id: '1', eventName: 'scoreboard_init', timestamp: new Date(Date.now() - 300000).toLocaleTimeString(), details: 'Personal scoreboard channel loaded in client viewport.' }
  ]);

  // For Bit.ly style shortened links
  const [useShortLink, setUseShortLink] = useState<boolean>(false);

  // Auto-simulation/Polling: simulation adds play records or triggers increment notifications
  useEffect(() => {
    if (!pollingActive || !activeQuiz) return;

    const interval = setInterval(() => {
      // 15% chance to trigger simulated friend play
      if (Math.random() < 0.25) {
        setPlaysModifier(prev => prev + 1);
        
        const randomNames = ["SlayQueen_99", "AlphaSkibidi", "NoCapNathan", "RizzGod_Op", "BFF_Sophia", "OmegaGamer"];
        const takerName = randomNames[Math.floor(Math.random() * randomNames.length)];
        const mockScorePercent = Math.floor(Math.random() * 5) * 20 + 20; // 20% to 100%
        
        // Push notification toast
        setRecentNotification(`🎉 ${takerName} completed your quiz with ${mockScorePercent}% score!`);
        confetti({
          particleCount: 50,
          spread: 40,
          origin: { y: 0.9, x: 0.85 }
        });

        // Trigger analytics track
        trackEvent('quiz_plays', `New score of ${mockScorePercent}% recorded from simulated client.`);

        setTimeout(() => setRecentNotification(null), 4000);
      }
    }, 7000);

    return () => clearInterval(interval);
  }, [pollingActive, activeQuiz]);

  if (!activeQuiz) {
    return (
      <div className="p-8 rounded-2xl border-4 border-black bg-[#161e2e] shadow-[6px_6px_0px_0px_#000] text-center max-w-xl mx-auto my-12">
        <ShieldAlert className="w-16 h-16 text-pink-500 mx-auto mb-4 animate-pulse" />
        <h2 className="text-2xl font-black text-white uppercase tracking-tight">No Active Quiz Found!</h2>
        <p className="text-xs text-slate-300 mt-2 mb-6">
          You don't have any quizzes associated with your account yet. Slay a custom challenge right now and flex it with your squad!
        </p>
        <button
          onClick={() => setActiveTab('create')}
          className="px-5 py-3 rounded-lg bg-pink-500 text-white font-black uppercase text-xs border-2 border-black shadow-[4px_4px_0px_0px_#000] active:translate-y-1 transition-all cursor-pointer inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create First Quiz
        </button>
      </div>
    );
  }

  // Calculate actual play counts & score statistics based on existing attempts
  const actualQuizAttempts = attempts.filter(a => a.quizId === activeQuiz.id);
  const playsCount = actualQuizAttempts.length + playsModifier;
  
  // Calculate dynamic stats
  const averageScore = Math.round(
    actualQuizAttempts.length > 0 
      ? (actualQuizAttempts.reduce((sum, item) => sum + (item.score / (item.totalPoints || 1)), 0) / actualQuizAttempts.length) * 100 
      : 82 // default high-vibe average ratio if fresh
  );

  const completionRate = actualQuizAttempts.length > 0 
    ? Math.round((actualQuizAttempts.filter(a => a.score > 0).length / actualQuizAttempts.length) * 100)
    : 100; // Default completion

  // Computed sharing URL
  const quizShareDomain = "https://quizora.app";
  const quizSlug = activeQuiz.id;
  const standardLink = `${quizShareDomain}/@${quizSlug}`;
  const shortLink = `https://qz.ra/s/${quizSlug.substring(0, 8)}`;
  const currentShareLink = useShortLink ? shortLink : standardLink;

  // Custom logging of sharing telemetry
  const trackEvent = (eventName: string, details: string) => {
    const newLog: EventLog = {
      id: Date.now().toString(),
      eventName,
      timestamp: new Date().toLocaleTimeString(),
      details
    };
    setAnalyticsLogs(prev => [newLog, ...prev].slice(0, 5));
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    trackEvent('copy_link', `Target URL link copied to user clipboard: ${text}`);
    setTimeout(() => setCopiedText(null), 2500);
  };

  // 13 Social sharing platforms
  const triggerShare = (platform: string) => {
    const message = `Check out my friendship quiz "${activeQuiz.title}" and vibe-check our synergy! Can you score 100%? 👉 ${currentShareLink}`;
    let url = '';

    trackEvent(`share_${platform}`, `User selected sharing trigger to platform channel.`);

    switch (platform) {
      case 'whatsapp_status':
        url = `https://wa.me/?text=${encodeURIComponent(message)}`;
        break;
      case 'whatsapp_message':
        url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentShareLink)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
        break;
      case 'telegram':
        url = `https://t.me/share/url?url=${encodeURIComponent(currentShareLink)}&text=${encodeURIComponent(message)}`;
        break;
      case 'line':
        url = `https://line.me/R/msg/text/?${encodeURIComponent(message)}`;
        break;
      case 'email':
        url = `mailto:?subject=${encodeURIComponent("Friendship Vibe Check!")}&body=${encodeURIComponent(message)}`;
        break;
      case 'sms':
        url = `sms:?&body=${encodeURIComponent(message)}`;
        break;
      case 'instagram':
      case 'snapchat':
      case 'messenger':
      case 'tiktok':
      case 'threads':
      default:
        // Copy option + fallback instructions
        navigator.clipboard.writeText(currentShareLink);
        alert(`🔗 Link copied for ${platform.toUpperCase()}!\n\nOpen the ${platform.toUpperCase()} app and paste the link directly into your story or bio. No cap!`);
        return;
    }

    if (url) {
      window.open(url, '_blank');
    }
  };

  // Public leaderboards previews
  // Standard list of attempts for this quiz
  const baseLeaderboard = actualQuizAttempts.length > 0 
    ? actualQuizAttempts 
    : [
        { id: 'att_m1', userId: 'usr_m1', username: 'SkibidiSlayer', quizId: activeQuiz.id, quizTitle: activeQuiz.title, score: 5, totalPoints: 5, timeTaken: 12, completedAt: new Date(Date.now() - 3600000).toISOString(), category: activeQuiz.category, deviceType: 'mobile' },
        { id: 'att_m2', userId: 'usr_m2', username: 'WiggleRizzler', quizId: activeQuiz.id, quizTitle: activeQuiz.title, score: 4, totalPoints: 5, timeTaken: 18, completedAt: new Date(Date.now() - 7200000).toISOString(), category: activeQuiz.category, deviceType: 'desktop' },
        { id: 'att_m3', userId: 'usr_m3', username: 'NoCapTimi', quizId: activeQuiz.id, quizTitle: activeQuiz.title, score: 3, totalPoints: 5, timeTaken: 22, completedAt: new Date(Date.now() - 9300000).toISOString(), category: activeQuiz.category, deviceType: 'mobile' },
        { id: 'att_m4', userId: 'usr_m4', username: 'GigaChadStudent', quizId: activeQuiz.id, quizTitle: activeQuiz.title, score: 4, totalPoints: 5, timeTaken: 25, completedAt: new Date(Date.now() - 11200000).toISOString(), category: activeQuiz.category, deviceType: 'desktop' },
        { id: 'att_m5', userId: 'usr_m5', username: 'FuzzyBreezy', quizId: activeQuiz.id, quizTitle: activeQuiz.title, score: 2, totalPoints: 5, timeTaken: 15, completedAt: new Date().toISOString(), category: activeQuiz.category, deviceType: 'mobile' }
      ];

  // Apply visual Geo filtering Simulation
  const geoFilteredAttempts = baseLeaderboard.filter((item, index) => {
    if (geoFilter === 'asia') return index % 3 === 0 || index % 4 === 1;
    if (geoFilter === 'india') return index % 2 === 0;
    return true;
  });

  const rankedAttempts = [...geoFilteredAttempts].sort((a, b) => {
    const calcPctA = (a.score / (a.totalPoints || 1));
    const calcPctB = (b.score / (b.totalPoints || 1));
    if (calcPctB !== calcPctA) return calcPctB - calcPctA;
    return a.timeTaken - b.timeTaken;
  });

  // Calculate dynamic global ranking
  // Suppose user matches some position, or calculated rank
  const myMockGlobalRank = 28;
  const playsLeftForTop100 = 100 - myMockGlobalRank;

  // Static Sparkline helper: 7 days daily data mock points
  const sparklineDays = ["18", "24", "15", "30", "22", "38", playsCount.toString()];
  const sparkPoints = "0,40 15,30 30,55 45,15 60,35 75,5 90," + Math.max(0, 60 - Math.min(60, playsCount * 1.5));

  // Handler to Soft Delete Quiz & re-create
  const handleConfirmDelete = () => {
    onDeleteQuiz(activeQuiz.id);
    setShowDeleteModal(false);
    trackEvent('quiz_reset_delete', `Soft deleted quiz instance: ${activeQuiz.title}`);
    setActiveTab('create');
  };

  // Full erase GDPR action
  const handleGdprAbsoluteErase = () => {
    localStorage.clear();
    setShowGdprModal(false);
    alert("🚨 GDRP ERASE TRIGGERED!\nAll personal profile data, cookie caching, and stored test attempts have been completely purged from browser local storage.");
    window.location.reload();
  };

  return (
    <div className="space-y-8 animate-fade-in py-2">
      
      {/* Toast Notification For Polling Simulator */}
      {recentNotification && (
        <div className="fixed top-6 right-6 z-50 max-w-sm p-4 rounded-xl border-4 border-black bg-yellow-400 text-black font-black uppercase text-xs flex items-center gap-3 shadow-[5px_5px_0px_0px_#000] animate-bounce">
          <Sparkles className="w-5 h-5 text-black animate-pulse animate-spin" />
          <span>{recentNotification}</span>
        </div>
      )}

      {/* Main Hero Header Board */}
      <div className="p-6 sm:p-8 rounded-2xl border-4 border-black bg-[#161e2e] shadow-[6px_6px_0px_0px_#000000] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
          <span className="text-[10px] font-mono font-bold uppercase text-yellow-400 bg-black/40 px-2.5 py-1 border border-yellow-400/20 rounded">
            URL Matcher Slug: {activeQuiz.id}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-yellow-400 border-2 border-black text-black text-[10px] font-mono font-black uppercase shadow-[1.5px_1.5px_0px_0px_#000]">
              🎯 PAGE TYPE: PERSONAL SCOREBOARD
            </div>
            <h1 className="text-3xl sm:text-4.5xl font-black text-white mt-1 uppercase tracking-tight">
              {currentUser.username}'s Scoreboard
            </h1>
            <p className="text-xs text-slate-300 italic font-semibold max-w-xl">
              Currently Monitoring: "{activeQuiz.title}" | Creator Code: @{activeQuiz.createdBy || 'Unknown'}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-center">
            {/* User Created Quiz Selector */}
            {quizzes.length > 1 && (
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-mono font-black text-slate-400 uppercase mb-1">Switch Quiz Display</span>
                <select 
                  value={selectedQuizId}
                  onChange={(e) => {
                    setSelectedQuizId(e.target.value);
                    setPlaysModifier(0);
                    trackEvent('switch_quiz_view', `Focused scoreboard on quiz index ID: ${e.target.value}`);
                  }}
                  className="px-3 py-1.5 rounded-lg border-2 border-black bg-[#1f2a3d] text-white text-xs font-black uppercase tracking-wide cursor-pointer focus:outline-none"
                >
                  {quizzes.map(q => (
                    <option key={q.id} value={q.id} className="text-black bg-white">{q.title}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid of Major Scorecard KPIs Area */}
      <div className="grid md:grid-cols-4 gap-6">
        
        {/* Plays KPI */}
        <div className="p-5 rounded-2xl border-4 border-black bg-[#1f2a3d] shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[9.5px] font-mono font-black text-pink-400 uppercase block">Plays Received</span>
              <span className="text-3.5xl font-black text-white tracking-tight leading-none mt-1">
                {playsCount}
              </span>
            </div>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border-2 border-black ${pollingActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} title={pollingActive ? "Polling actively simulating" : "Simulation stopped"}>
              <RefreshCw className={`w-4 h-4 text-black ${pollingActive ? 'animate-spin' : ''}`} />
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-black/30 flex items-center justify-between">
            <span className="text-[9.5px] text-slate-400 font-semibold italic">
              {playsCount === 0 ? "Nobody has yet played your quiz" : `${playsCount} friends took action!`}
            </span>
            <button 
              onClick={() => {
                setPollingActive(!pollingActive);
                trackEvent('polling_toggle', `Automated proctor state switched to ${!pollingActive}`);
              }}
              className="text-[9px] font-mono font-black uppercase text-yellow-400 underline decoration-wavy hover:text-white"
            >
              {pollingActive ? 'Mute Live' : 'Go Live'}
            </button>
          </div>
        </div>

        {/* Average Score KPI */}
        <div className="p-5 rounded-2xl border-4 border-black bg-[#1f2a3d] shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between">
          <div>
            <span className="text-[9.5px] font-mono font-black text-cyan-400 uppercase block">Avg Score Match</span>
            <span className="text-3.5xl font-black text-white tracking-tight leading-none mt-1">{averageScore}%</span>
          </div>
          <div className="mt-4 pt-3 border-t border-black/30 text-left">
            <span className="text-[9.5px] font-mono font-black text-slate-400 uppercase block">Synergy Tier</span>
            <span className="text-[11px] font-black text-yellow-400 uppercase">
              {averageScore >= 80 ? '👑 Elite Vibes' : averageScore >= 50 ? '🌟 Lowkey Tight' : '💀 Awkward Cap'}
            </span>
          </div>
        </div>

        {/* Completion Rate KPI with Dynamic SVG Progress Path Ring */}
        <div className="p-5 rounded-2xl border-4 border-black bg-[#1f2a3d] shadow-[4px_4px_0px_0px_#000] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[9.5px] font-mono font-black text-emerald-400 uppercase block">Completion Rate</span>
            <span className="text-3.5xl font-black text-white tracking-tight leading-none">{completionRate}%</span>
            <span className="text-[9px] font-mono text-slate-400 block pt-1.5 uppercase font-bold">Absolute Survivals</span>
          </div>
          
          {/* Progress Ring */}
          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="24" className="stroke-slate-800" strokeWidth="6" fill="transparent"/>
              <circle cx="32" cy="32" r="24" className="stroke-emerald-400" strokeWidth="6" fill="transparent"
                strokeDasharray={`${2 * Math.PI * 24}`}
                strokeDashoffset={`${2 * Math.PI * 24 * (1 - completionRate / 100)}`}
              />
            </svg>
            <span className="absolute text-[9px] font-extrabold text-white">✓</span>
          </div>
        </div>

        {/* Sparkline Daily Activity plays Chart */}
        <div className="p-5 rounded-2xl border-4 border-black bg-[#1f2a3d] shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[9.5px] font-mono font-black text-yellow-500 uppercase block">Daily Play Index</span>
              <span className="text-xl font-bold text-white tracking-tight">Active Sparkline</span>
            </div>
            <span className="text-[8px] font-mono text-slate-400 font-extrabold uppercase">Last 7D</span>
          </div>

          <div className="h-10 mt-2 flex items-end">
            <svg className="w-full h-full" viewBox="0 0 90 60" preserveAspectRatio="none">
              <rect x="0" y="0" width="90" height="60" className="fill-slate-900/40 rounded" />
              <polyline
                fill="none"
                stroke="#ec4899"
                strokeWidth="3.5"
                points={sparkPoints}
              />
            </svg>
          </div>

          <div className="flex justify-between text-[7px] font-mono text-slate-500 font-bold uppercase mt-1">
            <span>D1</span>
            <span>D3</span>
            <span>D5</span>
            <span className="text-pink-500 font-black">Today ({playsCount})</span>
          </div>
        </div>
      </div>

      {/* Sharing options Section */}
      <div className="grid md:grid-cols-12 gap-8">
        
        {/* Share card & Social Buttons - col-span-7 */}
        <div className="p-6 rounded-2xl border-4 border-black bg-[#161e2e] shadow-[6px_6px_0px_0px_#000] md:col-span-12 lg:col-span-7 relative">
          <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            <Share2 className="w-5 h-5 text-pink-500" /> Share Quiz & Unlock Clout
          </h2>

          <p className="text-xs text-slate-300 mt-2.5 max-w-xl">
            Blast this challenge link across exactly 13 digital pathways or download a high-contrast QR sticker below to let your squad check their scores instantly.
          </p>

          <div className="my-5 p-3.5 bg-slate-900 border-2 border-black rounded-xl flex flex-col sm:flex-row items-center gap-3 shadow-[2px_2px_0px_0px_#000]">
            <span className="px-2 py-0.5 text-[8.5px] font-mono font-black text-black bg-pink-500 rounded uppercase">
              {useShortLink ? 'Short URL' : 'Standard'}
            </span>
            <span className="text-[11px] font-mono font-black text-slate-100 flex-1 truncate select-all">
              {currentShareLink}
            </span>
            <div className="flex gap-2 shrink-0">
              <button 
                onClick={() => setUseShortLink(!useShortLink)}
                className="px-2.5 py-1 text-[9px] font-mono font-black uppercase tracking-wide border-2 border-black bg-slate-800 text-slate-300 rounded hover:text-white"
                title="Toggle Short/Standard URI"
              >
                Toggle URI Type
              </button>
              <button
                onClick={() => copyToClipboard(currentShareLink, 'primary')}
                className="p-2 border-2 border-black bg-yellow-400 hover:bg-yellow-300 text-black rounded-lg transition-transform hover:scale-105"
                title="Copy Quiz URL Link"
              >
                {copiedText === 'primary' ? <Check className="w-4 h-4 text-emerald-800" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 13 Platform Action buttons */}
          <div>
            <span className="text-[9.5px] font-mono font-black text-slate-400 uppercase tracking-widest block mb-2.5">
              🚀 select from 13 dispatch paths
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 gap-2.5">
              {[
                { id: 'whatsapp_status', name: 'WA Status', color: 'bg-[#25D366] text-black' },
                { id: 'whatsapp_message', name: 'Send Chat', color: 'bg-[#25D366]/80 text-black' },
                { id: 'facebook', name: 'Facebook', color: 'bg-[#1877F2] text-white' },
                { id: 'twitter', name: 'X/Twitter', color: 'bg-black text-white' },
                { id: 'instagram', name: 'Instagram', color: 'bg-gradient-to-tr from-yellow-500 to-pink-500 text-white' },
                { id: 'snapchat', name: 'Snapchat', color: 'bg-[#FFFC00] text-black' },
                { id: 'messenger', name: 'Messenger', color: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' },
                { id: 'tiktok', name: 'TikTok', color: 'bg-black text-white' },
                { id: 'telegram', name: 'Telegram', color: 'bg-[#0088cc] text-white' },
                { id: 'line', name: 'LINE', color: 'bg-[#06C755] text-white' },
                { id: 'threads', name: 'Threads', color: 'bg-black text-white' },
                { id: 'email', name: 'Email Inbox', color: 'bg-slate-700 text-white' },
                { id: 'sms', name: 'SMS Cellular', color: 'bg-emerald-600 text-white' }
              ].map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => triggerShare(platform.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wide border-2 border-black cursor-pointer shadow-[2.5px_2.5px_0px_0px_#000] hover:-translate-y-0.5 active:translate-y-0 transition-transform ${platform.color}`}
                >
                  {platform.name}
                </button>
              ))}
            </div>
          </div>

          {/* Live Action Tracker Board */}
          <div className="mt-6 p-4 rounded-xl border-2 border-black bg-slate-900 border-dashed">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9.5px] font-mono font-black text-cyan-400 uppercase tracking-widest flex items-center gap-1">
                <Settings className="w-3.5 h-3.5 animate-spin" /> Live Sharing Telemetry Logs
              </span>
              <span className="text-[8px] font-mono text-slate-500 font-bold uppercase">Real Time telemetry</span>
            </div>
            
            <div className="space-y-1.5 text-[10px] font-mono text-slate-300">
              {analyticsLogs.map(log => (
                <div key={log.id} className="flex items-center justify-between p-1 rounded bg-black/40 border border-slate-800">
                  <span className="text-emerald-400 font-black shrink-0">[{log.timestamp}]</span>
                  <span className="text-yellow-400 font-black uppercase text-[9px] mx-2 truncate">{log.eventName}</span>
                  <span className="text-slate-400 flex-1 text-right truncate italic">{log.details}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* QR Code stickers & Global Rank Tracker - col-span-5 */}
        <div className="space-y-6 md:col-span-12 lg:col-span-5 flex flex-col">
          
          {/* QR Generator Card */}
          <div className="p-5 rounded-2xl border-4 border-black bg-[#1f2a3d] shadow-[5px_5px_0px_0px_#000] text-center flex flex-col justify-between flex-1 relative">
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center justify-center gap-2">
                <QrCode className="w-5 h-5 text-yellow-400" /> EXCLUSIVE QUIZ QR INDEX
              </h3>
              <p className="text-[10px] text-slate-400 mt-1 max-w-sm mx-auto">
                Scan below with any camera device to launch this Friendship Quiz instantly. Ready to share on Instagram stories or print!
              </p>
            </div>

            <div className="my-5 p-4 bg-white border-4 border-black rounded-xl max-w-[170px] mx-auto shadow-[4px_4px_0px_0px_#000] hover:scale-105 transition-transform">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(currentShareLink)}`} 
                alt="Quiz QR Index Code" 
                className="w-full h-auto object-contain block"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowQrModal(true)}
                className="px-4 py-2 text-xs font-black uppercase rounded bg-yellow-400 border-2 border-black flex-1 shadow-[2px_2px_0px_0px_#000] active:translate-y-0.5 hover:bg-yellow-350 cursor-pointer"
              >
                Expand Sticker
              </button>
              <a
                href={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(currentShareLink)}`}
                target="_blank"
                rel="noreferrer"
                download="quiz_qrcode.png"
                className="p-2 bg-slate-800 text-cyan-400 border-2 border-black rounded-lg hover:text-white flex items-center justify-center. shadow-[2px_2px_0px_0px_#000] transition-transform"
                title="Download QR Image Source URL"
                onClick={() => trackEvent('download_qr', 'Downloaded high-res friendship QR code template.')}
              >
                <Download className="w-4 h-4 mx-auto" />
              </a>
            </div>
          </div>

          {/* Global Rank Tracking Badge Card */}
          <div className="p-5 rounded-2xl border-4 border-black bg-gradient-to-br from-indigo-950 to-slate-900 shadow-[5px_5px_0px_0px_#000] flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[9.5px] font-mono font-black text-indigo-400 uppercase tracking-wider block">CLOUT RANK TRACKER</span>
                <span className="text-3xl font-black text-white mt-1 uppercase tracking-tight">Rank #{myMockGlobalRank}</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-indigo-500 border-2 border-black flex items-center justify-center text-black font-extrabold text-[13px] shadow-[2.5px_2.5px_0px_0px_#000] shrink-0 animate-bounce">
                👑
              </div>
            </div>

            <p className="text-[10px] text-slate-350 italic mt-3 font-semibold leading-relaxed">
              "Only {playsLeftForTop100} more plays required to push you past the ultimate Top 100 benchmark barrier of the Global Creator board."
            </p>

            <div className="mt-4 pt-3.5 border-t border-indigo-950 flex items-center justify-between">
              <span className="text-[9px] font-mono font-bold text-slate-400">Streak multipliers active</span>
              <button 
                onClick={() => {
                  confetti({ particleCount: 70, spread: 55 });
                  trackEvent('boost_clout', 'Clout energy calibration boosted via simulated click.');
                }}
                className="text-[9.5px] font-mono font-black uppercase text-yellow-400 underline hover:text-pink-400"
              >
                Calibrate Rank Boost ⚡
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Conditionally Loaded Reshare Prompt Banner */}
      {(playsCount < 20 || myMockGlobalRank > 10) && (
        <div className="p-5 rounded-2xl border-4 border-black bg-[#ec4899]/20 text-white flex flex-col sm:flex-row items-center justify-between gap-5 shadow-[4px_4px_0px_0px_#000] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-15">
            <Share2 className="w-24 h-24 text-pink-500" />
          </div>
          
          <div className="space-y-1 relative">
            <span className="px-2 py-0.5 text-[8.5px] font-mono font-black text-black bg-pink-500 rounded uppercase shadow-[1px_1px_0px_0px_#000] inline-block animate-pulse">
              HOT ACTION PROMPT 🥵
            </span>
            <h3 className="text-base font-black text-white uppercase tracking-tight">
              Share again to climb the rankings! 🔥
            </h3>
            <p className="text-[10px] text-slate-350 max-w-lg font-medium">
              You haven't hit 20 friend sessions or top 10 rankings yet. Blast a quick broadcast to WhatsApp or copy the link directly below to jumpstart your daily streak now. No cap.
            </p>
          </div>

          <div className="flex gap-2 relative">
            <button
              onClick={() => triggerShare('whatsapp_status')}
              className="px-4 py-2.5 rounded bg-[#25D366] text-black font-black uppercase text-[10px] border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:scale-105 active:translate-y-0.5 cursor-pointer transition-transform"
            >
              Broadcast status 📲
            </button>
            <button
              onClick={() => copyToClipboard(currentShareLink, 'prompt')}
              className="px-4 py-2.5 rounded bg-yellow-400 text-black font-black uppercase text-[10px] border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:scale-105 active:translate-y-0.5 cursor-pointer transition-transform"
            >
              {copiedText === 'prompt' ? 'LINKED ✓' : 'Instant Grab URL'}
            </button>
          </div>
        </div>
      )}

      {/* Multi-source Public Leaderboard Preview + Regional Discovery Cards */}
      <div className="space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-400 animate-pulse" /> Proctor Leaderboard (Live)
            </h2>
            <p className="text-xs text-slate-400 font-semibold leading-relaxed">
              Real-time verified friendship entries for "{activeQuiz.title}". Tap geography cards to discover.
            </p>
          </div>

          {/* All Time, Weekly, Today filter triggers */}
          <div className="flex bg-[#1f2a3d] border-2 border-black p-1 rounded-xl shadow-[2px_2px_0px_0px_#000] gap-1 font-mono text-[9px] font-black">
            {[
              { id: 'all', label: 'ALL TIME' },
              { id: 'weekly', label: 'THIS WEEK' },
              { id: 'today', label: 'TODAY' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => {
                  setLeaderboardFilter(f.id as any);
                  trackEvent('filter_leaderboard_time', `Timeframe switched to: ${f.id}`);
                }}
                className={`px-3 py-1.5 rounded-lg border uppercase transition-all cursor-pointer ${
                  leaderboardFilter === f.id
                    ? 'bg-yellow-400 text-black border-black font-bold shadow-[1px_1px_0px_0px_#000]'
                    : 'text-slate-400 border-transparent hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Regional Leaderboard Discovery Cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { id: 'global', name: 'Global Top 100', desc: 'Squad connections from the entire planet', flag: '🌍', color: 'from-[#1e1b4b] to-[#311042]' },
            { id: 'asia', name: 'Asia Top 100', desc: 'Highest precision records in Asia timezone', flag: '⛩️', color: 'from-[#064e3b] to-[#1e1b4b]' },
            { id: 'india', name: 'India Top 100', desc: 'Direct Indian synergy & classroom matchers', flag: '🇮🇳', color: 'from-[#7c2d12] to-[#1e1b4b]' }
          ].map((region) => (
            <div
              key={region.id}
              onClick={() => {
                setGeoFilter(region.id as any);
                trackEvent('switch_geo_region', `Discovered scores flagged for region: ${region.id}`);
              }}
              className={`p-4 rounded-xl border-4 border-black transition-all cursor-pointer hover:scale-[1.02] shadow-[3px_3px_0px_0px_#000] relative overflow-hidden flex flex-col justify-between ${
                geoFilter === region.id
                  ? 'bg-slate-900 border-yellow-400 ring-2 ring-black'
                  : 'bg-gradient-to-r ' + region.color
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xl">{region.flag}</span>
                {geoFilter === region.id && (
                  <span className="px-2 py-0.5 text-[7px] font-mono font-black text-black bg-yellow-400 border border-black rounded uppercase shadow-[1px_1px_0px_0px_#000]">
                    DIsPLAY LOCKED
                  </span>
                )}
              </div>
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-wider">{region.name}</h4>
                <p className="text-[10px] text-slate-450 font-bold leading-tight mt-1">{region.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Leaderboard Table Grid */}
        <div className="p-3 sm:p-5 rounded-2xl border-4 border-black bg-[#161e2e] shadow-[6px_6px_0px_0px_#000] overflow-hidden">
          
          <div className="flex justify-between items-center pb-3 border-b-2 border-black font-mono text-[9.5px] font-black text-slate-400 uppercase tracking-widest px-2">
            <span className="w-16 shrink-0">Rank #</span>
            <span className="flex-1 text-left pl-3">SQUAD USERNAME</span>
            <span className="w-24 text-right">SCORE MATCH</span>
            <span className="w-24 text-right hidden sm:block">DEVICE STATE</span>
          </div>

          <div className="divide-y-2 divide-black">
            {rankedAttempts.slice(0, loadLimit).map((attempt, index) => {
              const scorePercentage = Math.round((attempt.score / (attempt.totalPoints || 1)) * 100);
              const isTamanash = attempt.username.toLowerCase() === 'tamanashdev' || attempt.username.toLowerCase() === 'tamanash';
              return (
                <div 
                  key={attempt.id}
                  className={`flex justify-between items-center py-3.5 px-2 transition-all font-mono text-xs ${
                    isTamanash 
                      ? 'bg-yellow-400/10 border-l-4 border-l-yellow-400 pl-1.5 font-bold' 
                      : 'hover:bg-slate-800/40 text-slate-200'
                  }`}
                >
                  <span className="w-16 shrink-0 font-extrabold flex items-center gap-1">
                    {index === 0 && '🥇'}
                    {index === 1 && '🥈'}
                    {index === 2 && '🥉'}
                    {index > 2 && `#${index + 1}`}
                  </span>
                  
                  <span className="flex-1 text-left pl-3 truncate flex items-center gap-2">
                    <span className="text-slate-100 font-black">@{attempt.username}</span>
                    {index === 0 && <span className="text-[9px] px-1 bg-yellow-400 text-black border border-black font-semibold rounded shrink-0 uppercase tracking-tight scale-90">GOAT</span>}
                  </span>

                  <span className="w-24 text-right pr-2">
                    <span className="font-extrabold text-[#22c55e]">{attempt.score}/{attempt.totalPoints}</span>
                    <span className="block text-[8.5px] text-slate-450">({scorePercentage}%)</span>
                  </span>

                  <span className="w-24 justify-end hidden sm:flex items-center gap-1.5 text-[10px] text-slate-400">
                    {attempt.deviceType === 'desktop' ? <Laptop className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
                    <span>{attempt.deviceType || 'mobile'}</span>
                  </span>
                </div>
              );
            })}
          </div>

          {/* Infinite Scroll / Load more option */}
          {rankedAttempts.length > loadLimit && (
            <div className="text-center pt-4 border-t-2 border-black/30">
              <button
                onClick={() => {
                  setLoadLimit(prev => prev + 5);
                  trackEvent('inf_scroll_load', `Loaded subsequent leaderboard scores database records.`);
                }}
                className="px-4 py-1.5 rounded-lg border-2 border-black bg-[#1f2a3d] text-white text-[10px] font-mono font-black uppercase tracking-wide hover:bg-slate-800 transition-colors shadow-[2px_2px_0px_0px_#000]"
              >
                Load More Entries ⏳
              </button>
            </div>
          )}

          {/* Empty Leaderboard state fallback */}
          {rankedAttempts.length === 0 && (
            <div className="py-12 text-center text-slate-400">
              <Info className="w-10 h-10 mx-auto text-slate-505 mb-2.5" />
              <p className="text-sm font-semibold">Nobody has logged attempts under this time-geo coordinate yet.</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Slay first share above to populate!</p>
            </div>
          )}
        </div>
      </div>

      {/* Special Quick Actions (Delete quiz, policy modals) */}
      <div className="p-5 rounded-2xl border-4 border-black bg-rose-600/10 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-[4px_4px_0px_0px_#000]">
        <div className="space-y-1">
          <span className="px-2 py-0.5 text-[8.5px] font-mono font-black text-white bg-rose-600 rounded uppercase">
            SOCIETY SETTINGS & GDPR COMPLIANCE
          </span>
          <h3 className="text-lg font-black text-white uppercase tracking-tight">Need a fresh start?</h3>
          <p className="text-[10px] text-slate-300 max-w-lg leading-relaxed font-semibold">
            Permanently terminate this active friendship quiz from the server system registry, delete all friend scores history, or trigger GDPR data removal tools.
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 bg-rose-600 font-black text-white text-xs border-2 border-black rounded shadow-[2.5px_2.5px_0px_0px_#000] active:translate-y-0.5 hover:bg-rose-500 cursor-pointer uppercase flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" /> Reset Quiz
          </button>
          <button
            onClick={() => setShowGdprModal(true)}
            className="px-3.5 py-1.5 bg-slate-800 text-slate-350 hover:text-white font-mono text-[9px] border-2 border-black rounded shadow-[1.5px_1.5px_0px_0px_#000]"
          >
            GDPR Purge
          </button>
        </div>
      </div>

      {/* Premium monetization banner */}
      {showAds && (
        <div className="p-4 rounded-xl border-4 border-black bg-gradient-to-r from-teal-950 to-indigo-950 shadow-[3px_3px_0px_0px_#000] text-center relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="absolute top-1 left-2 text-[6.5px] font-bold text-teal-400 font-mono tracking-wider uppercase">EXCLUSIVE SPONSOR LINK</span>
          <div className="flex items-center gap-2.5 pt-1">
            <span className="text-2xl shrink-0">🥤</span>
            <div className="text-left">
              <h5 className="text-[11px] font-black text-white uppercase">Sponsor: Brainrot energy drinks</h5>
              <p className="text-[9px] text-slate-400">100% taurine juice. +20,000 aura instantly. Focus modes guaranteed, no cap.</p>
            </div>
          </div>
          <button 
            onClick={() => setShowAds(false)}
            className="text-[8px] font-mono text-slate-400 bg-black/40 hover:text-white px-2 py-1 rounded"
          >
            Close Sponsor Ads (Hide)
          </button>
        </div>
      )}

      {/* QR MODAL EXPAND */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="p-6 rounded-2xl border-4 border-black bg-[#161e2e] shadow-[8px_8px_0px_0px_#000] text-center max-w-sm w-full space-y-4">
            <h4 className="text-base font-black text-white uppercase tracking-tight flex items-center justify-center gap-2">
              <QrCode className="w-5 h-5 text-yellow-500 animate-spin" /> High Stakes Dynamic QR
            </h4>
            
            <div className="bg-white p-5 border-4 border-black rounded-2xl max-w-[200px] mx-auto shadow-[4px_4px_0px_0px_#000]">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(currentShareLink)}`} 
                alt="High-Res QR Code Sticker" 
                className="w-full h-auto object-contain"
              />
            </div>

            <p className="text-[10px] text-slate-400 leading-relaxed max-w-xs mx-auto">
              Ready to display! Copy or fetch image directly to save on disk.
            </p>

            <button
              onClick={() => setShowQrModal(false)}
              className="px-4 py-1.5 rounded border-2 border-black bg-pink-500 text-white font-black text-xs uppercase"
            >
              Close sticker
            </button>
          </div>
        </div>
      )}

      {/* DELETE ACTIVE QUIZ MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="p-6 rounded-2xl border-4 border-black bg-[#161e2e] shadow-[8px_8px_0px_0px_#000] text-center max-w-sm w-full space-y-4">
            <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto animate-pulse" />
            <h4 className="text-lg font-black text-white uppercase tracking-tight">Erase Active Quiz?</h4>
            <p className="text-xs text-slate-300 leading-relaxed font-semibold">
              This will permanently delete "{activeQuiz.title}" and wipe all friend score attempts history. This action is recursive and absolutely irreversible! Continuance recommended for GDPR and resets only.
            </p>

            <div className="flex gap-2">
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 text-white border-2 border-black rounded font-black uppercase text-xs flex-1 shadow-[2px_2px_0px_0px_#000]"
              >
                Continue Reset
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-350 border-2 border-black rounded font-black uppercase text-xs flex-1 shadow-[2px_2px_0px_0px_#000]"
              >
                Keep Active
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GDPR ERASURE MODAL */}
      {showGdprModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="p-6 rounded-2xl border-4 border-black bg-[#161e2e] shadow-[8px_8px_0px_0px_#000] text-center max-w-sm w-full space-y-4">
            <Shield className="w-12 h-12 text-indigo-400 mx-auto animate-bounce" />
            <h4 className="text-lg font-black text-white uppercase tracking-tight">GDPR Absolute Data Erase</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              In correlation with standard European Union GDPR directives, taking this action deletes cookies, clears cache storage, clears profile identity indexes, resets streak records, and absolute logs.
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleGdprAbsoluteErase}
                className="px-4 py-2 bg-indigo-500 text-black border-2 border-black rounded font-black uppercase text-xs flex-1 shadow-[2px_2px_0px_0px_#000]"
              >
                Purge All Data
              </button>
              <button
                onClick={() => setShowGdprModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-350 border-2 border-black rounded font-black uppercase text-xs flex-1 shadow-[2px_2px_0px_0px_#000]"
              >
                Nevermind
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
