import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Radio, Sparkles, Activity, Play, Pause, Waves, Music, Disc } from 'lucide-react';

export const TideSynthTab: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [baseFreq, setBaseFreq] = useState(144); // 144Hz default (D9 frequency)
  const [harmonicRatio, setHarmonicRatio] = useState(1.5); // Fifth interval
  const [filterCutoff, setFilterCutoff] = useState(800);
  const [selectedPreset, setSelectedPreset] = useState<'calm_tide' | 'deep_ocean' | 'binaural_mesh' | 'solfeggio'>('calm_tide');

  const audioCtxRef = useRef<AudioContext | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Toggle Audio Play/Pause
  const togglePlay = () => {
    if (isPlaying) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      setIsPlaying(false);
    } else {
      startSynth();
    }
  };

  const startSynth = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      const analyser = ctx.createAnalyser();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(baseFreq, ctx.currentTime);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(baseFreq * harmonicRatio, ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(filterCutoff, ctx.currentTime);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(analyser);
      analyser.connect(ctx.destination);

      osc1.start();
      osc2.start();

      osc1Ref.current = osc1;
      osc2Ref.current = osc2;
      filterRef.current = filter;
      gainRef.current = gain;
      analyserRef.current = analyser;

      setIsPlaying(true);
    } catch (err) {
      console.error('Failed to start Tide Synth:', err);
    }
  };

  // Update Frequencies on State Change
  useEffect(() => {
    if (isPlaying && audioCtxRef.current) {
      if (osc1Ref.current) osc1Ref.current.frequency.setValueAtTime(baseFreq, audioCtxRef.current.currentTime);
      if (osc2Ref.current) osc2Ref.current.frequency.setValueAtTime(baseFreq * harmonicRatio, audioCtxRef.current.currentTime);
      if (filterRef.current) filterRef.current.frequency.setValueAtTime(filterCutoff, audioCtxRef.current.currentTime);
    }
  }, [baseFreq, harmonicRatio, filterCutoff, isPlaying]);

  // Handle Preset Changes
  const applyPreset = (preset: 'calm_tide' | 'deep_ocean' | 'binaural_mesh' | 'solfeggio') => {
    setSelectedPreset(preset);
    if (preset === 'calm_tide') {
      setBaseFreq(144);
      setHarmonicRatio(1.5);
      setFilterCutoff(800);
    } else if (preset === 'deep_ocean') {
      setBaseFreq(72);
      setHarmonicRatio(1.25);
      setFilterCutoff(400);
    } else if (preset === 'binaural_mesh') {
      setBaseFreq(216);
      setHarmonicRatio(1.02);
      setFilterCutoff(1200);
    } else if (preset === 'solfeggio') {
      setBaseFreq(528);
      setHarmonicRatio(1.33);
      setFilterCutoff(2000);
    }
  };

  // Canvas Visualizer Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, w, h);

      if (isPlaying && analyserRef.current) {
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteTimeDomainData(dataArray);

        ctx.lineWidth = 2;
        ctx.strokeStyle = '#22d3ee';
        ctx.beginPath();

        const sliceWidth = w / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * h) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        ctx.lineTo(w, h / 2);
        ctx.stroke();
      } else {
        // Idle Ambient Sine Wave Visual
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        const time = Date.now() * 0.002;
        for (let x = 0; x < w; x++) {
          const y = h / 2 + Math.sin(x * 0.02 + time) * 20;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6 text-slate-100">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#03131a] via-[#081e28] to-[#0d0714] border border-cyan-500/30 shadow-2xl">
        <div className="space-y-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Waves className="w-3.5 h-3.5 animate-pulse" />
            <span>Tide Synth • Sovereign Audio Generator</span>
          </div>
          <h2 className="text-2xl font-black text-white">Harmonic Mesh Ocean Drone & Ambient Synthesizer</h2>
          <p className="text-xs text-slate-400 max-w-lg">
            Synthesize binaural beats, Solfeggio frequencies, and ocean tide carrier waves to relax node operators and broadcast over mesh walkie-talkie channels.
          </p>
        </div>

        {/* Master Play Button */}
        <button
          onClick={togglePlay}
          className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-2xl ${
            isPlaying
              ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
              : 'bg-gradient-to-r from-cyan-500 to-emerald-500 hover:brightness-110 text-slate-950 shadow-cyan-500/30'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>Stop Synth Engine</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Start Tide Drone Synth</span>
            </>
          )}
        </button>
      </div>

      {/* Synth Controls & Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Oscilloscope Canvas */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between font-mono text-xs text-slate-400">
            <span className="flex items-center gap-2 text-cyan-400 font-bold">
              <Activity className="w-4 h-4" /> Real-time Oscilloscope
            </span>
            <span>Carrier Frequency: {baseFreq} Hz</span>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
            <canvas ref={canvasRef} width={800} height={260} className="w-full h-[220px]" />
          </div>

          {/* Quick Frequency Keys */}
          <div className="grid grid-cols-4 gap-2 pt-2 font-mono text-xs">
            {[108, 144, 216, 432, 528].map((freq) => (
              <button
                key={freq}
                onClick={() => setBaseFreq(freq)}
                className={`py-2 rounded-xl border transition-all ${
                  baseFreq === freq
                    ? 'bg-cyan-500 text-slate-950 font-black border-cyan-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {freq} Hz
              </button>
            ))}
          </div>
        </div>

        {/* Control Sliders & Presets */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-5">
          <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400 font-mono flex items-center gap-2">
            <Disc className="w-4 h-4 text-purple-400" />
            <span>Preset Soundscapes</span>
          </h3>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <button
              onClick={() => applyPreset('calm_tide')}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedPreset === 'calm_tide'
                  ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              🌊 Calm Tide (144Hz)
            </button>

            <button
              onClick={() => applyPreset('deep_ocean')}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedPreset === 'deep_ocean'
                  ? 'bg-purple-950 border-purple-500 text-purple-300 font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              🌌 Deep Ocean (72Hz)
            </button>

            <button
              onClick={() => applyPreset('binaural_mesh')}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedPreset === 'binaural_mesh'
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              🧠 Binaural Mesh
            </button>

            <button
              onClick={() => applyPreset('solfeggio')}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedPreset === 'solfeggio'
                  ? 'bg-amber-950 border-amber-500 text-amber-300 font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              ✨ Solfeggio (528Hz)
            </button>
          </div>

          <div className="space-y-4 pt-2 border-t border-slate-800 font-mono text-xs">
            <div className="space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Base Frequency</span>
                <span className="text-cyan-400 font-bold">{baseFreq} Hz</span>
              </div>
              <input
                type="range"
                min={40}
                max={800}
                value={baseFreq}
                onChange={(e) => setBaseFreq(Number(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-950"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Harmonic Ratio</span>
                <span className="text-purple-400 font-bold">{harmonicRatio}x</span>
              </div>
              <input
                type="range"
                min={1.0}
                max={2.0}
                step={0.01}
                value={harmonicRatio}
                onChange={(e) => setHarmonicRatio(Number(e.target.value))}
                className="w-full accent-purple-500 bg-slate-950"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Filter Cutoff</span>
                <span className="text-emerald-400 font-bold">{filterCutoff} Hz</span>
              </div>
              <input
                type="range"
                min={100}
                max={4000}
                step={50}
                value={filterCutoff}
                onChange={(e) => setFilterCutoff(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-950"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
