import React, { useState } from 'react';
import { 
  Info, 
  Mail, 
  MessageSquare, 
  ShieldAlert, 
  Check, 
  Send, 
  Award, 
  Heart,
  Star
} from 'lucide-react';

/* ================== ABOUT VIEW ================== */
export function AboutView() {
  return (
    <div className="space-y-8 animate-fade-in py-2">
      <div className="p-6 sm:p-8 rounded-2xl border-4 border-black bg-[#161e2e] shadow-[6px_6px_0px_0px_#000]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-yellow-400 border-2 border-black text-black text-[10px] font-mono font-black uppercase shadow-[1.5px_1.5px_0px_0px_#000] mb-3">
          ℹ️ CORE INFORMATION SHEET
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">About Quizora App</h1>
        <p className="text-xs text-slate-350 mt-1 max-w-xl font-medium">
          Quizora is a next-generation Progressive Web App built with modern offline-first capabilities. Lowkey the best quiz engine on the planet, no cap. ✨
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-5 rounded-xl border-4 border-black bg-[#1f2a3d] shadow-[4px_4px_0px_0px_#000] space-y-3">
          <div className="w-10 h-10 rounded-lg bg-pink-500 border-2 border-black flex items-center justify-center text-xl">
            🧠
          </div>
          <h3 className="text-sm font-black text-white uppercase">Vibe Integrity</h3>
          <p className="text-[11px] text-slate-300 leading-relaxed font-semibold">
            Our automated proctors evaluate exactly 20 behaviour vectors during quiz attempts. No cheating, no browser switching, no cap.
          </p>
        </div>

        <div className="p-5 rounded-xl border-4 border-black bg-[#1f2a3d] shadow-[4px_4px_0px_0px_#000] space-y-3">
          <div className="w-10 h-10 rounded-lg bg-yellow-400 border-2 border-black flex items-center justify-center text-xl">
            📱
          </div>
          <h3 className="text-sm font-black text-white uppercase">Aura PWA Support</h3>
          <p className="text-[11px] text-slate-300 leading-relaxed font-semibold">
            Add to home screen on iOS and Android devices for an immersive standalone workspace. Offline-ready local database caching keeps you active anywhere.
          </p>
        </div>

        <div className="p-5 rounded-xl border-4 border-black bg-[#1f2a3d] shadow-[4px_4px_0px_0px_#000] space-y-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-400 border-2 border-black flex items-center justify-center text-xl">
            🛡️
          </div>
          <h3 className="text-sm font-black text-white uppercase">Privacy-Shield</h3>
          <p className="text-[11px] text-slate-300 leading-relaxed font-semibold">
            We operate fully client-side and value telemetry control. Users have complete oversight and can erase all data with a single button.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ================== CONTACT VIEW ================== */
export function ContactView() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setName('');
      setEmail('');
      setMessage('');
    }, 4500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in py-2">
      <div className="p-6 rounded-2xl border-4 border-black bg-[#161e2e] shadow-[6px_6px_0px_0px_#000] text-center">
        <h1 className="text-3xl font-black text-white uppercase tracking-tight flex items-center justify-center gap-2">
          <Mail className="w-6 h-6 text-yellow-400" /> Contact Support Team
        </h1>
        <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto leading-relaxed">
          Questions about your custom scoreboard, regional leaderboards, or ads? Drop our moderators a memo below.
        </p>
      </div>

      <div className="p-6 rounded-2xl border-4 border-black bg-[#1f2a3d] shadow-[5px_5px_0px_0px_#000]">
        {sent ? (
          <div className="p-6 text-center space-y-3 bg-emerald-950/40 text-emerald-300 border-2 border-emerald-500/30 rounded-xl">
            <div className="w-12 h-12 rounded-full bg-emerald-500 border-2 border-black flex items-center justify-center text-black font-extrabold mx-auto text-xl">
              ✓
            </div>
            <h3 className="text-sm font-black uppercase">Memo Successfully Dispatched!</h3>
            <p className="text-[11px] leading-relaxed max-w-sm mx-auto font-semibold">
              Our Proctors have logged your transmission. We will low-key review and get back to your email inbox within 24 standard cycles.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono font-black uppercase text-slate-300 mb-1.5 ml-1">Vibe Username</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. NoCapNathan"
                className="w-full px-3 py-2 text-xs text-white bg-slate-900 border-2 border-slate-750 focus:border-yellow-400 rounded-lg focus:outline-none focus:ring-1"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono font-black uppercase text-slate-300 mb-1.5 ml-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@domain.com"
                className="w-full px-3 py-2 text-xs text-white bg-slate-900 border-2 border-slate-750 focus:border-yellow-400 rounded-lg focus:outline-none focus:ring-1"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono font-black uppercase text-slate-300 mb-1.5 ml-1">Transmission Memo</label>
              <textarea 
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                placeholder="Type your feedback, questions, or query..."
                className="w-full px-3 py-2 text-xs text-white bg-slate-900 border-2 border-slate-750 focus:border-yellow-400 rounded-lg focus:outline-none focus:ring-1"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-pink-500 text-white font-black uppercase tracking-wider text-xs border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000] active:translate-y-[1.5px] transition-transform flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" /> Dispatch Transmission
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

/* ================== REVIEWS VIEW ================== */
interface ReviewItem {
  id: string;
  name: string;
  quizTitle: string;
  rating: number;
  comment: string;
  timestamp: string;
}

export function ReviewsView() {
  const [reviewsList, setReviewsList] = useState<ReviewItem[]>([
    { id: 'rev1', name: 'AltheaSlayer', quizTitle: 'General Knowledge Vibe Check', rating: 5, comment: 'Slayed absolutely perfectly. Zero cheats, 100% vibe pass! 🎉', timestamp: 'May 28, 2026' },
    { id: 'rev2', name: 'X_OmegaGamer', quizTitle: 'NEET Physics Prep Mechanics', rating: 4, comment: 'Mechanics prep is spicy but highly educational! Recommend for exam drills.', timestamp: 'May 27, 2026' },
    { id: 'rev3', name: 'NoCapNathan', quizTitle: 'AI Core Essentials', rating: 5, comment: 'Lowkey the most accurate questions. Unmatched problem solver aura.', timestamp: 'May 26, 2026' }
  ]);

  const [commentName, setCommentName] = useState('');
  const [commentQuiz, setCommentQuiz] = useState('General Knowledge Vibe Check');
  const [commentText, setCommentText] = useState('');
  const [commentRating, setCommentRating] = useState(5);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName || !commentText) return;

    const newRev: ReviewItem = {
      id: Date.now().toString(),
      name: commentName,
      quizTitle: commentQuiz,
      rating: commentRating,
      comment: commentText,
      timestamp: 'Today'
    };

    setReviewsList([newRev, ...reviewsList]);
    setCommentName('');
    setCommentText('');
  };

  return (
    <div className="grid md:grid-cols-12 gap-8 animate-fade-in py-2">
      
      {/* Review Submission Form - col-span-5 */}
      <div className="p-5 sm:p-6 rounded-2xl border-4 border-black bg-[#1f2a3d] shadow-[5px_5px_0px_0px_#000] md:col-span-12 lg:col-span-5 self-start space-y-4">
        <div>
          <span className="px-2 py-0.5 text-[8.5px] font-mono font-black text-black bg-cyan-400 rounded uppercase">
            FEEDBACK CHANNELS
          </span>
          <h2 className="text-xl font-black text-white mt-1 uppercase tracking-tight">Post Vibe Review</h2>
          <p className="text-[10px] text-slate-400 font-medium">
            How was your synergy with standard study quizzes or squad duels? Post a public rating below.
          </p>
        </div>

        <form onSubmit={handleSubmitReview} className="space-y-4.5">
          <div>
            <label className="block text-[9px] font-mono font-black uppercase text-slate-300 mb-1 ml-1">Squad Username</label>
            <input 
              type="text" 
              value={commentName}
              onChange={(e) => setCommentName(e.target.value)}
              required
              placeholder="e.g. SlayQueen_99"
              className="w-full px-3 py-1.5 text-xs text-white bg-slate-900 border-2 border-slate-750 focus:border-cyan-400 rounded-lg focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[9px] font-mono font-black uppercase text-slate-300 mb-1 ml-1">Target Quiz Category</label>
            <select
              value={commentQuiz}
              onChange={(e) => setCommentQuiz(e.target.value)}
              className="w-full px-3 py-1.5 text-xs text-white bg-slate-900 border-2 border-slate-750 focus:border-cyan-400 rounded-lg focus:outline-none cursor-pointer"
            >
              <option value="General Knowledge Vibe Check">General Knowledge Vibe Check 🌍</option>
              <option value="NEET/JEE Mechanics">NEET/JEE Mechanics 🧠</option>
              <option value="AI or Cap Essentials">AI or Cap Essentials 🤖</option>
              <option value="Computer Science Code or Die">Computer Science Code or Die 💻</option>
            </select>
          </div>

          <div>
            <label className="block text-[9px] font-mono font-black uppercase text-slate-300 mb-1 ml-1">Aura Level Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(num => (
                <button
                  type="button"
                  key={num}
                  onClick={() => setCommentRating(num)}
                  className="p-1 px-2.5 rounded border border-black bg-slate-900 hover:bg-slate-800 text-yellow-400 text-xs font-bold transition-all cursor-pointer"
                >
                  {num <= commentRating ? '★' : '☆'} ({num})
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-mono font-black uppercase text-slate-300 mb-1 ml-1">Vibe Review Comment</label>
            <textarea 
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
              placeholder="Vibe commentary..."
              className="w-full px-3 py-1.5 text-xs text-white bg-slate-900 border-2 border-slate-750 focus:border-cyan-400 rounded-lg focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-cyan-400 text-black font-black uppercase text-xs border-2 border-black rounded-xl shadow-[2.5px_2.5px_0px_0px_#000] active:translate-y-0.5 transition-transform cursor-pointer"
          >
            Post Testimonial Star ★
          </button>
        </form>
      </div>

      {/* Reviews Display list - col-span-7 */}
      <div className="p-3 sm:p-5 rounded-2xl border-4 border-black bg-[#161e2e] shadow-[6px_6px_0px_0px_#000] md:col-span-12 lg:col-span-7 space-y-4">
        <div className="flex justify-between items-center pb-3 border-b-2 border-black">
          <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-cyan-400" /> Active Synergy Testimonials ({reviewsList.length})
          </h3>
          <span className="text-[9px] font-mono text-slate-400 font-extrabold uppercase">Verified Feedbacks</span>
        </div>

        <div className="space-y-3 pb-4 max-h-[450px] overflow-y-auto pr-1">
          {reviewsList.map((rev) => (
            <div key={rev.id} className="p-4 rounded-xl border-2 border-black bg-[#1f2a3d] text-left space-y-1 hover:scale-[1.01] transition-transform">
              <div className="flex flex-wrap items-center justify-between text-[11px] font-black">
                <span className="text-[#22c55e]">@{rev.name}</span>
                <span className="text-yellow-400 text-xs">{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</span>
              </div>
              <span className="block text-[8px] font-mono text-pink-500 font-black uppercase">Category: {rev.quizTitle}</span>
              <p className="text-[11px] text-slate-200 font-semibold leading-relaxed font-sans pt-1">
                "{rev.comment}"
              </p>
              <div className="text-[8px] font-mono text-slate-500 font-bold block pt-1.5 text-right uppercase">
                logged date: {rev.timestamp} • Vibe Cert ✅
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

/* ================== PRIVACY STATUS ================== */
export function PrivacyView() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in py-2 text-left">
      <div className="p-6 rounded-2xl border-4 border-black bg-[#161e2e] shadow-[6px_6px_0px_0px_#000]">
        <ShieldAlert className="w-12 h-12 text-pink-500 mb-3" />
        <h1 className="text-3xl font-black text-white uppercase tracking-tight">Privacy Policy & GDPR Terms</h1>
        <p className="text-xs text-slate-350 mt-1.5 font-medium">
          Effective on standard server epoch coordinate: May 28, 2026. Real-time control vectors.
        </p>
      </div>

      <div className="p-6 rounded-2xl border-4 border-black bg-[#1f2a3d] space-y-4 shadow-[4px_4px_0px_0px_#000] text-xs leading-relaxed text-slate-200">
        <h3 className="font-extrabold text-white text-sm uppercase">1. Zero Permanent Caching Policy</h3>
        <p>
          Quizora operates persistent offline-first modules utilizing client browser localStorage. We do not transmit or cache any demographic, personal, password or biometric credentials to server warehouses without user request or consent block.
        </p>

        <h3 className="font-extrabold text-white text-sm uppercase">2. European GDPR User Directives</h3>
        <p>
          In full accordance with European GDPR directives, individuals can execute an immediate deletion of their entire profile metadata, history charts, and cookie records directly via the "GDPR Purge" interface on our Dashboard / Scoreboards panels.
        </p>

        <h3 className="font-extrabold text-white text-sm uppercase">3. Sandbox Analytics Scope</h3>
        <p>
          We use local click-trigger tracking for performance metrics and ad optimization placeholders to verify system latency. There is absolutely NO tracking across third party external tracking domains.
        </p>
      </div>
    </div>
  );
}

/* ================== TERMS & CONDITIONS ================== */
export function TermsView() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in py-2 text-left">
      <div className="p-6 rounded-2xl border-4 border-black bg-[#161e2e] shadow-[6px_6px_0px_0px_#000]">
        <Info className="w-12 h-12 text-yellow-400 mb-3" />
        <h1 className="text-3xl font-black text-white uppercase tracking-tight">Terms & Conditions</h1>
        <p className="text-xs text-slate-355 mt-1.5 font-semibold">
          Platform terms and user proctored codes of conduct.
        </p>
      </div>

      <div className="p-6 rounded-2xl border-4 border-black bg-[#1f2a3d] space-y-4 shadow-[4px_4px_0px_0px_#000] text-xs leading-relaxed text-slate-200">
        <h3 className="font-extrabold text-white text-sm uppercase">1. Acceptable Aura Conduct</h3>
        <p>
          User agrees not to script, duplicate, or bypass automated proctor behavioral vectors assessing cheat counts or browser-tab deviations. Play the quizzes honestly to calibrate true, high-vibe compatibility scores!
        </p>

        <h3 className="font-extrabold text-white text-sm uppercase">2. Intellectual Slayage Proprietary</h3>
        <p>
          Quiz custom questions created on our interface remain standard intellectual creations of the creators, hosted under URL parameters (`/@id`) for community-wide discovery or regional boards.
        </p>

        <h3 className="font-extrabold text-white text-sm uppercase">3. Disclaimer of Slander</h3>
        <p>
          Compatibility indices, meme generators and scorecard synergy assessments are generated for entertainment and academic drill purposes. Take the metrics seriously, but low-key keep the vibes immaculate.
        </p>
      </div>
    </div>
  );
}
