import { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Save, 
  FileJson,
  CheckCircle2,
  ListPlus,
  Compass,
  Smile,
  Sparkles,
  BookOpen,
  Heart,
  ListOrdered,
  Sliders,
  Eye,
  Undo
} from 'lucide-react';
import { Quiz, QuizCategory, Question, Option } from '../types';

interface QuizCreateProps {
  categories: QuizCategory[];
  username: string;
  onAddQuiz: (quiz: Quiz) => void;
  onCancel: () => void;
}

interface DraftQuestion {
  id: string;
  text: string;
  questionType: 'mcq' | 'tf' | 'scale' | 'ranking' | 'short_answer' | 'image_choice';
  points: number;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    imageUrl?: string;
    order?: number;
  }[];
  scaleMin?: number;
  scaleMax?: number;
  scaleMinLabel?: string;
  scaleMaxLabel?: string;
  acceptedKeywords?: string[];
  caseSensitive?: boolean;
}

// Preset Gen Z hashtags
const GENZ_VIBE_TAGS = ['#funny', '#hard', '#chaos', '#study', '#lowkey', '#slay', '#cap', '#real'];

// High-Vibe Unsplash default images for our templates
const IMAGES_GRID = [
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=300&q=80', // Cozy Gaming
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80', // Party Music
  'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=300&q=80', // Nature hike
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=300&q=80'  // Library Study
];

export default function QuizCreate({
  categories,
  username,
  onAddQuiz,
  onCancel
}: QuizCreateProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || 'General Knowledge');
  const [timeLimit, setTimeLimit] = useState(120); // in seconds
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [vibeTags, setVibeTags] = useState<string[]>(['#chaos']);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initial core questions state
  const [questions, setQuestions] = useState<DraftQuestion[]>([
    {
      id: 'q_draft_1',
      text: '',
      questionType: 'mcq',
      points: 10,
      options: [
        { id: 'opt_draft_1_1', text: '', isCorrect: true },
        { id: 'opt_draft_1_2', text: '', isCorrect: false },
        { id: 'opt_draft_1_3', text: '', isCorrect: false },
        { id: 'opt_draft_1_4', text: '', isCorrect: false }
      ]
    }
  ]);

  const toggleVibeTag = (tag: string) => {
    if (vibeTags.includes(tag)) {
      setVibeTags(vibeTags.filter(t => t !== tag));
    } else {
      setVibeTags([...vibeTags, tag]);
    }
  };

  // Add an empty question to list based on chosen type
  const handleAddNewQuestion = (type: 'mcq' | 'tf' | 'scale' | 'ranking' | 'short_answer' | 'image_choice' = 'mcq') => {
    const qId = `q_draft_${Date.now()}_${Math.random().toString(36).substring(4, 8)}`;
    
    let initialOptions: any[] = [];
    let initialScaleMin = 1;
    let initialScaleMax = 10;
    let initialScaleMinLabel = 'Low';
    let initialScaleMaxLabel = 'High';
    let initialKeywords: string[] = [];

    if (type === 'mcq') {
      initialOptions = [
        { id: `opt_${qId}_1`, text: '', isCorrect: true },
        { id: `opt_${qId}_2`, text: '', isCorrect: false },
        { id: `opt_${qId}_3`, text: '', isCorrect: false },
        { id: `opt_${qId}_4`, text: '', isCorrect: false }
      ];
    } else if (type === 'tf') {
      initialOptions = [
        { id: `opt_${qId}_1`, text: 'True', isCorrect: true },
        { id: `opt_${qId}_2`, text: 'False', isCorrect: false }
      ];
    } else if (type === 'scale') {
      initialOptions = [
        { id: `opt_${qId}_target`, text: '8', isCorrect: true } // scale target optimal is stored as correct
      ];
    } else if (type === 'ranking') {
      initialOptions = [
        { id: `opt_${qId}_rank1`, text: 'Priority 1', isCorrect: false, order: 0 },
        { id: `opt_${qId}_rank2`, text: 'Priority 2', isCorrect: false, order: 1 },
        { id: `opt_${qId}_rank3`, text: 'Priority 3', isCorrect: false, order: 2 },
        { id: `opt_${qId}_rank4`, text: 'Priority 4', isCorrect: false, order: 3 }
      ];
    } else if (type === 'short_answer') {
      initialOptions = [];
      initialKeywords = ['friendship', 'besties'];
    } else if (type === 'image_choice') {
      initialOptions = [
        { id: `opt_${qId}_img1`, text: 'Slaying Gamer', isCorrect: true, imageUrl: IMAGES_GRID[0] },
        { id: `opt_${qId}_img2`, text: 'Club Beats', isCorrect: false, imageUrl: IMAGES_GRID[1] },
        { id: `opt_${qId}_img3`, text: 'Mountain Peak', isCorrect: false, imageUrl: IMAGES_GRID[2] },
        { id: `opt_${qId}_img4`, text: 'Smart Brains', isCorrect: false, imageUrl: IMAGES_GRID[3] }
      ];
    }

    setQuestions([
      ...questions,
      {
        id: qId,
        text: '',
        questionType: type,
        points: type === 'tf' ? 5 : 10,
        options: initialOptions,
        scaleMin: initialScaleMin,
        scaleMax: initialScaleMax,
        scaleMinLabel: initialScaleMinLabel,
        scaleMaxLabel: initialScaleMaxLabel,
        acceptedKeywords: initialKeywords,
        caseSensitive: false
      }
    ]);
  };

  const handleRemoveQuestion = (idx: number) => {
    if (questions.length <= 1) {
      setErrorMessage("Your customized quiz must contain at least 1 question block. No empty quizzes, bestie! 💀");
      return;
    }
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleQuestionTextChange = (idx: number, text: string) => {
    const next = [...questions];
    next[idx].text = text;
    setQuestions(next);
  };

  const handlePointsChange = (idx: number, pts: number) => {
    const next = [...questions];
    next[idx].points = Math.max(1, pts);
    setQuestions(next);
  };

  const handleOptionTextChange = (qIdx: number, oIdx: number, text: string) => {
    const next = [...questions];
    next[qIdx].options[oIdx].text = text;
    setQuestions(next);
  };

  const handleOptionCorrectStatusChange = (qIdx: number, oIdx: number) => {
    const next = [...questions];
    next[qIdx].options.forEach((opt, idx) => {
      opt.isCorrect = idx === oIdx;
    });
    setQuestions(next);
  };

  // Pre-load precompiled Template Packs (All 6 options)
  const handleLoadTemplatePack = (templateId: string) => {
    setErrorMessage(null);
    if (templateId === 'know_me') {
      setTitle("How Well Do You Know Me? (Ultimate Friendship Audit)");
      setDescription("A speedrun quiz designed to test if the squad represents real besties or certified caps.");
      setCategory("General Knowledge");
      setTimeLimit(120);
      setVibeTags(['#slay', '#funny', '#real']);
      setQuestions([
        {
          id: 'km_q1',
          text: "True or False: My absolute favorite comfort food is spicy hot pot.",
          questionType: 'tf',
          points: 5,
          options: [
            { id: 'km_opt1_1', text: 'True', isCorrect: true },
            { id: 'km_opt1_2', text: 'False', isCorrect: false }
          ]
        },
        {
          id: 'km_q2',
          text: "On a level of 1 to 10, how high-key introverted am I behind closed doors?",
          questionType: 'scale',
          points: 10,
          scaleMin: 1,
          scaleMax: 10,
          scaleMinLabel: "Total extroverted party animal",
          scaleMaxLabel: "Deep dark bedroom cave hermit",
          options: [
            { id: 'km_opt2_target', text: '8', isCorrect: true }
          ]
        },
        {
          id: 'km_q3',
          text: "Which streaming app do I low-key spend way too money on monthly?",
          questionType: 'mcq',
          points: 10,
          options: [
            { id: 'km_opt3_1', text: 'Prime Video', isCorrect: false },
            { id: 'km_opt3_2', text: 'Spotify Premium', isCorrect: false },
            { id: 'km_opt3_3', text: 'Crunchyroll Anime', isCorrect: true },
            { id: 'km_opt3_4', text: 'YouTube Blue ad-blockers', isCorrect: false }
          ]
        },
        {
          id: 'km_q4',
          text: "Rank my favorite daily activities from absolute god-tier to complete mid:",
          questionType: 'ranking',
          points: 10,
          options: [
            { id: 'km_opt4_1', text: 'Sleeeeeping peacefully 😴', isCorrect: false, order: 0 },
            { id: 'km_opt4_2', text: 'Playing rogue-like video games 🎮', isCorrect: false, order: 1 },
            { id: 'km_opt4_3', text: 'Coding wild dynamic react apps 💻', isCorrect: false, order: 2 },
            { id: 'km_opt4_4', text: 'Actually touching grass outside 🌿', isCorrect: false, order: 3 }
          ]
        }
      ]);
    } else if (templateId === 'compatibility') {
      setTitle("Friendship Compatibility Audit 🧬");
      setDescription("Scientific evaluation of our shared memory lane overlap and chaotic logic patterns.");
      setCategory("Science");
      setTimeLimit(120);
      setVibeTags(['#chaos', '#study', '#lowkey']);
      setQuestions([
        {
          id: 'co_q1',
          text: "True or False: We initially crossed paths during a boring academic class.",
          questionType: 'tf',
          points: 5,
          options: [
            { id: 'co_opt1_1', text: 'True', isCorrect: true },
            { id: 'co_opt1_2', text: 'False', isCorrect: false }
          ]
        },
        {
          id: 'co_q2',
          text: "Which visual aesthetic represents our chaotic weekend energy best?",
          questionType: 'image_choice',
          points: 10,
          options: [
            { id: 'co_opt2_1', text: 'Intense PC Gaming Co-op', isCorrect: true, imageUrl: IMAGES_GRID[0] },
            { id: 'co_opt2_2', text: 'Dancetracks and party noise', isCorrect: false, imageUrl: IMAGES_GRID[1] },
            { id: 'co_opt2_3', text: 'Peaceful hiking outdoors', isCorrect: false, imageUrl: IMAGES_GRID[2] },
            { id: 'co_opt2_4', text: 'Rigorous bookstore library sessions', isCorrect: false, imageUrl: IMAGES_GRID[3] }
          ]
        },
        {
          id: 'co_q3',
          text: "What is the single best word to describe our shared wavelength?",
          questionType: 'short_answer',
          points: 10,
          options: [],
          acceptedKeywords: ['chaotic', 'insane', 'besties', 'slaying', 'clowns', 'homies']
        }
      ]);
    } else if (templateId === 'personality') {
      setTitle("The Ultimate Personality Matching Matrix");
      setDescription("Assess alignment across fundamental cognitive traits, core values, and life philosophy.");
      setCategory("General Knowledge");
      setTimeLimit(180);
      setVibeTags(['#study', '#lowkey']);
      setQuestions([
        {
          id: 'per_q1',
          text: "Where do you stand on standard weekend planning logic?",
          questionType: 'scale',
          points: 10,
          scaleMin: 1,
          scaleMax: 10,
          scaleMinLabel: "Extremely structured Google Calendar sheets",
          scaleMaxLabel: "Absolute zero-plan chaotic wanderer",
          options: [
            { id: 'per_opt1_target', text: '5', isCorrect: true }
          ]
        },
        {
          id: 'per_q2',
          text: "Which of these traits gets priority when evaluating a potential teammate?",
          questionType: 'mcq',
          points: 10,
          options: [
            { id: 'per_opt2_1', text: 'Unflinching loyalty under pressure', isCorrect: true },
            { id: 'per_opt2_2', text: 'High theoretical intelligence IQ', isCorrect: false },
            { id: 'per_opt2_3', text: 'Uncapped financial success', isCorrect: false },
            { id: 'per_opt2_4', text: 'Consistent witty sarcasm', isCorrect: false }
          ]
        }
      ]);
    } else if (templateId === 'couple') {
      setTitle("Couple Resonance Alignment Duel");
      setDescription("Evaluate compatibility benchmarks across romantic preferences, future targets, and relationship logic.");
      setCategory("General Knowledge");
      setTimeLimit(120);
      setVibeTags(['#slay', '#real']);
      setQuestions([
        {
          id: 'cp_q1',
          text: "True or False: I would choose a peaceful forest stargazing cabin over a high-tier five-star city resort.",
          questionType: 'tf',
          points: 5,
          options: [
            { id: 'cp_opt1_1', text: 'True', isCorrect: true },
            { id: 'cp_opt1_2', text: 'False', isCorrect: false }
          ]
        },
        {
          id: 'cp_q2',
          text: "Rate how sensitive I get during competitive board game defeats on a scale of 1-10:",
          questionType: 'scale',
          points: 10,
          scaleMin: 1,
          scaleMax: 10,
          scaleMinLabel: "Completely calm, high-vibe sportsman",
          scaleMaxLabel: "Ready to flip the board and file charges",
          options: [
            { id: 'cp_opt2_target', text: '9', isCorrect: true }
          ]
        }
      ]);
    } else if (templateId === 'group') {
      setTitle("Group Trivia Arena Challenge");
      setDescription("A multiplayer-ready general assembly challenge spanning cs, logic, and trivia levels.");
      setCategory("Cpu");
      setTimeLimit(120);
      setVibeTags(['#funny', '#chaos']);
      setQuestions([
        {
          id: 'grp_q1',
          text: "Which standard data structure uses First-In-First-Out FIFO access pattern?",
          questionType: 'mcq',
          points: 10,
          options: [
            { id: 'grp_opt1_1', text: 'Stack LIFO structure', isCorrect: false },
            { id: 'grp_opt1_2', text: 'Dynamic Queue FIFO [Correct]', isCorrect: true },
            { id: 'grp_opt1_3', text: 'Inverted Binary Tree link', isCorrect: false },
            { id: 'grp_opt1_4', text: 'Static Memory Buffer array', isCorrect: false }
          ]
        }
      ]);
    } else {
      // custom clear quiz
      setTitle('');
      setDescription('');
      setQuestions([
        {
          id: 'q_draft_custom',
          text: '',
          questionType: 'mcq',
          points: 10,
          options: [
            { id: 'opt_draft_c1', text: '', isCorrect: true },
            { id: 'opt_draft_c2', text: '', isCorrect: false },
            { id: 'opt_draft_c3', text: '', isCorrect: false },
            { id: 'opt_draft_c4', text: '', isCorrect: false }
          ]
        }
      ]);
    }
  };

  // Build and submit the quizora structure
  const handleSubmitQuiz = () => {
    setErrorMessage(null);

    if (!title.trim()) {
      setErrorMessage("Please enter an awesome Quiz Title first, bestie. ✨");
      return;
    }

    // Validate each drafted question node
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim()) {
        setErrorMessage(`Question ${i + 1} has dry, empty formulation text.`);
        return;
      }

      if (q.questionType === 'mcq') {
        const emptyOpts = q.options.filter(o => !o.text.trim());
        if (emptyOpts.length > 0) {
          setErrorMessage(`Question ${i + 1} has empty choices. Please fill out option text.`);
          return;
        }
        const correctCount = q.options.filter(o => o.isCorrect).length;
        if (correctCount !== 1) {
          setErrorMessage(`Question ${i + 1} (MCQ) must mark exactly 1 correct key.`);
          return;
        }
      } else if (q.questionType === 'tf') {
        const correctCount = q.options.filter(o => o.isCorrect).length;
        if (correctCount !== 1) {
          setErrorMessage(`Question ${i + 1} (T/F) must specify whether True or False is the answer.`);
          return;
        }
      } else if (q.questionType === 'scale') {
        const targetValVal = Number(q.options[0]?.text);
        if (isNaN(targetValVal)) {
          setErrorMessage(`Question ${i + 1} (Scale) target optimal answer must be a valid number.`);
          return;
        }
      } else if (q.questionType === 'ranking') {
        const emptyOpts = q.options.filter(o => !o.text.trim());
        if (emptyOpts.length > 0) {
          setErrorMessage(`Question ${i + 1} (Ranking) requires writing label text for all sequence slots.`);
          return;
        }
      } else if (q.questionType === 'short_answer') {
        if (!q.acceptedKeywords || q.acceptedKeywords.length === 0) {
          setErrorMessage(`Question ${i + 1} (Short Answer) requires at least 1 keyword for automated matching.`);
          return;
        }
      } else if (q.questionType === 'image_choice') {
        const emptyOpts = q.options.filter(o => !o.text.trim());
        if (emptyOpts.length > 0) {
          setErrorMessage(`Question ${i + 1} (Image Grid) has options with empty title label text.`);
          return;
        }
        const correctCount = q.options.filter(o => o.isCorrect).length;
        if (correctCount !== 1) {
          setErrorMessage(`Question ${i + 1} (Image Grid) must have exactly 1 option marked correct.`);
          return;
        }
      }
    }

    const generatedQuizId = 'quiz_user_' + Date.now();
    
    // Core compilation
    const formattedQuestions: Question[] = questions.map((q, idx) => {
      const dbQId = `q_user_${generatedQuizId}_${idx}_${Math.random().toString(36).substring(4, 7)}`;
      return {
        id: dbQId,
        quizId: generatedQuizId,
        text: q.text,
        questionType: q.questionType,
        points: q.points,
        order: idx,
        isRequired: true,
        scaleMin: q.scaleMin,
        scaleMax: q.scaleMax,
        scaleMinLabel: q.scaleMinLabel,
        scaleMaxLabel: q.scaleMaxLabel,
        acceptedKeywords: q.acceptedKeywords,
        caseSensitive: q.caseSensitive,
        options: q.options.map((opt, oidx) => ({
          id: `opt_user_${dbQId}_${oidx}`,
          questionId: dbQId,
          text: opt.text,
          isCorrect: opt.isCorrect,
          imageUrl: opt.imageUrl,
          order: oidx
        }))
      };
    });

    const newQuiz: Quiz = {
      id: generatedQuizId,
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      timeLimit,
      createdBy: username,
      isPublic: true,
      createdAt: new Date().toISOString(),
      questions: formattedQuestions,
      vibeTags,
      difficulty,
      allowComments: true,
      showCorrectAnswers: true,
      totalAttempts: 0,
      averageScore: 0,
      completionRate: 100
    };

    onAddQuiz(newQuiz);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-fade-in py-4 text-left">
      {/* Creation Headers */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border-4 border-black bg-[#161e2e] shadow-[4px_4px_0px_0px_#000]">
        <div>
          <span className="px-2.5 py-1 text-[9px] font-mono text-black bg-pink-500 border-2 border-black rounded uppercase font-black shadow-[1px_1px_0px_0px_#000]">
            VIBE CREATION ARENA
          </span>
          <h1 className="text-2xl font-black text-white mt-2">DRAFT MATCHUP ENGINE</h1>
          <p className="text-xs text-slate-300">Formulate customizable quizzes covering six question types or deploy a pre-built template!</p>
        </div>

        <button
          onClick={onCancel}
          className="text-xs font-black uppercase tracking-wider text-slate-300 hover:text-black hover:bg-yellow-400 border-2 border-black px-4 py-2 rounded-xl cursor-pointer bg-slate-800 transition-all shadow-[2px_2px_0px_0px_#000]"
        >
          Cancel Draft
        </button>
      </div>

      {/* Preset Prebuilt Template Selection (6 Varieties) */}
      <div className="p-5 rounded-2xl border-4 border-black bg-[#1f2a3d] space-y-3.5 shadow-[4px_4px_0px_0px_#000]">
        <h3 className="text-xs font-mono font-black text-yellow-400 uppercase tracking-widest flex items-center gap-1.5 pl-0.5">
          <Sparkles className="w-4 h-4" /> LOAD PREBUILT TEMPLATE PACK (AUTOPREFILL)
        </h3>
        <p className="text-[10px] text-slate-300 pl-0.5 font-medium">Select a dynamic prebuilt skeleton configuration containing True/False, Slider Scales, Rankings, MCQs, or short text inputs automatically!</p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { id: 'know_me', label: "How Well Know Me?", icon: Smile, color: 'bg-emerald-500 text-white' },
            { id: 'compatibility', label: "Friendship Compatibility", icon: Sparkles, color: 'bg-pink-500 text-white' },
            { id: 'personality', label: "Personality Match", icon: Sliders, color: 'bg-purple-600 text-white' },
            { id: 'couple', label: "Couple Quiz", icon: Heart, color: 'bg-red-500 text-white' },
            { id: 'group', label: "Group Challenge", icon: Compass, color: 'bg-sky-500 text-white' },
            { id: 'custom', label: "Custom (Reset Empty)", icon: Undo, color: 'bg-slate-700 text-slate-300' }
          ].map((pack) => {
            const P_Icon = pack.icon;
            return (
              <button
                key={pack.id}
                type="button"
                onClick={() => handleLoadTemplatePack(pack.id)}
                className="p-2.5 rounded-lg border-2 border-black bg-slate-800 hover:bg-slate-750 text-[10.5px] font-black text-left flex items-center gap-2 cursor-pointer transition-colors shadow-[1.5px_1.5px_0px_0px_#000] text-slate-200"
              >
                <div className={`p-1.5 rounded border border-black ${pack.color}`}>
                  <P_Icon className="w-3.5 h-3.5 shrink-0" />
                </div>
                <span className="truncate">{pack.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl border-2 border-rose-500 bg-rose-950 text-rose-300 text-xs font-bold leading-normal text-left">
          ⚠️ {errorMessage}
        </div>
      )}

      {/* Param Configuration Fields */}
      <div className="p-6 rounded-2xl border-4 border-black bg-[#161e2e] space-y-4 shadow-[4px_4px_0px_0px_#000]">
        <h3 className="text-xs uppercase font-mono tracking-widest text-[#94a3b8] font-black pl-0.5">1. SETUP COMBAT SPECIFICATION</h3>
        
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 space-y-1">
            <label className="block text-[11px] font-extrabold text-white">Quiz Title</label>
            <div className="relative border-2 border-black rounded-lg overflow-hidden">
              <Compass className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. Einstein Physics Duels / Low-key CS challenge"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs font-bold bg-white text-black"
                id="creation-title-input"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-extrabold text-white">Subject Channel</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-black bg-slate-800 text-xs font-bold text-white focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name} className="bg-slate-900">
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-extrabold text-white">Brief Vibe Description</label>
          <input
            type="text"
            placeholder="Introduce the quiz focus..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border-2 border-black text-xs font-bold bg-white text-black"
          />
        </div>

        {/* Vibe Tags selector */}
        <div className="space-y-1.5 pt-1 text-left">
          <label className="block text-[11px] font-extrabold text-white flex items-center gap-1.5 pl-0.5">
            <Smile className="w-3.5 h-3.5 text-yellow-500" />
            Vibe Hashtags (Tap to toggle)
          </label>
          <div className="flex flex-wrap gap-1.5">
            {GENZ_VIBE_TAGS.map((tag) => {
              const active = vibeTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleVibeTag(tag)}
                  className={`px-3 py-1.5 border-2 border-black rounded-xl text-xs font-mono font-black transition-all cursor-pointer shadow-[1.5px_1.5px_0px_0px_#000] active:translate-y-[1px] ${
                    active ? 'bg-yellow-400 text-black' : 'bg-slate-800 text-slate-350 hover:bg-slate-700'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 pt-1">
          <div className="space-y-1">
            <label className="block text-[11px] font-extrabold text-white">Timer Allotment Limit</label>
            <select
              value={timeLimit}
              onChange={(e) => setTimeLimit(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-lg border-2 border-black bg-slate-800 text-xs font-bold text-white focus:outline-none"
            >
              <option value="30">30 Seconds (Absolute Speedrun! 💀)</option>
              <option value="60">60 Seconds (1 Minute Blitz)</option>
              <option value="120">120 Seconds (2 Minutes Standard)</option>
              <option value="180">180 Seconds (3 Minutes Relaxed)</option>
              <option value="300">300 Seconds (5 Minutes Cozy)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-extrabold text-white">Target Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="w-full px-4 py-3 rounded-lg border-2 border-black bg-slate-800 text-xs font-bold text-white focus:outline-none"
            >
              <option value="easy">Easy (Friendly Vibes)</option>
              <option value="medium">Medium (Standard Logic)</option>
              <option value="hard">Hard (Certified Sweat 💀)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-extrabold text-white font-mono text-slate-300">Author Credit Signature</label>
            <input
              type="text"
              disabled
              value={`Authenticated (@${username})`}
              className="w-full px-4 py-3 rounded-lg border-2 border-slate-800 bg-slate-900 text-slate-400 text-xs font-mono font-black"
            />
          </div>
        </div>
      </div>

      {/* Core Question Stack */}
      <div className="space-y-4 text-left">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs uppercase font-mono tracking-widest text-slate-400 font-black">2. WRITE THE QUEST-CARDS</h3>
          <span className="text-xs font-mono text-slate-400 font-bold">{questions.length} cards in stack</span>
        </div>

        {questions.map((q, qIdx) => (
          <div 
            key={q.id}
            className="p-5 sm:p-6 rounded-2xl border-4 border-black bg-[#161e2e] space-y-4 shadow-[4px_4px_0px_0px_#000] relative"
            id={`question-form-block-${qIdx}`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-black pb-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-pink-500 font-mono uppercase">QUEST CARD #{qIdx + 1}</span>
                <select
                  value={q.questionType}
                  onChange={(e) => {
                    const type = e.target.value as any;
                    const next = [...questions];
                    next[qIdx].questionType = type;
                    
                    // reset options based on type
                    let initOpts: any[] = [];
                    if (type === 'mcq') {
                      initOpts = [
                        { id: `opt_${q.id}_1`, text: '', isCorrect: true },
                        { id: `opt_${q.id}_2`, text: '', isCorrect: false },
                        { id: `opt_${q.id}_3`, text: '', isCorrect: false },
                        { id: `opt_${q.id}_4`, text: '', isCorrect: false }
                      ];
                    } else if (type === 'tf') {
                      initOpts = [
                        { id: `opt_${q.id}_1`, text: 'True', isCorrect: true },
                        { id: `opt_${q.id}_2`, text: 'False', isCorrect: false }
                      ];
                    } else if (type === 'scale') {
                      initOpts = [
                        { id: `opt_${q.id}_target`, text: '8', isCorrect: true }
                      ];
                      next[qIdx].scaleMin = 1;
                      next[qIdx].scaleMax = 10;
                      next[qIdx].scaleMinLabel = 'Low';
                      next[qIdx].scaleMaxLabel = 'High';
                    } else if (type === 'ranking') {
                      initOpts = [
                        { id: `opt_${q.id}_r1`, text: 'Choice 1', isCorrect: false, order: 0 },
                        { id: `opt_${q.id}_r2`, text: 'Choice 2', isCorrect: false, order: 1 },
                        { id: `opt_${q.id}_r3`, text: 'Choice 3', isCorrect: false, order: 2 },
                        { id: `opt_${q.id}_r4`, text: 'Choice 4', isCorrect: false, order: 3 }
                      ];
                    } else if (type === 'short_answer') {
                      initOpts = [];
                      next[qIdx].acceptedKeywords = ['answer'];
                    } else if (type === 'image_choice') {
                      initOpts = [
                        { id: `opt_${q.id}_i1`, text: 'Cozy Gaming', isCorrect: true, imageUrl: IMAGES_GRID[0] },
                        { id: `opt_${q.id}_i2`, text: 'Disco Beats', isCorrect: false, imageUrl: IMAGES_GRID[1] },
                        { id: `opt_${q.id}_i3`, text: 'Climbing Peak', isCorrect: false, imageUrl: IMAGES_GRID[2] },
                        { id: `opt_${q.id}_i4`, text: 'Studying Library', isCorrect: false, imageUrl: IMAGES_GRID[3] }
                      ];
                    }
                    next[qIdx].options = initOpts;
                    setQuestions(next);
                  }}
                  className="px-2 py-1 rounded bg-slate-800 text-pink-400 text-xs border border-slate-700 font-extrabold focus:outline-none"
                >
                  <option value="mcq">Multiple Choice MCQ</option>
                  <option value="tf">True / False</option>
                  <option value="scale">Scale Rating Slider</option>
                  <option value="ranking">Reordering Sequence</option>
                  <option value="short_answer">Fuzzy Short Text Answer</option>
                  <option value="image_choice">Image Grid Selection</option>
                </select>
              </div>
              
              <div className="flex items-center gap-3 justify-end">
                {/* Weight points */}
                <span className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">XP weight</span>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={q.points}
                    onChange={(e) => handlePointsChange(qIdx, Number(e.target.value))}
                    className="w-12 text-center p-1 rounded border-2 border-black bg-slate-800 text-xs font-mono font-black text-white"
                  />
                </span>

                <button
                  type="button"
                  onClick={() => handleRemoveQuestion(qIdx)}
                  className="p-1.5 text-rose-500 border-2 border-black bg-slate-800 hover:bg-rose-600 hover:text-black rounded-lg transition-all cursor-pointer shadow-[1px_1px_0px_0px_#000]"
                  title="Remove Quest"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Question Text */}
            <div className="space-y-1">
              <label className="block text-[11px] font-extrabold text-white">Quest Prompt Text</label>
              <textarea
                placeholder="Write original question clearly, keep it fun and spicy..."
                rows={2}
                value={q.text}
                onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-xs font-semibold focus:outline-none bg-white text-black resize-none"
              />
            </div>

            {/* -------------------- DYNAMIC OPTIONS BUILDER DEPENDING ON QUESTION TYPE -------------------- */}

            {/* 1. MCQ Builder */}
            {q.questionType === 'mcq' && (
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono font-black pl-0.5 uppercase">
                  <span>Configure 4 Options</span>
                  <span className="text-[9px] text-[#22c55e] flex items-center gap-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 fill-current" /> SELECT CORRECT KEY KEYChoice
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {q.options.map((opt, oIdx) => (
                    <div 
                      key={opt.id}
                      className={`p-3 rounded-xl border-2 border-black flex items-center justify-between gap-3 transition-colors ${
                        opt.isCorrect 
                          ? 'bg-emerald-950 border-emerald-500 text-white shadow-[1px_1px_0px_0px_#000]' 
                          : 'bg-slate-800 border-black text-slate-300'
                      }`}
                    >
                      <span className="text-xs font-black font-mono text-yellow-400 bg-slate-900 px-1.5 py-1 rounded border border-black select-none">
                        {['A', 'B', 'C', 'D'][oIdx]}
                      </span>
                      <input
                        type="text"
                        placeholder={`Choice option ${['A', 'B', 'C', 'D'][oIdx]} text`}
                        value={opt.text}
                        onChange={(e) => handleOptionTextChange(qIdx, oIdx, e.target.value)}
                        className="flex-1 bg-transparent border-none text-xs text-slate-100 font-bold focus:outline-none placeholder-slate-500"
                      />

                      <input
                        type="radio"
                        name={`q_${q.id}_correct`}
                        checked={opt.isCorrect}
                        onChange={() => handleOptionCorrectStatusChange(qIdx, oIdx)}
                        className="w-4 h-4 accent-emerald-500 cursor-pointer flex-shrink-0"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. True / False Builder */}
            {q.questionType === 'tf' && (
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono font-black pl-0.5 uppercase">
                  <span>True / False Choice Toggle</span>
                  <span className="text-[9px] text-[#22c55e]">SELECT CORRECT VALUE</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {q.options.map((opt, oIdx) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleOptionCorrectStatusChange(qIdx, oIdx)}
                      className={`p-4 border-2 rounded-xl text-xs font-black font-mono transition-all shadow-[1.5px_1.5px_0px_0px_#000] flex items-center justify-between ${
                        opt.isCorrect 
                          ? 'bg-emerald-950 border-emerald-500 text-emerald-350' 
                          : 'bg-slate-800 border-black text-slate-400'
                      }`}
                    >
                      <span>{opt.text}</span>
                      <div className={`w-3.5 h-3.5 rounded-full border-2 ${opt.isCorrect ? 'bg-emerald-500 border-emerald-300' : 'bg-transparent border-slate-600'}`}></div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Scale Rating Builder */}
            {q.questionType === 'scale' && (
              <div className="space-y-3 p-4 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-mono uppercase font-black block mb-2">Scale Sliders Setup (1-10 Slider bounds)</span>
                
                <div className="grid sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-300 block">Left Side Label (Min value)</span>
                    <input
                      type="text"
                      placeholder="e.g. Introverted / Low key"
                      value={q.scaleMinLabel}
                      onChange={(e) => {
                        const next = [...questions];
                        next[qIdx].scaleMinLabel = e.target.value;
                        setQuestions(next);
                      }}
                      className="w-full p-2 text-xs font-bold rounded border bg-slate-800 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-300 block">Right Side Label (Max value)</span>
                    <input
                      type="text"
                      placeholder="e.g. Extroverted / Absolute peak"
                      value={q.scaleMaxLabel}
                      onChange={(e) => {
                        const next = [...questions];
                        next[qIdx].scaleMaxLabel = e.target.value;
                        setQuestions(next);
                      }}
                      className="w-full p-2 text-xs font-bold rounded border bg-slate-800 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1 pt-2">
                  <span className="text-[10px] font-bold text-pink-400 block">Set Creator Correct Target Rating (Value Slider check): <b className="text-white font-mono">{q.options[0]?.text || '5'}</b></span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={q.options[0]?.text || '5'}
                    onChange={(e) => handleOptionTextChange(qIdx, 0, e.target.value)}
                    className="w-full h-2 rounded bg-slate-700 accent-pink-500 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* 4. Position Ranking Builder */}
            {q.questionType === 'ranking' && (
              <div className="space-y-2.5 p-4 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-mono uppercase block mb-1">Position Ordering Setup (Input correct sequence from Top to Bottom)</span>
                
                <div className="space-y-2">
                  {q.options.map((opt, oIdx) => (
                    <div key={opt.id} className="flex items-center gap-3">
                      <span className="text-[10.5px] font-mono text-slate-450 bg-slate-800 p-2.5 rounded border border-slate-700 shrink-0 font-bold select-none w-16 text-center">
                        Slot {oIdx + 1}
                      </span>
                      <input
                        type="text"
                        placeholder={`Pre-sorted item label for sequence ${oIdx + 1}`}
                        value={opt.text}
                        onChange={(e) => handleOptionTextChange(qIdx, oIdx, e.target.value)}
                        className="flex-1 p-2 text-xs font-bold rounded bg-slate-850 bg-slate-800 text-white border border-black focus:outline-none focus:border-pink-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Short Answer Keywords Builder */}
            {q.questionType === 'short_answer' && (
              <div className="space-y-2.5 p-4 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-mono uppercase block mb-1">Config Keyword answers</span>
                
                <p className="text-[10px] text-slate-350 leading-relaxed italic">Provide automated keywords that representing appropriate valid user predictions (comma separated):</p>
                
                <div className="space-y-2.5">
                  <input
                    type="text"
                    placeholder="e.g. dog, cat, retriever, golden husky"
                    value={q.acceptedKeywords?.join(', ') || ''}
                    onChange={(e) => {
                      const next = [...questions];
                      next[qIdx].acceptedKeywords = e.target.value.split(',').map(s => s.trim()).filter(s => s.length > 0);
                      setQuestions(next);
                    }}
                    className="w-full p-2.5 text-xs font-bold rounded bg-slate-850 bg-slate-800 border border-black text-white"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      const next = [...questions];
                      next[qIdx].caseSensitive = !next[qIdx].caseSensitive;
                      setQuestions(next);
                    }}
                    className={`px-3 py-1.5 border border-black rounded font-mono text-[9px] font-black transition-colors ${
                      q.caseSensitive ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {q.caseSensitive ? 'CASE SENSITIVE ACTIVE' : 'CASE INSENSITIVE MATCH (DEFAULT)'}
                  </button>
                </div>
              </div>
            )}

            {/* 6. Image Choices Grid Builder */}
            {q.questionType === 'image_choice' && (
              <div className="space-y-3.5">
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono font-black pl-0.5 uppercase">
                  <span>Configure 4 Options with Image URLs</span>
                  <span className="text-[9px] text-[#22c55e]">SELECT CORRECT KEY</span>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {q.options.map((opt, oIdx) => (
                    <div 
                      key={opt.id}
                      className={`p-3 rounded-xl border-2 flex flex-col gap-2 ${opt.isCorrect ? 'bg-emerald-950 border-emerald-500' : 'bg-slate-800 border-black'}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-mono font-black text-pink-400">IMAGE SLOT #{oIdx + 1}</span>
                        <input
                          type="radio"
                          name={`q_${q.id}_correct_img`}
                          checked={opt.isCorrect}
                          onChange={() => handleOptionCorrectStatusChange(qIdx, oIdx)}
                          className="w-4 h-4 accent-emerald-500 cursor-pointer"
                        />
                      </div>

                      {/* Image text label */}
                      <input
                        type="text"
                        placeholder="Option label text..."
                        value={opt.text}
                        onChange={(e) => handleOptionTextChange(qIdx, oIdx, e.target.value)}
                        className="w-full p-2 rounded bg-slate-900 border border-slate-700 font-bold text-xs text-white"
                      />

                      {/* Image URL text */}
                      <input
                        type="text"
                        placeholder="Image URL..."
                        value={opt.imageUrl || ''}
                        onChange={(e) => {
                          const next = [...questions];
                          next[qIdx].options[oIdx].imageUrl = e.target.value;
                          setQuestions(next);
                        }}
                        className="w-full p-2 rounded bg-slate-900 border border-slate-700 font-mono text-[9px] text-slate-300"
                      />

                      {opt.imageUrl && (
                        <img
                          src={opt.imageUrl}
                          alt="preview"
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 rounded border border-black bg-black object-cover mt-1"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        ))}

        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#1d2a3d] p-4 rounded-xl border-3 border-black shadow-[2.5px_2.5px_0px_0px_#000]">
          <span className="text-xs font-mono font-black text-white shrink-0 uppercase">Append card choice type:</span>
          <div className="flex flex-wrap gap-1.5 justify-end">
            {[
              { type: 'mcq', label: "+ MCQ", color: 'bg-indigo-600 hover:bg-indigo-500 text-white' },
              { type: 'tf', label: "+ True/False", color: 'bg-emerald-600 hover:bg-emerald-500 text-white' },
              { type: 'scale', label: "+ Slider scale", color: 'bg-yellow-405 bg-yellow-500 hover:bg-yellow-600 text-black' },
              { type: 'ranking', label: "+ Reordering", color: 'bg-pink-500 hover:bg-pink-600 text-white' },
              { type: 'short_answer', label: "+ Short Answer", color: 'bg-cyan-500 hover:bg-cyan-600 text-white' },
              { type: 'image_choice', label: "+ Image Choice", color: 'bg-purple-600 hover:bg-purple-500 text-white' }
            ].map((adder) => (
              <button
                key={adder.type}
                type="button"
                onClick={() => handleAddNewQuestion(adder.type as any)}
                className={`px-3 py-1.5 border-2 border-black font-black text-[10px] rounded-lg tracking-wider uppercase shadow-[1.5px_1.5px_0px_0px_#000] cursor-pointer transition-transform active:scale-95 ${adder.color}`}
              >
                {adder.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Conclude Draft Action buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t-2 border-black">
        <button
          onClick={() => {
            const draftQuiz = {
              title: title || 'Draft Quiz Slay',
              description,
              category,
              timeLimit,
              difficulty,
              createdBy: username,
              questions: questions,
              vibeTags
            };
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(draftQuiz, null, 2));
            const dl = document.createElement('a');
            dl.setAttribute("href", dataStr);
            dl.setAttribute("download", "quizora-ind-draft.json");
            document.body.appendChild(dl);
            dl.click();
            dl.remove();
          }}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border-2 border-black bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-extrabold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_0px_#000]"
        >
          <FileJson className="w-4 h-4 text-yellow-400" />
          Export Live Config JSON
        </button>

        <button
          onClick={handleSubmitQuiz}
          className="w-full sm:w-auto px-6 py-3 neo-btn text-xs font-black cursor-pointer flex items-center justify-center gap-1.5"
          id="btn-publish-challenge"
        >
          <Plus className="w-4 h-4 text-black font-black" />
          Publish Challenge Live! 🔥
        </button>
      </div>

    </div>
  );
}
