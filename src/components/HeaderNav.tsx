import React from 'react';
import { ViewMode, ActiveTab } from '../types';
import { 
  Radio, 
  Smartphone, 
  Monitor, 
  Activity, 
  Receipt, 
  QrCode, 
  AppWindow, 
  Code2, 
  Bot, 
  Sparkles,
  Zap,
  Mic,
  Waves,
  Terminal
} from 'lucide-react';

interface HeaderNavProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  harmonyBalance: number;
  onlineCount: number;
  totalCount: number;
  onOpenAi: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  viewMode,
  setViewMode,
  activeTab,
  setActiveTab,
  harmonyBalance,
  onlineCount,
  totalCount,
  onOpenAi
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0b0f19]/90 backdrop-blur-md border-b border-emerald-900/30">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-cyan-500 to-amber-400 p-[1px] shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-[#0d1322] rounded-[11px] flex items-center justify-center">
                <Zap className="w-5 h-5 text-emerald-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-emerald-400 bg-clip-text text-transparent">
                  Sovereign ISP
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Dragon9 Heart
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Fluid Motion Decentralized Data Mesh & P2P Network
              </p>
            </div>
          </div>

          {/* Center Status Pulse */}
          <div className="hidden lg:flex items-center gap-4 bg-slate-900/80 border border-slate-800 rounded-full px-4 py-1.5 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-400 font-medium">{onlineCount}/{totalCount} Mesh Nodes Online</span>
            </div>
            <span className="text-slate-700">|</span>
            <span className="text-slate-400">Latency: <span className="text-cyan-400 font-mono">8.2ms</span></span>
            <span className="text-slate-700">|</span>
            <span className="text-slate-400">Monthly Carrier Fee: <span className="text-emerald-400 font-bold">$0.00</span></span>
          </div>

          {/* Right Section: Harmony Notes + Mode Toggle + AI Button */}
          <div className="flex items-center gap-3">
            {/* Harmony Notes Balance */}
            <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-amber-500/5 border border-amber-500/30 rounded-full px-3 py-1.5 text-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-300 font-medium">Harmony:</span>
              <span className="font-mono font-bold text-amber-300">
                {harmonyBalance.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} 🎵
              </span>
            </div>

            {/* View Mode Switcher (Mobile App Interface vs Commander Dashboard) */}
            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setViewMode('mobile')}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                  viewMode === 'mobile'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Mobile App View for Non-Technical Users"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mobile App</span>
              </button>
              <button
                onClick={() => setViewMode('desktop')}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                  viewMode === 'desktop'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Node Commander Full Dashboard"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Commander</span>
              </button>
            </div>

            {/* AI Assistant Button */}
            <button
              onClick={onOpenAi}
              className="flex items-center gap-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
            >
              <Bot className="w-4 h-4 text-cyan-400" />
              <span className="hidden md:inline">Dragon9 AI</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-800/60 text-xs">
          <button
            onClick={() => setActiveTab('monitor')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'monitor'
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Node Monitor & Map</span>
          </button>

          <button
            onClick={() => setActiveTab('billing')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'billing'
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Zero-Cost Billing & Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('setup')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'setup'
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>1-Click SMS Join & Setup</span>
          </button>

          <button
            onClick={() => setActiveTab('walkie')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'walkie'
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Walkie Talkie (Elite PTT)</span>
          </button>

          <button
            onClick={() => setActiveTab('apps')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'apps'
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <AppWindow className="w-3.5 h-3.5" />
            <span>Sovereign Apps & Add-ons</span>
          </button>

          <button
            onClick={() => setActiveTab('ledger')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'ledger'
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Developer Ledger & Splits</span>
          </button>

          <button
            onClick={() => setActiveTab('avatar_forge')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'avatar_forge'
                ? 'bg-slate-800 text-purple-400 border border-purple-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Mic className="w-3.5 h-3.5 text-purple-400" />
            <span>Avatar Forge (Director Voice)</span>
          </button>

          <button
            onClick={() => setActiveTab('tide_synth')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'tide_synth'
                ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Waves className="w-3.5 h-3.5 text-cyan-400" />
            <span>Tide Synth Engine</span>
          </button>

          <button
            onClick={() => setActiveTab('terminal')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'terminal'
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sovereign Terminal</span>
          </button>
        </div>
      </div>
    </header>
  );
};
