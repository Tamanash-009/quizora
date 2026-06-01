import { Quiz, QuizCategory, Attempt } from './types';

export const INITIAL_CATEGORIES: QuizCategory[] = [
  {
    id: 'gk',
    name: 'General Knowledge',
    icon: 'Globe',
    description: 'Explore history, geography, space, and world occurrences.',
    color: 'from-blue-500/20 to-cyan-500/20 text-cyan-400 border-cyan-500/30'
  },
  {
    id: 'neet-jee',
    name: 'NEET/JEE Prep',
    icon: 'GraduationCap',
    description: 'Rigorous physics, chemistry, and biology sample MCQs for engineering & medical entrance exams.',
    color: 'from-purple-500/20 to-pink-500/20 text-pink-400 border-pink-500/30'
  },
  {
    id: 'science',
    name: 'Science',
    icon: 'Atom',
    description: 'Unlock mysteries of nature, cosmos, quantum physics, and biology.',
    color: 'from-emerald-500/20 to-teal-500/20 text-teal-400 border-teal-500/30'
  },
  {
    id: 'cs',
    name: 'Computer Science',
    icon: 'Cpu',
    description: 'Tackle core algorithms, data structures, web tech, and databases.',
    color: 'from-amber-500/20 to-orange-500/20 text-orange-400 border-orange-500/30'
  },
  {
    id: 'ai-ml',
    name: 'AI/ML Essentials',
    icon: 'BrainCircuit',
    description: 'Test your grasp of transformers, gradient descent, deep learning, and agents.',
    color: 'from-rose-500/20 to-indigo-500/20 text-rose-400 border-rose-500/30'
  }
];

export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'jee-physics-1',
    title: 'JEE Physics - Mechanics & Electrostatics',
    category: 'NEET/JEE Prep',
    timeLimit: 120, // 2 minutes
    createdBy: 'System (Academic Team)',
    isPublic: true,
    difficulty: 'hard',
    createdAt: '2026-05-20T10:00:00Z',
    questions: [
      {
        id: 'jp1_q1',
        quizId: 'jee-physics-1',
        text: 'A point charge q is placed at a distance d from an infinite conducting grounded plate. What is the attractive force on the charge due to the induced charges?',
        questionType: 'mcq',
        points: 4,
        options: [
          { id: 'jp1_q1_o1', questionId: 'jp1_q1', text: 'q² / (4π ε₀ d²)', isCorrect: false },
          { id: 'jp1_q1_o2', questionId: 'jp1_q1', text: 'q² / (16π ε₀ d²)', isCorrect: true },
          { id: 'jp1_q1_o3', questionId: 'jp1_q1', text: 'q² / (8π ε₀ d²)', isCorrect: false },
          { id: 'jp1_q1_o4', questionId: 'jp1_q1', text: 'Zero, because the plate is grounded.', isCorrect: false }
        ]
      },
      {
        id: 'jp1_q2',
        quizId: 'jee-physics-1',
        text: 'A block of mass m is placed on a smooth wedge of inclination θ which is placed inside an elevator accelerating upwards with an acceleration a. The acceleration of the block relative to the wedge is:',
        questionType: 'mcq',
        points: 4,
        options: [
          { id: 'jp1_q2_o1', questionId: 'jp1_q2', text: 'g sin(θ)', isCorrect: false },
          { id: 'jp1_q2_o2', questionId: 'jp1_q2', text: '(g + a) sin(θ)', isCorrect: true },
          { id: 'jp1_q2_o3', questionId: 'jp1_q2', text: '(g - a) sin(θ)', isCorrect: false },
          { id: 'jp1_q2_o4', questionId: 'jp1_q2', text: '(g + a) cos(θ)', isCorrect: false }
        ]
      },
      {
        id: 'jp1_q3',
        quizId: 'jee-physics-1',
        text: 'If the kinetic energy of a body is increased by 300%, by what percentage does the momentum increase?',
        questionType: 'mcq',
        points: 4,
        options: [
          { id: 'jp1_q3_o1', questionId: 'jp1_q3', text: '100%', isCorrect: true },
          { id: 'jp1_q3_o2', questionId: 'jp1_q3', text: '200%', isCorrect: false },
          { id: 'jp1_q3_o3', questionId: 'jp1_q3', text: '50%', isCorrect: false },
          { id: 'jp1_q3_o4', questionId: 'jp1_q3', text: '150%', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'neet-bio-1',
    title: 'NEET Biology - Genetics & Evolution',
    category: 'NEET/JEE Prep',
    timeLimit: 90,
    createdBy: 'System (Medical Panel)',
    isPublic: true,
    difficulty: 'medium',
    createdAt: '2026-05-21T12:00:00Z',
    questions: [
      {
        id: 'nb1_q1',
        quizId: 'neet-bio-1',
        text: 'What is the phenotypic Mendelian ratio in a typical dihybrid cross in the F2 generation?',
        questionType: 'mcq',
        points: 4,
        options: [
          { id: 'nb1_q1_o1', questionId: 'nb1_q1', text: '3:1', isCorrect: false },
          { id: 'nb1_q1_o2', questionId: 'nb1_q1', text: '9:3:3:1', isCorrect: true },
          { id: 'nb1_q1_o3', questionId: 'nb1_q1', text: '1:2:1', isCorrect: false },
          { id: 'nb1_q1_o4', questionId: 'nb1_q1', text: '9:7', isCorrect: false }
        ]
      },
      {
        id: 'nb1_q2',
        quizId: 'neet-bio-1',
        text: 'Which of the following nitrogenous bases is NOT present in modern DNA double helix?',
        questionType: 'mcq',
        points: 4,
        options: [
          { id: 'nb1_q2_o1', questionId: 'nb1_q2', text: 'Thymine', isCorrect: false },
          { id: 'nb1_q2_o2', questionId: 'nb1_q2', text: 'Adenine', isCorrect: false },
          { id: 'nb1_q2_o3', questionId: 'nb1_q2', text: 'Uracil', isCorrect: true },
          { id: 'nb1_q2_o4', questionId: 'nb1_q2', text: 'Cytosine', isCorrect: false }
        ]
      },
      {
        id: 'nb1_q3',
        quizId: 'neet-bio-1',
        text: 'DNA replication takes place in which phase of the cell cycle?',
        questionType: 'mcq',
        points: 4,
        options: [
          { id: 'nb1_q3_o1', questionId: 'nb1_q3', text: 'G1 phase', isCorrect: false },
          { id: 'nb1_q3_o2', questionId: 'nb1_q3', text: 'S phase', isCorrect: true },
          { id: 'nb1_q3_o3', questionId: 'nb1_q3', text: 'G2 phase', isCorrect: false },
          { id: 'nb1_q3_o4', questionId: 'nb1_q3', text: 'M phase', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'ai-ml-basics',
    title: 'Generative AI & Transformer Architectures',
    category: 'AI/ML Essentials',
    timeLimit: 120,
    createdBy: 'System (AI Labs)',
    isPublic: true,
    difficulty: 'hard',
    createdAt: '2026-05-22T14:30:00Z',
    questions: [
      {
        id: 'aiml_q1',
        quizId: 'ai-ml-basics',
        text: 'What mathematical operation sits at the heart of "Self-Attention" in standard transformer networks?',
        questionType: 'mcq',
        points: 5,
        options: [
          { id: 'aiml_q1_o1', questionId: 'aiml_q1', text: 'Dynamic Fourier Transform of states', isCorrect: false },
          { id: 'aiml_q1_o2', questionId: 'aiml_q1', text: 'Scaled Dot-Product of Query, Key, and Value vectors', isCorrect: true },
          { id: 'aiml_q1_o3', questionId: 'aiml_q1', text: 'Stochastic Gradient Convolution', isCorrect: false },
          { id: 'aiml_q1_o4', questionId: 'aiml_q1', text: 'Reversible LSTMs feed-forward gating', isCorrect: false }
        ]
      },
      {
        id: 'aiml_q2',
        quizId: 'ai-ml-basics',
        text: 'Which activation function is most commonly utilized in GPT-class feedflow transformer sublayers?',
        questionType: 'mcq',
        points: 5,
        options: [
          { id: 'aiml_q2_o1', questionId: 'aiml_q2', text: 'Sigmoid', isCorrect: false },
          { id: 'aiml_q2_o2', questionId: 'aiml_q2', text: 'TanH', isCorrect: false },
          { id: 'aiml_q2_o3', questionId: 'aiml_q2', text: 'GELU (Gaussian Error Linear Unit)', isCorrect: true },
          { id: 'aiml_q2_o4', questionId: 'aiml_q2', text: 'Standard Linear identity function', isCorrect: false }
        ]
      },
      {
        id: 'aiml_q3',
        quizId: 'ai-ml-basics',
        text: 'In Reinforcement Learning from Human Feedback (RLHF), what is the role of the reward model?',
        questionType: 'mcq',
        points: 5,
        options: [
          { id: 'aiml_q3_o1', questionId: 'aiml_q3', text: 'Generating multiple alternative system responses', isCorrect: false },
          { id: 'aiml_q3_o2', questionId: 'aiml_q3', text: 'Evaluating system responses to mimic human preference scores', isCorrect: true },
          { id: 'aiml_q3_o3', questionId: 'aiml_q3', text: 'Masking out dangerous input tokens', isCorrect: false },
          { id: 'aiml_q3_o4', questionId: 'aiml_q3', text: 'Recalculating learning rate decay schedules', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'cs-algo-1',
    title: 'Core Algorithms & Complexity Analysis',
    category: 'Computer Science',
    timeLimit: 100,
    createdBy: 'System (CS Academic)',
    isPublic: true,
    difficulty: 'medium',
    createdAt: '2026-05-23T08:00:00Z',
    questions: [
      {
        id: 'cs1_q1',
        quizId: 'cs-algo-1',
        text: 'What is the worst-case space complexity of Depth First Search (DFS) on a tree of maximum depth D and branching factor B?',
        questionType: 'mcq',
        points: 4,
        options: [
          { id: 'cs1_q1_o1', questionId: 'cs1_q1', text: 'O(B * D)', isCorrect: false },
          { id: 'cs1_q1_o2', questionId: 'cs1_q1', text: 'O(D)', isCorrect: true },
          { id: 'cs1_q1_o3', questionId: 'cs1_q1', text: 'O(B^D)', isCorrect: false },
          { id: 'cs1_q1_o4', questionId: 'cs1_q1', text: 'O(V + E)', isCorrect: false }
        ]
      },
      {
        id: 'cs1_q2',
        quizId: 'cs-algo-1',
        text: 'Which data structure is internally used by Dijkstra\'s algorithm to extract the next shortest node efficiently?',
        questionType: 'mcq',
        points: 4,
        options: [
          { id: 'cs1_q2_o1', questionId: 'cs1_q2', text: 'Hash Map', isCorrect: false },
          { id: 'cs1_q2_o2', questionId: 'cs1_q2', text: 'Dequeue (Double ended queue)', isCorrect: false },
          { id: 'cs1_q2_o3', questionId: 'cs1_q2', text: 'Min-Priority Queue / Binary Heap', isCorrect: true },
          { id: 'cs1_q2_o4', questionId: 'cs1_q2', text: 'Red-Black Tree', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'science-astronomy-1',
    title: 'Wonders of Astrophysics & Cosmos',
    category: 'Science',
    timeLimit: 60,
    createdBy: 'System (Cosmo Team)',
    isPublic: true,
    difficulty: 'easy',
    createdAt: '2026-05-24T15:00:00Z',
    questions: [
      {
        id: 'sci_q1',
        quizId: 'science-astronomy-1',
        text: 'The event horizon of a Schwarzschild black hole is a boundary where the escape velocity is equal to:',
        questionType: 'mcq',
        points: 3,
        options: [
          { id: 'sci_q1_o1', questionId: 'sci_q1', text: 'Earth\'s orbital velocity', isCorrect: false },
          { id: 'sci_q1_o2', questionId: 'sci_q1', text: 'The speed of light in vacuum', isCorrect: true },
          { id: 'sci_q1_o3', questionId: 'sci_q1', text: 'The speed of sound in plasma', isCorrect: false },
          { id: 'sci_q1_o4', questionId: 'sci_q1', text: 'Twice the light speed', isCorrect: false }
        ]
      },
      {
        id: 'sci_q2',
        quizId: 'science-astronomy-1',
        text: 'What reaction provides fuel for the Sun\'s core, converting Hydrogen isotopes to Helium?',
        questionType: 'mcq',
        points: 3,
        options: [
          { id: 'sci_q2_o1', questionId: 'sci_q2', text: 'Nuclear Fission chain response', isCorrect: false },
          { id: 'sci_q2_o2', questionId: 'sci_q2', text: 'Proton-Proton chain nuclear fusion', isCorrect: true },
          { id: 'sci_q2_o3', questionId: 'sci_q2', text: 'Thermite carbon dioxide burn', isCorrect: false },
          { id: 'sci_q2_o4', questionId: 'sci_q2', text: 'Endothermic nitrogen cracking', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'gk-world-history-1',
    title: 'World History & Famous Empires',
    category: 'General Knowledge',
    timeLimit: 90,
    createdBy: 'System (History Dept)',
    isPublic: true,
    createdAt: '2026-05-26T11:00:00Z',
    questions: [
      {
        id: 'gkh_q1',
        quizId: 'gk-world-history-1',
        text: 'Which historical treaty in 1648 ended the Thirty Years\' War and established the modern concept of state sovereignty?',
        questionType: 'mcq',
        points: 4,
        options: [
          { id: 'gkh_q1_o1', questionId: 'gkh_q1', text: 'Treaty of Versailles', isCorrect: false },
          { id: 'gkh_q1_o2', questionId: 'gkh_q1', text: 'Peace of Westphalia', isCorrect: true },
          { id: 'gkh_q1_o3', questionId: 'gkh_q1', text: 'Treaty of Utrecht', isCorrect: false },
          { id: 'gkh_q1_o4', questionId: 'gkh_q1', text: 'Congress of Vienna', isCorrect: false }
        ]
      },
      {
        id: 'gkh_q2',
        quizId: 'gk-world-history-1',
        text: 'Who was the first emperor of the Roman Empire, ruling from 27 BC until his death in AD 14?',
        questionType: 'mcq',
        points: 4,
        options: [
          { id: 'gkh_q2_o1', questionId: 'gkh_q2', text: 'Julius Caesar', isCorrect: false },
          { id: 'gkh_q2_o2', questionId: 'gkh_q2', text: 'Nero', isCorrect: false },
          { id: 'gkh_q2_o3', questionId: 'gkh_q2', text: 'Augustus', isCorrect: true },
          { id: 'gkh_q2_o4', questionId: 'gkh_q2', text: 'Marcus Aurelius', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'neet-org-chem-1',
    title: 'NEET Organic Chemistry - Reaction Mechanisms',
    category: 'NEET/JEE Prep',
    timeLimit: 100,
    createdBy: 'System (Chem Group)',
    isPublic: true,
    createdAt: '2026-05-25T14:40:00Z',
    questions: [
      {
        id: 'noc_q1',
        quizId: 'neet-org-chem-1',
        text: 'Which of the following carboxylic acid derivatives is the most reactive towards nucleophilic acyl substitution reactions?',
        questionType: 'mcq',
        points: 4,
        options: [
          { id: 'noc_q1_o1', questionId: 'noc_q1', text: 'Acid Anhydride', isCorrect: false },
          { id: 'noc_q1_o2', questionId: 'noc_q1', text: 'Ester', isCorrect: false },
          { id: 'noc_q1_o3', questionId: 'noc_q1', text: 'Acyl Chloride', isCorrect: true },
          { id: 'noc_q1_o4', questionId: 'noc_q1', text: 'Amide', isCorrect: false }
        ]
      },
      {
        id: 'noc_q2',
        quizId: 'neet-org-chem-1',
        text: 'The conversion of an amide to a primary amine with one less carbon atom using bromine and sodium hydroxide is known as:',
        questionType: 'mcq',
        points: 4,
        options: [
          { id: 'noc_q2_o1', questionId: 'noc_q2', text: 'Gabriel Phthalimide Synthesis', isCorrect: false },
          { id: 'noc_q2_o2', questionId: 'noc_q2', text: 'Hoffmann Bromamide Degradation', isCorrect: true },
          { id: 'noc_q2_o3', questionId: 'noc_q2', text: 'Cannizzaro Reaction', isCorrect: false },
          { id: 'noc_q2_o4', questionId: 'noc_q2', text: 'Clemmensen Reduction', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'science-quantum-1',
    title: 'Quantum Mechanics & Particle Physics',
    category: 'Science',
    timeLimit: 120,
    createdBy: 'System (Physics Dept)',
    isPublic: true,
    createdAt: '2026-05-26T16:00:00Z',
    questions: [
      {
        id: 'sqp_q1',
        quizId: 'science-quantum-1',
        text: 'Which of the following particles is the mediator/carrier of the Strong Nuclear Force?',
        questionType: 'mcq',
        points: 4,
        options: [
          { id: 'sqp_q1_o1', questionId: 'sqp_q1', text: 'W/Z Bosons', isCorrect: false },
          { id: 'sqp_q1_o2', questionId: 'sqp_q1', text: 'Graviton', isCorrect: false },
          { id: 'sqp_q1_o3', questionId: 'sqp_q1', text: 'Gluon', isCorrect: true },
          { id: 'sqp_q1_o4', questionId: 'sqp_q1', text: 'Photon', isCorrect: false }
        ]
      },
      {
        id: 'sqp_q2',
        quizId: 'science-quantum-1',
        text: 'The famous double-slit experiment demonstrates which fundamental quantum principle?',
        questionType: 'mcq',
        points: 4,
        options: [
          { id: 'sqp_q2_o1', questionId: 'sqp_q2', text: 'Wave-particle duality', isCorrect: true },
          { id: 'sqp_q2_o2', questionId: 'sqp_q2', text: 'Quantum Entanglement', isCorrect: false },
          { id: 'sqp_q2_o3', questionId: 'sqp_q2', text: 'Planck\'s constant definition', isCorrect: false },
          { id: 'sqp_q2_o4', questionId: 'sqp_q2', text: 'Zeeman effect polarization', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'cs-sys-design-1',
    title: 'System Design & High Performance Web Scale',
    category: 'Computer Science',
    timeLimit: 110,
    createdBy: 'System (Eng Council)',
    isPublic: true,
    createdAt: '2026-05-25T11:20:00Z',
    questions: [
      {
        id: 'csd_q1',
        quizId: 'cs-sys-design-1',
        text: 'Under the CAP Theorem, which two properties does a standard relational database with synchronous master-slave replication provide when a network partition occurs?',
        questionType: 'mcq',
        points: 5,
        options: [
          { id: 'csd_q1_o1', questionId: 'csd_q1', text: 'Consistency and Partition Tolerance (CP)', isCorrect: true },
          { id: 'csd_q1_o2', questionId: 'csd_q1', text: 'Availability and Partition Tolerance (AP)', isCorrect: false },
          { id: 'csd_q1_o3', questionId: 'csd_q1', text: 'Consistency and Availability (CA)', isCorrect: false },
          { id: 'csd_q1_o4', questionId: 'csd_q1', text: 'None of the above', isCorrect: false }
        ]
      },
      {
        id: 'csd_q2',
        quizId: 'cs-sys-design-1',
        text: 'Which filter structure can check for set membership with O(1) time complexity but allows a small, tunable rate of false positives with zero false negatives?',
        questionType: 'mcq',
        points: 5,
        options: [
          { id: 'csd_q2_o1', questionId: 'csd_q2', text: 'Skip List', isCorrect: false },
          { id: 'csd_q2_o2', questionId: 'csd_q2', text: 'Bloom Filter', isCorrect: true },
          { id: 'csd_q2_o3', questionId: 'csd_q2', text: 'B-Tree Index', isCorrect: false },
          { id: 'csd_q2_o4', questionId: 'csd_q2', text: 'Merkle Tree', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'ai-nn-deep',
    title: 'Neural Network Tuning & Training Dynamics',
    category: 'AI/ML Essentials',
    timeLimit: 120,
    createdBy: 'System (AI Research)',
    isPublic: true,
    createdAt: '2026-05-26T18:00:00Z',
    questions: [
      {
        id: 'and_q1',
        quizId: 'ai-nn-deep',
        text: 'What issue is primary-selected as the reason to use Batch Normalization in deep multi-layered neural networks?',
        questionType: 'mcq',
        points: 4,
        options: [
          { id: 'and_q1_o1', questionId: 'and_q1', text: 'To perform automatic learning rate decay', isCorrect: false },
          { id: 'and_q2_o21', questionId: 'and_q1', text: 'To stabilize internal covariate shift across training batches', isCorrect: true },
          { id: 'and_q3_o22', questionId: 'and_q1', text: 'To prune sparse weights out of dense maps', isCorrect: false },
          { id: 'and_q4_o23', questionId: 'and_q1', text: 'To guarantee convexity of non-linear loss surfaces', isCorrect: false }
        ]
      },
      {
        id: 'and_q2',
        quizId: 'ai-nn-deep',
        text: 'Which optimizer implements both adaptive gradients and momentum to speed up training descent?',
        questionType: 'mcq',
        points: 4,
        options: [
          { id: 'and_q2_o1', questionId: 'and_q2', text: 'RMSprop', isCorrect: false },
          { id: 'and_q2_o2', questionId: 'and_q2', text: 'Stochastic Gradient Decent without weight decay (SGD)', isCorrect: false },
          { id: 'and_q2_o3', questionId: 'and_q2', text: 'Adam', isCorrect: true },
          { id: 'and_q2_o4', questionId: 'and_q2', text: 'AdaGrad', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'gk-pop-culture',
    title: 'Vibe Check: Cinematic Multiverses 🎬',
    category: 'General Knowledge',
    timeLimit: 20,
    createdBy: 'System (Pop Culture)',
    isPublic: true,
    createdAt: '2026-05-27T10:00:00Z',
    questions: [
      {
        id: 'gk_q2_1',
        quizId: 'gk-pop-culture',
        text: 'Who played Iron Man in the Marvel Cinematic Universe?',
        questionType: 'mcq',
        points: 5,
        options: [
          { id: 'gk_q2_1_o1', questionId: 'gk_q2_1', text: 'Chris Evans', isCorrect: false },
          { id: 'gk_q2_1_o2', questionId: 'gk_q2_1', text: 'Robert Downey Jr.', isCorrect: true },
          { id: 'gk_q2_1_o3', questionId: 'gk_q2_1', text: 'Tom Holland', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'gk-memes',
    title: 'Vibe Check: Internet Memes & Brainrot 🧠',
    category: 'General Knowledge',
    timeLimit: 20,
    createdBy: 'System (Meme Team)',
    isPublic: true,
    createdAt: '2026-05-27T10:05:00Z',
    questions: [
      {
        id: 'gk_q3_1',
        quizId: 'gk-memes',
        text: 'Which word describes a person\'s capability to attract someone with their speech and charm?',
        questionType: 'mcq',
        points: 5,
        options: [
          { id: 'gk_q3_1_o1', questionId: 'gk_q3_1', text: 'Ligma', isCorrect: false },
          { id: 'gk_q3_1_o2', questionId: 'gk_q3_1', text: 'Rizz', isCorrect: true },
          { id: 'gk_q3_1_o3', questionId: 'gk_q3_1', text: 'Skibidi', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'gk-gaming',
    title: 'Vibe Check: Retro Gaming & Esports 🎮',
    category: 'General Knowledge',
    timeLimit: 20,
    createdBy: 'System (Gamers)',
    isPublic: true,
    createdAt: '2026-05-27T10:10:00Z',
    questions: [
      {
        id: 'gk_q4_1',
        quizId: 'gk-gaming',
        text: 'In Minecraft, which block is required to build a standard Nether Portal?',
        questionType: 'mcq',
        points: 5,
        options: [
          { id: 'gk_q4_1_o1', questionId: 'gk_q4_1', text: 'Crying Obsidian', isCorrect: false },
          { id: 'gk_q4_1_o2', questionId: 'gk_q4_1', text: 'Obsidian', isCorrect: true },
          { id: 'gk_q4_1_o3', questionId: 'gk_q4_1', text: 'Bedrock', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'gk-geography',
    title: 'Vibe Check: Global Geography & Flag Flex 🌍',
    category: 'General Knowledge',
    timeLimit: 20,
    createdBy: 'System (Geography)',
    isPublic: true,
    createdAt: '2026-05-27T10:15:00Z',
    questions: [
      {
        id: 'gk_q5_1',
        quizId: 'gk-geography',
        text: 'Which is the largest ocean on Planet Earth?',
        questionType: 'mcq',
        points: 5,
        options: [
          { id: 'gk_q5_1_o1', questionId: 'gk_q5_1', text: 'Atlantic Ocean', isCorrect: false },
          { id: 'gk_q5_1_o2', questionId: 'gk_q5_1', text: 'Pacific Ocean', isCorrect: true },
          { id: 'gk_q5_1_o3', questionId: 'gk_q5_1', text: 'Indian Ocean', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'gk-music',
    title: 'Vibe Check: Music & TikTok Anthems 🎶',
    category: 'General Knowledge',
    timeLimit: 20,
    createdBy: 'System (Spotify Gurus)',
    isPublic: true,
    createdAt: '2026-05-27T10:20:00Z',
    questions: [
      {
        id: 'gk_q6_1',
        quizId: 'gk-music',
        text: 'Which artist is famed for the viral synth-pop smash hit "Blinding Lights"?',
        questionType: 'mcq',
        points: 5,
        options: [
          { id: 'gk_q6_1_o1', questionId: 'gk_q6_1', text: 'Drake', isCorrect: false },
          { id: 'gk_q6_1_o2', questionId: 'gk_q6_1', text: 'The Weeknd', isCorrect: true },
          { id: 'gk_q6_1_o3', questionId: 'gk_q6_1', text: 'Post Malone', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'gk-anime',
    title: 'Vibe Check: Anime & Otaku Kingdom ⛩️',
    category: 'General Knowledge',
    timeLimit: 20,
    createdBy: 'System (Anime Board)',
    isPublic: true,
    createdAt: '2026-05-27T10:25:00Z',
    questions: [
      {
        id: 'gk_q7_1',
        quizId: 'gk-anime',
        text: 'In Naruto, what is the name of the nine-tailed demon fox sealed inside Naruto?',
        questionType: 'mcq',
        points: 5,
        options: [
          { id: 'gk_q7_1_o1', questionId: 'gk_q7_1', text: 'Kurama', isCorrect: true },
          { id: 'gk_q7_1_o2', questionId: 'gk_q7_1', text: 'Gyuki', isCorrect: false },
          { id: 'gk_q7_1_o3', questionId: 'gk_q7_1', text: 'Shukaku', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'gk-crypto',
    title: 'Vibe Check: Crypto & Degen Finance 🪙',
    category: 'General Knowledge',
    timeLimit: 20,
    createdBy: 'System (Web3)',
    isPublic: true,
    createdAt: '2026-05-27T10:30:00Z',
    questions: [
      {
        id: 'gk_q8_1',
        quizId: 'gk-crypto',
        text: 'Who is the legendary anonymous creator or founders of Bitcoin?',
        questionType: 'mcq',
        points: 5,
        options: [
          { id: 'gk_q8_1_o1', questionId: 'gk_q8_1', text: 'Vitalik Buterin', isCorrect: false },
          { id: 'gk_q8_1_o2', questionId: 'gk_q8_1', text: 'Satoshi Nakamoto', isCorrect: true },
          { id: 'gk_q8_1_o3', questionId: 'gk_q8_1', text: 'Elon Musk', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'gk-food',
    title: 'Vibe Check: Fast Food Craft & Delicacies 🍔',
    category: 'General Knowledge',
    timeLimit: 20,
    createdBy: 'System (Foodies)',
    isPublic: true,
    createdAt: '2026-05-27T10:35:00Z',
    questions: [
      {
        id: 'gk_q9_1',
        quizId: 'gk-food',
        text: 'Which fast-food chain\'s slogan is "Finger Lickin\' Good"?',
        questionType: 'mcq',
        points: 5,
        options: [
          { id: 'gk_q9_1_o1', questionId: 'gk_q9_1', text: 'McDonald\'s', isCorrect: false },
          { id: 'gk_q9_1_o2', questionId: 'gk_q9_1', text: 'KFC', isCorrect: true },
          { id: 'gk_q9_1_o3', questionId: 'gk_q9_1', text: 'Burger King', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'gk-space',
    title: 'Vibe Check: Astrophysics & Cosmic Depth 🌌',
    category: 'General Knowledge',
    timeLimit: 20,
    createdBy: 'System (Cosmology)',
    isPublic: true,
    createdAt: '2026-05-27T10:40:00Z',
    questions: [
      {
        id: 'gk_q10_1',
        quizId: 'gk-space',
        text: 'What is the estimated age of our physical Universe?',
        questionType: 'mcq',
        points: 5,
        options: [
          { id: 'gk_q10_1_o1', questionId: 'gk_q10_1', text: '4.5 Billion Years', isCorrect: false },
          { id: 'gk_q10_1_o2', questionId: 'gk_q10_1', text: '13.8 Billion Years', isCorrect: true },
          { id: 'gk_q10_1_o3', questionId: 'gk_q10_1', text: '100 Billion Years', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'gk-mythology',
    title: 'Vibe Check: Mythical Beasts & Folklore ⚡',
    category: 'General Knowledge',
    timeLimit: 20,
    createdBy: 'System (Historians)',
    isPublic: true,
    createdAt: '2026-05-27T10:45:00Z',
    questions: [
      {
        id: 'gk_q11_1',
        quizId: 'gk-mythology',
        text: 'In Greek mythology, who is the supreme king of the gods ruling Olympus?',
        questionType: 'mcq',
        points: 5,
        options: [
          { id: 'gk_q11_1_o1', questionId: 'gk_q11_1', text: 'Poseidon', isCorrect: false },
          { id: 'gk_q11_1_o2', questionId: 'gk_q11_1', text: 'Zeus', isCorrect: true },
          { id: 'gk_q11_1_o3', questionId: 'gk_q11_1', text: 'Hades', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'gk-slang',
    title: 'Vibe Check: Gen Z Slang Dictionary 🗣️',
    category: 'General Knowledge',
    timeLimit: 20,
    createdBy: 'System (Linguists)',
    isPublic: true,
    createdAt: '2026-05-27T10:50:00Z',
    questions: [
      {
        id: 'gk_q12_1',
        quizId: 'gk-slang',
        text: 'If someone in the chat says "No Cap", what are they actually asserting?',
        questionType: 'mcq',
        points: 5,
        options: [
          { id: 'gk_q12_1_o1', questionId: 'gk_q12_1', text: 'They are lying', isCorrect: false },
          { id: 'gk_q12_1_o2', questionId: 'gk_q12_1', text: 'They are telling the absolute truth', isCorrect: true },
          { id: 'gk_q12_1_o3', questionId: 'gk_q12_1', text: 'They lost their hat', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'gk-fashion',
    title: 'Vibe Check: Fashion & Sneakerhead Trends 👟',
    category: 'General Knowledge',
    timeLimit: 20,
    createdBy: 'System (Hypebeast)',
    isPublic: true,
    createdAt: '2026-05-27T10:55:00Z',
    questions: [
      {
        id: 'gk_q13_1',
        quizId: 'gk-fashion',
        text: 'Which shoe brand collaborated with Kanye West to manufacture the original Yeezy sneaker lineup?',
        questionType: 'mcq',
        points: 5,
        options: [
          { id: 'gk_q13_1_o1', questionId: 'gk_q13_1', text: 'Nike', isCorrect: false },
          { id: 'gk_q13_1_o2', questionId: 'gk_q13_1', text: 'Adidas', isCorrect: true },
          { id: 'gk_q13_1_o3', questionId: 'gk_q13_1', text: 'Puma', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'gk-coding',
    title: 'Vibe Check: Coding Hacks & Web Tech 💻',
    category: 'General Knowledge',
    timeLimit: 20,
    createdBy: 'System (Dev Squad)',
    isPublic: true,
    createdAt: '2026-05-27T11:00:00Z',
    questions: [
      {
        id: 'gk_q14_1',
        quizId: 'gk-coding',
        text: 'What does HTML stand for in web engineering?',
        questionType: 'mcq',
        points: 5,
        options: [
          { id: 'gk_q14_1_o1', questionId: 'gk_q14_1', text: 'HighText Machine Language', isCorrect: false },
          { id: 'gk_q14_1_o2', questionId: 'gk_q14_1', text: 'HyperText Markup Language', isCorrect: true },
          { id: 'gk_q14_1_o3', questionId: 'gk_q14_1', text: 'Hyperlink Transfer Mode Language', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'gk-ai',
    title: 'Vibe Check: AI over Human Intelligence 🤖',
    category: 'General Knowledge',
    timeLimit: 20,
    createdBy: 'System (Singularity)',
    isPublic: true,
    createdAt: '2026-05-27T11:05:00Z',
    questions: [
      {
        id: 'gk_q15_1',
        quizId: 'gk-ai',
        text: 'Which AI lab launched the original ChatGPT chatbot in November 2022?',
        questionType: 'mcq',
        points: 5,
        options: [
          { id: 'gk_q15_1_o1', questionId: 'gk_q15_1', text: 'Google DeepMind', isCorrect: false },
          { id: 'gk_q15_1_o2', questionId: 'gk_q15_1', text: 'OpenAI', isCorrect: true },
          { id: 'gk_q15_1_o3', questionId: 'gk_q15_1', text: 'Anthropic', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'gk-comics',
    title: 'Vibe Check: Comic Books & Superheroes 🦸‍♂️',
    category: 'General Knowledge',
    timeLimit: 20,
    createdBy: 'System (Marvel DC)',
    isPublic: true,
    createdAt: '2026-05-27T11:10:00Z',
    questions: [
      {
        id: 'gk_q16_1',
        quizId: 'gk-comics',
        text: 'Who is the billionaire alter-ego of Batman?',
        questionType: 'mcq',
        points: 5,
        options: [
          { id: 'gk_q16_1_o1', questionId: 'gk_q16_1', text: 'Clark Kent', isCorrect: false },
          { id: 'gk_q16_1_o2', questionId: 'gk_q16_1', text: 'Bruce Wayne', isCorrect: true },
          { id: 'gk_q16_1_o3', questionId: 'gk_q16_1', text: 'Tony Stark', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'gk-literature',
    title: 'Vibe Check: Classic Literature & Rants 📚',
    category: 'General Knowledge',
    timeLimit: 20,
    createdBy: 'System (Poetry Club)',
    isPublic: true,
    createdAt: '2026-05-27T11:15:00Z',
    questions: [
      {
        id: 'gk_q17_1',
        quizId: 'gk-literature',
        text: 'Who penned the tragic play Romeo and Juliet?',
        questionType: 'mcq',
        points: 5,
        options: [
          { id: 'gk_q17_1_o1', questionId: 'gk_q17_1', text: 'Jane Austen', isCorrect: false },
          { id: 'gk_q17_1_o2', questionId: 'gk_q17_1', text: 'William Shakespeare', isCorrect: true },
          { id: 'gk_q17_1_o3', questionId: 'gk_q17_1', text: 'Charles Dickens', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'gk-animals',
    title: 'Vibe Check: Zoology & Wild Animal Quirks 🦇',
    category: 'General Knowledge',
    timeLimit: 20,
    createdBy: 'System (Safari Team)',
    isPublic: true,
    createdAt: '2026-05-27T11:20:00Z',
    questions: [
      {
        id: 'gk_q18_1',
        quizId: 'gk-animals',
        text: 'What is the only mammal capable of continuous active flight?',
        questionType: 'mcq',
        points: 5,
        options: [
          { id: 'gk_q18_1_o1', questionId: 'gk_q18_1', text: 'Flying Squirrel', isCorrect: false },
          { id: 'gk_q18_1_o2', questionId: 'gk_q18_1', text: 'Bat', isCorrect: true },
          { id: 'gk_q18_1_o3', questionId: 'gk_q18_1', text: 'Ostriches', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'gk-philosophy',
    title: 'Vibe Check: High Philosophy & Simulation 🧘',
    category: 'General Knowledge',
    timeLimit: 20,
    createdBy: 'System (Thinkers)',
    isPublic: true,
    createdAt: '2026-05-27T11:25:00Z',
    questions: [
      {
        id: 'gk_q19_1',
        quizId: 'gk-philosophy',
        text: 'Which French thinker uttered the iconic phrase: "I think, therefore I am"?',
        questionType: 'mcq',
        points: 5,
        options: [
          { id: 'gk_q19_1_o1', questionId: 'gk_q19_1', text: 'Jean-Paul Sartre', isCorrect: false },
          { id: 'gk_q19_1_o2', questionId: 'gk_q19_1', text: 'René Descartes', isCorrect: true },
          { id: 'gk_q19_1_o3', questionId: 'gk_q19_1', text: 'Albert Camus', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'gk-sports',
    title: 'Vibe Check: Extreme Sports & High Adrenaline ⚽',
    category: 'General Knowledge',
    timeLimit: 20,
    createdBy: 'System (Athletes)',
    isPublic: true,
    createdAt: '2026-05-27T11:30:00Z',
    questions: [
      {
        id: 'gk_q20_1',
        quizId: 'gk-sports',
        text: 'How many players are on the pitch for a single active team during a soccer match?',
        questionType: 'mcq',
        points: 5,
        options: [
          { id: 'gk_q20_1_o1', questionId: 'gk_q20_1', text: '9 Players', isCorrect: false },
          { id: 'gk_q20_1_o2', questionId: 'gk_q20_1', text: '11 Players', isCorrect: true },
          { id: 'gk_q20_1_o3', questionId: 'gk_q20_1', text: '15 Players', isCorrect: false }
        ]
      }
    ]
  }
];

export const INITIAL_ATTEMPTS: Attempt[] = [
  {
    id: 'att_1',
    userId: 'mock_usr_alice',
    username: 'AliceLearner',
    quizId: 'jee-physics-1',
    quizTitle: 'JEE Physics - Mechanics & Electrostatics',
    category: 'NEET/JEE Prep',
    score: 8,
    totalPoints: 12,
    timeTaken: 53,
    completedAt: '2026-05-25T14:22:00Z'
  },
  {
    id: 'att_2',
    userId: 'mock_usr_bob',
    username: 'BobPioneer',
    quizId: 'ai-ml-basics',
    quizTitle: 'Generative AI & Transformer Architectures',
    category: 'AI/ML Essentials',
    score: 15,
    totalPoints: 15,
    timeTaken: 72,
    completedAt: '2026-05-25T18:41:00Z'
  },
  {
    id: 'att_3',
    userId: 'mock_usr_alice',
    username: 'AliceLearner',
    quizId: 'ai-ml-basics',
    quizTitle: 'Generative AI & Transformer Architectures',
    category: 'AI/ML Essentials',
    score: 10,
    totalPoints: 15,
    timeTaken: 89,
    completedAt: '2026-05-26T09:15:00Z'
  },
  {
    id: 'att_4',
    userId: 'mock_usr_tamanash',
    username: 'TamanashDev',
    quizId: 'cs-algo-1',
    quizTitle: 'Core Algorithms & Complexity Analysis',
    category: 'Computer Science',
    score: 8,
    totalPoints: 8,
    timeTaken: 34,
    completedAt: '2026-05-26T15:30:00Z'
  }
];
