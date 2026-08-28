import React, { useState } from 'react';
import { AddonApp } from '../types';
import { 
  Zap, 
  Radio, 
  Tv, 
  Wallet, 
  Share2, 
  CheckCircle2, 
  Sparkles, 
  Layers,
  Film,
  Palette
} from 'lucide-react';

interface EcosystemAppsHubProps {
  apps: AddonApp[];
}

export const EcosystemAppsHub: React.FC<EcosystemAppsHubProps> = ({ apps }) => {
  const [sharedMessage, setSharedMessage] = useState<string | null>(null);

  const getAppIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap':
        return <Zap className="w-5 h-5 text-emerald-400" />;
      case 'Radio':
        return <Radio className="w-5 h-5 text-cyan-400" />;
      case 'Tv':
        return <Tv className="w-5 h-5 text-purple-400" />;
      case 'Film':
        return <Film className="w-5 h-5 text-amber-400" />;
      case 'Palette':
        return <Palette className="w-5 h-5 text-fuchsia-400" />;
      case 'Wallet':
        return <Wallet className="w-5 h-5 text-emerald-400" />;
      default:
        return <Layers className="w-5 h-5 text-emerald-400" />;
    }
  };

  const handleLaunchAppDemo = (app: AddonApp) => {
    setSharedMessage(`Launched ${app.title}. Mesh packet routing enabled! Earned +5.0 Harmony Notes.`);
    setTimeout(() => {
      setSharedMessage(null);
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Title */}
      <div className="bg-[#08080a] border border-[#222] p-6 rounded-[2rem] space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Sovereign Community Apps & Add-ons</span>
        </div>
        <h2 className="text-2xl font-black italic uppercase text-white tracking-tight font-sans">
          Peer-to-Peer Community Apps & Add-ons
        </h2>
        <p className="text-xs text-slate-400 max-w-2xl">
          High-demand peer-to-peer applications with built-in mesh networking. Every app shared expands the Sovereign ISP data network while rewarding users with Harmony Notes.
        </p>
      </div>

      {/* Toast Banner */}
      {sharedMessage && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{sharedMessage}</span>
        </div>
      )}

      {/* Grid of Apps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {apps.map((app) => (
          <div
            key={app.id}
            className="bg-[#08080a] border border-[#222] rounded-[2rem] p-6 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-[#030304] border border-[#1e1e24] shadow-lg">
                    {getAppIcon(app.iconName)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{app.title}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#18181f] text-slate-300 font-mono">
                      {app.category}
                    </span>
                  </div>
                </div>
                {app.featured && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    Featured Add-on
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300">{app.tagline}</p>

              {/* Embedded Mesh Mechanism */}
              <div className="p-3 rounded-2xl bg-[#030304] border border-[#1e1e24] text-xs space-y-1">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">P2P Mesh Engine:</span>
                <p className="text-emerald-400 font-medium">{app.embeddedMeshFeature}</p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs border-t border-[#1e1e24]">
              <span className="text-slate-400 font-mono text-[11px]">
                {app.downloadsCount.toLocaleString()} active shares
              </span>

              <button
                onClick={() => handleLaunchAppDemo(app)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:brightness-110 text-white font-bold text-xs transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Launch & Share Add-on</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
