import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Clock, 
  Award, 
  XCircle, 
  Flame, 
  RotateCcw, 
  ChevronRight, 
  AlertTriangle,
  Check,
  Share2,
  Copy,
  Volume2,
  VolumeX,
  ShieldAlert,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Heart,
  Undo
} from 'lucide-react';
import { Quiz, Attempt, Question, Option, Answer } from '../types';

interface QuizPlayProps {
  quiz: Quiz;
  userId: string;
  username: string;
  onSaveAttempt: (attempt: Attempt) => void;
  onExit: () => void;
  onOpenMemeWithScore: (scoreText: string) => void;
}

// Sound effects utilizing Web Audio API without external static dependencies
let soundMuted = false;
const playQuizSound = (type: 'correct' | 'wrong' | 'timeout' | 'cheat' | 'click') => {
  if (soundMuted) return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === 'correct') {
      // Pleasant upward arpeggio
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + idx * 0.08 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.3);
      });
    } else if (type === 'wrong') {
      // Dissonant descending buzz
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc1.type = 'sawtooth';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(140, ctx.currentTime);
      osc1.frequency.linearRampToValueAtTime(70, ctx.currentTime + 0.3);
      osc2.frequency.setValueAtTime(144, ctx.currentTime);
      osc2.frequency.linearRampToValueAtTime(74, ctx.currentTime + 0.3);
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.3);
      osc2.stop(ctx.currentTime + 0.3);
    } else if (type === 'timeout') {
      // Flat double beep
      [0, 0.15].forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = 220;
        gain.gain.setValueAtTime(0, ctx.currentTime + delay);
        gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + delay + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.15);
      });
    } else if (type === 'cheat') {
      // Low siren warning
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.15);
      osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.3);
      osc.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.45);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } else if (type === 'click') {
      // Bubble / subtle mechanical tick
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    }
  } catch (err) {
    console.warn('Web Audio playback blocked:', err);
  }
};

export default function QuizPlay({
  quiz,
  userId,
  username,
  onSaveAttempt,
  onExit,
  onOpenMemeWithScore
}: QuizPlayProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [mutedState, setMutedState] = useState(soundMuted);

  // Anti-Cheat tracking states
  const [cheatCounts, setCheatCounts] = useState(0);
  const [cheatToast, setCheatToast] = useState(false);

  // Custom multi-question answers input state
  const [textAnswerInput, setTextAnswerInput] = useState('');
  const [scaleRatingValue, setScaleRatingValue] = useState(5);
  const [rankingOptions, setRankingOptions] = useState<Option[]>([]);
  const [selectedImageOptId, setSelectedImageOptId] = useState<string | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  // Scoring & Stats
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  // Timer Setup (Seconds left)
  const [secondsLeft, setSecondsLeft] = useState(quiz.timeLimit || 60);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);

  const currentQuestion: Question = quiz.questions[currentQuestionIndex];

  // Initialize interactive elements based on current question type
  useEffect(() => {
    if (!currentQuestion) return;
    
    // Set default value for scale
    if (currentQuestion.questionType === 'scale') {
      const min = currentQuestion.scaleMin ?? 1;
      const max = currentQuestion.scaleMax ?? 10;
      setScaleRatingValue(Math.floor((min + max) / 2));
    }

    // Set initial custom ordering for ranking
    if (currentQuestion.questionType === 'ranking') {
      // Shuffled list initially to let users order them!
      const cloned = [...currentQuestion.options];
      cloned.sort(() => Math.random() - 0.5);
      setRankingOptions(cloned);
    }

    setTextAnswerInput('');
    setSelectedOptionId(null);
    setSelectedImageOptId(null);
  }, [currentQuestionIndex, currentQuestion]);

  // Synchronized refs for cheat proctor callbacks to avoid stale closures
  const currentQuestionRef = useRef(currentQuestion);
  currentQuestionRef.current = currentQuestion;

  const isAnsweredRef = useRef(isAnswered);
  isAnsweredRef.current = isAnswered;

  const handleActionTimeoutRef = useRef<() => void>();
  handleActionTimeoutRef.current = handleActionTimeout;

  const lastCheatTimeRef = useRef<number>(0);

  // Anti-Cheat switch tab check listener
  useEffect(() => {
    const handleCheatDetection = (source: 'visibility' | 'blur') => {
      if (isFinished || isAnsweredRef.current) return;

      const now = Date.now();
      // Throttling to prevent double triggering when both visibility change and blur fire
      if (now - lastCheatTimeRef.current < 2000) return;
      lastCheatTimeRef.current = now;

      setCheatCounts(prev => {
        const next = prev + 1;
        playQuizSound('cheat');
        setCheatToast(true);
        setTimeout(() => setCheatToast(false), 4000);
        return next;
      });

      // Subtraction of 15 seconds as a dynamic time penalty
      setSecondsLeft(prev => {
        const penalty = 15;
        const next = Math.max(0, prev - penalty);
        if (next === 0 && !isAnsweredRef.current) {
          handleActionTimeoutRef.current?.();
        }
        return next;
      });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        handleCheatDetection('visibility');
      }
    };

    const handleWindowBlur = () => {
      handleCheatDetection('blur');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [isFinished]);

  // Set up the countdown timer
  useEffect(() => {
    if (isFinished || isAnswered) return;

    timerRef.current = setInterval(() => {
      setTimeTaken(prev => prev + 1);
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          // Auto timeout score trigger
          handleActionTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentQuestionIndex, isFinished, isAnswered]);

  // Confetti on finished quiz
  useEffect(() => {
    if (isFinished) {
      try {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
        setTimeout(() => {
          confetti({
            particleCount: 80,
            angle: 60,
            spread: 60,
            origin: { x: 0, y: 0.8 }
          });
        }, 180);
        setTimeout(() => {
          confetti({
            particleCount: 80,
            angle: 120,
            spread: 60,
            origin: { x: 1, y: 0.8 }
          });
        }, 340);
      } catch (err) {
        console.warn('Confetti blocked or failed', err);
      }
    }
  }, [isFinished]);

  const toggleMute = () => {
    soundMuted = !soundMuted;
    setMutedState(soundMuted);
  };

  // Helper when timer goes to zero
  function handleActionTimeout() {
    setIsAnswered(true);
    playQuizSound('timeout');
    setStreak(0);

    const questionPoints = currentQuestion.points;

    // Log answer as completely missed
    const failedAns: Answer = {
      id: 'ans_' + Date.now(),
      attemptId: 'temp_attempt',
      questionId: currentQuestion.id,
      isCorrect: false,
      pointsEarned: 0,
      timeSpent: quiz.timeLimit || 60
    };

    setAnswers(prev => [...prev, failedAns]);
  }

  // Handle MCQ selection
  const handleSelectMCQ = (option: Option) => {
    if (isAnswered) return;
    setSelectedOptionId(option.id);
    setIsAnswered(true);

    const isCorrect = option.isCorrect;
    const gainedPoints = isCorrect ? currentQuestion.points : 0;

    if (isCorrect) {
      playQuizSound('correct');
      setScore(p => p + gainedPoints);
      setStreak(prev => {
        const next = prev + 1;
        if (next > maxStreak) setMaxStreak(next);
        return next;
      });
    } else {
      playQuizSound('wrong');
      setStreak(0);
    }

    const newAns: Answer = {
      id: 'ans_' + Date.now(),
      attemptId: 'temp',
      questionId: currentQuestion.id,
      selectedOptionId: option.id,
      isCorrect,
      pointsEarned: gainedPoints,
      timeSpent: quiz.timeLimit - secondsLeft
    };
    setAnswers(prev => [...prev, newAns]);
  };

  // Handle Binary Option Selection (True / False)
  const handleSelectTrueFalse = (boolVal: boolean) => {
    if (isAnswered) return;
    
    // Find options matching True / False
    const chosenOption = currentQuestion.options.find(
      opt => opt.text.trim().toLowerCase() === (boolVal ? 'true' : 'false')
    ) || currentQuestion.options.find(
      opt => opt.isCorrect === boolVal
    ) || currentQuestion.options[0];

    setSelectedOptionId(chosenOption.id);
    setIsAnswered(true);

    const isCorrect = chosenOption.isCorrect;
    const gainedPoints = isCorrect ? currentQuestion.points : 0;

    if (isCorrect) {
      playQuizSound('correct');
      setScore(p => p + gainedPoints);
      setStreak(prev => {
        const next = prev + 1;
        if (next > maxStreak) setMaxStreak(next);
        return next;
      });
    } else {
      playQuizSound('wrong');
      setStreak(0);
    }

    const newAns: Answer = {
      id: 'ans_' + Date.now(),
      attemptId: 'temp',
      questionId: currentQuestion.id,
      selectedOptionId: chosenOption.id,
      isCorrect,
      pointsEarned: gainedPoints,
      timeSpent: quiz.timeLimit - secondsLeft
    };
    setAnswers(prev => [...prev, newAns]);
  };

  // Submit Slider Rating (Scale Rating)
  const handleSubmitScaleValue = () => {
    if (isAnswered) return;
    setIsAnswered(true);

    // Finding correct scale option text to parse as target rating
    const correctOption = currentQuestion.options.find(o => o.isCorrect) || currentQuestion.options[0];
    const targetVal = Number(correctOption.text) || 5;
    const gap = Math.abs(scaleRatingValue - targetVal);
    const min = currentQuestion.scaleMin ?? 1;
    const max = currentQuestion.scaleMax ?? 10;
    const range = Math.max(1, max - min);

    // Calculation: partial credit based on closeness
    const deviationPercentage = gap / range;
    const pointsPossible = currentQuestion.points;
    const pointsEarned = Math.round(pointsPossible * Math.max(0, 1 - deviationPercentage * 1.5));
    const isCorrect = gap <= 1; // within 1 unit margin is treated as true match

    if (isCorrect) {
      playQuizSound('correct');
      setStreak(prev => {
        const next = prev + 1;
        if (next > maxStreak) setMaxStreak(next);
        return next;
      });
    } else {
      playQuizSound('wrong');
      setStreak(0);
    }

    setScore(p => p + pointsEarned);

    const newAns: Answer = {
      id: 'ans_' + Date.now(),
      attemptId: 'temp',
      questionId: currentQuestion.id,
      scaleValue: scaleRatingValue,
      isCorrect,
      pointsEarned,
      timeSpent: quiz.timeLimit - secondsLeft
    };
    setAnswers(prev => [...prev, newAns]);
  };

  // Up/down option shifting for Position ranking questions
  const shiftRankOption = (idx: number, direction: 'up' | 'down') => {
    if (isAnswered) return;
    playQuizSound('click');
    const newOpts = [...rankingOptions];
    if (direction === 'up' && idx > 0) {
      const tmp = newOpts[idx];
      newOpts[idx] = newOpts[idx - 1];
      newOpts[idx - 1] = tmp;
    } else if (direction === 'down' && idx < newOpts.length - 1) {
      const tmp = newOpts[idx];
      newOpts[idx] = newOpts[idx + 1];
      newOpts[idx + 1] = tmp;
    }
    setRankingOptions(newOpts);
  };

  const handleSubmitRankingOrder = () => {
    if (isAnswered) return;
    setIsAnswered(true);

    // Initial correct unshuffled order of options
    const correctOrdering = [...currentQuestion.options].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const userRankingIds = rankingOptions.map(o => o.id);

    let matchCount = 0;
    userRankingIds.forEach((id, index) => {
      if (correctOrdering[index] && correctOrdering[index].id === id) {
        matchCount++;
      }
    });

    // Score based on matched positions (partial credit)
    const pointsPossible = currentQuestion.points;
    const portionOfMatches = matchCount / Math.max(1, correctOrdering.length);
    const pointsEarned = Math.round(pointsPossible * portionOfMatches);
    const isPerfect = matchCount === correctOrdering.length;

    if (isPerfect) {
      playQuizSound('correct');
      setStreak(prev => {
        const next = prev + 1;
        if (next > maxStreak) setMaxStreak(next);
        return next;
      });
    } else {
      playQuizSound('wrong');
      setStreak(0);
    }

    setScore(p => p + pointsEarned);

    const newAns: Answer = {
      id: 'ans_' + Date.now(),
      attemptId: 'temp',
      questionId: currentQuestion.id,
      rankingOrder: userRankingIds,
      isCorrect: fractionToCorrect(portionOfMatches),
      pointsEarned,
      timeSpent: quiz.timeLimit - secondsLeft
    };
    setAnswers(prev => [...prev, newAns]);
  };

  const fractionToCorrect = (fraction: number): boolean => {
    return fraction >= 0.55; // counts correct if they ordered more than half slots accurately
  };

  // Submit text answer
  const handleSubmitShortAnswer = () => {
    if (isAnswered) return;
    setIsAnswered(true);

    const cleanedInput = textAnswerInput.trim();
    const keywords = currentQuestion.acceptedKeywords || currentQuestion.options.map(o => o.text);
    const isCase = currentQuestion.caseSensitive ?? false;

    // keyword check
    let hasMatch = false;
    let maxSimilarity = 0.0;

    keywords.forEach(keyword => {
      const kClean = isCase ? keyword.trim() : keyword.trim().toLowerCase();
      const uClean = isCase ? cleanedInput : cleanedInput.toLowerCase();

      if (uClean === kClean) {
        hasMatch = true;
        maxSimilarity = 1.0;
      } else if (uClean.includes(kClean) && kClean.length > 2) {
        maxSimilarity = Math.max(maxSimilarity, 0.7);
      }
    });

    const pointsPossible = currentQuestion.points;
    const similarityScore = hasMatch ? 1.0 : maxSimilarity;
    const pointsEarned = Math.round(pointsPossible * similarityScore);
    const isCorrect = pointsEarned > 0;

    if (isCorrect) {
      playQuizSound('correct');
      setStreak(prev => {
        const next = prev + 1;
        if (next > maxStreak) setMaxStreak(next);
        return next;
      });
    } else {
      playQuizSound('wrong');
      setStreak(0);
    }

    setScore(p => p + pointsEarned);

    const newAns: Answer = {
      id: 'ans_' + Date.now(),
      attemptId: 'temp',
      questionId: currentQuestion.id,
      textAnswer: textAnswerInput,
      isCorrect,
      pointsEarned,
      timeSpent: quiz.timeLimit - secondsLeft
    };
    setAnswers(prev => [...prev, newAns]);
  };

  // Submit Grid Image choice selection
  const handleSelectImageChoice = (option: Option) => {
    if (isAnswered) return;
    setSelectedImageOptId(option.id);
    setIsAnswered(true);

    const isCorrect = option.isCorrect;
    const gainedPoints = isCorrect ? currentQuestion.points : 0;

    if (isCorrect) {
      playQuizSound('correct');
      setScore(p => p + gainedPoints);
      setStreak(prev => {
        const next = prev + 1;
        if (next > maxStreak) setMaxStreak(next);
        return next;
      });
    } else {
      playQuizSound('wrong');
      setStreak(0);
    }

    const newAns: Answer = {
      id: 'ans_' + Date.now(),
      attemptId: 'temp',
      questionId: currentQuestion.id,
      selectedOptionId: option.id,
      isCorrect,
      pointsEarned: gainedPoints,
      timeSpent: quiz.timeLimit - secondsLeft
    };
    setAnswers(prev => [...prev, newAns]);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setIsAnswered(false);
      setSecondsLeft(quiz.timeLimit || 60);
    } else {
      handleFinishQuiz();
    }
  };

  const handleFinishQuiz = () => {
    setIsFinished(true);
    if (timerRef.current) clearInterval(timerRef.current);

    // Calculate accuracy percentage
    const correctCount = answers.filter(a => a.isCorrect).length;
    
    // Check if flagged as cheated (switched window or tab at least once)
    const isAntiCheatFlagged = cheatCounts > 0;

    const quizAttempt: Attempt = {
      id: 'att_' + Date.now(),
      userId,
      username,
      quizId: quiz.id,
      quizTitle: quiz.title,
      category: quiz.category,
      score,
      totalPoints,
      timeTaken: timeTaken,
      completedAt: new Date().toISOString(),
      deviceType: window.innerWidth < 640 ? 'mobile' : 'desktop',
      browser: typeof navigator !== 'undefined' ? navigator.userAgent.split(' ')[0] : 'Browser',
      ipAddress: '127.0.0.1',
      isFlagged: isAntiCheatFlagged
    };

    onSaveAttempt(quizAttempt);
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setTimeTaken(0);
    setAnswers([]);
    setSecondsLeft(quiz.timeLimit || 60);
    setIsFinished(false);
    setCheatCounts(0);
  };

  // Feedback details
  const correctCount = answers.filter(a => a.isCorrect).length;
  const accuracy = quiz.questions.length > 0 ? Math.round((correctCount / quiz.questions.length) * 100) : 0;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // High-Vibe outcome classification
  const getRecapCaption = () => {
    if (accuracy >= 100) return "👑 GIGA CHAD LEVEL (100% Correct. Absolute Arena Conqueror!)";
    if (accuracy >= 75) return "🧠 MEGA MIND BRAIN (Elite precision, no cap!)";
    if (accuracy >= 45) return "💅 LOW-KEY VIBING (A respectable pass, bestie)";
    return "💀 DOWN BAD / NO LOGIC (Study the books, this is catastrophic!)";
  };

  // Active playing rendering layout
  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-fade-in py-6">
        
        {/* Anti-cheat banner warning at end if flagged */}
        {cheatCounts > 0 && (
          <div className="p-4 rounded-xl border-3 border-rose-500 bg-rose-950 text-rose-300 flex items-center gap-3 shadow-[2px_2px_0px_0px_#000]">
            <ShieldAlert className="w-6 h-6 text-rose-450 shrink-0" />
            <div className="text-left">
              <span className="text-xs font-black uppercase tracking-wider block">🚨 CHEAT PATROL METRICS INFLICTED</span>
              <p className="text-[10px] text-rose-400">
                Logged <b>{cheatCounts} separate tab switch events</b>. This attempt has been internally flagged for review! Keep it high-key fair, bestie.
              </p>
            </div>
          </div>
        )}

        {/* Neo-brutalist score card */}
        <div className="p-8 rounded-2xl border-4 border-black bg-[#161e2e] shadow-[6px_6px_0px_0px_#000] text-center relative overflow-hidden">
          <Award className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-bounce" />
          
          <div className="flex items-center justify-center gap-2">
            <span className="px-3 py-1 text-[9px] font-mono font-black text-black bg-yellow-400 border-2 border-black rounded uppercase shadow-[1.5px_1.5px_0px_0px_#000]">
              VIBE CHECK RECAP
            </span>
            {cheatCounts > 0 ? (
              <span className="px-3 py-1 text-[9px] font-mono font-black text-white bg-rose-600 border-2 border-black rounded uppercase shadow-[1.5px_1.5px_0px_0px_#000] animate-pulse">
                🚨 CHEATED
              </span>
            ) : (
              <span className="px-3 py-1 text-[9px] font-mono font-black text-white bg-emerald-600 border-2 border-black rounded uppercase shadow-[1.5px_1.5px_0px_0px_#000]">
                🛡️ CLEAN ATTEMPT
              </span>
            )}
          </div>
          
          <h2 className="text-3xl font-black text-white mt-4 uppercase tracking-tight">RESULT LOCKED IN!</h2>
          <p className="text-sm font-black text-pink-500 mt-2 decoration-pink-500 underline decoration-wavy">
            {getRecapCaption()}
          </p>

          <p className="text-[10px] text-slate-400 font-mono mt-3">
            QUIZID: {quiz.id} • SPARKED BY: @{username}
          </p>

          {/* Gamified stats meters */}
          <div className="my-8 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-black p-4 border-2 border-slate-800 rounded-xl shadow-[3px_3px_0px_0px_#000]">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
              <span className="block text-[8px] font-mono text-slate-400 font-black uppercase">CORRECTS</span>
              <span className="text-xl font-black text-emerald-400 mt-0.5 block">{correctCount} <span className="text-[10px] text-slate-500">/{quiz.questions.length}</span></span>
            </div>
            
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
              <span className="block text-[8px] font-mono text-slate-400 font-black uppercase">XP AWARDED</span>
              <span className="text-xl font-black text-yellow-400 mt-0.5 block">+{score} <span className="text-[10px] text-slate-500">pts</span></span>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
              <span className="block text-[8px] font-mono text-slate-400 font-black uppercase">ACCURACY</span>
              <span className="text-xl font-black text-pink-500 mt-0.5 block">{accuracy}%</span>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
              <span className="block text-[8px] font-mono text-slate-400 font-black uppercase">TIME SPENT</span>
              <span className="text-xl font-black text-indigo-400 mt-0.5 block font-mono">{formatTime(timeTaken)}</span>
            </div>
          </div>

          {/* Neo-brutalist 20-Point Vibe Check Diagnostics Panel */}
          <div className="my-8 text-left border-3 border-black bg-slate-900 p-5 rounded-2xl shadow-[4px_4px_0px_0px_#000]">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🔬</span>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                20-POINT VIBE DIAGNOSTICS
              </h3>
            </div>
            <p className="text-[10px] text-slate-400 mb-4 font-semibold leading-relaxed">
              Quizora proctors assessed exactly 20 cognitive, speed, and integrity areas of your behavior. Toggle details to review:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[10px] font-mono">
              {[
                { name: "Aura Integrity", active: cheatCounts === 0, desc: "Zero cheats detected", emoji: "✨" },
                { name: "Brainrot Shield", active: accuracy >= 75, desc: "High accuracy defense", emoji: "🧠" },
                { name: "Speed Demonry", active: timeTaken < (quiz.questions.length * 15), desc: "Hyperactive flow", emoji: "⚡" },
                { name: "No-Cap Radar", active: accuracy >= 50, desc: "Truth sensor calibrated", emoji: "🔎" },
                { name: "Focus Horizon", active: cheatCounts === 0, desc: "Stayed inside tab", emoji: "🔒" },
                { name: "Hypebeast Flow", active: score > 15, desc: "High tier rewards unlocked", emoji: "🔥" },
                { name: "Locked-In Core", active: maxStreak >= 2, desc: "Sustained streak multiplier", emoji: "🎯" },
                { name: "Based Score Coeff", active: correctCount > 0, desc: "Avoided absolute goose egg", emoji: "👑" },
                { name: "Clout Quotient", active: accuracy === 100, desc: "Perfect flawless completion", emoji: "💅" },
                { name: "Absolute Rizzler", active: maxStreak >= 3, desc: "Unmatched problem solver", emoji: "👄" },
                { name: "Cheater Exposer", active: cheatCounts === 0, desc: "Honorable play certify", emoji: "🛡️" },
                { name: "Pressure Control", active: secondsLeft > 5, desc: "Composure on time limits", emoji: "⏳" },
                { name: "Spicy Logic", active: accuracy >= 40, desc: "Solid analytical output", emoji: "🧪" },
                { name: "Chaos Reflector", active: cheatCounts < 2, desc: "Avoided major penalty traps", emoji: "🌀" },
                { name: "Academic Grind", active: quiz.category.toLowerCase().includes("prep") || quiz.category.toLowerCase().includes("science"), desc: "Academic study mode", emoji: "🎓" },
                { name: "Flex Potential", active: correctCount >= Math.ceil(quiz.questions.length / 2), desc: "Carried the squad energy", emoji: "🦾" },
                { name: "Proctor Certified", active: true, desc: "Automated proctor verified", emoji: "🤖" },
                { name: "Drip Quotient", active: username.length > 5, desc: "Custom alias registered", emoji: "🕶️" },
                { name: "Simulation Master", active: timeTaken > 0, desc: "Successfully survived canvas", emoji: "🌌" },
                { name: "Slayage Certificate", active: accuracy >= 60, desc: "Approved high-tier vibe pass", emoji: "📜" }
              ].map((d, index) => (
                <div 
                  key={index} 
                  className={`p-2 rounded-lg border-2 border-black flex flex-col justify-between transition-all hover:scale-[1.02] shadow-[2px_2px_0px_0px_#000] h-[78px] ${
                    d.active 
                      ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30' 
                      : 'bg-rose-950/40 text-rose-300 border-rose-500/30'
                  }`}
                  title={d.desc}
                >
                  <div>
                    <span className="text-[7.5px] text-slate-500 font-bold block mb-0.5">AREA {index + 1}</span>
                    <div className="flex items-center gap-1 font-black text-slate-100 text-[9px] truncate">
                      <span>{d.emoji}</span>
                      <span className="truncate">{d.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-1 pt-1 border-t border-black/30">
                    <span className="text-[7.5px] text-slate-400 font-black uppercase font-mono truncate">
                      {d.active ? 'SLAYED ✓' : 'FAILED ✗'}
                    </span>
                    <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8.5px] font-black font-sans shrink-0 ${
                      d.active ? 'bg-emerald-500 text-black' : 'bg-rose-500 text-white'
                    }`}>
                      {d.active ? '✓' : '✗'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {/* Meme Board Forge */}
            <div className="p-5 rounded-xl border-3 border-black bg-[#1f2a3d] text-left flex flex-col justify-between h-full shadow-[3px_3px_0px_0px_#000]">
              <div>
                <h4 className="text-xs font-black uppercase text-yellow-400 tracking-wider flex items-center gap-1.5 font-sans">
                  🎨 Meme Scoreboard Forge
                </h4>
                <p className="text-[10px] text-slate-300 mt-1 pb-4 leading-relaxed font-semibold">
                  Synthesize an actual viral image featuring your correct streak (<b>{correctCount}/{quiz.questions.length}</b>) to mock your group chat members!
                </p>
              </div>
              <button
                onClick={() => onOpenMemeWithScore(`Scored ${correctCount}/${quiz.questions.length} on ${quiz.title}! No cap. 🔥`)}
                className="w-full neo-btn py-2.5 cursor-pointer text-xs font-black flex items-center justify-center gap-1.5 bg-yellow-400 text-black border-2 border-black"
                id="btn-meme-forge"
              >
                Assemble Meme Card 🖼️
              </button>
            </div>

            {/* Social Broadcast */}
            <div className="p-5 rounded-xl border-3 border-black bg-[#1f2a3d] text-left flex flex-col justify-between h-full shadow-[3px_3px_0px_0px_#000]">
              <div>
                <h4 className="text-xs font-black uppercase text-pink-500 tracking-wider flex items-center gap-1.5 font-sans">
                  📢 Social Broadcast Link
                </h4>
                <p className="text-[10px] text-slate-300 mt-1 leading-relaxed font-semibold">
                  Slay Twitter, Facebook, or WhatsApp with your verified assessment accuracy instantly, or trigger your system's quick share sheet!
                </p>
              </div>

              {/* Native share API if supported */}
              {typeof navigator !== 'undefined' && navigator.share && (
                <button
                  type="button"
                  onClick={async () => {
                    const text = `I got ${correctCount}/${quiz.questions.length} (${accuracy}%) on the "${quiz.title}" duels on Quizora! Low-key carrying, can you beat me? 🏆🔥`;
                    const shareUrl = `${window.location.origin}${window.location.pathname}?token=${userId}&quiz=${quiz.id}&utm_source=native_share`;
                    try {
                      await navigator.share({
                        title: `Quizora Score: ${quiz.title}`,
                        text: text,
                        url: shareUrl,
                      });
                    } catch (err) {
                      if ((err as Error).name !== 'AbortError') {
                        console.warn('System native share cancelled:', err);
                      }
                    }
                  }}
                  className="w-full mt-3 py-2 border-2 border-black bg-pink-500 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_0px_#000] cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  DEVICE SHARE (WEB API)
                </button>
              )}
              
              <div className="grid grid-cols-4 gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    const shareUrl = `${window.location.origin}${window.location.pathname}?token=${userId}&quiz=${quiz.id}&utm_source=twitter`;
                    const text = `I got ${correctCount}/${quiz.questions.length} (${accuracy}%) on the "${quiz.title}" quiz on Quizora! Beat me if your logic isn't cap 👉 ${shareUrl}`;
                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
                  }}
                  className="py-2 rounded-lg bg-black border-2 border-black hover:bg-slate-800 text-white font-black text-[9px] text-center cursor-pointer"
                  title="Share on Twitter / X"
                >
                  🐦 X-Bird
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const shareUrl = `${window.location.origin}${window.location.pathname}?token=${userId}&quiz=${quiz.id}&utm_source=facebook`;
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank', 'noopener,noreferrer');
                  }}
                  className="py-2 rounded-lg bg-blue-600 border-2 border-black hover:bg-blue-700 text-white font-black text-[9px] text-center cursor-pointer"
                  title="Share on Facebook"
                >
                  🔵 FB
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const shareUrl = `${window.location.origin}${window.location.pathname}?token=${userId}&quiz=${quiz.id}&utm_source=whatsapp`;
                    const text = `I got ${correctCount}/${quiz.questions.length} (${accuracy}%) on "${quiz.title}" on Quizora! Try to beat my score, bet: ${shareUrl}`;
                    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
                  }}
                  className="py-2 rounded-lg bg-emerald-600 border-2 border-black hover:bg-emerald-700 text-white font-black text-[9px] text-center cursor-pointer"
                  title="Share on WhatsApp"
                >
                  🟢 WA
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const shareUrl = `${window.location.origin}${window.location.pathname}?token=${userId}&quiz=${quiz.id}&utm_source=copy_link`;
                    const text = `I got ${correctCount}/${quiz.questions.length} on "${quiz.title}"! Beat my score here: ${shareUrl}`;
                    navigator.clipboard.writeText(text);
                    setCopyFeedback(true);
                    setTimeout(() => setCopyFeedback(false), 2000);
                  }}
                  className={`py-2 rounded-lg border-2 border-black font-black text-[9px] text-center cursor-pointer ${
                    copyFeedback 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-slate-800 text-slate-350 hover:bg-slate-700'
                  }`}
                  title="Copy Score Clip"
                >
                  {copyFeedback ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 border-t-2 border-black pt-5">
            <button
               onClick={handleRestart}
               className="w-full sm:w-auto px-5 py-2.5 rounded-xl border-2 border-black bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_0px_#000]"
            >
              <RotateCcw className="w-4 h-4" />
              Retake Challenge
            </button>
            <button
              onClick={onExit}
              className="w-full sm:w-auto px-6 py-3 neo-btn text-xs font-black uppercase tracking-wider cursor-pointer"
            >
              Back to Arena Lobby 🚀
            </button>
          </div>
        </div>

        {/* Question Review Sheet with Question types breakdown */}
        <div className="space-y-4">
          <h3 className="text-xs uppercase font-mono tracking-widest text-[#94a3b8] font-black pl-0.5">3. INDIVIDUAL CARD STUDY SHEET</h3>
          {quiz.questions.map((q, idx) => {
            const myAns = answers.find(a => a.questionId === q.id);
            const isCorrect = myAns?.isCorrect;

            return (
              <div 
                key={q.id}
                className={`p-5 rounded-xl border-3 border-black bg-[#161e2e] shadow-[3px_3px_0px_0px_#000] text-left ${
                  isCorrect 
                    ? 'border-emerald-500' 
                    : 'border-rose-500'
                }`}
              >
                <div className="flex items-start gap-4 justify-between border-b-2 border-black pb-3">
                  <div>
                    <span className="text-[9px] font-mono text-slate-400 font-black uppercase">
                      Quest {idx + 1} ({q.points} XP) • Type: {q.questionType.toUpperCase()}
                    </span>
                    <p className="text-sm font-black text-white mt-1 leading-relaxed">{q.text}</p>
                  </div>
                  {isCorrect ? (
                    <span className="text-emerald-400 p-2 rounded-lg bg-emerald-950 border-2 border-emerald-500 shadow-[1.5px_1.5px_0px_0px_#000]">
                      <Check className="w-4 h-4 text-[#22c55e]" />
                    </span>
                  ) : (
                    <span className="text-rose-450 p-2 rounded-lg bg-rose-950 border-2 border-rose-500 shadow-[1.5px_1.5px_0px_0px_#000]">
                      <XCircle className="w-4 h-4 text-rose-500" />
                    </span>
                  )}
                </div>

                {/* Detailed feedback message depending on type */}
                <div className="mt-3 bg-black/45 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 leading-normal">
                  {q.questionType === 'scale' && (
                    <div>
                      <span className="font-bold text-yellow-400 uppercase tracking-widest block text-[9px] font-mono mb-1">Scale Slider Result</span>
                      <p>Your rating: <span className="text-white font-extrabold">{myAns?.scaleValue ?? 'N/A'}</span>. Correct target creator value check represents <span className="text-emerald-400 font-extrabold">{q.options.find(o => o.isCorrect)?.text || '5'}</span>.</p>
                      <p className="text-[10px] text-slate-400 mt-1 italic">XP points awarded depending on the numeric closeness / absolute deviation margin.</p>
                    </div>
                  )}

                  {q.questionType === 'ranking' && (
                    <div>
                      <span className="font-bold text-pink-500 uppercase tracking-widest block text-[9px] font-mono mb-1">Ranking Layout Match</span>
                      <p>Partial credits earned based on exactly positioned choices. Perfect sequence gets full {q.points} XP.</p>
                    </div>
                  )}

                  {q.questionType === 'short_answer' && (
                    <div>
                      <span className="font-bold text-blue-400 uppercase tracking-widest block text-[9px] font-mono mb-1">Fuzzy Short Answer Check</span>
                      <p>Your answer: &quot;<span className="text-white font-black">{myAns?.textAnswer || 'None'}</span>&quot;.</p>
                      <p className="mt-1">Accepted answers: <span className="text-emerald-400 font-bold">{q.acceptedKeywords?.join(', ') || q.options.map(o => o.text).join(', ')}</span></p>
                    </div>
                  )}

                  {(q.questionType === 'mcq' || q.questionType === 'tf' || q.questionType === 'image_choice') && (
                    <div className="grid sm:grid-cols-2 gap-2 mt-1">
                      {q.options.map(option => {
                        const optionSelected = myValueSelectionCheck(option.id, myAns);
                        return (
                          <div 
                            key={option.id}
                            className={`p-2 rounded border ${
                              option.isCorrect 
                                ? 'bg-emerald-950/70 border-emerald-500 text-emerald-350' 
                                : optionSelected 
                                  ? 'bg-rose-950/70 border-rose-500 text-rose-350' 
                                  : 'bg-slate-900 border-black text-slate-450'
                            }`}
                          >
                            <span className="font-bold block">{option.text}</span>
                            {option.isCorrect && <span className="text-[8px] text-emerald-400 font-black">✓ CORRECT CHOICE</span>}
                            {optionSelected && !option.isCorrect && <span className="text-[8px] text-rose-450 font-black">⚠️ YOUR WRONG GUESS</span>}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function myValueSelectionCheck(optId: string, currentAnsObj?: Answer) {
    return currentAnsObj?.selectedOptionId === optId;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in py-4">
      
      {/* Real-time Anti-Cheat Flash banner */}
      {cheatToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 p-4 rounded-xl border-4 border-black bg-rose-600 text-white font-black uppercase text-xs flex items-center gap-3 shadow-[5px_5px_0px_0px_#000] animate-bounce">
          <ShieldAlert className="w-6 h-6 animate-pulse" />
          <div>
            <span>🚨 CHEAT DEFENSE INFLICTED!</span>
            <span className="block text-[9px] font-mono font-medium lowercase text-rose-100">Tab switch detected! -15s penalty inflicted & attempt flagged!</span>
          </div>
        </div>
      )}

      {/* Quiz Progress header with Sound Toggler */}
      <div className="p-4 sm:p-5 rounded-xl border-4 border-black bg-[#161e2e] shadow-[4px_4px_0px_0px_#000] flex items-center justify-between gap-4">
        <div className="text-left">
          <span className="text-[9px] font-mono uppercase text-[#94a3b8] tracking-widest font-black">ARENA PROCTOR ACTIVE</span>
          <h3 className="text-base font-black text-white truncate max-w-[180px] sm:max-w-xs">{quiz.title}</h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Mute Button */}
          <button
            onClick={toggleMute}
            className="p-2 border-2 border-black rounded-lg bg-slate-800 hover:bg-slate-705 text-white shadow-[1.5px_1.5px_0px_0px_#000]"
            title={mutedState ? "Unmute Sounds" : "Mute Sounds"}
          >
            {mutedState ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Countdown timer meter */}
          <div className={`px-4 py-2 border-2 border-black rounded-lg font-black text-xs tracking-widest font-mono shadow-[2px_2px_0px_0px_#000] flex items-center gap-1.5 ${
            secondsLeft <= 15 
              ? 'bg-rose-500 text-white animate-pulse'
              : 'bg-yellow-400 text-black'
          }`}>
            <Clock className={`w-4 h-4 ${secondsLeft <= 15 ? 'animate-spin' : ''}`} />
            <span>{formatTime(secondsLeft)}</span>
          </div>
        </div>
      </div>

      {/* Progress tracker */}
      <div className="space-y-1 select-none pr-1 pl-1 text-left">
        <div className="flex items-center justify-between text-[10px] font-mono font-black text-slate-400 uppercase">
          <span>Quest {currentQuestionIndex + 1} of {quiz.questions.length} ({currentQuestion.questionType.toUpperCase()})</span>
          <span className="flex items-center gap-1 text-pink-500 font-bold">
            <Flame className="w-4 h-4 fill-current text-pink-500 animate-pulse" />
            STREAK: {streak}
          </span>
        </div>
        <div className="w-full h-3 bg-slate-800 border-2 border-black rounded-full overflow-hidden shadow-[1px_1px_0px_0px_#000]">
          <div 
            className="h-full bg-pink-500 transition-all duration-150"
            style={{ width: `${((currentQuestionIndex) / quiz.questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Core Interactive Card */}
      <div className="p-6 sm:p-8 rounded-2xl border-4 border-black bg-[#161e2e] shadow-[5px_5px_0px_0px_#000] space-y-6 text-left">
        
        <div className="flex items-center justify-between gap-2 border-b-2 border-black pb-3">
          <span className="px-2.5 py-1 rounded bg-yellow-400 border-2 border-black text-black text-[9px] uppercase font-mono font-extrabold shadow-[1px_1px_0px_0px_#000]">
            GAIN VALUE: {currentQuestion.points} XP
          </span>
          <span className="text-[9px] font-mono font-black text-[#94a3b8] uppercase">Type: {currentQuestion.questionType}</span>
        </div>

        <h2 className="text-xl font-black text-white leading-snug">
          {currentQuestion.text}
        </h2>

        {/* ----------------- RENDER 6 DISTINCT QUESTION TYPES ----------------- */}

        {/* 1. Multiple Choice MCQ */}
        {currentQuestion.questionType === 'mcq' && (
          <div className="space-y-3 pt-2">
            {currentQuestion.options.map((option, oIdx) => {
              const isMySelection = selectedOptionId === option.id;
              let btnStyle = 'border-black bg-slate-800 text-slate-300 hover:bg-slate-700';

              if (isAnswered) {
                if (option.isCorrect) {
                  btnStyle = 'border-emerald-500 bg-emerald-950 text-white shadow-[2px_2px_0px_0px_#000]';
                } else if (isMySelection) {
                  btnStyle = 'border-rose-500 bg-rose-950 text-white shadow-[2px_2px_0px_0px_#000]';
                } else {
                  btnStyle = 'border-black bg-slate-900 text-slate-600 opacity-40';
                }
              }

              return (
                <button
                  key={option.id}
                  disabled={isAnswered}
                  onClick={() => handleSelectMCQ(option)}
                  className={`w-full text-left p-4 rounded-xl border-2 flex items-center justify-between gap-4 transition-all active:scale-[0.99] cursor-pointer ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black font-mono bg-slate-900 border border-slate-750 text-pink-500 px-2.5 py-0.5 rounded shadow-[1.5px_1.5px_0px_0px_#000] select-none">
                      {['A', 'B', 'C', 'D'][oIdx] || oIdx + 1}
                    </span>
                    <span className="text-xs font-bold leading-snug">{option.text}</span>
                  </div>

                  <div className="flex-shrink-0">
                    {isAnswered ? (
                      option.isCorrect ? (
                        <span className="text-emerald-400 font-extrabold text-[9px] border border-emerald-500 bg-slate-950 px-1.5 py-0.5 rounded">CORRECT Choice</span>
                      ) : isMySelection ? (
                        <span className="text-rose-450 font-extrabold text-[9px] border border-rose-500 bg-slate-950 px-1.5 py-0.5 rounded">FAIL</span>
                      ) : null
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-black bg-slate-700"></div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* 2. True / False Choice */}
        {currentQuestion.questionType === 'tf' && (
          <div className="grid grid-cols-2 gap-4 pt-2">
            {[true, false].map((val) => {
              const textWord = val ? 'True' : 'False';
              const targetOption = currentQuestion.options.find(
                o => o.text.trim().toLowerCase() === textWord.toLowerCase()
              );
              const isSelected = selectedOptionId === targetOption?.id;
              
              let btnStyle = 'border-black bg-slate-805 bg-slate-800 text-white hover:bg-slate-700';

              if (isAnswered) {
                if (targetOption?.isCorrect) {
                  btnStyle = 'border-emerald-500 bg-emerald-950 text-emerald-300';
                } else if (isSelected) {
                  btnStyle = 'border-rose-550 bg-rose-955 bg-rose-950 text-rose-300';
                } else {
                  btnStyle = 'border-black bg-slate-900 opacity-40 text-slate-500';
                }
              }

              return (
                <button
                  key={textWord}
                  disabled={isAnswered}
                  onClick={() => handleSelectTrueFalse(val)}
                  className={`p-6 rounded-2xl border-3 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] shadow-[3px_3px_0px_0px_#000] ${btnStyle}`}
                >
                  <span className="text-2xl">{val ? '🔥' : '💀'}</span>
                  <span className="text-base font-black uppercase tracking-wider">{textWord}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* 3. Scale Rating Closeness */}
        {currentQuestion.questionType === 'scale' && (
          <div className="p-4 rounded-xl border-2 border-black bg-slate-900 space-y-4 pt-2">
            <div className="flex justify-between items-center bg-black/45 p-3 rounded-lg border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 font-extrabold">CHOOSE VALUE</span>
              <span className="text-2xl font-black text-yellow-400 font-mono animate-pulse">{scaleRatingValue}</span>
            </div>

            <input
              type="range"
              min={currentQuestion.scaleMin ?? 1}
              max={currentQuestion.scaleMax ?? 10}
              step="1"
              disabled={isAnswered}
              value={scaleRatingValue}
              onChange={(e) => {
                playQuizSound('click');
                setScaleRatingValue(Number(e.target.value));
              }}
              className="w-full h-2.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-400"
            />

            <div className="flex items-center justify-between text-[10px] font-mono font-black text-slate-400 uppercase">
              <span>{currentQuestion.scaleMinLabel || `Min (${currentQuestion.scaleMin ?? 1})`}</span>
              <span>{currentQuestion.scaleMaxLabel || `Max (${currentQuestion.scaleMax ?? 10})`}</span>
            </div>

            {!isAnswered ? (
              <button
                type="button"
                onClick={handleSubmitScaleValue}
                className="w-full py-2.5 bg-yellow-405 bg-yellow-400 hover:bg-yellow-500 text-black font-black text-xs uppercase tracking-wider rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000] cursor-pointer"
              >
                Lock In Slider Value 🔒
              </button>
            ) : (
              <div className="p-3 bg-[#111827] rounded-xl border-2 border-emerald-500 text-emerald-400 text-xs font-bold flex items-center justify-between">
                <span>Value submitted successfully!</span>
                <span className="text-[10px] font-mono">Target: {currentQuestion.options.find(o => o.isCorrect)?.text || '5'}</span>
              </div>
            )}
          </div>
        )}

        {/* 4. Position Ranking order */}
        {currentQuestion.questionType === 'ranking' && (
          <div className="space-y-2.5 pt-2">
            <span className="text-[10px] font-mono text-slate-450 block uppercase mb-1">Reorder from top to bottom (Best in top slots):</span>
            
            <div className="space-y-2">
              {rankingOptions.map((opt, rIdx) => (
                <div
                  key={opt.id}
                  className="p-3 rounded-xl border-2 border-black bg-slate-800 text-white flex items-center justify-between gap-3 shadow-[1.5px_1.5px_0px_0px_#000]"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black font-mono bg-pink-500/10 border border-pink-500/30 text-pink-400 px-2 py-0.5 rounded">
                      SLOT {rIdx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-250">{opt.text}</span>
                  </div>

                  {!isAnswered && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => shiftRankOption(rIdx, 'up')}
                        disabled={rIdx === 0}
                        className="p-1 border border-slate-700 rounded bg-slate-900 hover:bg-slate-750 disabled:opacity-30 disabled:pointer-events-none"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5 text-slate-300" />
                      </button>
                      <button
                        type="button"
                        onClick={() => shiftRankOption(rIdx, 'down')}
                        disabled={rIdx === rankingOptions.length - 1}
                        className="p-1 border border-slate-700 rounded bg-slate-900 hover:bg-slate-750 disabled:opacity-30 disabled:pointer-events-none"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5 text-slate-300" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {!isAnswered ? (
              <button
                type="button"
                onClick={handleSubmitRankingOrder}
                className="w-full mt-3 py-3 bg-pink-500 hover:bg-pink-600 text-white font-extrabold tracking-widest text-xs uppercase rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000] cursor-pointer"
              >
                Lock In Rank Sequence 🔒
              </button>
            ) : (
              <div className="p-3 bg-slate-900 rounded-xl border-2 border-emerald-500 text-emerald-300 text-xs font-bold leading-relaxed">
                ✓ Series locked in! Position credit calculated.
              </div>
            )}
          </div>
        )}

        {/* 5. Short Answer Input keyword mapping */}
        {currentQuestion.questionType === 'short_answer' && (
          <div className="space-y-3 pt-2">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Type your answer below:</span>
            
            <input
              type="text"
              placeholder="e.g. keyword answer guess..."
              disabled={isAnswered}
              value={textAnswerInput}
              onChange={(e) => setTextAnswerInput(e.target.value)}
              className="w-full p-3.5 border-2 border-black rounded-xl text-xs bg-slate-800 text-white font-bold placeholder-slate-500"
            />

            {!isAnswered ? (
              <button
                type="button"
                disabled={!textAnswerInput.trim()}
                onClick={handleSubmitShortAnswer}
                className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000] cursor-pointer"
              >
                Submit Text Answer 🔒
              </button>
            ) : (
              <div className="p-3 bg-slate-900 rounded-xl border-2 border-emerald-500 text-emerald-400 text-xs font-bold">
                ✓ Word checked. Accepted targets: &quot;{currentQuestion.acceptedKeywords?.join(', ') || currentQuestion.options.map(o => o.text).join(', ')}&quot;
              </div>
            )}
          </div>
        )}

        {/* 6. Image Choice Grid */}
        {currentQuestion.questionType === 'image_choice' && (
          <div className="space-y-3 pt-2">
            <span className="text-[10px] font-mono text-slate-450 block uppercase">Pick one representing correct option:</span>

            <div className="grid grid-cols-2 gap-3.5">
              {currentQuestion.options.map((opt) => {
                const isSelected = selectedImageOptId === opt.id;
                const fallbackImg = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(opt.text)}`;
                
                let cardBorder = 'border-black bg-slate-800 hover:border-pink-500';
                if (isAnswered) {
                  if (opt.isCorrect) {
                     cardBorder = 'border-emerald-500 bg-emerald-950/40 text-emerald-350 shadow-[1px_1px_1px_1px_green]';
                  } else if (isSelected) {
                     cardBorder = 'border-rose-500 bg-rose-950/40 text-rose-350';
                  } else {
                     cardBorder = 'border-slate-800 bg-slate-900 opacity-40';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handleSelectImageChoice(opt)}
                    className={`p-3 rounded-xl border-3 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${cardBorder}`}
                  >
                    <img
                      src={opt.imageUrl || fallbackImg}
                      alt={opt.text}
                      referrerPolicy="no-referrer"
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg border border-black object-cover bg-slate-900 shadow-[1px_1px_0px_0px_#000]"
                    />
                    <span className="text-xs font-extrabold text-white text-center hyphens-auto mt-1 break-all truncate w-full px-1">{opt.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* -------------------- DANGER ALERT CLOSE EXPIRY -------------------- */}
        {secondsLeft <= 15 && !isAnswered && (
          <div className="flex items-center gap-2 p-3 rounded-lg border-2 border-rose-500 bg-rose-950 text-rose-450 text-xs font-bold leading-normal animate-pulse">
            <AlertTriangle className="w-4 h-4 text-rose-550" />
            <span>EXCELLENCE SPEEDRUN! Drop your choice before proctor expels you! 💀</span>
          </div>
        )}

        {/* Action bar and next trigger */}
        <div className="flex items-center justify-between pt-4 border-t-2 border-black select-none">
          <button
            onClick={onExit}
            className="text-xs font-black uppercase text-slate-400 hover:text-rose-500 transition-all cursor-pointer"
          >
            Abandon Duel
          </button>

          {isAnswered && (
            <button
               onClick={handleNext}
               className="py-2.5 px-5 rounded-xl border-2 border-black bg-pink-500 hover:bg-pink-600 text-black text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#000] active:translate-y-[1.5px] cursor-pointer flex items-center gap-1"
            >
              <span>{currentQuestionIndex < quiz.questions.length - 1 ? 'Next Question' : 'Seal Score! 👑'}</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
