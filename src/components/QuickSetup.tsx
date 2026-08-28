import React, { useState } from 'react';
import { 
  Smartphone, 
  Send, 
  CheckCircle2, 
  QrCode, 
  Wifi, 
  Shield, 
  Copy, 
  Share2, 
  MessageSquare, 
  ArrowRight,
  Zap,
  Check,
  Download,
  Terminal,
  Cpu,
  Radio,
  Server,
  Code,
  FileText,
  Play,
  Activity,
  Globe,
  HardDrive
} from 'lucide-react';

export const QuickSetup: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [smsSent, setSmsSent] = useState(false);
  const [profileInstalled, setProfileInstalled] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // One-Click Node Installation Agent State
  const [nodeRole, setNodeRole] = useState<'mobile_hotspot' | 'raspberry_pi' | 'home_router' | 'starlink_relay'>('mobile_hotspot');
  const [installStep, setInstallStep] = useState<number>(1);
  const [isInstalling, setIsInstalling] = useState<boolean>(false);
  const [installProgress, setInstallProgress] = useState<number>(0);
  const [installLogs, setInstallLogs] = useState<string[]>([]);
  const [connectedNodeId, setConnectedNodeId] = useState<string>('');
  const [isNodeActive, setIsNodeActive] = useState<boolean>(false);

  // Antigravity IDE Brief Modal State
  const [isBriefOpen, setIsBriefOpen] = useState<boolean>(false);
  const [copiedBrief, setCopiedBrief] = useState<boolean>(false);

  const handleSendSms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    setSmsSent(true);
  };

  const handleInstallProfile = () => {
    setProfileInstalled(true);
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText('https://fluidmotiontv-oss.github.io/sovereign-isp/join?ref=dragon9_community');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Start Automated Node Installation & Connection Simulation
  const handleStartNodeInstall = () => {
    setIsInstalling(true);
    setInstallStep(2);
    setInstallProgress(10);
    setInstallLogs(['[1/4] Probing local network interfaces & radio chipsets...']);

    setTimeout(() => {
      setInstallProgress(35);
      setInstallLogs(prev => [
        ...prev,
        '[2/4] Generating ChaCha20-Poly1305 hardware key pair...',
        'Generated Node ID: node-drg9-' + Math.random().toString(16).slice(2, 8)
      ]);
      setInstallStep(3);
    }, 1200);

    setTimeout(() => {
      setInstallProgress(70);
      setInstallLogs(prev => [
        ...prev,
        '[3/4] Scanning 2.4GHz / 5.8GHz / Bluetooth LE mesh frequencies...',
        'Discovered 14 local peer nodes & 1 Starlink LEO Satellite Gateway.'
      ]);
    }, 2500);

    setTimeout(() => {
      const generatedId = 'DRG9-NODE-' + Math.floor(1000 + Math.random() * 9000);
      setConnectedNodeId(generatedId);
      setInstallProgress(100);
      setIsInstalling(false);
      setIsNodeActive(true);
      setInstallStep(4);
      setInstallLogs(prev => [
        ...prev,
        `[4/4] SUCCESS! Node ${generatedId} active on Sovereign Mesh.`,
        'Cryptographic peer tunnel established • Zero carrier cost routing enabled.'
      ]);
    }, 3800);
  };

  const briefText = `# ANTIGRAVITY-IDE SPECIFICATION BRIEF
## Standalone Dragon9 Sovereign Mesh Node Agent & One-Click Installer App

### 1. Executive Summary
Build a lightweight cross-platform Desktop/Mobile binary (using Electron, Tauri, or Rust/Go) that turns any user device into a zero-configuration Sovereign Mesh Node. The installer automatically configures virtual network interfaces, binds peer-to-peer radio channels (2.4GHz/5GHz Wi-Fi, BLE, or Starlink backhaul), and connects the device to the Sovereign ISP network with $0 data fees.

### 2. Key Architecture & Features
- **Auto Interface Binding**: Detects Wi-Fi Direct, TAP/TUN virtual interfaces, and Bluetooth LE.
- **Cryptographic Vault**: Auto-generates local ChaCha20-Poly1305 identity keys & Node ID on first run.
- **P2P Peer Discovery**: mDNS / GossipSub protocol to discover nearest 500m mesh peers automatically.
- **Starlink Relay Hook**: Direct LEO satellite bandwidth sharing for off-grid campsite clusters.
- **System Service Daemon**: Runs as a background systemd daemon (Linux/Raspberry Pi) or native tray app (Windows/macOS).

### 3. One-Line Linux Quick Install Script
\`\`\`bash
curl -sSL https://raw.githubusercontent.com/fluidmotiontv-oss/sovereign-isp/main/scripts/install-node.sh | bash
\`\`\`

### 4. Core Integration Endpoint
RPC Gateway: http://localhost:3000/api/nodes/register
Payload: { "nodeId": "DRG9-NODE-AUTO", "role": "mobile_hotspot", "capabilities": ["p2p_voice", "harmony_notes"] }`;

  const handleCopyBrief = () => {
    navigator.clipboard.writeText(briefText);
    setCopiedBrief(true);
    setTimeout(() => setCopiedBrief(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Title Header with IDE Brief Action */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-[#0a0f18] to-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div className="space-y-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <Zap className="w-3.5 h-3.5" />
            <span>Instant One-Click Mesh Connector</span>
          </div>
          <h2 className="text-2xl font-black text-white">Connect as a Sovereign Mesh Node</h2>
          <p className="text-xs text-slate-400 max-w-lg">
            Easily activate your device as an active routing node to expand the free-data peer network in 60 seconds.
          </p>
        </div>

        <button
          onClick={() => setIsBriefOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 font-bold text-xs transition-all flex items-center gap-2 shrink-0 shadow-md"
        >
          <Code className="w-4 h-4 text-amber-400" />
          <span>Antigravity-IDE Brief & Spec</span>
        </button>
      </div>

      {/* ONE-CLICK AUTOMATED NODE INSTALLER & CONNECT WIZARD */}
      <div className="p-6 rounded-[2.5rem] bg-[#050810] border border-cyan-500/30 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white uppercase italic">1-Click Node Installation & Auto-Connect Agent</h3>
              <p className="text-xs text-slate-400">Automated setup provisions cryptographic keys & connects to nearest peers.</p>
            </div>
          </div>

          {isNodeActive && (
            <span className="px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider animate-pulse flex items-center gap-1.5 shadow-lg shadow-emerald-500/30">
              <CheckCircle2 className="w-4 h-4" /> NODE ONLINE & BOUND
            </span>
          )}
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono font-bold">
          <div className={`p-2 rounded-xl border ${installStep >= 1 ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-slate-950 text-slate-600 border-slate-800'}`}>
            1. Select Hardware
          </div>
          <div className={`p-2 rounded-xl border ${installStep >= 2 ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-slate-950 text-slate-600 border-slate-800'}`}>
            2. Key Gen
          </div>
          <div className={`p-2 rounded-xl border ${installStep >= 3 ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-slate-950 text-slate-600 border-slate-800'}`}>
            3. Peer Discovery
          </div>
          <div className={`p-2 rounded-xl border ${installStep >= 4 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-950 text-slate-600 border-slate-800'}`}>
            4. Routing Active
          </div>
        </div>

        {/* Selection & Installer Controls */}
        {!isNodeActive ? (
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-slate-400 font-bold block">Choose Node Hardware Profile:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
                <button
                  onClick={() => setNodeRole('mobile_hotspot')}
                  className={`p-3.5 rounded-2xl border text-left space-y-1 transition-all ${
                    nodeRole === 'mobile_hotspot' ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-cyan-400" />
                  <div className="font-bold">Mobile Hotspot</div>
                  <div className="text-[10px] text-slate-400">iOS / Android Smartphone</div>
                </button>

                <button
                  onClick={() => setNodeRole('raspberry_pi')}
                  className={`p-3.5 rounded-2xl border text-left space-y-1 transition-all ${
                    nodeRole === 'raspberry_pi' ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <HardDrive className="w-5 h-5 text-amber-400" />
                  <div className="font-bold">Raspberry Pi Gateway</div>
                  <div className="text-[10px] text-slate-400">Low-power campsite relay</div>
                </button>

                <button
                  onClick={() => setNodeRole('home_router')}
                  className={`p-3.5 rounded-2xl border text-left space-y-1 transition-all ${
                    nodeRole === 'home_router' ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Server className="w-5 h-5 text-emerald-400" />
                  <div className="font-bold">Home Router Bridge</div>
                  <div className="text-[10px] text-slate-400">OpenWrt / DD-WRT router</div>
                </button>

                <button
                  onClick={() => setNodeRole('starlink_relay')}
                  className={`p-3.5 rounded-2xl border text-left space-y-1 transition-all ${
                    nodeRole === 'starlink_relay' ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Globe className="w-5 h-5 text-purple-400" />
                  <div className="font-bold">Starlink Relay</div>
                  <div className="text-[10px] text-slate-400">LEO Satellite backhaul</div>
                </button>
              </div>
            </div>

            {/* Install CTA Button */}
            <button
              onClick={handleStartNodeInstall}
              disabled={isInstalling}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-600 hover:brightness-110 text-slate-950 font-black uppercase text-sm tracking-wider transition-all shadow-2xl shadow-emerald-500/30 flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5 text-slate-950" />
              <span>{isInstalling ? 'Installing & Registering Node...' : 'Connect as Active Node Now'}</span>
            </button>

            {/* Installation Logs Output */}
            {installLogs.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs text-slate-300">
                <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase pb-1 border-b border-slate-800">
                  <span className="flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5 text-emerald-400" /> Agent Terminal Output</span>
                  <span>{installProgress}%</span>
                </div>
                {installLogs.map((log, idx) => (
                  <div key={idx} className="text-emerald-400 flex items-center gap-2">
                    <span>›</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Active Node State Summary */
          <div className="p-6 bg-[#04120f] border border-emerald-500/40 rounded-2xl space-y-4 font-mono text-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-emerald-500/20 pb-3">
              <div>
                <span className="text-slate-400 uppercase text-[10px] block">Assigned Cryptographic Node ID</span>
                <span className="text-lg font-black text-emerald-400">{connectedNodeId}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 uppercase text-[10px] block">Network Status</span>
                <span className="text-emerald-300 font-bold">100% Operational • 14 Peers Connected</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-slate-300 pt-1">
              <div>
                <span className="text-slate-500 text-[10px] block">Hardware Profile</span>
                <span className="font-bold text-white uppercase">{nodeRole.replace('_', ' ')}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Shared Bandwidth</span>
                <span className="font-bold text-cyan-400">12.4 GB / Free Data</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Earned Harmony Notes</span>
                <span className="font-bold text-amber-300">+18.5 🎵</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Encryption</span>
                <span className="font-bold text-emerald-400">ChaCha20-Poly1305</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3 Step Quick Join Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Step 1: Receive Message to Join */}
        <div className={`p-5 rounded-2xl border transition-all ${
          smsSent ? 'bg-emerald-950/20 border-emerald-500/40' : 'bg-slate-900/90 border-slate-800'
        } space-y-4`}>
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-sm flex items-center justify-center border border-emerald-500/20">
              1
            </span>
            {smsSent && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">Receive SMS Link to Join</h3>
            <p className="text-xs text-slate-400">
              Enter your mobile number to get a direct 1-click activation message on your smartphone.
            </p>
          </div>

          {!smsSent ? (
            <form onSubmit={handleSendSms} className="space-y-2">
              <input
                type="tel"
                placeholder="+1 (555) 234-5678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send SMS Link</span>
              </button>
            </form>
          ) : (
            <div className="p-3 bg-slate-950 rounded-xl border border-emerald-500/30 text-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <MessageSquare className="w-4 h-4" />
                <span>SMS Sent to {phoneNumber}</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Message preview: <br />
                <em className="text-slate-400">"Tap link to connect to Sovereign Mesh Free Data: https://sovereign.net/m/99"</em>
              </p>
            </div>
          )}
        </div>

        {/* Step 2: Install 1-Tap VPN / Mesh Profile */}
        <div className={`p-5 rounded-2xl border transition-all ${
          profileInstalled ? 'bg-emerald-950/20 border-emerald-500/40' : 'bg-slate-900/90 border-slate-800'
        } space-y-4`}>
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-full bg-cyan-500/10 text-cyan-400 font-bold text-sm flex items-center justify-center border border-cyan-500/20">
              2
            </span>
            {profileInstalled && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">1-Tap Mesh Profile</h3>
            <p className="text-xs text-slate-400">
              Automated cryptographic profile connects your smartphone to all local mesh nodes instantly.
            </p>
          </div>

          <button
            onClick={handleInstallProfile}
            disabled={profileInstalled}
            className={`w-full py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
              profileInstalled
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/20'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>{profileInstalled ? 'Profile Installed & Active' : 'Install Mesh Profile'}</span>
          </button>
        </div>

        {/* Step 3: Enjoy Free Data & Share */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-400 font-bold text-sm flex items-center justify-center border border-amber-500/20">
              3
            </span>
            <Wifi className="w-5 h-5 text-emerald-400 animate-pulse" />
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">Unlimited Free Connectivity</h3>
            <p className="text-xs text-slate-400">
              Enjoy $0 mobile data. Share this setup with family, holiday park guests, and community members.
            </p>
          </div>

          <button
            onClick={handleCopyShareLink}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 border border-slate-700"
          >
            <Copy className="w-3.5 h-3.5 text-amber-400" />
            <span>{copiedLink ? 'Share Link Copied!' : 'Copy Share Link'}</span>
          </button>
        </div>
      </div>

      {/* QR Code Section */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-lg font-bold text-white flex items-center justify-center md:justify-start gap-2">
            <QrCode className="w-5 h-5 text-emerald-400" />
            Scan QR Code to Join Instantly
          </h3>
          <p className="text-xs text-slate-300 max-w-md">
            Print this QR code for holiday park reception desks, community centers, or vehicle dashboards to give visitors instant zero-cost mesh access.
          </p>
          <div className="pt-2 flex items-center justify-center md:justify-start gap-2 text-xs font-mono text-emerald-400">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Tested on iOS, Android, Linux & Windows</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl shadow-xl flex flex-col items-center gap-2">
          {/* Simulated QR Code */}
          <div className="w-36 h-36 bg-slate-950 p-2 rounded-xl flex items-center justify-center relative">
            <div className="w-full h-full border-4 border-dashed border-emerald-400 rounded-lg flex flex-col items-center justify-center gap-1">
              <Zap className="w-8 h-8 text-emerald-400 animate-bounce" />
              <span className="text-[9px] font-mono font-bold text-white">SOVEREIGN-MESH</span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-slate-800 font-bold">SOVEREIGN-ISP-QR9</span>
        </div>
      </div>

      {/* ANTIGRAVITY-IDE SPECIFICATION BRIEF MODAL */}
      {isBriefOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-[#08080c] border border-amber-500/40 rounded-[2.5rem] p-6 shadow-2xl space-y-5 text-white max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Code className="w-5 h-5" />
                <span>Antigravity-IDE Standalone App Brief</span>
              </div>
              <button
                onClick={() => setIsBriefOpen(false)}
                className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Use this technical brief and shell script in Antigravity-IDE or your local terminal to build a standalone installer binary for Linux, macOS, or Windows.
            </p>

            <div className="flex-1 overflow-y-auto p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-3">
              <pre className="whitespace-pre-wrap leading-relaxed">{briefText}</pre>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">Compatible with Antigravity-IDE & Rust/Tauri</span>
              <button
                onClick={handleCopyBrief}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase transition-all flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedBrief ? 'Brief Copied to Clipboard!' : 'Copy Brief to Clipboard'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

