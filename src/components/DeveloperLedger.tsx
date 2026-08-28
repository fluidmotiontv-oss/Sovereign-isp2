import React, { useState } from 'react';
import { DeveloperContribution } from '../types';
import { 
  Code2, 
  GitCommit, 
  PieChart, 
  Coins, 
  CheckCircle2, 
  Plus, 
  Sparkles, 
  Github, 
  Layers 
} from 'lucide-react';

interface DeveloperLedgerProps {
  developers: DeveloperContribution[];
}

export const DeveloperLedger: React.FC<DeveloperLedgerProps> = ({ developers }) => {
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [commitMessage, setCommitMessage] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleCommitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commitMessage) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowSubmitModal(false);
      setCommitMessage('');
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white">Developer Contributions Ledger & Fair Splits</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              Open-Source & Transparent
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Automated blockchain distribution engine ensuring developers, node hosts, and holiday park operators receive fair splits of generated Harmony Notes.
          </p>
        </div>

        <button
          onClick={() => setShowSubmitModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:brightness-110 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all"
        >
          <GitCommit className="w-4 h-4" />
          <span>Submit Code Contribution</span>
        </button>
      </div>

      {/* Fair Split Rules Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <span className="text-xs font-mono text-emerald-400 font-bold block">50% Node Operators</span>
          <h3 className="text-base font-bold text-white">Data Routing Hosts</h3>
          <p className="text-xs text-slate-400">
            Distributed directly to home router nodes, holiday park gateways, and mobile hotspot hosts routing peer traffic.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <span className="text-xs font-mono text-cyan-400 font-bold block">30% Developer Ledger</span>
          <h3 className="text-base font-bold text-white">Open Source Guilds</h3>
          <p className="text-xs text-slate-400">
            Allocated to core mesh protocol developers, Walkie-Talkie engineers, and Trojan app builders based on commit consensus.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <span className="text-xs font-mono text-amber-400 font-bold block">20% Community Reserve</span>
          <h3 className="text-base font-bold text-white">Global P2P Expansion</h3>
          <p className="text-xs text-slate-400">
            Reserved for hardware subsidies in underserved areas, community holiday park upgrades, and emergency nodes.
          </p>
        </div>
      </div>

      {/* Developer Contributions List */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-400" />
            Verified Guild Developer Split Leaderboard
          </h3>
          <span className="text-xs font-mono text-slate-400">Total Harmony Notes Distributed: 40,710 🎵</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {developers.map((dev) => (
            <div
              key={dev.id}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3 hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={dev.avatar}
                    alt={dev.developer}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">{dev.developer}</h4>
                    <p className="text-[11px] text-slate-400">{dev.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-mono font-bold text-amber-300 block">{dev.splitPercentage}% Split</span>
                  <span className="text-[10px] text-slate-500 font-mono">{dev.commitsCount} commits</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono text-[11px]">Component: {dev.component}</span>
                <span className="font-mono font-bold text-emerald-400">+{dev.earnedNotes.toLocaleString()} 🎵</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Commit Submission Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2">
              <GitCommit className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">Register Developer Contribution</h3>
            </div>
            <p className="text-xs text-slate-400">
              Submit your code commit hash or pull request to receive automated Harmony Notes fair splits from the developer pool.
            </p>

            {submitted ? (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Commit Verified & Added to Ledger!</h4>
                <p className="text-xs text-emerald-300">Your Harmony Notes split allocation will update on the next epoch.</p>
              </div>
            ) : (
              <form onSubmit={handleCommitSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Commit Summary / Feature</label>
                  <input
                    type="text"
                    placeholder="e.g. Added low-latency Walkie-Talkie audio compression codec"
                    value={commitMessage}
                    onChange={(e) => setCommitMessage(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-600/20"
                >
                  Verify Commit & Register Split
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
