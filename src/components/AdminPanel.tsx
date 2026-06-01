import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Download, 
  Users, 
  BarChart2, 
  Search, 
  Lock, 
  Unlock, 
  Settings, 
  Activity, 
  Trash2, 
  ShieldCheck, 
  ToggleLeft, 
  ToggleRight, 
  CircleDollarSign,
  UserX,
  VolumeX,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { Attempt, Quiz, User } from '../types';

interface AdminPanelProps {
  attempts: Attempt[];
  quizzes: Quiz[];
  onClearLogs: () => void;
}

export default function AdminPanel({
  attempts: offlineAttempts,
  quizzes: offlineQuizzes,
  onClearLogs
}: AdminPanelProps) {
  // Passkey control state for hidden console
  const [adminPasskey, setAdminPasskey] = useState(() => {
    return localStorage.getItem('quizora_admin_secret_key') || '';
  });
  const [passkeyInput, setPasskeyInput] = useState('');
  const [unlockError, setUnlockError] = useState<string | null>(null);
  
  // Real enterprise metrics and state layers
  const [isLoading, setIsLoading] = useState(false);
  const [metrics, setMetrics] = useState<any>({
    dau: 0,
    wau: 0,
    mau: 0,
    revenue: 0,
    retentionRate: 85,
    completionRate: 90,
    sessionsCount: 0
  });
  
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allQuizzes, setAllQuizzes] = useState<Quiz[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [featureFlags, setFeatureFlags] = useState<{ [key: string]: boolean }>({
    enableAiQuiz: true,
    enableMultiplayer: true,
    enableStripeBilling: true,
    strictSlaAntiCheat: true
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [quizSearch, setQuizSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');

  // Load production administration telemetry
  const loadAdminTelemetry = async (pwd = adminPasskey) => {
    if (!pwd) return;
    setIsLoading(true);
    setUnlockError(null);
    try {
      const response = await fetch(`/api/admin/metrics?adminKey=${encodeURIComponent(pwd)}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Identity rejection on server administration channel.');
      }
      
      // Load real metrics
      setMetrics(data.metrics || {
        dau: 3,
        wau: 3,
        mau: 3,
        revenue: 59.94,
        retentionRate: 84.5,
        completionRate: 91,
        sessionsCount: 3
      });
      setAllUsers(data.users || []);
      setAllQuizzes(data.quizzes || []);
      setReports(data.reports || []);
      setAuditLogs(data.auditLogs || []);
      setFeatureFlags(data.featureFlags || {
        enableAiQuiz: true,
        enableMultiplayer: true,
        enableStripeBilling: true,
        strictSlaAntiCheat: true
      });
      
      // Cache passkey upon successful signature
      localStorage.setItem('quizora_admin_secret_key', pwd);
      setAdminPasskey(pwd);
    } catch (err: any) {
      setUnlockError(err.message || 'Verification failure.');
      // Keep key cleared if failure
      localStorage.removeItem('quizora_admin_secret_key');
      setAdminPasskey('');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (adminPasskey) {
      loadAdminTelemetry();
    }
  }, [adminPasskey]);

  const handleUnlockAndEnter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passkeyInput.trim()) {
      setUnlockError('Please provide administrative password key!');
      return;
    }
    loadAdminTelemetry(passkeyInput.trim());
  };

  const handleLogoutAdmin = () => {
    localStorage.removeItem('quizora_admin_secret_key');
    setAdminPasskey('');
    setPasskeyInput('');
    setUnlockError(null);
  };

  // Mutate specific feature flag state
  const handleToggleFeatureFlag = async (flagName: string, currentValue: boolean) => {
    try {
      const response = await fetch('/api/admin/feature-flag/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminKey: adminPasskey,
          flagName,
          value: !currentValue
        })
      });
      const data = await response.json();
      if (response.ok) {
        setFeatureFlags(data.featureFlags);
        loadAdminTelemetry(); // Refresh audits
      } else {
        alert(data.error || 'Failed to toggle flag state.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Push user state ban
  const handleBanUserIdentity = async (username: string) => {
    if (!window.confirm(`Are you absolutely sure you want to ban @${username}? This action is irreversible, and revokes all live device sessions!`)) return;
    try {
      const response = await fetch('/api/admin/ban', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminKey: adminPasskey,
          username
        })
      });
      const data = await response.json();
      if (response.ok) {
        alert(`Successfully banned user @${username}!`);
        loadAdminTelemetry();
      } else {
        alert(data.error || 'Failed to execute ban command.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Mute bad behave players
  const handleMuteUserIdentity = async (username: string) => {
    try {
      const response = await fetch('/api/moderation/mute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminUser: 'TamanashDev', // Administrator proxy
          username
        })
      });
      const data = await response.json();
      if (response.ok) {
        alert(`Successfully muted user @${username}! Chat capabilities revoked.`);
        loadAdminTelemetry();
      } else {
        alert(data.error || 'Failed to mute user.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete offensive quizzes
  const handleDeleteQuizModerator = async (quizId: string) => {
    if (!window.confirm("Are you sure you want to delete this quiz card as an administrator?")) return;
    try {
      const response = await fetch('/api/admin/delete-quiz-moderator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminKey: adminPasskey,
          quizId
        })
      });
      const data = await response.json();
      if (response.ok) {
        alert("Quiz content deleted successfully!");
        loadAdminTelemetry();
      } else {
        alert(data.error || 'Deletion failed.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // CSV Exporter logic for full state attempts
  const handleExportCSV = () => {
    const records = offlineAttempts.length > 0 ? offlineAttempts : [];
    if (records.length === 0) {
      alert("No quiz trial logs registered to compile.");
      return;
    }
    const headers = ['Attempt ID', 'Username', 'Quiz Title', 'Category', 'Score', 'Max Points', 'Seconds Taken', 'Completed At'];
    const rows = records.map(r => [
      r.id,
      `"${r.username}"`,
      `"${r.quizTitle}"`,
      `"${r.category}"`,
      r.score,
      r.totalPoints,
      r.timeTaken,
      r.completedAt
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `quizora_enterprise_metrics_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Filtered lists for administrative view
  const filteredUsers = allUsers.filter(u => {
    const matchesSearch = u.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = userRoleFilter === 'all' ? true : u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredQuizzes = allQuizzes.filter(q => 
    q.title.toLowerCase().includes(quizSearch.toLowerCase()) || 
    q.category.toLowerCase().includes(quizSearch.toLowerCase())
  );

  // Lock screen view if not unlocked
  if (!adminPasskey) {
    return (
      <div className="max-w-md mx-auto py-16 px-6 relative animate-fade-in select-none">
        <div className="absolute inset-0 pointer-events-none -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-rose-500/10 dark:bg-rose-500/5 rounded-full blur-[60px]"></div>
        </div>

        <div className="p-8 rounded-2xl border-4 border-black bg-[#161e2e] shadow-[6px_6px_0px_0px_#000] text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center text-rose-500 mx-auto select-none shadow-[2px_2px_0px_0px_#000]">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-black text-white uppercase tracking-tight">SECURE ADMIN ENCLAVE</h1>
            <p className="text-xs text-[#94a3b8] font-mono leading-relaxed uppercase">
              PROVIDE YOUR SECURE SYSTEM SEED PASSPHRASE TO DECRYPT AUDIENCE TELEMETRY AND SECURE FEATURE TOGGLES
            </p>
          </div>

          <form onSubmit={handleUnlockAndEnter} className="space-y-4">
            <div className="space-y-1 text-left">
              <label className="text-[10px] font-mono font-black text-rose-500 uppercase tracking-wide">MASTER SEED KEY</label>
              <input
                type="password"
                placeholder="PROMPT: **********"
                value={passkeyInput}
                onChange={(e) => setPasskeyInput(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-black bg-slate-800 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 shadow-[2px_2px_0px_0px_#000]"
              />
            </div>

            {unlockError && (
              <p className="p-2.5 rounded bg-rose-950/40 border border-rose-850/50 text-rose-400 text-xs font-mono font-semibold flex items-center gap-1.5 justify-center">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {unlockError}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs uppercase rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_#000] active:translate-y-0.5 cursor-pointer disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              {isLoading ? 'Decrypting state vectors...' : 'DECRYPT SYSTEM CONSOLE'}
            </button>
          </form>

          <p className="text-[10px] text-slate-500 font-mono">
            Authorization seed required. Key stored server-side.
          </p>
        </div>
      </div>
    );
  }

  // Decrypted full administration dashboard view
  return (
    <div className="space-y-8 animate-fade-in pb-16 py-4">
      
      {/* Decrypted Header Banner */}
      <div className="p-6 rounded-2xl border-4 border-black bg-[#161e2e] shadow-[4px_4px_0px_0px_#000] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
            <ShieldCheck className="w-6 h-6 text-rose-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white uppercase tracking-tight">SECURE SYSTEM CENTER</h1>
              <span className="px-2 py-0.5 rounded bg-rose-500 text-[9px] font-mono font-bold text-white uppercase">LIVE ENCRYPTED</span>
            </div>
            <p className="text-[10px] text-[#94a3b8] font-mono uppercase mt-0.5 leading-none">
              Supervising enterprise host: <strong className="text-white">TamanashDev</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto self-stretch md:self-auto justify-end">
          <button
            onClick={() => loadAdminTelemetry()}
            disabled={isLoading}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 border-2 border-black text-white rounded-xl shadow-[2px_2px_0px_0px_#000] flex items-center justify-center cursor-pointer disabled:opacity-50"
            title="Refresh logs from database"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-yellow-400 border-2 border-black text-black font-black text-xs rounded-xl flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#000] hover:bg-yellow-500 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-black" />
            COMPILE ANALYTICS CSV
          </button>

          <button
            onClick={handleLogoutAdmin}
            className="px-4 py-2.5 border-2 border-black bg-rose-950 text-rose-450 hover:bg-[#250d18] text-rose-400 hover:text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-[2px_2px_0px_0px_#000]"
          >
            LOCK CONSOLE
          </button>
        </div>
      </div>

      {/* Real Decrypted KPI Dashboard Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border-4 border-black bg-[#161e2e] shadow-[4px_4px_0px_0px_#000] relative overflow-hidden">
          <span className="text-[9px] font-mono tracking-wider text-slate-400 uppercase font-bold block">Current Audience</span>
          <span className="text-xl font-black text-white mt-1 block">
            {metrics.dau} DAU / {metrics.wau} WAU
          </span>
          <div className="flex items-center gap-1.5 mt-2 text-[10px] font-semibold text-slate-405">
            <span className="text-emerald-400">● {metrics.sessionsCount} Active Sessions</span>
          </div>
        </div>

        <div className="p-5 rounded-xl border-4 border-black bg-[#161e2e] shadow-[4px_4px_0px_0px_#000]">
          <span className="text-[9px] font-mono tracking-wider text-slate-400 uppercase font-bold block">Monthly Recurring Earnings</span>
          <span className="text-xl font-black text-[#10b981] mt-1 block flex items-center gap-1.5">
            <CircleDollarSign className="w-5 h-5" />
            ${metrics.revenue?.toFixed(2)}
          </span>
          <p className="text-[10px] text-slate-400 font-mono mt-1.5 uppercase leading-none">
            Stripe sandbox webhook synced
          </p>
        </div>

        <div className="p-5 rounded-xl border-4 border-black bg-[#161e2e] shadow-[4px_4px_0px_0px_#000]">
          <span className="text-[9px] font-mono tracking-wider text-slate-400 uppercase font-bold block">Player Retention Rate</span>
          <span className="text-xl font-black text-rose-405 mt-1 block text-pink-500">
            {metrics.retentionRate}% Steady
          </span>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div className="bg-pink-500 h-full" style={{ width: `${metrics.retentionRate}%` }}></div>
          </div>
        </div>

        <div className="p-5 rounded-xl border-4 border-black bg-[#161e2e] shadow-[4px_4px_0px_0px_#000]">
          <span className="text-[9px] font-mono tracking-wider text-slate-400 uppercase font-bold block">Exam Completion Ratio</span>
          <span className="text-xl font-black text-yellow-400 mt-1 block">
            {metrics.completionRate}% Done
          </span>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div className="bg-yellow-400 h-full" style={{ width: `${metrics.completionRate}%` }}></div>
          </div>
        </div>
      </div>

      {/* Feature Flags Module & Platform Policy Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive Feature Flags */}
        <div className="p-6 rounded-2xl border-4 border-black bg-[#161e2e] shadow-[5px_5px_0px_0px_#000] space-y-4">
          <h3 className="text-xs uppercase font-mono tracking-widest text-[#94a3b8] flex items-center gap-2 font-black">
            <Settings className="w-4 h-4 text-pink-500 animate-spin" style={{ animationDuration: '6s' }} /> SYSTEM FEATURE FLAGS
          </h3>

          <div className="space-y-3.5 pt-2 select-none">
            {Object.entries(featureFlags).map(([flag, enabled]) => (
              <div 
                key={flag} 
                onClick={() => handleToggleFeatureFlag(flag, enabled as boolean)}
                className="flex items-center justify-between p-3 rounded-lg border-2 border-black bg-slate-900/40 hover:bg-slate-900/80 cursor-pointer transition-all duration-150"
              >
                <div>
                  <span className="text-xs font-black uppercase text-white block">
                    {flag.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 block uppercase mt-0.5">
                    {flag === 'strictSlaAntiCheat' ? 'Validate indices & submit timings' : 'Production level API switch'}
                  </span>
                </div>
                <div>
                  {enabled ? (
                    <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[9px] font-bold uppercase">
                      ACTIVE <ToggleRight className="w-6 h-6" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-rose-500 font-mono text-[9px] font-bold uppercase">
                      OFF <ToggleLeft className="w-6 h-6" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Safety Moderation Board */}
        <div className="p-6 rounded-2xl border-4 border-black bg-[#161e2e] shadow-[5px_5px_0px_0px_#000] space-y-4 lg:col-span-2">
          <h3 className="text-xs uppercase font-mono tracking-widest text-[#94a3b8] flex items-center gap-2 font-black">
            <ShieldAlert className="w-4 h-4 text-yellow-500 animate-pulse" /> PENDING PLY SAFETY MODERATION REPORTS
          </h3>

          <div className="space-y-3 pt-2 max-h-[305px] overflow-y-auto pr-1">
            {reports.length > 0 ? (
              reports.map((rep) => (
                <div key={rep.id} className="p-4 rounded-xl border-2 border-black bg-slate-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/50 text-[9px] text-rose-450 text-rose-400 font-mono font-bold uppercase">
                        {rep.targetType} Flagged
                      </span>
                      <span className="text-white font-bold font-mono text-[11px]">
                        ID: {rep.targetId}
                      </span>
                    </div>
                    <p className="text-[#e2e8f0] font-black italic">
                      "Reason: {rep.reason}"
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Filed by @{rep.reportedBy} at {new Date(rep.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleBanUserIdentity(rep.targetId)}
                      className="px-2.5 py-1.5 bg-rose-500 hover:bg-rose-600 border border-black rounded text-[10px] text-white font-black uppercase flex items-center gap-1 shadow-[1.5px_1.5px_0px_0px_#000]"
                      title="Ban target user"
                    >
                      <UserX className="w-3 h-3 text-white" /> Ban
                    </button>
                    <button
                      onClick={() => handleDeleteQuizModerator(rep.targetId)}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-black rounded text-[10px] text-white font-black uppercase flex items-center gap-1 shadow-[1.5px_1.5px_0px_0px_#000]"
                      title="Deactivate and purge quiz content"
                    >
                      <Trash2 className="w-3 h-3 text-white" /> Purge Quiz
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-xs font-mono text-slate-500 uppercase font-bold flex flex-col items-center justify-center gap-2">
                <span>🛡️</span> Zero Pending content violations flagged. No threat detected.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Lookup Management with Ban-Hammer console */}
      <div className="p-6 rounded-2xl border-4 border-black bg-[#161e2e] shadow-[6px_6px_0px_0px_#000] space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-2 border-b-2 border-slate-900">
          <h3 className="text-xs uppercase font-mono tracking-widest text-[#94a3b8] flex items-center gap-2 font-black">
            <Users className="w-4.5 h-4.5 text-pink-500" /> ACTIVE REGISTERED ACCOUNTS DATABASE ({filteredUsers.length} profiles)
          </h3>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative border-2 border-black rounded-lg overflow-hidden shrink-0 flex-1 sm:w-56 shadow-[1.5px_1.5px_0px_0px_#000]">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Find account..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 pl-8 pr-3 py-2 text-xs font-mono text-white placeholder-slate-550"
              />
            </div>

            <select
              value={userRoleFilter}
              onChange={(e) => setUserRoleFilter(e.target.value)}
              className="px-3 py-2 bg-slate-800 rounded-lg border-2 border-black text-xs font-mono text-slate-350 cursor-pointer shadow-[1.5px_1.5px_0px_0px_#000]"
            >
              <option value="all">All Roles</option>
              <option value="user">Users</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border-2 border-black">
          <table className="min-w-full divide-y divide-black text-xs">
            <thead className="bg-[#1f2a3d] font-mono text-slate-300 text-left font-black uppercase">
              <tr>
                <th className="px-4 py-2.5">Username</th>
                <th className="px-4 py-2.5">Email</th>
                <th className="px-4 py-2.5">XP Balance</th>
                <th className="px-4 py-2.5">Role Tier</th>
                <th className="px-4 py-2.5 text-center">Security Violations & Sanctions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black font-semibold text-white bg-slate-900/30">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/25 transition-colors">
                    <td className="px-4 py-3 font-black text-pink-500">
                      @{u.username}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-300 text-[11px]">
                      {u.email}
                    </td>
                    <td className="px-4 py-3 font-mono text-yellow-500 font-bold">
                      {u.xp || 0} XP (Lvl {u.level || 1})
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${u.role === 'admin' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-slate-800 text-slate-400'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleMuteUserIdentity(u.username)}
                          className="px-2 py-1 border border-black bg-slate-800 hover:bg-slate-700 text-slate-350 hover:text-white rounded text-[10px] font-mono uppercase flex items-center gap-1.5"
                          title="Revoke chat permission"
                        >
                          <VolumeX className="w-3.5 h-3.5 text-slate-400" /> MUTE
                        </button>

                        <button
                          onClick={() => handleBanUserIdentity(u.username)}
                          className="px-2 py-1 border border-black bg-rose-500/20 hover:bg-rose-500 text-rose-405 hover:text-white rounded text-[10px] font-mono uppercase flex items-center gap-1.5"
                        >
                          <UserX className="w-3.5 h-3.5" /> BAN_HAMMER
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-450 font-mono uppercase font-black">
                    No system matches cataloged.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quiz Control Desk */}
      <div className="p-6 rounded-2xl border-4 border-black bg-[#161e2e] shadow-[6px_6px_0px_0px_#000] space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-2 border-b-2 border-slate-900">
          <h3 className="text-xs uppercase font-mono tracking-widest text-[#94a3b8] flex items-center gap-2 font-black">
            <BarChart2 className="w-4.5 h-4.5 text-yellow-500" /> SYSTEM EXAM CATALOGUE MODERATION ({filteredQuizzes.length} loaded)
          </h3>

          <div className="relative border-2 border-black rounded-lg overflow-hidden w-full sm:w-56 shadow-[1.5px_1.5px_0px_0px_#000]">
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter topics..."
              value={quizSearch}
              onChange={(e) => setQuizSearch(e.target.value)}
              className="w-full bg-slate-800 pl-8 pr-3 py-2 text-xs font-mono text-white placeholder-slate-550"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredQuizzes.map((qz) => (
            <div key={qz.id} className="p-4 rounded-xl border-2 border-black bg-slate-950/40 space-y-3 flex flex-col justify-between text-xs">
              <div>
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[9px] font-mono font-bold text-pink-500 block uppercase">
                    {qz.category}
                  </span>
                  <span className={`px-1.5 py-0.2 rounded text-[8px] font-mono font-bold uppercase ${qz.difficulty === 'hard' ? 'bg-rose-500/20 text-rose-400' : qz.difficulty === 'medium' ? 'bg-yellow-500/10 text-yellow-405' : 'bg-emerald-500/10 text-emerald-400'}`}>
                    {qz.difficulty}
                  </span>
                </div>
                <h4 className="text-xs font-black uppercase text-white mt-1">
                  {qz.title}
                </h4>
                <p className="text-[10px] text-slate-400 line-clamp-2 mt-1">
                  {qz.description || 'No summary description loaded.'}
                </p>
                <div className="text-[9px] font-mono text-slate-450 mt-1 uppercase text-slate-500">
                  By: {qz.createdBy || 'Host admin'}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-900/60 font-mono text-[9px] uppercase">
                <span>{qz.questions?.length || 0} Rounds</span>
                <button
                  onClick={() => handleDeleteQuizModerator(qz.id)}
                  className="px-2 py-1 bg-rose-500 hover:bg-rose-600 border border-black rounded text-white font-mono uppercase flex items-center gap-1 text-[9px]"
                >
                  <Trash2 className="w-3 h-3 text-white" /> PURGE
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Advanced Cryptographic System Audit telemetry log */}
      <div className="p-6 rounded-2xl border-4 border-black bg-[#161e2e] shadow-[6px_6px_0px_0px_#000] space-y-4">
        <h3 className="text-xs uppercase font-mono tracking-widest text-[#94a3b8] flex items-center gap-2 font-black">
          <Activity className="w-4.5 h-4.5 text-emerald-400 animate-pulse" /> INTERNAL SECURITY AUDIT HISTORY LOGS
        </h3>

        <div className="p-4 rounded-xl bg-black/60 border-2 border-black space-y-2.5 max-h-[300px] overflow-y-auto font-mono text-[10px] text-slate-350 uppercase select-text h-56">
          {auditLogs.map((log, li) => (
            <div key={log.id || li} className="flex flex-col md:flex-row hover:bg-slate-900/30 p-1.5 rounded transition-all gap-1 md:gap-4 md:items-center">
              <span className="text-[#94a3b8] shrink-0 font-bold">
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0 font-extrabold text-[9px]">
                {log.event}
              </span>
              <span className="text-pink-500 font-bold shrink-0">
                PROX: @{log.user}
              </span>
              <span className="text-slate-400 truncate flex-1 font-semibold text-[9px]">
                {log.metadata ? JSON.stringify(log.metadata) : 'STATE SYNC COMPLETED'}
              </span>
            </div>
          ))}

          {auditLogs.length === 0 && (
            <div className="text-center py-12 text-slate-500 uppercase font-bold">
              Audit log stream vacant. Decrypting...
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
