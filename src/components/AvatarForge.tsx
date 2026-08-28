import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import type { DirectorPersona, StorySegment } from '../types';
import { Volume2, VolumeX, Flame, Sparkles, Radio, Mic, Play, UserCheck, Layers } from 'lucide-react';

interface AvatarForgeProps {
  activeDirector?: DirectorPersona;
  timeline?: StorySegment[];
  onSelectDirector?: (director: DirectorPersona) => void;
}

const DEFAULT_DIRECTOR: DirectorPersona = {
  id: 'dir-d9',
  name: 'Dragon Nine Senior Director',
  tagline: 'Ready to narrate your sovereign mesh reality.',
  avatar: '🎭',
  voice: 'en-US'
};

const DEFAULT_DIRECTORS_LIST: DirectorPersona[] = [
  { id: 'dir-d9', name: 'Dragon Nine Senior Director', tagline: 'Ready to narrate your sovereign mesh reality.', avatar: '🎭' },
  { id: 'dir-kden', name: 'Kdenlive Enigma Master', tagline: 'Cuts through timelines with razor precision.', avatar: '⚡' },
  { id: 'dir-campsite', name: 'Campsite Mesh Operator', tagline: 'Off-grid broadcasting for local campsites.', avatar: '🏕️' },
  { id: 'dir-harmony', name: 'Harmony Ledger Archivist', tagline: 'Transcribing 90/9/1 splits with flair.', avatar: '📜' }
];

const DEFAULT_TIMELINE: StorySegment[] = [
  { id: 's1', title: 'Mesh Initialization & Node Discovery', durationSec: 14, description: 'Discovering 14 local peer nodes' },
  { id: 's2', title: 'Starlink LEO Satellite Uplink Sync', durationSec: 28, description: 'Direct satellite relay connection' },
  { id: 's3', title: 'ChaCha20 Cryptographic Vault Lock', durationSec: 18, description: 'Zero carrier cost data channel binding' },
  { id: 's4', title: 'Community Harmony Notes Distribution', durationSec: 24, description: 'Earning yield for network contribution' }
];

export const AvatarForge: React.FC<AvatarForgeProps> = ({
  activeDirector = DEFAULT_DIRECTOR,
  timeline = DEFAULT_TIMELINE,
  onSelectDirector
}) => {
  const [selectedDirector, setSelectedDirector] = useState<DirectorPersona>(activeDirector);
  const [script, setScript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceIdx, setSelectedVoiceIdx] = useState(0);

  useEffect(() => {
    const load = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      }
    };
    load();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = load;
    }
  }, []);

  const speak = () => {
    if (!script.trim() || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(script);
    const v = voices[selectedVoiceIdx];
    if (v) u.voice = v;
    u.pitch = 0.9 + Math.random() * 0.3; // slight variation per director
    u.rate = 0.95;
    u.onstart = () => setIsSpeaking(true);
    u.onend = () => setIsSpeaking(false);
    u.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(u);
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const roast = () => {
    const roasts = [
      `This timeline has ${timeline.length} segments and somehow still manages to have no soul. Let me fix that.`,
      `I've seen smoother transitions in a PowerPoint from 2003. Let's talk.`,
      `That B-roll is giving "I found this on a hard drive at 3am" energy. Iconic, but not in the good way.`,
      `The void called. It wants its footage back. But first — let's give it a narrative arc.`,
      `If this edit were a clock, it would be a 54-minute hour. Confusing, beautiful, and slightly illegal.`,
      `I've analyzed ${timeline.reduce((a, s) => a + s.durationSec, 0)} seconds of your life choices. We need to talk.`
    ];
    setScript(roasts[Math.floor(Math.random() * roasts.length)]);
  };

  const generateIntro = () => {
    const intros = [
      `Welcome to Fluid Motion TV. The time is now, the tide is high, and the edit is raw. I'm ${selectedDirector.name}, and this is Dragon Nine.`,
      `Sovereign broadcast incoming. You are tuned to the frequency of the future. Let the motion flow across the mesh.`,
      `This is not a video. This is a vote. A vote for beauty. A vote for chaos. A vote for the Nine.`
    ];
    setScript(intros[Math.floor(Math.random() * intros.length)]);
  };

  const handleDirectorSelect = (dir: DirectorPersona) => {
    setSelectedDirector(dir);
    if (onSelectDirector) onSelectDirector(dir);
  };

  const totalRuntime = timeline.reduce((acc, seg) => acc + seg.durationSec, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6 text-slate-100">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#0d0714] via-[#150a24] to-[#0a1128] border border-purple-500/30 shadow-2xl">
        <div className="space-y-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Avatar Forge • Director Speech Studio</span>
          </div>
          <h2 className="text-2xl font-black text-white">Proclaim & Narrate Over Sovereign Mesh</h2>
          <p className="text-xs text-slate-400 max-w-lg">
            Synthesize voice broadcasts, roast edit timelines, and stream speech scripts through P2P audio channels.
          </p>
        </div>

        {/* Director Persona Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto p-1.5 rounded-2xl bg-slate-950 border border-slate-800">
          {DEFAULT_DIRECTORS_LIST.map((dir) => (
            <button
              key={dir.id}
              onClick={() => handleDirectorSelect(dir)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                selectedDirector.id === dir.id
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 border border-purple-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <span>{dir.avatar || '🎭'}</span>
              <span>{dir.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Avatar Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Persona Details */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6 flex flex-col items-center text-center">
          <motion.div
            animate={
              isSpeaking
                ? {
                    scale: [1, 1.15, 1],
                    boxShadow: [
                      '0 0 20px rgba(168,85,247,0.3)',
                      '0 0 60px rgba(34,211,238,0.7)',
                      '0 0 20px rgba(168,85,247,0.3)',
                    ],
                  }
                : {
                    scale: [1, 1.02, 1],
                    boxShadow: [
                      '0 0 10px rgba(255,255,255,0.05)',
                      '0 0 20px rgba(255,255,255,0.1)',
                      '0 0 10px rgba(255,255,255,0.05)',
                    ],
                  }
            }
            transition={{ repeat: Infinity, duration: isSpeaking ? 0.4 : 3 }}
            className="w-28 h-28 rounded-full bg-gradient-to-br from-cyan-400 via-purple-500 to-amber-400 flex items-center justify-center text-4xl shadow-2xl border-2 border-purple-400/50 cursor-pointer"
            onClick={isSpeaking ? stopSpeaking : speak}
          >
            {isSpeaking ? '🗣️' : selectedDirector.avatar || '🎭'}
          </motion.div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">{selectedDirector.name}</h3>
            <p className="text-xs text-slate-400 italic font-mono">
              "{selectedDirector.tagline}"
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs">
              <span className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`} />
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
                {isSpeaking ? 'BROADCASTING LIVE' : 'VOICE STANDBY'}
              </span>
            </div>
          </div>

          {/* Voice Selector */}
          <div className="w-full text-left space-y-2 pt-2 border-t border-slate-800">
            <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block font-mono">
              Synthesizer Voice Model:
            </label>
            <select
              value={selectedVoiceIdx}
              onChange={(e) => setSelectedVoiceIdx(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-purple-500 focus:outline-none font-mono"
            >
              {voices.map((v, i) => (
                <option key={i} value={i}>
                  {v.name} ({v.lang})
                </option>
              ))}
              {voices.length === 0 && <option>Loading Web Speech Voices...</option>}
            </select>
          </div>
        </div>

        {/* Right Column: Script Control Studio */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <label className="text-xs text-purple-400 uppercase tracking-wider font-bold font-mono flex items-center gap-2">
              <Mic className="w-4 h-4" />
              <span>Sovereign Script Editor</span>
            </label>
            <span className="text-[10px] text-slate-500 font-mono">
              {script.length} characters
            </span>
          </div>

          <textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            rows={6}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-slate-100 placeholder-slate-600 focus:border-purple-500 focus:outline-none resize-none font-mono text-xs leading-relaxed"
            placeholder={`What shall ${selectedDirector.name} proclaim to the mesh network? Type or click Roast/Intro below...`}
          />

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={speak}
              disabled={!script.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-purple-600/20 flex items-center gap-2"
            >
              <Volume2 className="w-4 h-4" />
              <span>{isSpeaking ? 'Speaking...' : 'Speak Script'}</span>
            </button>

            <button
              onClick={stopSpeaking}
              className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs transition-all flex items-center gap-1.5"
            >
              <VolumeX className="w-4 h-4" />
              <span>Stop</span>
            </button>

            <button
              onClick={roast}
              className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold text-xs transition-all flex items-center gap-1.5"
            >
              <Flame className="w-4 h-4 text-rose-400" />
              <span>Roast Timeline</span>
            </button>

            <button
              onClick={generateIntro}
              className="px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-xs transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Generate Intro</span>
            </button>
          </div>
        </div>
      </div>

      {/* Timeline Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-center space-y-1">
          <div className="text-2xl font-black text-cyan-400">{timeline.length}</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Story Segments</div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-center space-y-1">
          <div className="text-2xl font-black text-purple-400">{totalRuntime}s</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Total Edit Runtime</div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-center space-y-1">
          <div className="text-2xl font-black text-amber-400">{selectedDirector.name[0]}</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Active Director Persona</div>
        </div>
      </div>
    </div>
  );
};
