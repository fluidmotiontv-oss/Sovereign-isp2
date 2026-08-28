import React, { useState, useEffect } from 'react';
import { WalkieTalkieChannel, WalkieTalkieMessage, MateTalkie, DistressBeaconAlert } from '../types';
import { 
  Radio, 
  Volume2, 
  VolumeX, 
  Mic, 
  Lock, 
  Unlock, 
  Send, 
  Sparkles, 
  Users, 
  Baby, 
  Wind, 
  Play,
  Battery,
  Signal,
  MapPin,
  Plus,
  CheckCircle2,
  X,
  Copy,
  Zap,
  Activity,
  ShieldCheck,
  Headphones,
  AlertTriangle,
  Phone,
  PhoneIncoming,
  PhoneOff,
  PhoneCall,
  Voicemail,
  Flame,
  ShieldAlert,
  Clock,
  Heart
} from 'lucide-react';

interface WalkieTalkieProps {
  channels: WalkieTalkieChannel[];
  messages: WalkieTalkieMessage[];
  mates: MateTalkie[];
  onSendMessage: (channelId: string, text: string, isAudio: boolean) => void;
  onAddMate?: (mate: MateTalkie) => void;
}

export const WalkieTalkie: React.FC<WalkieTalkieProps> = ({
  channels,
  messages,
  mates,
  onSendMessage,
  onAddMate
}) => {
  const [activeTab, setActiveTab] = useState<'console' | 'mates' | 'beacon' | 'plasma_call' | 'baby_monitor' | 'whisper_wind'>('mates');
  const [selectedChannelId, setSelectedChannelId] = useState<string>(channels[0]?.id || 'chan-01');
  const [isTransmitting, setIsTransmitting] = useState<boolean>(false);
  const [textInput, setTextInput] = useState<string>('');
  const [volumeMuted, setVolumeMuted] = useState<boolean>(false);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  // Baby Monitor State
  const [babyMonitorActive, setBabyMonitorActive] = useState<boolean>(true);
  const [decibelThreshold, setDecibelThreshold] = useState<number>(55); // dB threshold
  const [simulatedNurseryNoise, setSimulatedNurseryNoise] = useState<number>(24);
  const [babyAlertTriggered, setBabyAlertTriggered] = useState<boolean>(false);

  // WhisperWind State
  const [whisperWindActive, setWhisperWindActive] = useState<boolean>(false);
  const [silentVibration, setSilentVibration] = useState<boolean>(true);

  // Distress Beacon State
  const [beaconActive, setBeaconActive] = useState<boolean>(false);
  const [beaconAlert, setBeaconAlert] = useState<DistressBeaconAlert | null>(null);
  const [beaconDispatchedSuccess, setBeaconDispatchedSuccess] = useState<boolean>(false);

  // Plasma Effects Incoming Call & Answering Service State
  const [isIncomingCallActive, setIsIncomingCallActive] = useState<boolean>(false);
  const [isCallAnswered, setIsCallAnswered] = useState<boolean>(false);
  const [isAnsweringMachineActive, setIsAnsweringMachineActive] = useState<boolean>(false);
  const [callDuration, setCallDuration] = useState<number>(0);
  const [callerInfo, setCallerInfo] = useState<{ name: string; avatar: string; node: string }>({
    name: 'Sarah (Cornwall Pitch 12)',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    node: 'Cornwall Coastal Mesh Node #12'
  });
  const [voicemailList, setVoicemailList] = useState<{ id: string; caller: string; time: string; durationSec: number; transcript: string }[]>([
    {
      id: 'vm-01',
      caller: 'Dave (Vista Node 04)',
      time: '10 mins ago',
      durationSec: 8,
      transcript: 'Hey! Just checking in on the campsite node signal. Give me a shout back on 99.9 MHz!'
    },
    {
      id: 'vm-02',
      caller: 'Gaz (Highland Mobile Mesh)',
      time: '1 hour ago',
      durationSec: 12,
      transcript: 'Plasma answering service captured: WhisperWind stream received smoothly. All clear here.'
    }
  ]);

  // Add Mate Modal
  const [isAddMateModalOpen, setIsAddMateModalOpen] = useState<boolean>(false);
  const [newMateName, setNewMateName] = useState<string>('');
  const [newMateLocation, setNewMateLocation] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const selectedChannel = channels.find(c => c.id === selectedChannelId) || channels[0];
  const channelMessages = messages.filter(m => m.channelId === selectedChannelId);

  // Play realistic Walkie-Talkie Radio Beep using Web Audio API
  const playRadioBeep = (freq = 880) => {
    if (volumeMuted) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch (e) {
      // Audio fallback
    }
  };

  const handleStartPtt = () => {
    setIsTransmitting(true);
    playRadioBeep(920);
  };

  const handleStopPtt = () => {
    if (isTransmitting) {
      setIsTransmitting(false);
      playRadioBeep(440);
      const modePrefix = whisperWindActive 
        ? '[WhisperWind Encrypted Stream Broadcasted]' 
        : '[Voice Transmission Broadcasted over Peer Mesh]';
      onSendMessage(selectedChannelId, modePrefix, true);
    }
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    onSendMessage(selectedChannelId, textInput, false);
    setTextInput('');
  };

  const handleSimulatePlayAudio = (msgId: string) => {
    setPlayingAudioId(msgId);
    playRadioBeep(600);
    setTimeout(() => {
      setPlayingAudioId(null);
    }, 2000);
  };

  // Simulate nursery noise spike for Baby Monitor
  const triggerNurseryCrySimulation = () => {
    setSimulatedNurseryNoise(78);
    setBabyAlertTriggered(true);
    playRadioBeep(1100);
    onSendMessage('chan-02', '👶 [BABY MONITOR ALERT] Acoustic crying sound detected (78 dB) in Nursery Channel!', false);

    setTimeout(() => {
      setSimulatedNurseryNoise(32);
    }, 4000);
  };

  // Timer for active call duration
  useEffect(() => {
    let timer: any;
    if (isCallAnswered) {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [isCallAnswered]);

  // Distress Beacon Dispatch Handler
  const handleTriggerDistressBeacon = () => {
    playRadioBeep(1200);
    setBeaconActive(true);
    setBeaconDispatchedSuccess(true);

    const alertData: DistressBeaconAlert = {
      id: `beacon-${Date.now().toString(36)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      location: 'Campsite Mesh Zone (Pitch 14 / Sector B)',
      coordinates: { x: 48, y: 52 },
      status: 'responding',
      closestPeersCount: 4,
      anonymousNote: 'Silent Anonymous Wellness Check requested via Mesh Radio.',
      responders: [
        { id: 'r1', name: 'Peer Node #04 (120m away)', distanceMeters: 120, status: 'Accepted & Dispatched' },
        { id: 'r2', name: 'Campsite Gateway #12 (210m away)', distanceMeters: 210, status: 'En Route for Discrete Check' },
        { id: 'r3', name: 'Community Helper Mobile Node (340m away)', distanceMeters: 340, status: 'Standing By' }
      ]
    };
    setBeaconAlert(alertData);
    onSendMessage('chan-01', '🚨 [DISCRETE DISTRESS BEACON] Anonymous Wellness Check requested for nearest 4 mesh peers.', false);
  };

  const handleCancelDistressBeacon = () => {
    playRadioBeep(440);
    setBeaconActive(false);
    setBeaconAlert(null);
    setBeaconDispatchedSuccess(false);
  };

  // Plasma Effect Incoming Call Handlers
  const handleSimulatePlasmaCall = () => {
    setIsIncomingCallActive(true);
    setIsCallAnswered(false);
    setIsAnsweringMachineActive(false);
    playRadioBeep(1050);
  };

  const handleAnswerPlasmaCall = () => {
    setIsCallAnswered(true);
    setIsAnsweringMachineActive(false);
    playRadioBeep(880);
  };

  const handleRouteToAnsweringService = () => {
    setIsAnsweringMachineActive(true);
    setIsCallAnswered(false);
    playRadioBeep(600);

    // Record an automated voicemail entry
    const newVm = {
      id: `vm-${Date.now().toString(36)}`,
      caller: callerInfo.name,
      time: 'Just now',
      durationSec: 6,
      transcript: 'Plasma Answering Service: "Hey! Left a voice memo over Dragon9 mesh while you were away."'
    };
    setVoicemailList(prev => [newVm, ...prev]);

    setTimeout(() => {
      setIsIncomingCallActive(false);
      setIsAnsweringMachineActive(false);
    }, 3000);
  };

  const handleDeclinePlasmaCall = () => {
    setIsIncomingCallActive(false);
    setIsCallAnswered(false);
    setIsAnsweringMachineActive(false);
    playRadioBeep(350);
  };

  const handleCreateMateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMateName) return;

    const newMate: MateTalkie = {
      id: `mate-${Date.now().toString(36)}`,
      name: newMateName,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      status: 'online',
      nodeLocation: newMateLocation || 'Local Mesh Node',
      distanceKm: 0.8,
      signalStrengthPct: 95,
      batteryPct: 92,
      frequencyChannel: '99.9 MHz',
      lastActive: 'Just now'
    };

    if (onAddMate) {
      onAddMate(newMate);
    }
    setIsAddMateModalOpen(false);
    setNewMateName('');
    setNewMateLocation('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Page Header */}
      <div className="relative rounded-[2.5rem] bg-gradient-to-r from-[#0d131f] via-[#080c14] to-[#0a1818] border border-cyan-500/30 p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Radio className="w-4 h-4" />
              <span>Sovereign ISP P2P Radio & Add-on Suite</span>
            </div>
            <h2 className="text-3xl font-black italic uppercase text-white tracking-tight font-sans">
              Dragon9 Walkie Talkie & Mates Mesh
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Encrypted push-to-talk voice radio, linked talkie mates, Baby Monitor acoustic surveillance, and WhisperWind stealth transmission — completely free without cellular networks.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSimulatePlasmaCall}
              className="py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:brightness-110 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-xl shadow-purple-600/30 animate-pulse"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Simulate Plasma Call</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('beacon');
                handleTriggerDistressBeacon();
              }}
              className="py-3 px-4 rounded-2xl bg-[#1f0a0a] hover:bg-[#2d0f0f] border border-[#FF3E3E] text-[#FF3E3E] font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-[#FF3E3E]/20"
            >
              <AlertTriangle className="w-4 h-4 animate-bounce" />
              <span>🚨 Distress Beacon</span>
            </button>

            <button
              onClick={() => setIsAddMateModalOpen(true)}
              className="py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:brightness-110 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-xl shadow-emerald-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Link New Mate</span>
            </button>
          </div>
        </div>

        {/* Feature Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 pt-6 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setActiveTab('mates')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold transition-all whitespace-nowrap ${
              activeTab === 'mates'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-[#050505] text-slate-400 hover:text-white border border-[#222]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Linked Mates ({mates.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('beacon')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold transition-all whitespace-nowrap ${
              activeTab === 'beacon'
                ? 'bg-[#FF3E3E] text-white shadow-lg shadow-[#FF3E3E]/30'
                : 'bg-[#050505] text-[#FF3E3E] hover:bg-[#1a0a0a] border border-[#FF3E3E]/40'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Distress Beacon {beaconActive && '🚨 ACTIVE'}</span>
          </button>

          <button
            onClick={() => setActiveTab('plasma_call')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold transition-all whitespace-nowrap ${
              activeTab === 'plasma_call'
                ? 'bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white shadow-lg shadow-purple-500/30'
                : 'bg-[#050505] text-purple-300 hover:text-white border border-purple-500/30'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>Plasma Call & Answer Service</span>
          </button>

          <button
            onClick={() => setActiveTab('baby_monitor')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold transition-all whitespace-nowrap ${
              activeTab === 'baby_monitor'
                ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
                : 'bg-[#050505] text-slate-400 hover:text-white border border-[#222]'
            }`}
          >
            <Baby className="w-4 h-4 text-amber-500" />
            <span>Baby Monitor</span>
          </button>

          <button
            onClick={() => setActiveTab('whisper_wind')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold transition-all whitespace-nowrap ${
              activeTab === 'whisper_wind'
                ? 'bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/20'
                : 'bg-[#050505] text-slate-400 hover:text-white border border-[#222]'
            }`}
          >
            <Wind className="w-4 h-4 text-cyan-400" />
            <span>WhisperWind</span>
          </button>

          <button
            onClick={() => setActiveTab('console')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold transition-all whitespace-nowrap ${
              activeTab === 'console'
                ? 'bg-white text-slate-950 shadow-lg shadow-white/20'
                : 'bg-[#050505] text-slate-400 hover:text-white border border-[#222]'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>PTT Radio Console</span>
          </button>
        </div>
      </div>

      {/* TAB 1: LINKED MATES & FRIENDS TALKIES PAGE */}
      {activeTab === 'mates' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black italic uppercase text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                Linked Talkies with Mates
              </h3>
              <p className="text-xs text-slate-400">
                Direct peer-to-peer encrypted voice channels with your connected friends and nearby campsite mates.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              {mates.filter(m => m.status !== 'offline').length} Mates Active
            </span>
          </div>

          {/* Mates Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mates.map((mate) => (
              <div
                key={mate.id}
                className="bg-[#08080a] border border-[#222] rounded-[2rem] p-5 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Avatar + Status Header */}
                  <div className="flex items-center justify-between">
                    <div className="relative">
                      <img
                        src={mate.avatar}
                        alt={mate.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-[#333]"
                      />
                      <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#08080a] ${
                        mate.status === 'online' ? 'bg-emerald-500' :
                        mate.status === 'baby_monitor' ? 'bg-amber-400' :
                        mate.status === 'whisper_wind' ? 'bg-cyan-400' : 'bg-slate-500'
                      }`} />
                    </div>

                    <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      mate.status === 'online' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      mate.status === 'baby_monitor' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' :
                      mate.status === 'whisper_wind' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {mate.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Mate Details */}
                  <div>
                    <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">{mate.name}</h4>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span>{mate.nodeLocation}</span>
                    </p>
                  </div>

                  {/* Distance, Signal & Battery stats */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-[#030304] p-3 rounded-2xl border border-[#1e1e24]">
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase">Distance</span>
                      <span className="text-slate-200 font-bold">{mate.distanceKm} km away</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase">Frequency</span>
                      <span className="text-cyan-400 font-bold">{mate.frequencyChannel}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-300">
                      <Signal className="w-3 h-3 text-emerald-400" />
                      <span>{mate.signalStrengthPct}% Signal</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-300">
                      <Battery className="w-3 h-3 text-amber-400" />
                      <span>{mate.batteryPct}% Battery</span>
                    </div>
                  </div>
                </div>

                {/* Direct Talkie Action */}
                <button
                  onClick={() => {
                    setActiveTab('console');
                    playRadioBeep(920);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#141418] hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 border border-emerald-500/30 font-bold text-xs transition-all flex items-center justify-center gap-2"
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>Push-To-Talk Direct Link</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: ANONYMOUS DISTRESS BEACON & WELLNESS CHECK */}
      {activeTab === 'beacon' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#0d0505] border border-[#FF3E3E]/40 rounded-[2.5rem] p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#2d1212]">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-[#FF3E3E]/10 text-[#FF3E3E] border border-[#FF3E3E]/30 animate-pulse">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black italic uppercase text-white">Mesh Distress Beacon & Wellness Check</h3>
                  <p className="text-xs text-slate-400">
                    Silently broadcasts an emergency request to nearest peer mesh nodes asking closest peers for a discrete, anonymous wellness check.
                  </p>
                </div>
              </div>

              {beaconActive && (
                <span className="px-3 py-1 rounded-full bg-[#FF3E3E] text-white font-mono text-xs font-bold uppercase tracking-wider animate-bounce shadow-lg shadow-[#FF3E3E]/30">
                  BEACON DISPATCHED 🚨
                </span>
              )}
            </div>

            {/* Action Trigger Card */}
            {!beaconActive ? (
              <div className="p-6 bg-[#050202] rounded-2xl border border-[#FF3E3E]/30 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#FF3E3E]/20 flex items-center justify-center text-[#FF3E3E] border border-[#FF3E3E]/40">
                  <ShieldAlert className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-lg font-black uppercase text-white">Need a Discrete Peer Check?</h4>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    Sending a beacon notifies the <strong>nearest 4 mesh peers</strong> in your campsite or mobile node radius (e.g. within 500m) to check on you anonymously. Your personal identity stays 100% private.
                  </p>
                </div>

                <button
                  onClick={handleTriggerDistressBeacon}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FF3E3E] via-red-600 to-amber-500 hover:brightness-110 text-white font-black text-sm uppercase tracking-wider shadow-2xl shadow-[#FF3E3E]/40 transition-all animate-pulse"
                >
                  🚀 BROADCAST ANONYMOUS DISTRESS BEACON
                </button>
              </div>
            ) : (
              <div className="p-6 bg-[#050202] rounded-2xl border border-[#FF3E3E]/50 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500 animate-ping" />
                    <span className="text-sm font-bold text-white uppercase">Active Wellness Dispatch Progress</span>
                  </div>
                  <button
                    onClick={handleCancelDistressBeacon}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-600 hover:text-slate-950 text-slate-200 text-xs font-bold transition-all"
                  >
                    Cancel Beacon (I'm Safe / All OK)
                  </button>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#1e0a0a] h-3 rounded-full overflow-hidden border border-[#FF3E3E]/30">
                  <div className="bg-gradient-to-r from-red-600 via-amber-400 to-emerald-400 h-full w-3/4 animate-pulse"></div>
                </div>

                {/* Responders List */}
                <div className="space-y-2 text-xs font-mono">
                  <span className="text-slate-400 uppercase text-[10px] block">Dispatched Closest Mesh Peers:</span>
                  {beaconAlert?.responders.map((resp) => (
                    <div key={resp.id} className="p-3 bg-[#0a0404] rounded-xl border border-[#FF3E3E]/20 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-white block">{resp.name}</span>
                        <span className="text-[10px] text-slate-400">{resp.distanceMeters}m away from node</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                        {resp.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-[#08080a] border border-[#222] rounded-[2.5rem] p-6 space-y-4">
            <h4 className="text-base font-black uppercase text-white">How Distress Beacon Works</h4>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Zero-Identity Protection:</strong> Your name, phone number, and personal details are omitted from the emergency packet.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Proximity Peer Dispatch:</strong> Only nodes within 500 meters receive the acoustic pulse.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Campsite & Mobile Mesh Ready:</strong> Operates even with 0 cell towers or internet.</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* TAB: PLASMA CALL & ANSWERING SERVICE */}
      {activeTab === 'plasma_call' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#0a0512] border border-purple-500/40 rounded-[2.5rem] p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-purple-950">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-purple-500/10 text-fuchsia-400 border border-purple-500/30">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black italic uppercase text-white">Plasma Effects Incoming Call & Answering Service</h3>
                  <p className="text-xs text-slate-400">
                    High-energy plasma visualizer for P2P mesh voice calls with automatic answering service transcription.
                  </p>
                </div>
              </div>

              <button
                onClick={handleSimulatePlasmaCall}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold text-xs uppercase transition-all shadow-lg shadow-purple-600/30 flex items-center gap-1.5"
              >
                <PhoneIncoming className="w-4 h-4" />
                <span>Test Plasma Call</span>
              </button>
            </div>

            {/* Captured Voicemails List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 font-bold uppercase flex items-center gap-1.5">
                  <Voicemail className="w-4 h-4 text-fuchsia-400" />
                  Captured Mesh Voicemails ({voicemailList.length})
                </span>
                <span className="text-cyan-400 text-[10px]">Dragon9 Speech-to-Text Transcribed</span>
              </div>

              <div className="space-y-3">
                {voicemailList.map((vm) => (
                  <div key={vm.id} className="p-4 bg-[#050308] rounded-2xl border border-purple-500/20 space-y-2 text-xs">
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="font-bold text-fuchsia-300">{vm.caller}</span>
                      <span className="text-slate-500">{vm.time} • ({vm.durationSec}s voice pulse)</span>
                    </div>
                    <p className="text-slate-200 italic bg-[#030205] p-3 rounded-xl border border-[#1a1224]">
                      "{vm.transcript}"
                    </p>
                    <div className="flex items-center justify-between text-[10px] font-mono pt-1">
                      <span className="text-emerald-400">ChaCha20-Poly1305 Voice Stream</span>
                      <button
                        onClick={() => playRadioBeep(650)}
                        className="text-cyan-400 hover:underline flex items-center gap-1 font-bold"
                      >
                        <Play className="w-3 h-3 fill-current" /> Play Voice Recording
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[#08080a] border border-[#222] rounded-[2.5rem] p-6 space-y-4">
            <h4 className="text-base font-black uppercase text-white">Answering Service Features</h4>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Plasma Ring Aura:</strong> Neon electric plasma effects on incoming voice calls.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Automatic Answering Machine:</strong> Captures audio pulses when you are busy or out of range.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Local Node Encryption:</strong> Voice memos stored directly on device without cloud harvesting.</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* TAB 2: SPECIALIZED BABY MONITOR ADD-ON */}
      {activeTab === 'baby_monitor' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#08080a] border border-amber-500/30 rounded-[2rem] p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#222]">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Baby className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black italic uppercase text-white">Baby Monitor & Nursery Squelch</h3>
                  <p className="text-xs text-slate-400">
                    Low-latency acoustic threshold monitoring. Automatically opens P2P audio stream when nursery noise is detected.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setBabyMonitorActive(!babyMonitorActive)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase font-mono transition-all border ${
                  babyMonitorActive
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg shadow-amber-400/20'
                    : 'bg-[#121214] text-slate-400 border-[#333]'
                }`}
              >
                {babyMonitorActive ? 'Baby Monitor ON 👶' : 'Monitor Standby'}
              </button>
            </div>

            {/* Acoustic Decibel Sensitivity Threshold Control */}
            <div className="p-5 bg-[#030304] rounded-2xl border border-[#1e1e24] space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-bold uppercase font-mono">Acoustic Squelch Sensitivity Threshold:</span>
                <span className="text-amber-400 font-mono font-bold text-sm">{decibelThreshold} dB (Trigger)</span>
              </div>

              <input
                type="range"
                min="30"
                max="90"
                value={decibelThreshold}
                onChange={(e) => setDecibelThreshold(parseInt(e.target.value))}
                className="w-full accent-amber-400 bg-[#18181f] h-2 rounded-lg cursor-pointer"
              />

              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>30 dB (Whisper / Soft Breath)</span>
                <span>55 dB (Normal Nursery)</span>
                <span>90 dB (Loud Cry Alert)</span>
              </div>
            </div>

            {/* Live Audio Visualizer for Nursery */}
            <div className="p-5 bg-[#030304] rounded-2xl border border-[#1e1e24] text-center space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Nursery Microphone Channel:</span>
                <span className="text-emerald-400 flex items-center gap-1 font-bold">
                  <Headphones className="w-3.5 h-3.5" /> Sarah's Nursery Node (Pitch 12)
                </span>
              </div>

              <div className="h-16 bg-[#08080a] rounded-xl border border-[#222] flex items-center justify-center gap-1.5 px-4 overflow-hidden">
                {[...Array(32)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      height: `${Math.min(50, Math.max(6, Math.sin(i + simulatedNurseryNoise) * simulatedNurseryNoise + 12))}px`,
                    }}
                    className={`w-1.5 rounded-full transition-all duration-200 ${
                      simulatedNurseryNoise > decibelThreshold
                        ? 'bg-amber-400 animate-pulse'
                        : 'bg-emerald-500/40'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">Current Noise Level: <strong className="text-amber-300">{simulatedNurseryNoise} dB</strong></span>
                <button
                  onClick={triggerNurseryCrySimulation}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all"
                >
                  Simulate Crying Alert Noise
                </button>
              </div>
            </div>

            {/* Encrypted Parent Stream Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/30 to-slate-900 border border-amber-500/30 text-xs space-y-1">
              <span className="font-bold text-amber-300 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> End-to-End Encrypted Nursery Mesh Stream
              </span>
              <p className="text-slate-300">
                Data travels directly between your child's room node and your mobile handset over ChaCha20-Poly1305 key pairs. No cloud servers, no third-party listening.
              </p>
            </div>
          </div>

          {/* Baby Monitor Quick Guide & Status */}
          <div className="bg-[#08080a] border border-[#222] rounded-[2rem] p-6 space-y-4">
            <h4 className="text-base font-black uppercase text-white tracking-wide">Baby Monitor Features</h4>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Instant Squelch Auto-Broadcast:</strong> Re-opens audio immediately when sound exceeds set dB threshold.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Zero Latency P2P:</strong> Sub-10ms local audio transmission without internet or cellular connectivity.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Low Battery Guard:</strong> Alerts parents if nursery tablet or node battery drops below 15%.</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* TAB 3: SPECIALIZED WHISPERWIND STEALTH ADD-ON */}
      {activeTab === 'whisper_wind' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#08080a] border border-cyan-500/30 rounded-[2rem] p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#222]">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Wind className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black italic uppercase text-white">WhisperWind Stealth Mesh</h3>
                  <p className="text-xs text-slate-400">
                    Ultra-low power stealth whisper mesh codec. Amplifies low-decibel whispers while filtering out ambient wind and background noise.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setWhisperWindActive(!whisperWindActive)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase font-mono transition-all border ${
                  whisperWindActive
                    ? 'bg-cyan-400 text-slate-950 border-cyan-300 shadow-lg shadow-cyan-400/20'
                    : 'bg-[#121214] text-slate-400 border-[#333]'
                }`}
              >
                {whisperWindActive ? 'WhisperWind Active 🌬️' : 'WhisperWind Off'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 bg-[#030304] rounded-2xl border border-[#1e1e24] space-y-2">
                <span className="text-slate-400 uppercase text-[10px]">Mesh Audio Codec</span>
                <span className="text-cyan-300 font-bold block text-sm">Opus Ultra-Low 3.2 kbps</span>
                <p className="text-slate-500 text-[10px]">Optimized for extreme long-range mesh relay in wilderness and campsite zones.</p>
              </div>

              <div className="p-4 bg-[#030304] rounded-2xl border border-[#1e1e24] space-y-2">
                <span className="text-slate-400 uppercase text-[10px]">Silent Alert Mode</span>
                <button
                  onClick={() => setSilentVibration(!silentVibration)}
                  className="text-emerald-400 font-bold block text-sm hover:underline"
                >
                  {silentVibration ? 'Haptic Vibration Alert (Active)' : 'Speaker Chimes (Active)'}
                </button>
                <p className="text-slate-500 text-[10px]">Vibrates phone stealthily when incoming whisper transmission arrives.</p>
              </div>
            </div>
          </div>

          <div className="bg-[#08080a] border border-[#222] rounded-[2rem] p-6 space-y-4">
            <h4 className="text-base font-black uppercase text-white">WhisperWind Advantages</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Designed for night ops, quiet campsite hours, and discreet communication between mates. Uses AI DSP spectral subtraction to remove 99.8% of wind turbulence noise.
            </p>
          </div>
        </div>
      )}

      {/* TAB 4: PTT RADIO CONSOLE */}
      {activeTab === 'console' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Channel Tuner */}
          <div className="bg-[#08080a] border border-[#222] rounded-[2rem] p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#222]">
              <span className="text-xs font-bold text-slate-300 uppercase font-mono">Frequency Channels</span>
              <span className="text-[10px] text-cyan-400 font-mono">Dragon9 Mesh</span>
            </div>

            <div className="space-y-2">
              {channels.map((chan) => {
                const isActive = chan.id === selectedChannelId;
                return (
                  <button
                    key={chan.id}
                    onClick={() => {
                      setSelectedChannelId(chan.id);
                      playRadioBeep(700);
                    }}
                    className={`w-full p-3.5 rounded-2xl text-left transition-all border ${
                      isActive 
                        ? 'bg-gradient-to-r from-cyan-950/80 to-[#08080a] border-cyan-500/50 shadow-xl shadow-cyan-950/30' 
                        : 'bg-[#030304] border-[#1e1e24] hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {chan.encrypted ? (
                          <Lock className="w-3.5 h-3.5 text-amber-400" />
                        ) : (
                          <Unlock className="w-3.5 h-3.5 text-slate-500" />
                        )}
                        <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                          {chan.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-cyan-400 font-bold">{chan.frequency}</span>
                    </div>

                    <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
                      <span className="px-2 py-0.5 rounded-full bg-[#18181f] text-slate-300 font-mono">{chan.accessLevel}</span>
                      <span>{chan.activeListeners} active listeners</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right 2 Columns: Walkie Talkie Radio Console & Message Stream */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* PTT Large Button Controls */}
            <div className="bg-[#08080a] border border-[#222] rounded-[2rem] p-6 text-center space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-[#222]">
                <span className="text-slate-400">Tuned Channel: <strong className="text-white">{selectedChannel.name}</strong></span>
                <span className="text-cyan-400 font-mono font-bold">{selectedChannel.frequency}</span>
              </div>

              {/* Audio Signal Visualizer Animation */}
              <div className="h-14 bg-[#030304] rounded-2xl border border-[#1e1e24] flex items-center justify-center gap-1 px-4 overflow-hidden">
                {[...Array(28)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      height: isTransmitting ? `${Math.floor(Math.random() * 38) + 8}px` : '6px',
                    }}
                    className={`w-1.5 rounded-full transition-all duration-150 ${
                      isTransmitting ? 'bg-red-500 animate-pulse' : 'bg-cyan-500/40'
                    }`}
                  />
                ))}
              </div>

              {/* Hold to Transmit Button */}
              <button
                onMouseDown={handleStartPtt}
                onMouseUp={handleStopPtt}
                onTouchStart={handleStartPtt}
                onTouchEnd={handleStopPtt}
                className={`w-full py-6 rounded-2xl font-black text-base transition-all select-none touch-none shadow-2xl flex items-center justify-center gap-3 ${
                  isTransmitting
                    ? 'bg-red-600 text-white shadow-red-600/50 scale-98 border-2 border-white'
                    : 'bg-gradient-to-r from-cyan-600 via-emerald-600 to-cyan-600 text-white hover:brightness-110 shadow-cyan-600/30'
                }`}
              >
                <Mic className={`w-6 h-6 ${isTransmitting ? 'animate-ping' : ''}`} />
                <span>{isTransmitting ? 'BROADCASTING VOICE (RELEASE TO SEND)...' : 'HOLD TO TALK (PUSH-TO-TALK)'}</span>
              </button>

              <p className="text-[11px] text-slate-400">
                Encrypted ChaCha20-Poly1305 Voice Stream • Multi-node relay active
              </p>
            </div>

            {/* Transmission Log */}
            <div className="bg-[#08080a] border border-[#222] rounded-[2rem] p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#222]">
                <span className="text-xs font-bold text-white">Channel Transmission Log</span>
                <span className="text-[10px] font-mono text-emerald-400">DragonSign Verified</span>
              </div>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {channelMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-3.5 bg-[#030304] rounded-2xl border border-[#1e1e24] space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-cyan-300">{msg.sender}</span>
                      <span className="text-slate-500 font-mono">{msg.timestamp}</span>
                    </div>

                    {msg.isAudio ? (
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSimulatePlayAudio(msg.id)}
                            className="p-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                          </button>
                          <span className="text-xs font-medium text-slate-200">
                            {playingAudioId === msg.id ? 'Playing Voice Pulse...' : `Voice Pulse (${msg.audioDurationSec || 3}s)`}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-cyan-400">{msg.dragonSignSignature}</span>
                      </div>
                    ) : (
                      <p className="text-slate-200 text-xs">{msg.text}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Quick Text Transmission Form */}
              <form onSubmit={handleSendText} className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Send encrypted mesh text message..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="flex-1 bg-[#030304] border border-[#1e1e24] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

      {/* Link New Mate Modal */}
      {isAddMateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#050505] border border-[#333] rounded-[2.5rem] p-6 shadow-2xl space-y-5 text-white">
            <button
              onClick={() => setIsAddMateModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-[#141418] border border-[#222] text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold uppercase">
                <Users className="w-3 h-3" /> Link Talkie Mate
              </div>
              <h3 className="text-xl font-black italic uppercase">Add Friend to Talkie Mesh</h3>
              <p className="text-xs text-slate-400">
                Enter your mate's name or scan their 6-digit P2P Talkie Pin to pair direct encrypted voice channels.
              </p>
            </div>

            <form onSubmit={handleCreateMateSubmit} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-slate-400 uppercase text-[10px]">Mate Name / Handle</label>
                <input
                  type="text"
                  placeholder="e.g. Gaz (Highland Pitch 08)"
                  value={newMateName}
                  onChange={(e) => setNewMateName(e.target.value)}
                  required
                  className="w-full bg-[#0a0a0e] border border-[#222] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 uppercase text-[10px]">Campsite / Node Location</label>
                <input
                  type="text"
                  placeholder="e.g. Cornwall Coastal Mesh Pitch 14"
                  value={newMateLocation}
                  onChange={(e) => setNewMateLocation(e.target.value)}
                  className="w-full bg-[#0a0a0e] border border-[#222] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Pair & Link Talkie Mate</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PLASMA EFFECTS INCOMING CALL & ANSWER SERVICE MODAL */}
      {isIncomingCallActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl">
          <div className="relative w-full max-w-lg bg-gradient-to-br from-[#130026] via-[#090014] to-[#1a0033] border-2 border-fuchsia-500/80 rounded-[3rem] p-8 shadow-[0_0_90px_rgba(217,70,239,0.5)] space-y-6 text-center text-white overflow-hidden">
            
            {/* Plasma Particle Waves Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-fuchsia-600/20 via-purple-900/10 to-transparent animate-pulse pointer-events-none" />
            
            {/* Close Button */}
            <button
              onClick={handleDeclinePlasmaCall}
              className="absolute top-6 right-6 p-2 rounded-full bg-[#180828] border border-purple-500/40 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-fuchsia-500/20 border border-fuchsia-500/40 text-fuchsia-300 font-mono text-xs font-bold uppercase tracking-widest shadow-lg shadow-fuchsia-500/20 animate-pulse">
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>Plasma Energy P2P Call Stream</span>
            </div>

            {/* Animated Plasma Avatar Container */}
            <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
              {/* Pulsing Plasma Ring 1 */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-fuchsia-500 via-purple-500 to-cyan-400 opacity-80 blur-xl animate-ping" />
              {/* Pulsing Plasma Ring 2 */}
              <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-amber-400 via-fuchsia-500 to-cyan-500 opacity-60 blur-md animate-spin-slow" />
              
              <img
                src={callerInfo.avatar}
                alt={callerInfo.name}
                className="relative z-10 w-28 h-28 rounded-full object-cover border-4 border-fuchsia-400 shadow-2xl"
              />
            </div>

            {/* Caller Information */}
            <div className="space-y-1 relative z-10 font-sans">
              <h3 className="text-2xl font-black italic uppercase text-white tracking-tight">{callerInfo.name}</h3>
              <p className="text-xs text-purple-200 font-mono">{callerInfo.node}</p>
              <p className="text-[11px] text-cyan-300 font-mono">99.9 MHz • Direct Starlink & Mesh Relay</p>
            </div>

            {/* CALL STATES */}
            {!isCallAnswered && !isAnsweringMachineActive && (
              <div className="space-y-5 relative z-10 pt-2">
                <p className="text-xs text-fuchsia-300 font-mono animate-pulse">
                  ⚡ Incoming Plasma Call Ringing over Mesh...
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                  <button
                    onClick={handleAnswerPlasmaCall}
                    className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:brightness-110 text-slate-950 font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/30"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Answer</span>
                  </button>

                  <button
                    onClick={handleRouteToAnsweringService}
                    className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:brightness-110 text-white font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl shadow-purple-600/30"
                  >
                    <Voicemail className="w-4 h-4" />
                    <span>Answering Machine</span>
                  </button>

                  <button
                    onClick={handleDeclinePlasmaCall}
                    className="py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-red-600 border border-red-500/40 text-red-400 hover:text-white font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                  >
                    <PhoneOff className="w-4 h-4" />
                    <span>Decline</span>
                  </button>
                </div>
              </div>
            )}

            {isCallAnswered && (
              <div className="space-y-4 relative z-10 pt-2">
                <div className="p-4 bg-purple-950/60 rounded-2xl border border-purple-500/40 space-y-2">
                  <span className="text-xs text-emerald-400 font-mono font-bold flex items-center justify-center gap-2">
                    <Activity className="w-4 h-4 animate-pulse" />
                    CALL CONNECTED (LIVE STREAM)
                  </span>
                  <div className="text-2xl font-mono font-black text-amber-300">
                    00:{callDuration < 10 ? `0${callDuration}` : callDuration}
                  </div>

                  {/* Audio Wave animation */}
                  <div className="h-8 flex items-center justify-center gap-1">
                    {[...Array(16)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-fuchsia-400 rounded-full animate-bounce"
                        style={{ height: `${Math.floor(Math.random() * 24) + 6}px`, animationDelay: `${i * 0.08}s` }}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleDeclinePlasmaCall}
                  className="w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black uppercase text-xs tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl shadow-red-600/30"
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>End Plasma Call</span>
                </button>
              </div>
            )}

            {isAnsweringMachineActive && (
              <div className="p-5 bg-purple-950/80 rounded-2xl border border-fuchsia-500/50 space-y-3 relative z-10 text-center animate-pulse">
                <Voicemail className="w-8 h-8 text-fuchsia-400 mx-auto" />
                <h4 className="font-black text-white text-base uppercase">Routed to Answering Service</h4>
                <p className="text-xs text-purple-200">
                  Dragon9 speech-to-text service is transcribing voice message onto your local node vault...
                </p>
              </div>
            )}

          </div>
        </div>
      )}
      {isAddMateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#050505] border border-[#333] rounded-[2.5rem] p-6 shadow-2xl space-y-5 text-white">
            <button
              onClick={() => setIsAddMateModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-[#141418] border border-[#222] text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold uppercase">
                <Users className="w-3 h-3" /> Link Talkie Mate
              </div>
              <h3 className="text-xl font-black italic uppercase">Add Friend to Talkie Mesh</h3>
              <p className="text-xs text-slate-400">
                Enter your mate's name or scan their 6-digit P2P Talkie Pin to pair direct encrypted voice channels.
              </p>
            </div>

            <form onSubmit={handleCreateMateSubmit} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-slate-400 uppercase text-[10px]">Mate Name / Handle</label>
                <input
                  type="text"
                  placeholder="e.g. Gaz (Highland Pitch 08)"
                  value={newMateName}
                  onChange={(e) => setNewMateName(e.target.value)}
                  required
                  className="w-full bg-[#0a0a0e] border border-[#222] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 uppercase text-[10px]">Campsite / Node Location</label>
                <input
                  type="text"
                  placeholder="e.g. Cornwall Coastal Mesh Pitch 14"
                  value={newMateLocation}
                  onChange={(e) => setNewMateLocation(e.target.value)}
                  className="w-full bg-[#0a0a0e] border border-[#222] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Pair & Link Talkie Mate</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
