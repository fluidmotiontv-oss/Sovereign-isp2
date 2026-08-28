import React, { useState } from 'react';
import { 
  Wifi, 
  ShieldCheck, 
  Radio, 
  Send, 
  QrCode, 
  Sparkles, 
  CheckCircle2, 
  ArrowUpRight, 
  Smartphone,
  Share2,
  Copy,
  Zap,
  Volume2
} from 'lucide-react';
import { MeshNode } from '../types';

interface MobileAppViewProps {
  nodes: MeshNode[];
  harmonyBalance: number;
  onOpenWalkie: () => void;
  onDeployNode: () => void;
}

export const MobileAppView: React.FC<MobileAppViewProps> = ({
  nodes,
  harmonyBalance,
  onOpenWalkie,
  onDeployNode
}) => {
  const [joined, setJoined] = useState(true);
  const [phoneInput, setPhoneInput] = useState('');
  const [smsSent, setSmsSent] = useState(false);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const nearestNode = nodes[0] || null;

  const handleSendSmsJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput) return;
    setSmsSent(true);
    setTimeout(() => {
      setJoined(true);
    }, 1500);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://fluidmotiontv-oss.github.io/sovereign-isp/join?mesh=dragon9');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const playBeepSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // High pitch PTT beep
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
      // Audio context fallback
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 space-y-6">
      {/* Mobile App Header Device Frame Simulation */}
      <div className="relative rounded-3xl bg-slate-950 border border-slate-800/80 p-5 shadow-2xl shadow-emerald-950/40">
        
        {/* Status Indicator */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
              <Wifi className="w-4 h-4 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Sovereign Data Mesh</p>
              <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Connected to {nearestNode?.name || 'Dragon9 Mesh'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Cellular Bill</span>
            <span className="text-sm font-black text-emerald-400">$0.00 / mo</span>
          </div>
        </div>

        {/* Free Unlimited Data Badge */}
        <div className="mt-5 p-4 rounded-2xl bg-gradient-to-br from-emerald-950/60 via-slate-900 to-cyan-950/60 border border-emerald-500/30 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-3 -translate-y-3 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl pointer-events-none"></div>
          <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
          <h3 className="text-lg font-bold text-white">Free Data for All Members</h3>
          <p className="text-xs text-slate-300 mt-1">
            Zero hidden fees. Zero usage caps. Replaces standard mobile network contracts ($120/mo saved).
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2 text-left bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 block">Monthly Bandwidth</span>
              <span className="text-sm font-mono font-bold text-cyan-300">388 GB Shared</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Harmony Earned</span>
              <span className="text-sm font-mono font-bold text-amber-300">{harmonyBalance} 🎵</span>
            </div>
          </div>
        </div>

        {/* 1-Tap PTT Walkie-Talkie Button for Elites & Members */}
        <div className="mt-5 p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30 text-center space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-white">Dragon9 Walkie Talkie</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Freq 99.9 MHz
            </span>
          </div>

          <button
            onMouseDown={() => {
              setIsTransmitting(true);
              playBeepSound();
            }}
            onMouseUp={() => setIsTransmitting(false)}
            onTouchStart={() => {
              setIsTransmitting(true);
              playBeepSound();
            }}
            onTouchEnd={() => setIsTransmitting(false)}
            className={`w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 select-none touch-none ${
              isTransmitting
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/50 scale-95'
                : 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-white shadow-lg shadow-cyan-600/20 hover:brightness-110'
            }`}
          >
            <Volume2 className={`w-5 h-5 ${isTransmitting ? 'animate-ping' : ''}`} />
            <span>{isTransmitting ? 'TRANSMITTING VOICE...' : 'PRESS & HOLD TO TALK (PTT)'}</span>
          </button>
          <p className="text-[11px] text-slate-400">
            Push-to-talk voice encrypted over peer-to-peer mesh. No cellular towers needed.
          </p>
        </div>

        {/* Easy Join via SMS / Message Link */}
        {!joined ? (
          <div className="mt-5 p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold text-white">Receive SMS Message to Join</h4>
            </div>
            <p className="text-xs text-slate-400">
              Enter your mobile number to receive instant 1-click mesh activation code:
            </p>
            <form onSubmit={handleSendSmsJoin} className="space-y-2">
              <input
                type="tel"
                placeholder="+1 (555) 019-2831"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{smsSent ? 'SMS Sent! Connecting...' : 'Get Instant Access SMS'}</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="mt-5 p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Member Registered & Active
              </span>
              <span className="text-slate-400 font-mono text-[10px]">ID: #DRAGON9-8812</span>
            </div>
            <div className="flex items-center justify-between pt-2 text-xs">
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-all text-xs"
              >
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>{copiedLink ? 'Link Copied!' : 'Share SMS Join Link'}</span>
              </button>
              <button
                onClick={onOpenWalkie}
                className="flex items-center gap-1 text-cyan-400 font-medium hover:underline text-xs"
              >
                <span>Full Radio Room</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Nearby Mesh Gateways / Holiday Parks */}
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300">Nearby Mesh Gateways</span>
            <span className="text-slate-500 text-[10px]">Blockchain Verified</span>
          </div>

          <div className="space-y-2">
            {nodes.slice(0, 3).map((node) => (
              <div
                key={node.id}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs hover:border-slate-700 transition-all"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white">{node.name}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                      {node.type.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{node.location} • Latency {node.latencyMs}ms</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-emerald-400 block">{node.bandwidthMbps} Mbps</span>
                  <span className="text-[10px] text-slate-400">{node.connectedPeers} peers</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deploy Local Node CTA */}
        <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-emerald-500/10 border border-amber-500/20 text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-bold text-amber-300">Host a Node & Earn Harmony Notes</h4>
          </div>
          <p className="text-[11px] text-slate-300">
            Turn your home router, laptop, or holiday park cabin into a mesh node. Earn automatic Harmony Notes for routing peer data.
          </p>
          <button
            onClick={onDeployNode}
            className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Deploy Node in 1 Click</span>
          </button>
        </div>

      </div>
    </div>
  );
};
