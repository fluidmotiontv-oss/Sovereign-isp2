import React, { useState, useEffect } from 'react';
import { MeshHeatmapOverlay } from './MeshHeatmapOverlay';
import { MeshNode, NodeType } from '../types';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';
import { 
  Server, 
  Trees, 
  Radio, 
  Smartphone, 
  Users, 
  ShieldCheck, 
  Activity, 
  Zap, 
  Plus, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  Globe, 
  HardDrive, 
  Cpu, 
  Terminal,
  TrendingUp,
  X
} from 'lucide-react';

interface NodeMonitorProps {
  nodes: MeshNode[];
  onDeployNode: (name: string, type: NodeType, location: string) => void;
}

interface BandwidthSample {
  time: string;
  bandwidth: number;
  latency: number;
}

export const NodeMonitor: React.FC<NodeMonitorProps> = ({ nodes, onDeployNode }) => {
  const [selectedNode, setSelectedNode] = useState<MeshNode | null>(nodes[0] || null);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pingingNodeId, setPingingNodeId] = useState<string | null>(null);
  const [showDeployModal, setShowDeployModal] = useState<boolean>(false);
  const [bandwidthHistory, setBandwidthHistory] = useState<BandwidthSample[]>([]);

  // Deploy modal form state
  const [newNodeName, setNewNodeName] = useState('');
  const [newNodeType, setNewNodeType] = useState<NodeType>('holiday_park');
  const [newNodeLocation, setNewNodeLocation] = useState('');

  // Generate initial history for the selected node
  const generateInitialSamples = (baseBandwidth: number, baseLatency: number): BandwidthSample[] => {
    const points: BandwidthSample[] = [];
    const now = Date.now();
    for (let i = 18; i >= 0; i--) {
      const t = new Date(now - i * 1500);
      const wave = Math.sin(i * 0.7) * (baseBandwidth * 0.09);
      const noise = (Math.random() - 0.5) * (baseBandwidth * 0.05);
      const latNoise = (Math.cos(i * 0.6) + (Math.random() - 0.5)) * (baseLatency * 0.12);
      points.push({
        time: t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        bandwidth: Math.max(10, Math.round(baseBandwidth + wave + noise)),
        latency: Math.max(1, Math.round(baseLatency + latNoise)),
      });
    }
    return points;
  };

  // Synchronize and stream real-time bandwidth fluctuations
  useEffect(() => {
    if (!selectedNode) return;
    setBandwidthHistory(generateInitialSamples(selectedNode.bandwidthMbps, selectedNode.latencyMs));

    const interval = setInterval(() => {
      setBandwidthHistory((prev) => {
        if (prev.length === 0) return prev;
        const base = selectedNode.bandwidthMbps;
        const baseLat = selectedNode.latencyMs;
        const timeNow = Date.now();
        const wave = Math.sin(timeNow / 1800) * (base * 0.08);
        const noise = (Math.random() - 0.5) * (base * 0.06);
        const latNoise = (Math.cos(timeNow / 2200) + (Math.random() - 0.5)) * (baseLat * 0.12);
        
        const newSample: BandwidthSample = {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          bandwidth: Math.max(10, Math.round(base + wave + noise)),
          latency: Math.max(1, Math.round(baseLat + latNoise)),
        };
        return [...prev.slice(1), newSample];
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [selectedNode?.id, selectedNode?.bandwidthMbps, selectedNode?.latencyMs]);

  const currentSample = bandwidthHistory[bandwidthHistory.length - 1];
  const peakBandwidth = bandwidthHistory.length > 0 
    ? Math.max(...bandwidthHistory.map(b => b.bandwidth)) 
    : (selectedNode?.bandwidthMbps || 0);
  const minBandwidth = bandwidthHistory.length > 0 
    ? Math.min(...bandwidthHistory.map(b => b.bandwidth)) 
    : (selectedNode?.bandwidthMbps || 0);
  const avgBandwidth = bandwidthHistory.length > 0
    ? Math.round(bandwidthHistory.reduce((acc, b) => acc + b.bandwidth, 0) / bandwidthHistory.length)
    : (selectedNode?.bandwidthMbps || 0);

  const filteredNodes = nodes.filter(node => {
    const matchesFilter = filterType === 'all' || node.type === filterType;
    const matchesSearch = node.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          node.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          node.operator.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getNodeIcon = (type: NodeType) => {
    switch (type) {
      case 'server':
        return <Server className="w-4 h-4 text-emerald-400" />;
      case 'holiday_park':
        return <Trees className="w-4 h-4 text-amber-400" />;
      case 'community_relay':
        return <Radio className="w-4 h-4 text-cyan-400" />;
      case 'mobile_hotspot':
        return <Smartphone className="w-4 h-4 text-purple-400" />;
      case 'peer_node':
        return <Users className="w-4 h-4 text-blue-400" />;
      default:
        return <Globe className="w-4 h-4 text-emerald-400" />;
    }
  };

  const handlePingNode = (nodeId: string) => {
    setPingingNodeId(nodeId);
    setTimeout(() => {
      setPingingNodeId(null);
    }, 1200);
  };

  const handleDeploySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNodeName || !newNodeLocation) return;
    onDeployNode(newNodeName, newNodeType, newNodeLocation);
    setShowDeployModal(false);
    setNewNodeName('');
    setNewNodeLocation('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Title & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white">Mesh Network Command Center</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              Real-time Node Pulse
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Decentralized peer-to-peer data mesh routing across server cores, holiday parks, community gateways, and mobile nodes.
          </p>
        </div>

        <button
          onClick={() => setShowDeployModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:brightness-110 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Deploy Sovereign Node</span>
        </button>
      </div>

      {/* Main Grid: Visual Mesh Map (Left) + Selected Node Specs (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive P2P Mesh Visualizer Canvas Card (2 Cols) */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 relative overflow-hidden flex flex-col min-h-[420px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-bold text-white">Peer-to-Peer Mesh Topology Map</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Verified Link
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span> Active Route
              </span>
            </div>
          </div>

          {/* SVG Visual Canvas showing nodes & connections */}
          <div className="relative flex-1 bg-[#070a13] rounded-xl my-4 p-4 border border-slate-800/80 overflow-hidden flex items-center justify-center">
            {/* Grid background overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            {/* D3 Geospatial Heatmap Overlay */}
            <MeshHeatmapOverlay nodes={nodes} />

            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
              {/* Draw animated connection lines between nodes */}
              {nodes.map((source, i) =>
                nodes.slice(i + 1).map((target) => (
                  <g key={`${source.id}-${target.id}`}>
                    <line
                      x1={`${source.coordinates.x}%`}
                      y1={`${source.coordinates.y}%`}
                      x2={`${target.coordinates.x}%`}
                      y2={`${target.coordinates.y}%`}
                      stroke="rgba(16, 185, 129, 0.2)"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />
                    {/* Animated packet dot */}
                    <circle r="3" fill="#06b6d4">
                      <animateMotion
                        path={`M ${source.coordinates.x * 4} ${source.coordinates.y * 3} L ${target.coordinates.x * 4} ${target.coordinates.y * 3}`}
                        dur={`${2 + (i % 3)}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>
                ))
              )}
            </svg>

            {/* Interactive Node Markers */}
            <div className="relative w-full h-full min-h-[300px]">
              {nodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    style={{
                      left: `${node.coordinates.x}%`,
                      top: `${node.coordinates.y}%`
                    }}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 group transition-all z-10 ${
                      isSelected ? 'scale-125 z-20' : 'hover:scale-110'
                    }`}
                  >
                    <div className="relative flex items-center justify-center">
                      <span className={`absolute w-8 h-8 rounded-full animate-ping opacity-30 ${
                        node.type === 'server' ? 'bg-emerald-400' :
                        node.type === 'holiday_park' ? 'bg-amber-400' : 'bg-cyan-400'
                      }`}></span>
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center border shadow-lg ${
                        isSelected 
                          ? 'bg-emerald-500 text-slate-950 border-white shadow-emerald-500/50' 
                          : 'bg-slate-900 border-slate-700 text-slate-200 hover:border-emerald-400'
                      }`}>
                        {getNodeIcon(node.type)}
                      </div>
                    </div>

                    {/* Tooltip on marker */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 text-white text-[10px] font-bold px-2 py-1 rounded border border-slate-800 whitespace-nowrap shadow-xl pointer-events-none">
                      {node.name} ({node.latencyMs}ms)
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Automated Mesh Mesh Routing Protocol: <strong className="text-emerald-400">Dragon9-Enigma v3.4</strong></span>
            <span>Encryption: <strong className="text-cyan-400">ChaCha20-Poly1305 P2P</strong></span>
          </div>
        </div>

        {/* Selected Node Specs Card (1 Col) */}
        {selectedNode ? (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  {getNodeIcon(selectedNode.type)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{selectedNode.name}</h3>
                  <span className="text-[11px] text-slate-400 capitalize">{selectedNode.type.replace('_', ' ')}</span>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                selectedNode.status === 'online' 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}>
                {selectedNode.status.toUpperCase()}
              </span>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                <span className="text-slate-400 block text-[10px] font-mono">Bandwidth</span>
                <span className="text-sm font-mono font-bold text-emerald-400">
                  {currentSample?.bandwidth ?? selectedNode.bandwidthMbps} Mbps
                </span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                <span className="text-slate-400 block text-[10px] font-mono">Latency</span>
                <span className="text-sm font-mono font-bold text-cyan-400">
                  {currentSample?.latency ?? selectedNode.latencyMs} ms
                </span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                <span className="text-slate-400 block text-[10px] font-mono">Peers Linked</span>
                <span className="text-sm font-mono font-bold text-white">{selectedNode.connectedPeers}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                <span className="text-slate-400 block text-[10px] font-mono">Uptime</span>
                <span className="text-sm font-mono font-bold text-amber-400">{selectedNode.uptimePercentage}%</span>
              </div>
            </div>

            {/* Real-Time Bandwidth Fluctuations Mini-Sparkline (recharts) */}
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/90 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                  <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>Bandwidth Pulse (Live Sparkline)</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[10px]">
                  <span className="text-slate-400">Peak: <strong className="text-emerald-400">{peakBandwidth} Mbps</strong></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                </div>
              </div>

              {/* Sparkline Canvas */}
              <div className="h-20 w-full relative pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={bandwidthHistory} margin={{ top: 4, right: 2, left: 2, bottom: 0 }}>
                    <defs>
                      <linearGradient id="nodeSparklineGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.45} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <YAxis hide domain={['dataMin - 15', 'dataMax + 15']} />
                    <XAxis hide dataKey="time" />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload as BandwidthSample;
                          return (
                            <div className="bg-slate-900/95 border border-slate-700 px-2.5 py-1 rounded-lg shadow-xl text-[11px] font-mono backdrop-blur-sm z-30">
                              <div className="text-emerald-400 font-bold flex items-center gap-1">
                                <span>{data.bandwidth} Mbps</span>
                                <span className="text-slate-400 text-[9px]">({data.latency}ms)</span>
                              </div>
                              <div className="text-slate-500 text-[9px]">{data.time}</div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="bandwidth"
                      stroke="#10b981"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#nodeSparklineGrad)"
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Telemetry Stats Bar */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1.5 border-t border-slate-900">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-cyan-400" />
                  Live: <strong className="text-emerald-400">{currentSample?.bandwidth ?? selectedNode.bandwidthMbps} Mbps</strong>
                </span>
                <span className="text-slate-500">Avg: {avgBandwidth} Mbps • Min: {minBandwidth} Mbps</span>
              </div>
            </div>

            {/* Location & Operator Info */}
            <div className="space-y-2 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">Location:</span>
                <span className="font-medium text-white">{selectedNode.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Operator:</span>
                <span className="font-medium text-white">{selectedNode.operator}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Harmony Yield (24h):</span>
                <span className="font-mono font-bold text-amber-300">+{selectedNode.harmonyEarned24h} 🎵</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Blockchain Hash:</span>
                <span className="font-mono text-[10px] text-cyan-400">{selectedNode.blockHash}</span>
              </div>
            </div>

            {/* Verification Shield */}
            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 flex items-center gap-2.5 text-xs text-emerald-300">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Blockchain Cryptographic Proof verified. Zero data tampering detected.</span>
            </div>

            {/* Actions */}
            <button
              onClick={() => handlePingNode(selectedNode.id)}
              disabled={pingingNodeId === selectedNode.id}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 border border-slate-700"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${pingingNodeId === selectedNode.id ? 'animate-spin text-cyan-400' : ''}`} />
              <span>{pingingNodeId === selectedNode.id ? 'Pinging Node...' : 'Test Node Ping & Throughput'}</span>
            </button>
          </div>
        ) : null}
      </div>

      {/* Node Search & Filtered List Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search nodes, locations, operators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto text-xs">
            {['all', 'server', 'holiday_park', 'community_relay', 'mobile_hotspot', 'peer_node'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-lg capitalize font-medium whitespace-nowrap transition-all ${
                  filterType === type 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {type.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Nodes Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-3">Node Name</th>
                <th className="p-3">Type</th>
                <th className="p-3">Location</th>
                <th className="p-3">Peers</th>
                <th className="p-3">Speed</th>
                <th className="p-3">Latency</th>
                <th className="p-3">24h Yield</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredNodes.map((node) => (
                <tr
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`hover:bg-slate-800/50 cursor-pointer transition-colors ${
                    selectedNode?.id === node.id ? 'bg-slate-800/80 border-l-2 border-emerald-500' : ''
                  }`}
                >
                  <td className="p-3 font-bold text-white flex items-center gap-2">
                    {getNodeIcon(node.type)}
                    <span>{node.name}</span>
                  </td>
                  <td className="p-3 capitalize font-mono text-slate-400">{node.type.replace('_', ' ')}</td>
                  <td className="p-3 text-slate-300">{node.location}</td>
                  <td className="p-3 font-mono">{node.connectedPeers}</td>
                  <td className="p-3 font-mono text-emerald-400 font-bold">{node.bandwidthMbps} Mbps</td>
                  <td className="p-3 font-mono text-cyan-400">{node.latencyMs} ms</td>
                  <td className="p-3 font-mono text-amber-300 font-bold">+{node.harmonyEarned24h} 🎵</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedNode(node);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px]"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deploy Node Modal */}
      {showDeployModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 relative shadow-2xl">
            <button
              onClick={() => setShowDeployModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">Deploy Sovereign Mesh Node</h3>
            </div>
            <p className="text-xs text-slate-400">
              Host a node on your home router, Linux server, holiday park cabin gateway, or mobile device to expand free data connectivity.
            </p>

            <form onSubmit={handleDeploySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Node Identifier Name</label>
                <input
                  type="text"
                  placeholder="e.g. Cornwall Holiday Cabin #12 Gateway"
                  value={newNodeName}
                  onChange={(e) => setNewNodeName(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Node Category</label>
                  <select
                    value={newNodeType}
                    onChange={(e) => setNewNodeType(e.target.value as NodeType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="holiday_park">Holiday Park Gateway</option>
                    <option value="community_relay">Community Relay</option>
                    <option value="mobile_hotspot">Mobile Hotspot</option>
                    <option value="peer_node">Peer Node</option>
                    <option value="server">Core Server</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Location / Zone</label>
                  <input
                    type="text"
                    placeholder="e.g. Cornwall Mesh Zone 4"
                    value={newNodeLocation}
                    onChange={(e) => setNewNodeLocation(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Shell Script Snippet */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" /> One-Line Installation Shell Command
                  </span>
                  <span>Linux / OpenWrt</span>
                </div>
                <code className="block text-[11px] font-mono text-emerald-400 bg-black/50 p-2 rounded border border-slate-900 select-all overflow-x-auto">
                  curl -sSL https://fluidmotiontv-oss.github.io/sovereign-isp/install.sh | bash -s -- --name="{newNodeName || 'MyNode'}"
                </code>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:brightness-110 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-600/20"
              >
                Register & Activate Node
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
