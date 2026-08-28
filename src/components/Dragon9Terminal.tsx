import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Send, Trash2, Shield, Radio, Server, Sparkles, Copy, Check } from 'lucide-react';
import type { MeshNode } from '../types';

interface Dragon9TerminalProps {
  nodes?: MeshNode[];
}

interface CommandLog {
  id: string;
  type: 'input' | 'output' | 'error' | 'system' | 'success';
  text: string;
  timestamp: string;
}

export const Dragon9Terminal: React.FC<Dragon9TerminalProps> = ({ nodes = [] }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [copied, setCopied] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const getD9Timestamp = () => {
    const now = new Date();
    const totalMin = now.getHours() * 60 + now.getMinutes();
    const d9Hour = Math.floor((totalMin / 54) % 27);
    const d9Min = Math.floor(totalMin % 54);
    const sec = now.getSeconds().toString().padStart(2, '0');
    return `${d9Hour}°${d9Min.toString().padStart(2, '0')}:${sec}`;
  };

  const [logs, setLogs] = useState<CommandLog[]>([
    {
      id: 'init-1',
      type: 'system',
      text: '🐉 Dragon9 Sovereign Terminal v2.4.1 (x86_64-dragon9-sovereign-linux-gnu)',
      timestamp: getD9Timestamp()
    },
    {
      id: 'init-2',
      type: 'system',
      text: 'Connected to Dragon9 Core Mesh P2P Socket • Zero-Cost Bandwidth Commons Active',
      timestamp: getD9Timestamp()
    },
    {
      id: 'init-3',
      type: 'output',
      text: 'Type "help" or "d9 status" to view available sovereign network commands.',
      timestamp: getD9Timestamp()
    }
  ]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleCommand = async (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const time = getD9Timestamp();
    const newLogs: CommandLog[] = [
      ...logs,
      { id: `cmd-${Date.now()}`, type: 'input', text: `dragon9@sovereign-mesh:~# ${trimmed}`, timestamp: time }
    ];

    setHistory((prev) => [trimmed, ...prev.filter((c) => c !== trimmed)]);
    setHistoryIndex(-1);
    setInput('');

    const [mainCmd, ...args] = trimmed.split(' ');
    const lowerCmd = mainCmd.toLowerCase();

    if (lowerCmd === 'clear' || lowerCmd === 'cls') {
      setLogs([]);
      return;
    }

    if (lowerCmd === 'help') {
      newLogs.push({
        id: `out-${Date.now()}`,
        type: 'output',
        text: `Available Dragon9 Sovereign Commands:
  d9 status         - Display mesh network health, latency & sovereignty %
  d9 peers          - List all connected P2P mesh nodes and bandwidth
  d9 split          - Inspect 90/9/1 Sovereign Split distribution & allocations
  d9 ping <node>    - Test round-trip latency to a specific mesh node
  d9 balance        - Check Harmony Notes ledger balance and shard health
  d9 synth          - Query Tide Synth acoustic frequencies
  d9 kdenlive       - Export Enigma pipeline timeline manifest for Kdenlive
  d9 enigma         - Run sovereign pipeline media audit
  d9 time           - Display standard and 54-minute D9 Sovereign hour
  top / meshstat    - Live resource allocation and bandwidth avoidance metrics
  uname -a          - Kernel & cryptographic verification metadata
  clear             - Clear the terminal screen`,
        timestamp: time
      });
      setLogs(newLogs);
      return;
    }

    if (lowerCmd === 'd9' || lowerCmd === 'dragon9') {
      const sub = args[0]?.toLowerCase();

      if (!sub || sub === 'status') {
        const onlineCount = nodes.filter((n) => n.status === 'online').length;
        const total = nodes.length || 8;
        const avgLat = nodes.length > 0 ? Math.round(nodes.reduce((a, b) => a + b.latencyMs, 0) / nodes.length) : 8;
        newLogs.push({
          id: `out-${Date.now()}`,
          type: 'success',
          text: `[DRAGON9 STATUS]
  Sovereignty: 94.8% Local Mesh Routed ($0 Carrier Fee)
  Active Nodes: ${onlineCount}/${total} Online
  Average Latency: ${avgLat}ms
  Carrier Frequency: 144.MESH.9
  Enigma Pipeline: ONLINE • Starlink Satellite Uplink ACTIVE`,
          timestamp: time
        });
        setLogs(newLogs);
        return;
      }

      if (sub === 'peers') {
        const peerList = nodes.map((n) => `  - [${n.status.toUpperCase()}] ${n.name} (${n.location}) • ${n.bandwidthMbps} Mbps • ${n.latencyMs}ms • Hash: ${n.blockHash.slice(0, 10)}...`).join('\n');
        newLogs.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: `Connected P2P Mesh Nodes:\n${peerList}`,
          timestamp: time
        });
        setLogs(newLogs);
        return;
      }

      if (sub === 'split') {
        newLogs.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: `[90/9/1 SOVEREIGN SPLIT DISTRIBUTION]
  - 90% Community Commons & Node Operators (Hardware maintenance & high-speed relays)
  -  9% Core Dragon9 Protocol Engineering & Infrastructure Devs
  -  1% Apex Security Shard Reserve & Zero-Knowledge Auditing`,
          timestamp: time
        });
        setLogs(newLogs);
        return;
      }

      if (sub === 'ping') {
        const target = args[1] || 'dragon9-core';
        newLogs.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: `PING ${target} (10.99.144.1): 64 data bytes
64 bytes from 10.99.144.1: icmp_seq=1 ttl=64 time=1.42 ms
64 bytes from 10.99.144.1: icmp_seq=2 ttl=64 time=1.85 ms
64 bytes from 10.99.144.1: icmp_seq=3 ttl=64 time=1.12 ms
--- ${target} ping statistics ---
3 packets transmitted, 3 packets received, 0.0% packet loss, round-trip min/avg/max = 1.12/1.46/1.85 ms`,
          timestamp: time
        });
        setLogs(newLogs);
        return;
      }

      if (sub === 'time') {
        newLogs.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: `Standard UTC Time: ${new Date().toISOString()}\nDragon9 Sovereign Clock (54-min hour): ${getD9Timestamp()}`,
          timestamp: time
        });
        setLogs(newLogs);
        return;
      }

      if (sub === 'synth') {
        newLogs.push({
          id: `out-${Date.now()}`,
          type: 'success',
          text: `[TIDE SYNTH ENGINE]
  Carrier Base: 144.0 Hz (D9 Fundamental)
  Harmonics: 216.0 Hz (1.5x Perfect Fifth)
  Filter Cutoff: 800 Hz Lowpass
  State: READY • Audio Context Standby`,
          timestamp: time
        });
        setLogs(newLogs);
        return;
      }

      if (sub === 'kdenlive' || sub === 'enigma') {
        newLogs.push({
          id: `out-${Date.now()}`,
          type: 'success',
          text: `[ENIGMA PIPELINE MANIFEST]
  Story Forge Project: "Dragon9 Sovereign Broadcast"
  Timeline Segments: 4 segments (84 seconds total)
  Director Persona: Dragon Nine Senior Director
  Kdenlive MLT XML: GENERATED (/export/kdenlive_dragon9_v2.mlt)
  Audit Status: PASS • No unindexed B-roll voids`,
          timestamp: time
        });
        setLogs(newLogs);
        return;
      }

      if (sub === 'balance' || sub === 'notes') {
        newLogs.push({
          id: `out-${Date.now()}`,
          type: 'success',
          text: `[HARMONY NOTES VAULT]
  Total Circulation: 98,640 HN
  Shard Alpha (Transactions): ACTIVE (Verified 0.001s)
  Shard Beta (Yield Reserves): ACTIVE
  Recent Settlement: 0x9f2a...e4d1 (Dragon9 Core → Holiday Park Gate)`,
          timestamp: time
        });
        setLogs(newLogs);
        return;
      }
    }

    if (lowerCmd === 'uname' || lowerCmd === 'uname -a') {
      newLogs.push({
        id: `out-${Date.now()}`,
        type: 'output',
        text: 'Linux sovereign-mesh-d9 6.1.0-dragon9-mesh #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux (ChaCha20-Poly1305 Engine)',
        timestamp: time
      });
      setLogs(newLogs);
      return;
    }

    if (lowerCmd === 'whoami') {
      newLogs.push({
        id: `out-${Date.now()}`,
        type: 'output',
        text: 'fluidmotiontv@dragon9.mesh (Root Sovereign Operator - The Nine Authority)',
        timestamp: time
      });
      setLogs(newLogs);
      return;
    }

    if (lowerCmd === 'top' || lowerCmd === 'meshstat') {
      newLogs.push({
        id: `out-${Date.now()}`,
        type: 'output',
        text: `Tasks: 14 total, 14 running, 0 sleeping, 0 stopped
%Mesh-Throughput: 94.8% peer-to-peer, 5.2% satellite uplink, 0.0% telco carrier
Cost Avoidance: $1,420.00 avoided this billing cycle
PID USER      PR  NI    VIRT    RES  %BANDWIDTH COMMAND
 01 dragon9   20   0  1024M   512M      94.8   mesh-daemon-p2p
 02 tim       20   0   512M   256M      18.4   kdenlive-exporter
 03 gemini    20   0   256M   128M       8.2   ai-intelligence-relay`,
        timestamp: time
      });
      setLogs(newLogs);
      return;
    }

    // Default unknown command
    newLogs.push({
      id: `err-${Date.now()}`,
      type: 'error',
      text: `command not found: "${trimmed}". Type "help" to see available Dragon9 commands.`,
      timestamp: time
    });
    setLogs(newLogs);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = Math.min(historyIndex + 1, history.length - 1);
        setHistoryIndex(nextIdx);
        setInput(history[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInput(history[nextIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  const copyLogs = () => {
    const text = logs.map((l) => `[${l.timestamp}] ${l.text}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-4 text-slate-100 font-mono">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Dragon9 Sovereign Terminal</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                TTY1 • LIVE
              </span>
            </h2>
            <p className="text-xs text-slate-400">P2P Socket CLI • Low-Latency Control Console</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={copyLogs}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors border border-slate-700"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Output'}</span>
          </button>

          <button
            onClick={() => setLogs([])}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-400 text-xs transition-colors border border-slate-700"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Quick Command Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-500 whitespace-nowrap">Quick Commands:</span>
        {['d9 status', 'd9 peers', 'd9 split', 'd9 ping', 'd9 synth', 'd9 kdenlive', 'top', 'help'].map((cmd) => (
          <button
            key={cmd}
            onClick={() => handleCommand(cmd)}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-400 hover:text-cyan-300 transition-colors whitespace-nowrap"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Terminal Main Canvas Box */}
      <div className="rounded-2xl border border-slate-800 bg-[#030712] shadow-2xl overflow-hidden flex flex-col min-h-[460px] max-h-[620px]">
        {/* Terminal Titlebar */}
        <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="ml-2 font-semibold text-slate-300">dragon9@sovereign-mesh:~</span>
          </div>
          <div className="text-[11px] text-slate-500">P2P Socket (Port 3000 Ingress)</div>
        </div>

        {/* Terminal Screen Stream */}
        <div
          className="flex-1 p-4 overflow-y-auto space-y-2 text-xs leading-relaxed"
          onClick={() => inputRef.current?.focus()}
        >
          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-2">
              <span className="text-slate-600 select-none text-[10px] pt-0.5">[{log.timestamp}]</span>
              <pre
                className={`flex-1 whitespace-pre-wrap font-mono ${
                  log.type === 'input'
                    ? 'text-cyan-400 font-bold'
                    : log.type === 'error'
                    ? 'text-rose-400'
                    : log.type === 'success'
                    ? 'text-emerald-400'
                    : log.type === 'system'
                    ? 'text-purple-400 font-semibold'
                    : 'text-slate-300'
                }`}
              >
                {log.text}
              </pre>
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <span className="text-emerald-400 font-bold text-xs select-none">dragon9@mesh:~#</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-xs text-slate-100 font-mono placeholder-slate-600"
            placeholder="Type command here (e.g. 'd9 status', 'help')..."
            autoFocus
          />
          <button
            onClick={() => handleCommand(input)}
            disabled={!input.trim()}
            className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 disabled:opacity-30 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
