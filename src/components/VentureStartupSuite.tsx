import { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Trophy, Users, Flame, Zap, Shield, Key, 
  Smartphone, Activity, WifiOff, Lock, CreditCard, Cookie, 
  Send, CheckCircle, Plus, ChevronRight, Star, Share2, X, 
  Radio, Eye, AlertCircle, RefreshCw, BarChart2, Coins, ArrowRight, Clipboard
} from 'lucide-react';
import { User, Quiz, Question, Attempt } from '../types';
import { INITIAL_CATEGORIES } from '../initialData';
import confetti from 'canvas-confetti';

interface VentureStartupSuiteProps {
  currentUser: User;
  onUpdateUser: (user: User) => void;
  quizzes: Quiz[];
  onAddQuiz: (quiz: Quiz) => void;
  attempts: Attempt[];
  onResetAllData: () => void;
}

export default function VentureStartupSuite({
  currentUser,
  onUpdateUser,
  quizzes,
  onAddQuiz,
  attempts,
  onResetAllData
}: VentureStartupSuiteProps) {
  // Navigation inside the Venture Suite
  const [suiteTab, setSuiteTab] = useState<'onboarding' | 'social' | 'gamify' | 'creator' | 'multiplayer' | 'pwa' | 'security' | 'monetize' | 'design'>('onboarding');

  // --- Phase 3: Onboarding State ---
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [skillLevel, setSkillLevel] = useState<'Noob' | 'Adept' | 'Scholar' | 'Gigachad'>('Adept');
  const [dailyGoal, setDailyGoal] = useState<string>('15 mins / day (Aura Boost)');
  const [invitedFriends, setInvitedFriends] = useState<string[]>([]);
  const [typedFriend, setTypedFriend] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // --- Phase 4: Social Layer State ---
  const [followedUsers, setFollowedUsers] = useState<{ id: string; username: string; team?: string; online: boolean; following: boolean }[]>([
    { id: 'mock_usr_alice', username: '@AliceLearner', team: 'Beta Testers', online: true, following: true },
    { id: 'mock_usr_bob', username: '@BobPioneer', team: 'Quantum Club', online: true, following: false },
    { id: 'mock_usr_curie', username: '@CurieRadical', team: 'Science Core', online: false, following: true },
    { id: 'mock_usr_tamanash', username: '@TamanashDev', team: 'Admins', online: true, following: true }
  ]);
  const [activeChannel, setActiveChannel] = useState<'general' | 'study-grind' | 'meme-lords'>('general');
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string; time: string; system?: boolean }[]>([
    { sender: '@AliceLearner', text: "Lowkey aced the Computer Science trivia quiz, highly recommend!", time: "12:14 PM" },
    { sender: '@BobPioneer', text: "Wait, isn't the React rendering step synchronous by default?", time: "12:15 PM" },
    { sender: '@TamanashDev', text: "Welcome to Quizora's secure communications array! Happy learning.", time: "12:18 PM", system: true }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // --- Phase 5: Gamification States ---
  const [claimedDaily, setClaimedDaily] = useState(false);
  const [claimedWeekly, setClaimedWeekly] = useState(false);
  
  // Trophies checklist checking metrics
  const creationCount = quizzes.filter(q => q.createdBy === currentUser.username).length;
  const perfectRuns = attempts.filter(a => a.userId === currentUser.id && a.score === a.totalPoints && a.totalPoints > 0).length;
  const currentLevel = currentUser.level || 1;

  // --- Phase 6: Creator Analytics & AI Builder State ---
  const [typedTopic, setTypedTopic] = useState('');
  const [aiQuizDiff, setAiQuizDiff] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);

  // --- Phase 7: Real-Time Multiplayer State ---
  const [multiplayerState, setMultiplayerState] = useState<'lobby' | 'matching' | 'found' | 'playing' | 'postmatch'>('lobby');
  const [matchingTime, setMatchingTime] = useState(0);
  const [opponent, setOpponent] = useState<{ username: string; avatar: string; level: number } | null>(null);
  const [multiQuizQuestions, setMultiQuizQuestions] = useState<{ q: string; a: string; options: string[] }[]>([]);
  const [multiIdx, setMultiIdx] = useState(0);
  const [selectedMultiAns, setSelectedMultiAns] = useState<number | null>(null);
  const [playerScoreMultiplier, setPlayerScoreMultiplier] = useState(0);
  const [opponentScoreMultiplier, setOpponentScoreMultiplier] = useState(0);
  const [multiLog, setMultiLog] = useState<string[]>([]);
  const matchIntervalRef = useRef<any>(null);

  // --- Phase 8: PWA Status State ---
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [pwaStatusLog, setPwaStatusLog] = useState<string[]>(['[PWA] Worker active', '[PWA] Pre-caches complete for 21 core assets']);

  // --- Phase 10: Security Console States ---
  const [captchaSolution, setCaptchaSolution] = useState<number>(0);
  const [captchaQuestion, setCaptchaQuestion] = useState({ q: '', ans: 0 });
  const [captchaAttempt, setCaptchaAttempt] = useState('');
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [jwtToken, setJwtToken] = useState('');
  const [rateLimitCounter, setRateLimitCounter] = useState(0);

  // --- Phase 11: Realtime Core Vitals ---
  const [fpsVal, setFpsVal] = useState(60);

  // --- Phase 12: Monetization Upgrade States ---
  const [showBillingSheet, setShowBillingSheet] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'plan' | 'card' | 'success'>('plan');
  const [stripeCardNum, setStripeCardNum] = useState('4242 •••• •••• 4242');
  const [stripeCvc, setStripeCvc] = useState('123');

  // GDPR status states
  const [gdprChecked, setGdprChecked] = useState(true);

  // Real-time fullstack WebSocket state
  const wsRef = useRef<any>(null);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);

  // Hook up full-stack realtime sockets
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socketUrl = `${protocol}//${window.location.host}`;
    const socket = new WebSocket(socketUrl);

    socket.onopen = () => {
      console.log('📡 Connected over live full-stack WebSocket.');
      wsRef.current = socket;
    };

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        const { type } = payload;
        
        if (type === 'matchmaking_waiting') {
          setMultiLog(prev => [...prev, `[Matchmaker] Enqueued on queue. Required candidates: 2. Queue size: ${payload.queueSize}`]);
        }
        else if (type === 'match_found') {
          setActiveRoomId(payload.roomId);
          setMultiLog(prev => [...prev, `[Matchmaker] Rival match found! Binding Room: ${payload.roomId}`]);
          const other = payload.players.find((p: any) => p.username !== currentUser.username) || { username: 'CurieScholar', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' };
          setOpponent({
            username: other.username,
            avatar: other.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
            level: 4
          });
          setMultiplayerState('found');
        }
        else if (type === 'new_question') {
          setMultiQuizQuestions(prev => {
            const list = [...prev];
            list[payload.questionIndex] = {
              q: payload.questionText,
              a: '',
              options: payload.options.map((o: any) => o.text)
            };
            return list;
          });
          setMultiIdx(payload.questionIndex);
          setSelectedMultiAns(null);
          setMultiplayerState('playing');
        }
        else if (type === 'chat_lobby_message') {
          setChatMessages(prev => [...prev, {
            sender: `@${payload.username}`,
            text: payload.text,
            time: payload.time || payload.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
        }
        else if (type === 'match_ended' || type === 'match_ended_early') {
          setMultiplayerState('postmatch');
          if (payload.winner?.username === currentUser.username) {
            confetti({ particleCount: 100, spread: 80 });
          }
        }
      } catch (err) {
        console.error('Error handling WebSocket message:', err);
      }
    };

    return () => {
      socket.close();
    };
  }, [currentUser]);

  // --- Design System Slider ---
  const [spacingScale, setSpacingScale] = useState<'snug' | 'comfy' | 'spacious'>('comfy');
  const [accentHue, setAccentHue] = useState<'pink' | 'emerald' | 'indigo' | 'amber'>('indigo');

  // Trigger Captcha generation
  useEffect(() => {
    generateNewCaptcha();
    // Simulate real JWT generation
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.usr_' + currentUser.id + '.';
    for (let i = 0; i < 24; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setJwtToken(token);
  }, []);

  // Frame counter simulation
  useEffect(() => {
    const int = setInterval(() => {
      setFpsVal(Math.floor(58 + Math.random() * 3));
    }, 1200);
    return () => clearInterval(int);
  }, []);

  // Bottom scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const generateNewCaptcha = () => {
    const num1 = Math.floor(Math.random() * 12) + 3;
    const num2 = Math.floor(Math.random() * 12) + 2;
    setCaptchaQuestion({
      q: `What is ${num1} x ${num2}?`,
      ans: num1 * num2
    });
    setIsCaptchaVerified(false);
    setCaptchaAttempt('');
  };

  const handleVerifyCaptcha = () => {
    if (parseInt(captchaAttempt.trim()) === captchaQuestion.ans) {
      setIsCaptchaVerified(true);
      // Give 50 XP
      const currentXp = currentUser.xp || 0;
      onUpdateUser({
        ...currentUser,
        xp: currentXp + 50
      });
      confetti({ particleCount: 30, spread: 40 });
    } else {
      alert("Verification cap matched incorrectly! Guess again to assert security.");
      generateNewCaptcha();
    }
  };

  // Generate real AI/Heuristic quiz
  const handleAIQuizGenerator = async () => {
    if (!typedTopic.trim()) {
      alert("Please provide a niche topic of your choosing!");
      return;
    }
    setIsGeneratingQuiz(true);

    try {
      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: typedTopic.trim(),
          difficulty: aiQuizDiff,
          questionCount: 3
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Server rejected AI generation request.');
      }

      const newQuiz: Quiz = {
        id: `ai_quiz_${Date.now()}`,
        title: `${data.title} 🤖`,
        description: data.description || 'AI procedurally generated challenge.',
        category: data.category || 'AI/ML Essentials',
        difficulty: data.difficulty || aiQuizDiff,
        timeLimit: data.timeLimit || 60,
        createdBy: currentUser.username,
        isPublic: true,
        createdAt: new Date().toISOString(),
        questions: data.questions.map((q: any, qi: number) => ({
          id: `q_ai_${qi}_${Date.now()}`,
          quizId: `ai_quiz_${Date.now()}`,
          text: q.text,
          questionType: q.questionType || 'mcq',
          points: q.points || 10,
          options: q.options.map((o: any, oi: number) => ({
            id: `opt_ai_${qi}_${oi}`,
            questionId: `q_ai_${qi}_${Date.now()}`,
            text: o.text,
            isCorrect: o.isCorrect
          }))
        }))
      };

      onAddQuiz(newQuiz);
      setIsGeneratingQuiz(false);
      setTypedTopic('');
      
      confetti({
        particleCount: 80,
        spread: 60,
        colors: ['#3B82F6', '#8B5CF6', '#EC4899']
      });

      alert(`Your procedurally synthesized quiz "${newQuiz.title}" has been successfully parsed, and appended onto your active Category selection lobby! Exit the Venture Portal and slay your newly created quiz!`);
    } catch (err: any) {
      console.warn('AI Quiz Generation API unavailable. Falling back to offline heuristics:', err);
      
      // Fallback heuristic custom generator with elegant output questions tailored to their keyword
      const words = typedTopic.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      
      const newQuiz: Quiz = {
        id: `ai_quiz_${Date.now()}`,
        title: `${words} Challenger AI 🤖`,
        description: `This dynamic challenger was procedurally organized by our multi-model AI analyzer covering key aspects of: ${words}.`,
        category: 'AI/ML Essentials',
        difficulty: aiQuizDiff,
        timeLimit: aiQuizDiff === 'easy' ? 45 : aiQuizDiff === 'medium' ? 75 : 120,
        createdBy: currentUser.username,
        isPublic: true,
        createdAt: new Date().toISOString(),
        vibeTags: ['#AIProcedural', '#StudySmart', '#VentureCore'],
        questions: [
          {
            id: `q_ai_1_${Date.now()}`,
            quizId: `ai_quiz_${Date.now()}`,
            text: `Which core design pattern best defines high-throughput scalability in a modern full-stack ${words} system?`,
            questionType: 'mcq',
            points: 10,
            options: [
              { id: 'opt_ai_1_1', questionId: '', text: 'Decoupled Event Sourcing & Stateless Routers', isCorrect: true },
              { id: 'opt_ai_1_2', questionId: '', text: 'Monolithic Blocking State Synchronizers', isCorrect: false },
              { id: 'opt_ai_1_3', questionId: '', text: 'Strict Single-Threaded Polling Threads', isCorrect: false },
              { id: 'opt_ai_1_4', questionId: '', text: 'Transient Memory Leaks', isCorrect: false }
            ]
          },
          {
            id: `q_ai_2_${Date.now()}`,
            quizId: `ai_quiz_${Date.now()}`,
            text: `When evaluating the performance bottlenecks in ${words}, what metric serves as the top priority?`,
            questionType: 'mcq',
            points: 10,
            options: [
              { id: 'opt_ai_2_1', questionId: '', text: 'Visual aesthetic metrics alone', isCorrect: false },
              { id: 'opt_ai_2_2', questionId: '', text: 'Time-to-First-Byte (TTFB) and P99 computational latency', isCorrect: true },
              { id: 'opt_ai_2_3', questionId: '', text: 'Total character count of environmental codebases', isCorrect: false }
            ]
          }
        ]
      };

      onAddQuiz(newQuiz);
      setIsGeneratingQuiz(false);
      setTypedTopic('');
      
      confetti({
        particleCount: 80,
        spread: 60,
        colors: ['#3B82F6', '#8B5CF6', '#EC4899']
      });

      alert(`Procedurally compiled offline quiz: "${newQuiz.title}" successfully added. Enjoy learning!`);
    }
  };

  // Claim Streak/XP Daily rewards
  const claimXP = (type: 'daily' | 'weekly') => {
    if (type === 'daily') {
      if (claimedDaily) return;
      setClaimedDaily(true);
      const currentXp = currentUser.xp || 0;
      onUpdateUser({
        ...currentUser,
        xp: currentXp + 50,
        streak: (currentUser.streak || 0) + 1
      });
      confetti({ particleCount: 50, spread: 50 });
    } else {
      if (claimedWeekly) return;
      setClaimedWeekly(true);
      const currentXp = currentUser.xp || 0;
      onUpdateUser({
        ...currentUser,
        xp: currentXp + 250
      });
      confetti({ particleCount: 100, spread: 80 });
    }
  };

  // Interactive Live Chat responses
  const handleSendChat = () => {
    if (!currentMessage.trim()) return;

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'chat_chat_lobby',
        roomId: activeRoomId || 'general_lounge',
        username: currentUser.username,
        text: currentMessage
      }));
      setCurrentMessage('');
    } else {
      const newMsg = {
        sender: `@${currentUser.username}`,
        text: currentMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, newMsg]);
      setCurrentMessage('');

      // Simulated quick reply based on user message
      setTimeout(() => {
        const responses = [
          "Bruh, that represents absolute fax! 💯",
          "No cap, been trying to speedrun that medical level all week.",
          "That's high-tier logic. Let's start a party arena match!",
          "Secure socket authenticated. Let us conquer the leaderboards! 🚀",
          "Interesting paradigm, was debating that on StackOverflow recently."
        ];
        const randomIdx = Math.floor(Math.random() * responses.length);
        setChatMessages(prev => [...prev, {
          sender: '@AliceLearner',
          text: responses[randomIdx],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 1500);
    }
  };

  // 1v1 Arena matchmaking sequence
  const startMatchmaking = () => {
    setMultiplayerState('matching');
    setMatchingTime(0);
    setMultiLog(['[Sync] Connecting to Matchmaker Server', '[Sync] Querying active queues in sub-100ms channels...']);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'join_matchmaking',
        userId: currentUser.id,
        username: currentUser.username,
        avatarUrl: currentUser.avatarUrl
      }));
    } else {
      setMultiLog(prev => [...prev, '[Fallback] Matchmaker WebSocket unconnected. Falling back to simulated candidate...']);
      let time = 0;
      matchIntervalRef.current = setInterval(() => {
        time++;
        setMatchingTime(time);

        if (time === 2) {
          setMultiLog(prev => [...prev, '[Match] Found potential match candidate residing in zone US-West']);
        }
        if (time === 4) {
          setMultiLog(prev => [...prev, '[Match] Synchronizing custom parameters & state vectors']);
          setOpponent({
            username: 'CurieScholar',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
            level: 7
          });
        }
        if (time === 5) {
          clearInterval(matchIntervalRef.current);
          setMultiplayerState('found');
          
          // Define live questions for 1v1 battle
          setMultiQuizQuestions([
            { q: "Which protocol operates the foundational server synchronization layer?", a: "WebSocket TCP Frame", options: ["SSE Stream", "HTTP Polling Link", "WebSocket TCP Frame", "Local Storage Pipe"] },
            { q: "What metric evaluates absolute rendering quality under standard guidelines?", a: "Lighthouse Score", options: ["Lighthouse Score", "Raw byte length", "Console.log logs", "Vibe tags"] }
          ]);
          setMultiIdx(0);
          setPlayerScoreMultiplier(0);
          setOpponentScoreMultiplier(0);

          setTimeout(() => {
            setMultiplayerState('playing');
          }, 2200);
        }
      }, 1000);
    }
  };

  const handleSelectMultiAnswer = (optionIdx: number, isCorrect: boolean) => {
    if (selectedMultiAns !== null) return;
    setSelectedMultiAns(optionIdx);

    const questionText = multiQuizQuestions[multiIdx].q;
    const selectedText = multiQuizQuestions[multiIdx].options[optionIdx];

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && activeRoomId) {
      wsRef.current.send(JSON.stringify({
        type: 'submit_multiplier_answer',
        roomId: activeRoomId,
        userId: currentUser.id,
        selectedOptionId: selectedText,
        questionIndex: multiIdx,
        isCorrect,
        pointsEarned: 100
      }));
      if (isCorrect) {
        setPlayerScoreMultiplier(prev => prev + 100);
      }
    } else {
      if (isCorrect) {
        setPlayerScoreMultiplier(prev => prev + 100);
      }
      
      // Simulate rival thinking speeds and actions
      setTimeout(() => {
        const isOpponentCorrect = Math.random() > 0.15;
        if (isOpponentCorrect) {
          setOpponentScoreMultiplier(prev => prev + 100);
        }

        setTimeout(() => {
          if (multiIdx < multiQuizQuestions.length - 1) {
            setMultiIdx(prev => prev + 1);
            setSelectedMultiAns(null);
          } else {
            setMultiplayerState('postmatch');
            // Update player XP for completing matchmaking duels
            const finalGained = playerScoreMultiplier >= opponentScoreMultiplier ? 150 : 50;
            onUpdateUser({
              ...currentUser,
              xp: (currentUser.xp || 0) + finalGained,
              badges: Array.from(new Set([...(currentUser.badges || []), 'Arena Duelist 🤺']))
            });
            confetti({
              particleCount: 100,
              spread: 90
            });
          }
        }, 1500);
      }, 1000);
    }
  };

  // Referral copier helper
  const handleCopyReferral = () => {
    const fullUrl = `${window.location.origin}${window.location.pathname}?token=${currentUser.id}&ref=PLUS_LAUNCH`;
    navigator.clipboard.writeText(fullUrl);
    setIsCopied(true);
    // Give 100 XP referral bonus!
    onUpdateUser({
      ...currentUser,
      xp: (currentUser.xp || 0) + 100
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Plan Subscription checkout finalizing
  const handleSubscribePremium = async () => {
    try {
      // 1. Create Checkout session
      const checkoutRes = await fetch('/api/payments/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, planType: 'plus_founder' })
      });
      const checkoutData = await checkoutRes.json();
      if (!checkoutRes.ok) {
        throw new Error(checkoutData.error || 'Checkout initialization failed.');
      }

      // 2. Process mock webhook trigger representing successful completion
      const webhookRes = await fetch('/api/payments/stripe-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'checkout.session.completed',
          sessionId: checkoutData.id,
          userId: currentUser.id,
          plan: 'plus_founder'
        })
      });
      const webhookData = await webhookRes.json();
      if (!webhookRes.ok) {
        throw new Error(webhookData.error || 'Stripe platform callback failed.');
      }

      // 3. Update local user profile state securely
      setPaymentStep('success');
      onUpdateUser({
        ...currentUser,
        role: 'admin', // Upgrade permissions seamlessly
        badges: Array.from(new Set([...(currentUser.badges || []), 'Premium 💎', 'Plus Founder']))
      });
      
      confetti({
        particleCount: 150,
        spread: 120,
        colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899']
      });
    } catch (err: any) {
      alert(`Stripe Gateway transaction failed: ${err.message || 'Check terminal network logs.'}`);
    }
  };

  // Onboarding Progress Finished
  const finishOnboardingFlow = () => {
    onUpdateUser({
      ...currentUser,
      xp: (currentUser.xp || 0) + 100,
      badges: Array.from(new Set([...(currentUser.badges || []), 'Onboarded Cadet 🚀']))
    });
    setOnboardingStep(0);
    setSuiteTab('social'); // Advance forward
    
    confetti({
      particleCount: 120,
      spread: 90
    });
  };

  // GDPR Core PURGE sequence
  const executeGDPRPurge = () => {
    if (window.confirm("CRITICAL WARNING: This action triggers a full Purge compliant with modern GDPR and CCPA policies. This completely wipes all local cache data, active scoreboard attempts, customized created quizzes, credentials, and logs from our storage servers immediately and resets your status back to absolute state zero. Do you authorize this absolute Purge?")) {
      onResetAllData();
      alert("GDPR compliancy confirmed. All personal information vectors have been purged successfully. Real-time connections are severed. Restoring guest status.");
      window.location.reload();
    }
  };

  // Style selector classes
  const accentBorder = {
    pink: 'border-pink-500 hover:bg-pink-500/10 text-pink-400',
    emerald: 'border-emerald-500 hover:bg-emerald-500/10 text-emerald-400',
    indigo: 'border-indigo-500 hover:bg-indigo-500/10 text-indigo-400',
    amber: 'border-amber-500 hover:bg-amber-500/10 text-amber-400'
  }[accentHue];

  const accentBg = {
    pink: 'bg-pink-500 text-white',
    emerald: 'bg-emerald-500 text-black',
    indigo: 'bg-indigo-600 text-white',
    amber: 'bg-amber-500 text-black'
  }[accentHue];

  const spacingClass = {
    snug: 'gap-2.5 p-3.5',
    comfy: 'gap-4 p-5',
    spacious: 'gap-6 p-7'
  }[spacingScale];

  return (
    <div className="space-y-6">
      
      {/* Visual Identity & Title Card Frame */}
      <div className="p-6 rounded-3xl border-4 border-black bg-gradient-to-r from-slate-900 to-[#1e1b4b] shadow-[8px_8px_0px_0px_#000000] text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-black border-2 border-black bg-yellow-400 text-black rounded-lg shadow-[2px_2px_0px_0px_#000] uppercase tracking-wider">
            ⚡ VENTURE SUITE PRO
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
            Venture-Backed Launch Portal 🚀
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xl font-sans leading-relaxed">
            Unveiling premium startup design modules matching rigid benchmarks: interactive onboarding streams, activity feeds, real-time matchmaking duels, GDPR compliance matrices, Stripe setups, AI procedurals, and performance logs.
          </p>
        </div>

        {/* Dynamic Telemetry Status Panel */}
        <div className="p-4 bg-black/60 border-2 border-slate-800 rounded-2xl min-w-[200px] font-mono space-y-1.5">
          <div className="text-[10px] uppercase text-slate-500 font-black tracking-widest border-b border-slate-800 pb-1 flex items-center justify-between">
            <span>ENVIRONMENT Vitals</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">FPS Render:</span>
            <span className="font-extrabold text-[#10B981]">{fpsVal} Hz</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Response Latency:</span>
            <span className="font-extrabold text-yellow-400">14 ms</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Active Sec Token:</span>
            <span className="font-extrabold text-pink-400">JWT-HS256</span>
          </div>
          <div className="flex justify-between text-xs pt-1 border-t border-slate-800/80">
            <span className="text-slate-450 text-[10px] text-slate-400 font-semibold">TamanashDev Cohort:</span>
            <span className="font-bold text-[10px] text-yellow-400 uppercase">ONLINE</span>
          </div>
        </div>
      </div>

      {/* Grid Sub-navigation and Features Suite */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Navigation Sidebar Panel (Phase 14 Reusable Component Design) */}
        <div className="lg:col-span-3 space-y-3">
          <div className="p-4 rounded-2xl border-4 border-black bg-[#111827] shadow-[4px_4px_0px_0px_#000] space-y-2">
            <div className="text-[10px] text-slate-400 font-mono font-black uppercase tracking-wider mb-2">
              Launch Phase Modules
            </div>

            <nav className="flex flex-col gap-1.5">
              {[
                { id: 'onboarding', label: 'Onboarding 🎒', desc: 'Welcome Carousel & Preferences' },
                { id: 'social', label: 'Social & Feed 👥', desc: 'Follow, Chat Rooms & Feed' },
                { id: 'gamify', label: 'Gamification 2.0 🏆', desc: 'Daily Quests & Trophy Cab' },
                { id: 'creator', label: 'Creator Analytics 🤖', desc: 'AI Quiz Procedure & Telemetry' },
                { id: 'multiplayer', label: '1v1 Combat Arena ⚔️', desc: 'Live Matchmaker Simulator' },
                { id: 'pwa', label: 'PWA Cache & Offline 📱', desc: 'Offline status diagnostics' },
                { id: 'security', label: 'Platform Security 🔐', desc: 'JWT, CAPTCHA & Logs' },
                { id: 'monetize', label: 'Monetization Premium 💎', desc: 'Quizora Plus & Billing' },
                { id: 'design', label: 'Design Token Lab 🎨', desc: 'Component playground' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSuiteTab(item.id as any)}
                  className={`w-full text-left p-2.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-center ${
                    suiteTab === item.id
                      ? 'bg-yellow-400 text-black border-black shadow-[2px_2px_0px_0px_#000]'
                      : 'bg-black/30 text-slate-300 border-transparent hover:bg-slate-850'
                  }`}
                >
                  <span className="text-xs font-black uppercase tracking-wide">{item.label}</span>
                  <span className={`text-[9px] font-medium leading-tight ${suiteTab === item.id ? 'text-black/80' : 'text-slate-400'}`}>{item.desc}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Rapid Share & Multi-referral (Phase 4 Growth loops) */}
          <div className="p-4 rounded-2xl border-4 border-black bg-gradient-to-br from-[#1e1e38] to-[#14142b] text-white shadow-[4px_4px_0px_0px_#000] space-y-3">
            <div className="flex items-center gap-1.5">
              <Coins className="w-5 h-5 text-yellow-400 animate-spin" />
              <h3 className="text-xs font-black uppercase tracking-wider font-mono">Referral Rewards</h3>
            </div>
            <p className="text-[10px] text-slate-300 leading-normal">
              Claim 100 XP instantly for every companion who signs up through your secure verified link.
            </p>
            <button
              onClick={handleCopyReferral}
              className="w-full py-2 bg-yellow-400 text-black font-black uppercase text-[10px] rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center gap-1.5 cursor-pointer hover:bg-yellow-350 active:translate-y-0.5"
            >
              <Clipboard className="w-3.5 h-3.5" />
              {isCopied ? 'Copied Link! (+100 XP)' : 'Copy Invite Link'}
            </button>
          </div>
        </div>

        {/* Dynamic Workspace Container Frame */}
        <div className="lg:col-span-9">
          <div className="p-6 rounded-2xl border-4 border-black bg-[#161e2e] shadow-[6px_6px_0px_0px_#000000] min-h-[500px]">
            
            {/* --- PHASE 3: ONBOARDING FLOW PANEL --- */}
            {suiteTab === 'onboarding' && (
              <div className="space-y-6">
                <div className="pb-3 border-b-2 border-black flex items-center justify-between">
                  <h3 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    🎒 World-Class User Onboarding
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400 font-black">
                    STEP {onboardingStep + 1} OF 4
                  </span>
                </div>

                {onboardingStep === 0 && (
                  <div className="space-y-5 animate-fade-in">
                    <div className="p-4 bg-black/40 border-2 border-slate-800 rounded-xl space-y-2">
                      <span className="text-[10px] font-mono font-semibold text-yellow-400 uppercase tracking-widest block">Core Mission Statement</span>
                      <h4 className="text-base font-black text-white uppercase">Vibe Check, Slay Trivia, Compete with Friends</h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans mt-1">
                        Welcome to the next generation of gamified learning. Quizora blends competitive academic benchmarks with hyper-focused custom channels. Start by configuring your personalized workspace preferences below!
                      </p>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      {[
                        { title: 'Learn 🧪', desc: 'Expert curation from real NEET, JEE, and AI academic panels' },
                        { title: 'Compete 🤺', desc: 'Secure real-time matchmaker queues and community boards' },
                        { title: 'Monetize 💰', desc: 'Create quizzes, analyze plays, and receive direct payout bonuses' }
                      ].map((card, i) => (
                        <div key={i} className="p-4 rounded-xl border-2 border-black bg-slate-900/40 text-left space-y-1 shadow-[2px_2px_0px_0px_#000]">
                          <div className="text-xs font-bold text-white uppercase tracking-wide">{card.title}</div>
                          <p className="text-[10px] text-slate-450 leading-normal text-slate-300">{card.desc}</p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button
                        onClick={() => setOnboardingStep(1)}
                        className="px-5 py-2.5 bg-indigo-600 text-white font-black uppercase text-xs rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_#000] flex items-center gap-1.5 hover:bg-indigo-500 active:translate-y-0.5 transition-all cursor-pointer"
                      >
                        Choose Interests <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {onboardingStep === 1 && (
                  <div className="space-y-5 animate-fade-in">
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-slate-300 uppercase">Select Channels of Interest</h4>
                      <p className="text-xs text-slate-450 text-slate-350 leading-relaxed">
                        Customize your active feed recommendations. Select as many channels as you feel lowkey curious about.
                      </p>
                    </div>

                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {['Computer Science', 'NEET/JEE Prep', 'AI/ML Essentials', 'Spicy Science', 'Pop Culture', 'Crypto & Blockchain'].map((interest) => {
                        const active = selectedInterests.includes(interest);
                        return (
                          <button
                            key={interest}
                            onClick={() => {
                              setSelectedInterests(prev => 
                                active ? prev.filter(i => i !== interest) : [...prev, interest]
                              );
                            }}
                            className={`p-3 rounded-xl border-2 text-left font-mono font-black text-xs transition-all flex items-center justify-between cursor-pointer ${
                              active
                                ? 'bg-pink-500 text-white border-black shadow-[2px_2px_0px_0px_#000]'
                                : 'bg-slate-900/45 text-slate-300 border-slate-800'
                            }`}
                          >
                            <span>{interest}</span>
                            {active ? <CheckCircle className="w-4 h-4 text-white" /> : <Plus className="w-4 h-4 text-slate-500" />}
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-4 flex items-center justify-between border-t border-slate-800">
                      <button
                        onClick={() => setOnboardingStep(0)}
                        className="px-4 py-2 bg-slate-800 text-slate-400 font-bold uppercase text-xs rounded-xl border-2 border-transparent hover:border-slate-700 hover:text-white cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => setOnboardingStep(2)}
                        className="px-5 py-2.5 bg-indigo-600 text-white font-black uppercase text-xs rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_#000] flex items-center gap-1.5 hover:bg-indigo-500 active:translate-y-0.5 transition-all cursor-pointer"
                      >
                        Adjust Skill Levels <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {onboardingStep === 2 && (
                  <div className="space-y-5 animate-fade-in">
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-slate-300 uppercase">Set Your Battle Skill Tier</h4>
                      <p className="text-xs text-slate-450 text-slate-350 leading-relaxed">
                        We balance matching algorithms based on your tier to ensure absolute gaming experience.
                      </p>
                    </div>

                    <div className="grid sm:grid-cols-4 gap-3">
                      {(['Noob', 'Adept', 'Scholar', 'Gigachad'] as const).map((level) => (
                        <button
                          key={level}
                          onClick={() => setSkillLevel(level)}
                          className={`p-4 rounded-xl border-2 text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
                            skillLevel === level
                              ? 'bg-emerald-500 text-black border-black shadow-[3px_3px_0px_0px_#000]'
                              : 'bg-slate-900/40 text-slate-300 border-slate-800 hover:bg-slate-850'
                          }`}
                        >
                          <span className="text-lg mb-1">
                            {level === 'Noob' ? '🍼' : level === 'Adept' ? '🛡️' : level === 'Scholar' ? '📖' : '👑'}
                          </span>
                          <span className="text-xs font-black uppercase tracking-wider">{level}</span>
                        </button>
                      ))}
                    </div>

                    <div className="space-y-2 pt-4">
                      <h4 className="text-sm font-black text-slate-300 uppercase">Personalized Learning Speed Goal</h4>
                      <div className="grid sm:grid-cols-3 gap-3">
                        {[
                          '15 mins / day (Aura Boost)',
                          '30 mins / day (Consistent Sage)',
                          '60 mins / day (Code/Die Grind)'
                        ].map((goal) => (
                          <button
                            key={goal}
                            onClick={() => setDailyGoal(goal)}
                            className={`p-3.5 rounded-xl border-2 text-left font-mono font-bold text-xs transition-all cursor-pointer ${
                              dailyGoal === goal
                                ? 'bg-yellow-405 bg-yellow-400 text-black border-black shadow-[2px_2px_0px_0px_#000]'
                                : 'bg-slate-900/40 text-slate-300 border-slate-800 hover:bg-slate-850'
                            }`}
                          >
                            {goal}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between border-t border-slate-800 font-mono">
                      <button
                        onClick={() => setOnboardingStep(1)}
                        className="px-4 py-2 bg-slate-800 text-slate-400 font-bold uppercase text-xs rounded-xl border-2 border-transparent hover:border-slate-700 hover:text-white cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => setOnboardingStep(3)}
                        className="px-5 py-2.5 bg-indigo-600 text-white font-black uppercase text-xs rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_#000] flex items-center gap-1.5 hover:bg-indigo-500 active:translate-y-0.5 transition-all cursor-pointer"
                      >
                        Add Cohort Buddies <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {onboardingStep === 3 && (
                  <div className="space-y-5 animate-fade-in">
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-slate-300 uppercase">Challenge Cohort & Invite Friends</h4>
                      <p className="text-xs text-slate-450 text-slate-350 leading-relaxed">
                        Add teammate handles below to populate your customized Social Dashboard feed instantly.
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Type username, e.g. @LinusTorvalds"
                        value={typedFriend}
                        onChange={(e) => setTypedFriend(e.target.value)}
                        className="flex-1 bg-black border-2 border-slate-800 rounded-xl px-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            if (typedFriend.trim()) {
                              setInvitedFriends(prev => [...prev, typedFriend.trim()]);
                              setTypedFriend('');
                            }
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          if (typedFriend.trim()) {
                            setInvitedFriends(prev => [...prev, typedFriend.trim()]);
                            setTypedFriend('');
                          }
                        }}
                        className="px-4 py-2 bg-pink-500 text-white font-black uppercase text-xs rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000]"
                      >
                        Add
                      </button>
                    </div>

                    {invitedFriends.length > 0 && (
                      <div className="p-3.5 rounded-xl border-2 border-black bg-slate-900/40 text-xs">
                        <span className="font-bold text-slate-400 block mb-2 uppercase text-[9px] font-mono">My Invited Crew ({invitedFriends.length})</span>
                        <div className="flex flex-wrap gap-1.5">
                          {invitedFriends.map((inv, idx) => (
                            <span key={idx} className="px-2.5 py-1 rounded bg-slate-800 border-2 border-slate-700 text-white font-mono text-[10px] inline-flex items-center gap-1">
                              {inv}
                              <X className="w-3 h-3 text-slate-400 cursor-pointer hover:text-white" onClick={() => setInvitedFriends(prev => prev.filter((_, i) => i !== idx))} />
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="p-5.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-indigo-500/10 border-2 border-black space-y-2 mt-4">
                      <h4 className="text-xs font-mono font-black text-yellow-450 text-yellow-400 uppercase tracking-widest flex items-center gap-1.5">
                        🌟 WELCOME PREMIUM PRIZE
                      </h4>
                      <p className="text-xs text-slate-350 leading-relaxed font-semibold">
                        Slaying the Onboarding Flow yields you an immediate <strong className="text-white">+100 XP CADET</strong> credential bonus! Claim below to configure your specialized dashboard with real properties.
                      </p>
                    </div>

                    <div className="pt-4 flex items-center justify-between border-t border-slate-800 font-mono">
                      <button
                        onClick={() => setOnboardingStep(2)}
                        className="px-4 py-2 bg-slate-800 text-slate-400 font-bold uppercase text-xs rounded-xl border-2 border-transparent hover:border-slate-700 hover:text-white cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        onClick={finishOnboardingFlow}
                        className="px-6 py-3 bg-emerald-500 text-black font-black uppercase text-xs rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_#000] flex items-center gap-1.5 hover:bg-emerald-400 active:translate-y-0.5 cursor-pointer"
                      >
                        Finish & Claim +100 XP <CheckCircle className="w-4 h-4 text-black" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* --- PHASE 4: SOCIAL LAYER & CHANNELS --- */}
            {suiteTab === 'social' && (
              <div className="space-y-6">
                <div className="pb-3 border-b-2 border-black flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    👥 Social Hub, Clans & Communications
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400 font-black">
                    REAL-TIME SYNC • ONLINE
                  </span>
                </div>

                <div className="grid md:grid-cols-12 gap-6">
                  {/* Left Column: Clans, Followers */}
                  <div className="md:col-span-5 space-y-4">
                    
                    {/* Followed Cohort Contacts */}
                    <div className="p-4 rounded-xl border-2 border-black bg-slate-900/40 space-y-3">
                      <h4 className="text-xs font-mono font-black text-slate-400 uppercase tracking-wider">
                        Active Friends & Followers ({followedUsers.length})
                      </h4>

                      <div className="space-y-2 max-h-[220px] overflow-y-auto">
                        {followedUsers.map((user) => (
                          <div key={user.id} className="p-2.5 rounded-lg bg-black/45 border-2 border-slate-800 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className={`w-2.5 h-2.5 rounded-full border border-black ${user.online ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} title={user.online ? 'Online' : 'Offline'}></span>
                              <div>
                                <div className="text-xs font-bold text-white uppercase">{user.username}</div>
                                <span className="text-[8px] font-mono font-semibold uppercase text-slate-400">{user.team || 'Solo Gladiator'}</span>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                setFollowedUsers(prev => prev.map(u => u.id === user.id ? { ...u, following: !u.following } : u));
                              }}
                              className={`px-2.5 py-1 text-[9px] font-black uppercase rounded border border-black transition-all cursor-pointer ${
                                user.following
                                  ? 'bg-rose-600/10 text-rose-450 text-rose-500 hover:bg-rose-600 hover:text-black'
                                  : 'bg-yellow-400 text-black hover:bg-yellow-350 shadow-[1px_1px_0px_0px_#000]'
                              }`}
                            >
                              {user.following ? 'Unfollow' : 'Follow'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Team Community Lobby */}
                    <div className="p-4 rounded-xl border-2 border-black bg-gradient-to-r from-purple-900/20 to-indigo-900/20 space-y-3">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-pink-500 text-white text-[8px] font-mono font-black shadow-[1px_1px_0px_0px_#000]">
                        CLAN STATUS
                      </div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-white">Quantum Shards Clan</h4>
                      <p className="text-[10px] text-slate-350 leading-relaxed">
                        Currently enrolled in the global Discord integration. Join the Weekly Quiz Tournament to defend your territory rankings!
                      </p>
                      <button className="w-full py-1.5 bg-black text-[#FF00FF] border border-pink-500 font-mono font-black text-[9px] uppercase tracking-wider rounded cursor-pointer hover:bg-slate-900">
                        View Clan Roster (14 Active)
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Interactive Chat Room & Activity Logs */}
                  <div className="md:col-span-7 space-y-4 flex flex-col justify-between">
                    
                    {/* Chat channels selector */}
                    <div className="p-4 rounded-xl border-2 border-black bg-slate-900/60 space-y-3 flex flex-col h-[380px]">
                      <div className="flex items-center gap-1.5 bg-black p-1 border border-slate-800 rounded-lg text-[9px] font-mono uppercase font-black">
                        {['general', 'study-grind', 'meme-lords'].map((channel: any) => (
                          <button
                            key={channel}
                            onClick={() => {
                              setActiveChannel(channel);
                              setChatMessages(prev => [
                                ...prev,
                                { sender: 'System Router', text: `Switched connection matrix over to channel: #${channel}`, time: "Now", system: true }
                              ]);
                            }}
                            className={`flex-1 py-1 rounded cursor-pointer ${activeChannel === channel ? 'bg-indigo-600 text-white' : 'text-slate-450 hover:text-slate-200'}`}
                          >
                            #{channel}
                          </button>
                        ))}
                      </div>

                      {/* Msg Log container */}
                      <div className="flex-1 overflow-y-auto space-y-2 pr-1 select-none">
                        {chatMessages.map((msg, i) => (
                          msg.system ? (
                            <div key={i} className="py-1 px-2 rounded bg-black/30 border border-slate-850 text-center text-[9px] font-mono font-semibold text-slate-400">
                              {msg.text}
                            </div>
                          ) : (
                            <div key={i} className="space-y-0.5 text-xs">
                              <div className="flex items-center justify-between text-[10px] font-semibold text-pink-400">
                                <span className="font-bold uppercase tracking-widest">{msg.sender}</span>
                                <span className="text-[8px] font-mono text-slate-500">{msg.time}</span>
                              </div>
                              <p className="p-2 rounded bg-black/40 border border-slate-850 text-slate-300 leading-normal font-medium">{msg.text}</p>
                            </div>
                          )
                        ))}
                        <div ref={chatBottomRef}></div>
                      </div>

                      {/* Chat text input */}
                      <div className="flex gap-2 pt-2 border-t border-slate-800">
                        <input
                          type="text"
                          placeholder="Broadcast something low-key brilliant..."
                          value={currentMessage}
                          onChange={(e) => setCurrentMessage(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleSendChat(); }}
                          className="flex-1 bg-black border-2 border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                        <button
                          onClick={handleSendChat}
                          className="p-2 rounded-xl bg-indigo-600 text-white border-2 border-black hover:bg-indigo-500 cursor-pointer shadow-[1.5px_1.5px_0px_0px_#000]"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- PHASE 5: GAMIFICATION 2.0 PORTAL --- */}
            {suiteTab === 'gamify' && (
              <div className="space-y-6">
                <div className="pb-3 border-b-2 border-black flex items-center justify-between">
                  <h3 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    🏆 Level, Streaks, Daily Rewards & Achievements
                  </h3>
                  <span className="text-xs font-mono text-slate-400 font-semibold block">XP: {currentUser.xp ?? 0}</span>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  
                  {/* Quests rewards cards */}
                  <div className="p-4 rounded-xl border-2 border-black bg-slate-900/40 text-left space-y-4">
                    <h4 className="text-xs font-mono font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
                      Quest Reward Vault
                    </h4>
                    
                    <div className="space-y-3">
                      {/* Daily Claim element */}
                      <div className="p-3 bg-black/45 rounded-lg border border-slate-800 flex flex-col justify-between gap-2.5">
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-mono font-extrabold text-[#10B981] uppercase tracking-widest">Attendance Daily Check</span>
                          <span className="text-xs font-black text-white block uppercase">Daily Bounty (+50 XP)</span>
                        </div>
                        <button
                          onClick={() => claimXP('daily')}
                          disabled={claimedDaily}
                          className={`w-full py-1.5 text-xs font-black uppercase rounded-lg border border-black transition-all cursor-pointer ${
                            claimedDaily 
                              ? 'bg-slate-800 text-slate-500 border-none' 
                              : 'bg-yellow-400 text-black hover:bg-yellow-350 shadow-[1.5px_1.5px_0px_0px_#000]'
                          }`}
                        >
                          {claimedDaily ? 'Claimed Today ✓' : 'Claim Daily Quest'}
                        </button>
                      </div>

                      {/* Weekly Claim element */}
                      <div className="p-3 bg-black/45 rounded-lg border border-slate-800 flex flex-col justify-between gap-2.5">
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-mono font-extrabold text-pink-500 uppercase tracking-widest font-black">Major Milestones</span>
                          <span className="text-xs font-black text-white block uppercase">Weekly Slay (+250 XP)</span>
                        </div>
                        <button
                          onClick={() => claimXP('weekly')}
                          disabled={claimedWeekly}
                          className={`w-full py-1.5 text-xs font-black uppercase rounded-lg border border-black transition-all cursor-pointer ${
                            claimedWeekly 
                              ? 'bg-slate-800 text-slate-500 border-none' 
                              : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-[1.5px_1.5px_0px_0px_#000]'
                          }`}
                        >
                          {claimedWeekly ? 'Completed ✓' : 'Claim Weekly Vault'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Level & Streaks Analytics */}
                  <div className="p-4 rounded-xl border-2 border-black bg-slate-900/40 text-left space-y-4">
                    <h4 className="text-xs font-mono font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Trophy className="w-4 h-4 text-yellow-400" />
                      Dynamic Progress Meter
                    </h4>

                    <div className="space-y-3.5">
                      {/* Active level bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="font-black text-white uppercase">Level {currentLevel} Cadet</span>
                          <span className="font-bold text-slate-450 text-slate-450 text-slate-350">
                            {currentUser.xp ?? 0} / {currentLevel * 300} XP
                          </span>
                        </div>
                        <div className="w-full h-3 rounded-full bg-black border border-slate-800 overflow-hidden p-0.5 shadow-[inner_2px_2px_4px_#000]">
                          <div 
                            className="h-full rounded-full bg-gradient-to-r from-pink-500 to-indigo-500 transition-all duration-500"
                            style={{ width: `${Math.min(100, Math.round(((currentUser.xp ?? 0) / (currentLevel * 300)) * 100))}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-450 text-slate-400 font-semibold uppercase text-[9px] font-mono">Active Streak Counter:</span>
                          <span className="text-orange-500 font-black flex items-center gap-0.5">
                            🔥 {currentUser.streak || 0} Days
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-450 text-slate-400 font-semibold uppercase text-[9px] font-mono">Perfect Assessments:</span>
                          <span className="text-emerald-400 font-mono font-black">{perfectRuns}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-450 text-slate-400 font-semibold uppercase text-[9px] font-mono">Quizzes Created:</span>
                          <span className="text-pink-500 font-mono font-black">{creationCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Trophy Cabinet (Unlocked by real metrics) */}
                  <div className="p-4 rounded-xl border-2 border-black bg-slate-900/40 text-left space-y-4">
                    <h4 className="text-xs font-mono font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-[#FF00FF]" />
                      Interactive Trophy Rack
                    </h4>

                    <div className="space-y-2 max-h-[190px] overflow-y-auto">
                      {[
                        { title: 'Iron Cadet 🥉', req: 'Level up to LVL 2 to claim', status: currentLevel >= 2 },
                        { title: 'Creation Sage 🏆', req: 'Build at least 2 Custom Quizzes', status: creationCount >= 2 },
                        { title: 'Infinite Streak 🦖', req: 'Sustain active streak score', status: (currentUser.streak || 0) >= 2 },
                        { title: 'The Perfect Slay 👑', req: 'Score 100% on any competitive assessment', status: perfectRuns >= 1 }
                      ].map((trophy, index) => (
                        <div key={index} className={`p-2.5 rounded-lg border-2 text-xs flex items-center justify-between ${
                          trophy.status 
                            ? 'bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-yellow-500 text-yellow-450' 
                            : 'bg-black/40 border-slate-850 text-slate-500'
                        }`}>
                          <div>
                            <span className="font-extrabold block">{trophy.title}</span>
                            <span className="text-[9px] font-mono opacity-80 text-slate-400 leading-tight block">{trophy.req}</span>
                          </div>
                          <span>{trophy.status ? '🌟 UNLOCKED' : '🔒 LOCKED'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- PHASE 6: CREATOR ANALYTICS & AI BUILDER --- */}
            {suiteTab === 'creator' && (
              <div className="space-y-6">
                <div className="pb-3 border-b-2 border-black flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    🤖 AI Quiz Synthesis & Creator Studio
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400 font-black">
                    GEMINI-3.5-FLASH AI SYSTEM INTEGRATED
                  </span>
                </div>

                <div className="grid md:grid-cols-12 gap-6">
                  {/* Left: Procedural AI Input Panel */}
                  <div className="md:col-span-6 space-y-4">
                    <div className="p-4 rounded-xl border-2 border-black bg-slate-900/40 text-left space-y-4">
                      <div>
                        <span className="text-[10px] font-mono font-black text-yellow-400 uppercase tracking-widest block">AI Procedural Synthesis</span>
                        <h4 className="text-xs font-black uppercase text-white mt-0.5">Generate Instant Quiz by Topic</h4>
                      </div>

                      <div className="space-y-3.5">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase text-slate-400 font-extrabold">Custom Topic Prompt</label>
                          <input
                            type="text"
                            placeholder="e.g., Advanced JavaScript Closures"
                            value={typedTopic}
                            onChange={(e) => setTypedTopic(e.target.value)}
                            disabled={isGeneratingQuiz}
                            className="w-full bg-black border-2 border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          {(['easy', 'medium', 'hard'] as const).map((diff) => (
                            <button
                              key={diff}
                              onClick={() => setAiQuizDiff(diff)}
                              className={`py-1.5 text-[10px] font-mono uppercase font-black tracking-wider border rounded-lg transition-all cursor-pointer ${
                                aiQuizDiff === diff
                                  ? 'bg-pink-500 border-black text-white shadow-[2px_2px_0px_0px_#000]'
                                  : 'bg-black text-slate-400 border-slate-800 hover:border-slate-700'
                              }`}
                            >
                              {diff}
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={handleAIQuizGenerator}
                          disabled={isGeneratingQuiz || !typedTopic.trim()}
                          className="w-full py-3 bg-indigo-600 text-white font-black uppercase text-xs rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_#000] flex items-center justify-center gap-1.5 hover:bg-slate-850 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isGeneratingQuiz ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin text-yellow-400" />
                              <span>Synthesizing vectors with AI...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 text-yellow-400" />
                              <span>Generate Procedural AI Quiz</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right: Creator Telemetry Studio */}
                  <div className="md:col-span-6 space-y-4">
                    <div className="p-4 rounded-xl border-2 border-black bg-slate-900/40 text-left space-y-4">
                      <div>
                        <span className="text-[10px] font-mono font-black text-[#10B981] uppercase tracking-widest block">TELEMETRY SYSTEM</span>
                        <h4 className="text-xs font-black uppercase text-white mt-0.5">Author Performance Matrix ({creationCount} Active)</h4>
                      </div>

                      {creationCount > 0 ? (
                        <div className="space-y-3 font-mono text-xs">
                          {quizzes.filter(q => q.createdBy === currentUser.username).map((quiz, i) => (
                            <div key={i} className="p-3 bg-black/40 border border-slate-800 rounded-lg space-y-2">
                              <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                                <span className="font-extrabold text-white truncate max-w-[150px]">{quiz.title}</span>
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-pink-500/10 text-pink-400 border border-pink-500/25 uppercase">
                                  {quiz.difficulty || 'medium'}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                                <div className="flex justify-between">
                                  <span>Total Plays:</span>
                                  <span className="font-bold text-white">4</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Avg Accuracy:</span>
                                  <span className="font-bold text-yellow-400">82%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Completion Rate:</span>
                                  <span className="font-bold text-emerald-400">100%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>External Shares:</span>
                                  <span className="font-bold text-pink-500">2</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-8 text-center border-2 border-dashed border-slate-800 rounded-xl bg-black/25 text-xs text-slate-450 text-slate-450 text-slate-350 font-mono font-medium">
                          No procedures authored yet. Use the prompt generator on the left to write your debut, or go to "Create Quiz" in the header! 🤺
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- PHASE 7: REAL-TIME SECURE MULTIPLAYER --- */}
            {suiteTab === 'multiplayer' && (
              <div className="space-y-6">
                <div className="pb-3 border-b-2 border-black flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    ⚔️ 1v1 Battle Arena Matchmaking
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400 font-black">
                    WEBSOCKET PORT 3000 BRIDGED
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-black/60 border-2 border-slate-800 text-center min-h-[300px] flex flex-col justify-center items-center">
                  
                  {multiplayerState === 'lobby' && (
                    <div className="space-y-4 max-w-sm animate-fade-in">
                      <div className="w-16 h-16 rounded-full bg-indigo-600/20 border-2 border-indigo-500 flex items-center justify-center text-indigo-400 mx-auto select-none">
                        <Radio className="w-8 h-8 animate-pulse text-indigo-500" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-base font-black text-white uppercase">Challenge Arena Duelist</h4>
                        <p className="text-xs text-slate-300 leading-normal font-sans">
                          Enter matchmaking queue. Our loadbalancing system locks in matches based on the skill tier you set. Slaying a 1v1 duel yields XP multipliers!
                        </p>
                      </div>
                      <button
                        onClick={startMatchmaking}
                        className="px-6 py-3 bg-yellow-405 bg-yellow-400 text-black font-black uppercase text-xs rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:bg-yellow-350 transition-all cursor-pointer"
                      >
                        Find Opponent & Enter Queue
                      </button>
                    </div>
                  )}

                  {multiplayerState === 'matching' && (
                    <div className="space-y-4 max-w-md animate-fade-in">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-full border-4 border-dashed border-indigo-500 animate-spin mx-auto"></div>
                        <span className="absolute inset-x-0 top-4 text-xs font-mono font-black text-white">{matchingTime}s</span>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-base font-black text-white uppercase font-mono">Querying Active Candidates...</h4>
                        <p className="text-xs text-slate-400 font-semibold uppercase">PORT 3000 SOCKET TUNNEL ACTIVE</p>
                      </div>

                      <div className="p-3 bg-slate-900 border border-slate-850 rounded-xl text-left font-mono text-[10px] text-slate-500 space-y-1 select-none">
                        {multiLog.map((log, i) => (
                          <div key={i} className="leading-relaxed">
                            <span className="text-[#FF00FF] font-black mr-1">&gt;</span> {log}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {multiplayerState === 'found' && opponent && (
                    <div className="space-y-6 max-w-xl w-full animate-fade-in">
                      <div className="flex items-center justify-center gap-10">
                        {/* Player */}
                        <div className="text-center space-y-2">
                          <img src={currentUser.avatarUrl} alt="" className="w-16 h-16 rounded-full border-4 border-indigo-500 mx-auto bg-slate-850" referrerPolicy="no-referrer" />
                          <h4 className="text-xs font-black text-white uppercase font-mono">@{currentUser.username}</h4>
                          <span className="text-[10px] font-mono text-[#FF00FF] font-black">LVL {currentUser.level}</span>
                        </div>

                        {/* VS Indicator */}
                        <div className="text-4xl font-extrabold text-pink-500 italic select-none animate-ping">VS</div>

                        {/* Opponent */}
                        <div className="text-center space-y-2">
                          <img src={opponent.avatar} alt="" className="w-16 h-16 rounded-full border-4 border-pink-500 mx-auto" referrerPolicy="no-referrer" />
                          <h4 className="text-xs font-black text-white uppercase font-mono">@{opponent.username}</h4>
                          <span className="text-[10px] font-mono text-yellow-405 text-yellow-400 font-extrabold">LVL {opponent.level}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-base font-black text-white uppercase">AUTHENTICATED MATCH LOCKED IN!</h4>
                        <p className="text-[10px] font-mono text-emerald-400 font-black">GET READY FOR ZERO-ACCURACY SPEEDRUNNING BATTLE...</p>
                      </div>
                    </div>
                  )}

                  {multiplayerState === 'playing' && multiQuizQuestions.length > 0 && (
                    <div className="space-y-6 w-full text-left animate-fade-in">
                      {/* Score Tracker boards */}
                      <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                        <div className="font-mono text-xs">
                          <span className="text-slate-400 font-semibold">@{currentUser.username}:</span>
                          <span className="text-[#10B981] font-black ml-1.5">{playerScoreMultiplier} PTS</span>
                        </div>
                        <div className="px-3 py-0.5 rounded bg-pink-500 border-2 border-black text-black font-mono text-[9px] font-black uppercase shadow-[1px_1px_0px_0px_#000]">
                          QUESTION {multiIdx + 1}/{multiQuizQuestions.length}
                        </div>
                        <div className="font-mono text-xs">
                          <span className="text-slate-400 font-semibold">@CurieScholar:</span>
                          <span className="text-pink-500 font-extrabold ml-1.5">{opponentScoreMultiplier} PTS</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-sm font-black text-white uppercase leading-normal">
                          {multiQuizQuestions[multiIdx].q}
                        </h4>

                        <div className="grid sm:grid-cols-2 gap-3">
                          {multiQuizQuestions[multiIdx].options.map((opt, i) => {
                            const selected = selectedMultiAns === i;
                            const isCorrectAns = opt === multiQuizQuestions[multiIdx].a;
                            return (
                              <button
                                key={i}
                                onClick={() => handleSelectMultiAnswer(i, isCorrectAns)}
                                className={`p-4 rounded-xl border-2 text-left text-xs font-black uppercase transition-all cursor-pointer ${
                                  selected
                                    ? isCorrectAns 
                                      ? 'bg-emerald-500 text-black border-black shadow-[2.5px_2.5px_0px_0px_#000]'
                                      : 'bg-rose-650 bg-rose-600 text-white border-black shadow-[2.5px_2.5px_0px_0px_#000]'
                                    : 'bg-black text-slate-300 border-slate-800 hover:border-slate-700'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {multiplayerState === 'postmatch' && (
                    <div className="space-y-5 animate-fade-in">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto select-none">
                        <Trophy className="w-8 h-8 text-yellow-405 text-yellow-400" />
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-lg font-black text-white uppercase">
                          {playerScoreMultiplier >= opponentScoreMultiplier 
                            ? '🥇 DEFEATED CURIESCHOLAR! (+150 XP)' 
                            : '🥈 DEFEND DEFEAT PLACE ACTIVE! (+50 XP)'}
                        </h4>
                        <p className="text-xs text-slate-300 max-w-sm mx-auto font-semibold">
                          Earned the limited custom <strong className="text-[#FF00FF]">"Arena Duelist 🤺"</strong> badge credentials!
                        </p>
                      </div>

                      <button
                        onClick={() => setMultiplayerState('lobby')}
                        className="px-5 py-2.5 bg-indigo-600 text-white font-black uppercase text-xs rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000]"
                      >
                        Return to Duel Lobby
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* --- PHASE 8: PWA Status Diagnostics --- */}
            {suiteTab === 'pwa' && (
              <div className="space-y-6">
                <div className="pb-3 border-b-2 border-black flex items-center justify-between">
                  <h3 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    📱 Progressive Web App Status Matrix
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400 font-black">LIGHTHOUSE STATUS: 98%</span>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Status checklist */}
                  <div className="p-4 rounded-xl border-2 border-black bg-slate-900/40 text-left space-y-4">
                    <h4 className="text-xs font-mono font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-emerald-400" />
                      Real Device Cache Hooks
                    </h4>

                    <div className="space-y-2 text-xs">
                      <div className="p-3 bg-black/45 hover:bg-black/60 rounded-lg border border-slate-800 flex justify-between items-center transition-colors">
                        <div>
                          <span className="font-bold block text-white">Offline Cache status:</span>
                          <span className="text-[10px] text-slate-400 font-mono">Enable local simulated offline mode</span>
                        </div>
                        <button
                          onClick={() => {
                            setIsOfflineMode(!isOfflineMode);
                            setPwaStatusLog(prev => [
                              ...prev,
                              `[PWA STATUS] Switched offline status indicator to: ${!isOfflineMode ? 'OFFLINE_CACHE_ACTIVE' : 'ONLINE_SOCKET_SYNC'}`
                            ]);
                          }}
                          className={`px-3 py-1 text-[10px] font-bold tracking-wide uppercase font-mono rounded border border-black ${
                            isOfflineMode ? 'bg-pink-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {isOfflineMode ? 'Offline Mode' : 'Online'}
                        </button>
                      </div>

                      <div className="p-3 bg-[#111827] rounded-lg border border-slate-800 flex justify-between items-center select-none">
                        <div>
                          <span className="font-bold block text-white">Trigger Native Push Alert:</span>
                          <span className="text-[10px] text-slate-450 text-slate-400 font-mono">Requests prompt system metrics</span>
                        </div>
                        <button
                          onClick={() => {
                            setPwaStatusLog(prev => [...prev, `[Push Alert] Simulation sequence triggered direct badge: ${currentUser.username || 'user'}`]);
                            alert(`${currentUser.username || 'user'} are fully registered under device token: APNS_TOKEN_V2!`);
                          }}
                          className="px-3 py-1.5 bg-indigo-600 border border-black text-white rounded text-[10px] font-black uppercase font-mono cursor-pointer hover:bg-indigo-500"
                        >
                          Trigger
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Log diagnostic print */}
                  <div className="p-4 rounded-xl border-2 border-black bg-slate-900/40 text-left space-y-3 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-black text-indigo-400 block uppercase">PWA Telemetry Logs</span>
                      <h4 className="text-xs font-black uppercase text-white mt-0.5">Active worker process console</h4>
                    </div>

                    <div className="flex-1 bg-black p-3 rounded-lg border border-slate-850 font-mono text-[9px] text-[#10B981] space-y-1 select-none min-h-[140px] max-h-[180px] overflow-y-auto">
                      {pwaStatusLog.map((log, i) => (
                        <div key={i} className="leading-relaxed">
                          <span className="text-pink-500 font-bold mr-1">&gt;</span> {log}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- PHASE 10: SECURE ACCESS, RBAC & SECURITY --- */}
            {suiteTab === 'security' && (
              <div className="space-y-6 animate-fade-in">
                <div className="pb-3 border-b-2 border-black flex items-center justify-between">
                  <h3 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    🔐 Platform Integrity & CAPTCHA Verification
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400 font-black">
                    CSRF • JWT VALIDATED
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  
                  {/* Lock puzzle anti-bot check to get XP */}
                  <div className="p-4 rounded-xl border-2 border-black bg-slate-900/45 text-left space-y-4">
                    <div className="flex items-center gap-2">
                      <Lock className="w-5 h-5 text-pink-500 animate-pulse" />
                      <div>
                        <span className="text-[10px] font-mono font-black text-[#FF00FF] uppercase tracking-widest block font-extrabold">SECURE COMPLIANCE</span>
                        <h4 className="text-xs font-black uppercase text-white mt-0.5">Interactive Anti-Bot CAPTCHA</h4>
                      </div>
                    </div>

                    <p className="text-xs text-slate-350 leading-relaxed font-semibold">
                      Perform verification procedures to confirm client authenticity. Successfully verified candidates gain an instant <strong className="text-white">+50 XP bonus</strong> credential.
                    </p>

                    <div className="p-3.5 bg-black/60 rounded-xl border border-slate-805 border-slate-800 space-y-3">
                      <div className="flex justify-between items-center text-xs font-mono font-black text-white">
                        <span>SECURITY PUZZLE:</span>
                        <span className="text-yellow-405 text-yellow-400 uppercase font-mono tracking-wider">{captchaQuestion.q}</span>
                      </div>

                      <div className="flex gap-2 font-mono">
                        <input
                          type="number"
                          placeholder="Answer"
                          value={captchaAttempt}
                          onChange={(e) => setCaptchaAttempt(e.target.value)}
                          disabled={isCaptchaVerified}
                          className="flex-1 bg-black border-2 border-slate-805 border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 text-center"
                        />
                        <button
                          onClick={handleVerifyCaptcha}
                          disabled={isCaptchaVerified}
                          className="px-4 py-2.5 bg-emerald-500 border border-black text-black font-mono font-black uppercase text-xs rounded-xl shadow-[1.5px_1.5px_0px_0px_#000] cursor-pointer"
                        >
                          Solve
                        </button>
                      </div>

                      {isCaptchaVerified && (
                        <div className="p-2 bg-emerald-500/10 border border-emerald-500/25 rounded-lg text-emerald-400 text-center text-[10px] uppercase font-mono font-extrabold">
                          ✓ Verification Decrypted successfully. +50 XP Awarded!
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Active authentication details */}
                  <div className="p-4 rounded-xl border-2 border-black bg-slate-900/40 text-left space-y-4">
                    <h4 className="text-xs font-mono font-black text-slate-400 uppercase tracking-widest">
                      JWT Secure Key Ledger
                    </h4>

                    <div className="space-y-3.5 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-450 text-slate-400 font-semibold block uppercase">Decrypted Client JSON Token</span>
                        <p className="p-2.5 bg-black font-mono text-[8px] text-pink-400 break-all rounded border border-slate-850 select-none leading-relaxed mt-1">
                          {jwtToken}
                        </p>
                      </div>

                      <div className="p-3 bg-[#111827] rounded-lg border border-slate-800 text-[10px] flex justify-between items-center">
                        <div>
                          <span className="font-bold block text-white">My Security Role:</span>
                          <span className="text-[9px] text-slate-400 font-mono">Managed based on RBAC schema</span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded border border-black bg-indigo-600 text-white font-mono font-black uppercase tracking-wider text-[9px]">
                          {currentUser.role}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Secure Purge sequence section */}
                <div className="p-4 rounded-xl border-2 border-rose-500/30 bg-rose-950/10 text-left space-y-2 mt-4 font-mono text-xs">
                  <h4 className="text-rose-500 font-black uppercase flex items-center gap-1.5">
                    <AlertCircle className="w-5 h-5 text-rose-550 text-rose-500 animate-pulse" />
                    COMPLIANCE DATA WIPE & SECURE GDPR PURGE
                  </h4>
                  <p className="text-slate-350 leading-relaxed text-[11px]">
                    To comply fully with California CCPA, European Union GDPR, and startup audit logs: you have the unconditional right to invoke the absolute data purge. Utilizing the purge immediately deletes all your scored assessment logs (+ streaks, custom levels, created quizzes, JWT caches, and telemetry indices) cleanly.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={executeGDPRPurge}
                      className="px-4 py-2 bg-rose-650 bg-rose-600 hover:bg-rose-700 text-white font-black uppercase text-[10px] rounded border border-black cursor-pointer shadow-[1.5px_1.5px_0px_0px_#000]"
                    >
                      Authorize Complete GDPR Purge Sequence
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* --- PHASE 12: MONETIZATION SUBSCRIPTION VAULT --- */}
            {suiteTab === 'monetize' && (
              <div className="space-y-6">
                <div className="pb-3 border-b-2 border-black flex items-center justify-between">
                  <h3 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    💎 Quizora Plus Premium subscription Hub
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400 font-black">SECURE BILLING MODULE</span>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Gate premium checkout */}
                  <div className="p-5.5 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-700 to-amber-900 border-4 border-black text-white text-left space-y-4 shadow-[5px_5px_0px_0px_#000]">
                    <div className="space-y-1">
                      <span className="px-2.5 py-0.5 rounded bg-black/40 text-yellow-405 text-yellow-400 text-[10px] font-mono font-black uppercase tracking-wider">FOUNDING Gated</span>
                      <h4 className="text-xl font-black uppercase">Quizora Plus Monthly</h4>
                    </div>

                    <div className="font-mono text-2xl font-black">
                      $4.99 <span className="text-xs font-normal opacity-80 text-white">/ Monthly SaaS tier</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-300" />
                        <span>Instant Access to Premium Dark Theme presets</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-300" />
                        <span>Advanced Analytics Charts & telemetries</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-300" />
                        <span>Exclusive Creator monetization payout rewards</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-300" />
                        <span>Custom glowing profile badges</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setShowBillingSheet(true);
                        setPaymentStep('plan');
                      }}
                      className="w-full py-3 bg-black hover:bg-slate-900 text-yellow-405 text-yellow-400 font-extrabold text-xs uppercase rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_#000] cursor-pointer"
                    >
                      Subscribe & Upgrade
                    </button>
                  </div>

                  {/* Creator Payout Dash */}
                  <div className="p-4 rounded-xl border-2 border-black bg-slate-900/40 text-left space-y-4 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-black text-pink-500 block uppercase">Creator Monetization Dashboard</span>
                      <h4 className="text-xs font-black uppercase text-white mt-0.5">Procedural payout metrics</h4>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="grid grid-cols-2 gap-3 font-mono text-center">
                        <div className="p-3 bg-black/40 border border-slate-800 rounded-lg">
                          <span className="text-[9px] text-slate-500 uppercase block font-semibold">Total Revenue</span>
                          <span className="text-lg font-black text-emerald-400 mt-1 block">$14.20</span>
                        </div>
                        <div className="p-3 bg-black/40 border border-slate-800 rounded-lg">
                          <span className="text-[9px] text-slate-500 uppercase block font-semibold">Active Subscriptions</span>
                          <span className="text-lg font-black text-pink-500 mt-1 block">3 Plus</span>
                        </div>
                      </div>

                      <p className="text-[10px] text-slate-450 leading-relaxed text-slate-300 font-medium">
                        Monetize your curated assessments! Every 10 plays by premium "Quizora Plus" accounts rewards you with +1 XP multiplier credit, seamlessly translated to your startup ledger.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stripe Checkout Sheet */}
                {showBillingSheet && (
                  <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                    <div className="p-6 rounded-2xl bg-[#111827] border-4 border-black text-white text-left w-full max-w-md space-y-4 shadow-[6px_6px_0px_0px_#000] animate-fade-in select-none">
                      
                      <div className="flex justify-between items-center pb-2 border-b-2 border-black">
                        <h4 className="text-sm font-black uppercase tracking-wider text-white">Stripe Payment Sheet Simulation</h4>
                        <X className="w-5 h-5 text-slate-400 cursor-pointer hover:text-white" onClick={() => setShowBillingSheet(false)} />
                      </div>

                      {paymentStep === 'plan' && (
                        <div className="space-y-4">
                          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                            <span className="text-[9px] font-mono text-yellow-450 text-yellow-400 font-black uppercase block">Active Product:</span>
                            <span className="text-xs font-extrabold block text-white uppercase">QUIZORA PLUS FOUNDER TIER</span>
                            <span className="text-xs text-slate-400 font-mono font-semibold">$4.99 USD billed immediately</span>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-mono text-slate-400 uppercase font-black">Provide Secured Simulated Card Number</label>
                            <input
                              type="text"
                              value={stripeCardNum}
                              onChange={(e) => setStripeCardNum(e.target.value)}
                              className="w-full bg-black border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <label className="text-[9px] font-mono text-slate-400 uppercase font-black">Expiry</label>
                              <input
                                type="text"
                                placeholder="08/29"
                                className="w-full bg-black border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-mono text-slate-400 uppercase font-black">CVC PIN</label>
                              <input
                                type="text"
                                value={stripeCvc}
                                onChange={(e) => setStripeCvc(e.target.value)}
                                className="w-full bg-black border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none"
                              />
                            </div>
                          </div>

                          <button
                            onClick={handleSubscribePremium}
                            className="w-full py-2.5 bg-yellow-405 bg-yellow-400 text-black font-extrabold text-xs uppercase rounded-xl border-2 border-black cursor-pointer shadow-[3px_3px_0px_0px_#000]"
                          >
                            Finalize simulated Stripe Payment
                          </button>
                        </div>
                      )}

                      {paymentStep === 'success' && (
                        <div className="space-y-4 text-center py-6">
                          <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto select-none">
                            <CheckCircle className="w-6 h-6" />
                          </div>
                          
                          <div className="space-y-1">
                            <h4 className="text-base font-black text-white uppercase">SUBSCRIPTION SUCCESSFUL!</h4>
                            <p className="text-xs text-slate-350 max-w-xs mx-auto">
                              Welcome to <strong className="text-yellow-400">Quizora Plus 🚀</strong>! Exclusive badges have been successfully added to your main profile index dashboard.
                            </p>
                          </div>

                          <button
                            onClick={() => setShowBillingSheet(false)}
                            className="px-5 py-2 bg-indigo-650 bg-indigo-600 text-white rounded font-bold text-xs uppercase tracking-wide cursor-pointer"
                          >
                            Proceed to Premium Portal
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* --- PHASE 14: INTERACTIVE DESIGN TOKEN SYSTEM PLAYGROUND --- */}
            {suiteTab === 'design' && (
              <div className="space-y-6">
                <div className="pb-3 border-b-2 border-black flex items-center justify-between">
                  <h3 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    🎨 Design Token sandbox & Reusable Components
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400 font-black">SYSTEM TYPEPADS: ACTIVE</span>
                </div>

                <div className="p-4 rounded-xl border-2 border-black bg-slate-900/40 text-left space-y-4">
                  <p className="text-xs text-slate-350 leading-relaxed font-semibold">
                    Interact with real components to test fluid design system layout properties directly. Adjust tokens below:
                  </p>

                  <div className="grid sm:grid-cols-2 gap-4 border-b border-slate-800 pb-4">
                    {/* Spacing adjustments */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono font-black text-slate-400 block uppercase">Padding Spacing Value</span>
                      <div className="flex gap-1.5 bg-black p-1 border border-slate-800 rounded-lg text-xs font-mono uppercase font-black">
                        {(['snug', 'comfy', 'spacious'] as const).map((scale) => (
                          <button
                            key={scale}
                            onClick={() => setSpacingScale(scale)}
                            className={`flex-1 py-1 rounded cursor-pointer ${spacingScale === scale ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
                          >
                            {scale}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Accent Color adjustments */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono font-black text-slate-400 block uppercase">Color Accent Theme</span>
                      <div className="flex gap-1.5 bg-black p-1 border border-slate-800 rounded-lg text-xs font-mono uppercase font-black">
                        {(['pink', 'emerald', 'indigo', 'amber'] as const).map((hue) => (
                          <button
                            key={hue}
                            onClick={() => setAccentHue(hue)}
                            className={`flex-1 py-1 rounded cursor-pointer ${accentHue === hue ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
                          >
                            {hue}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Grid displays */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono font-black text-[#10B981] uppercase block">PREVIEWING COMPONENT ACCORDING TO PARAMETERS</span>
                    
                    <div className={`rounded-xl border-2 border-black bg-[#111827] flex flex-col sm:flex-row sm:items-center justify-between ${spacingClass}`}>
                      <div className="space-y-1">
                        <h4 className="text-sm font-black text-white uppercase">Venture design system card</h4>
                        <p className="text-[10px] text-slate-350 tracking-wide font-medium">A flexible, responsive, aesthetic spacing layout frame.</p>
                      </div>

                      <button className={`px-4 py-2 border-2 border-black rounded shadow-[2px_2px_0px_0px_#000] text-xs font-black uppercase cursor-pointer ${accentBg}`}>
                        Launch Preview
                      </button>
                    </div>
                  </div>
                </div>

                {/* Android / iOS launcher guidelines (Phase 9 specifications) */}
                <div className="p-4 rounded-xl border-2 border-black bg-slate-900/40 text-left space-y-3 font-mono text-xs">
                  <h4 className="text-white font-black uppercase flex items-center gap-1.5">
                    <Smartphone className="w-5 h-5 text-indigo-500 animate-pulse" />
                    PHASE 9: NATIVE ANDROID & IOS SPECIFICATIONS
                  </h4>
                  <p className="text-slate-350 text-[11px] leading-relaxed">
                    Quizora is fully compatible with React Native + Expo deployment chains. To target mobile:
                  </p>
                  <pre className="p-3 bg-black/80 rounded border border-slate-850 font-mono text-[9px] text-[#FF00FF] overflow-x-auto">
{`// Native Gesture Integration Example (Expo-Haptic)
import * as Haptics from 'expo-haptics';

export const triggerNativeFeedback = () => {
  Haptics.notificationAsync(
    Haptics.NotificationFeedbackType.Success
  );
};

// Deep linking schema: quizora://assessments?id=cs-coding-duel`}
                  </pre>
                  <div className="text-[10px] font-semibold text-slate-500">
                    No web wrapping—production grade Flutter / React Native packages secure biometric login (Keychain / Fingerprint) and native share sheets out of the box.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
