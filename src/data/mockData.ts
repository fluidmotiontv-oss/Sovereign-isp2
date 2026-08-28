import { 
  MeshNode, 
  BandwidthUsage, 
  HarmonyNoteTransaction, 
  DeveloperContribution, 
  AddonApp, 
  MateTalkie,
  WalkieTalkieChannel,
  WalkieTalkieMessage
} from '../types';

export const INITIAL_NODES: MeshNode[] = [
  {
    id: 'node-d9-core-01',
    name: 'Dragon9 Genesis Core Server',
    type: 'server',
    status: 'online',
    location: 'London Sovereign Center',
    coordinates: { x: 32, y: 38 },
    lat: 51.5074,
    lng: -0.1278,
    connectedPeers: 1420,
    bandwidthMbps: 10000,
    latencyMs: 4,
    uptimePercentage: 99.99,
    harmonyEarned24h: 840,
    blockchainVerified: true,
    blockHash: '0x8f3a...d9e1',
    operator: 'Dragon9 Foundation'
  },
  {
    id: 'node-hp-sunshine',
    name: 'Sunshine Cove Holiday Park Gateway',
    type: 'holiday_park',
    status: 'online',
    location: 'Cornwall Coastal Mesh',
    coordinates: { x: 22, y: 62 },
    lat: 50.4155,
    lng: -5.0737,
    connectedPeers: 380,
    bandwidthMbps: 2500,
    latencyMs: 9,
    uptimePercentage: 99.92,
    harmonyEarned24h: 420,
    blockchainVerified: true,
    blockHash: '0x3c21...a782',
    operator: 'Sunshine Holiday Group'
  },
  {
    id: 'node-hp-pinehills',
    name: 'Pine Hills Holiday Resort Node',
    type: 'holiday_park',
    status: 'online',
    location: 'Scottish Highlands Mesh',
    coordinates: { x: 38, y: 18 },
    lat: 57.1497,
    lng: -2.0943,
    connectedPeers: 290,
    bandwidthMbps: 1800,
    latencyMs: 11,
    uptimePercentage: 99.85,
    harmonyEarned24h: 310,
    blockchainVerified: true,
    blockHash: '0x1b9d...f041',
    operator: 'Highland Mesh Coop'
  },
  {
    id: 'node-relay-mcr-01',
    name: 'Manchester Community Relay #4',
    type: 'community_relay',
    status: 'online',
    location: 'Manchester Urban Sector',
    coordinates: { x: 35, y: 32 },
    lat: 53.4808,
    lng: -2.2426,
    connectedPeers: 184,
    bandwidthMbps: 1200,
    latencyMs: 7,
    uptimePercentage: 99.78,
    harmonyEarned24h: 195,
    blockchainVerified: true,
    blockHash: '0x7e88...b2c3',
    operator: 'Northern Mesh Guild'
  },
  {
    id: 'node-mobile-p2p-88',
    name: 'Fluid Motion Mobile Node #88',
    type: 'mobile_hotspot',
    status: 'online',
    location: 'Bristol Mobile Mesh',
    coordinates: { x: 28, y: 52 },
    lat: 51.4545,
    lng: -2.5879,
    connectedPeers: 42,
    bandwidthMbps: 450,
    latencyMs: 14,
    uptimePercentage: 98.90,
    harmonyEarned24h: 88,
    blockchainVerified: true,
    blockHash: '0x22a1...ef54',
    operator: 'User #8849 (Mobile)'
  },
  {
    id: 'node-peer-alpha-09',
    name: 'Dragon9 Enigma Peer Sanctuary',
    type: 'peer_node',
    status: 'syncing',
    location: 'Edinburgh Sovereign Cell',
    coordinates: { x: 42, y: 22 },
    lat: 55.9533,
    lng: -3.1883,
    connectedPeers: 68,
    bandwidthMbps: 600,
    latencyMs: 12,
    uptimePercentage: 99.40,
    harmonyEarned24h: 112,
    blockchainVerified: true,
    blockHash: '0x66f0...881a',
    operator: 'Enigma Node Guild'
  }
];

export const MONTHLY_BANDWIDTH_HISTORY: BandwidthUsage[] = [
  { month: 'Feb 2026', downloadGB: 142, uploadGB: 88, p2pMeshRoutedGB: 320, carrierCostSavedUsd: 120 },
  { month: 'Mar 2026', downloadGB: 185, uploadGB: 112, p2pMeshRoutedGB: 410, carrierCostSavedUsd: 120 },
  { month: 'Apr 2026', downloadGB: 210, uploadGB: 140, p2pMeshRoutedGB: 580, carrierCostSavedUsd: 120 },
  { month: 'May 2026', downloadGB: 260, uploadGB: 175, p2pMeshRoutedGB: 790, carrierCostSavedUsd: 120 },
  { month: 'Jun 2026', downloadGB: 310, uploadGB: 210, p2pMeshRoutedGB: 1050, carrierCostSavedUsd: 120 },
  { month: 'Jul 2026 (Current)', downloadGB: 388, uploadGB: 245, p2pMeshRoutedGB: 1420, carrierCostSavedUsd: 120 }
];

export const HARMONY_NOTE_TRANSACTIONS: HarmonyNoteTransaction[] = [
  {
    id: 'tx-8812',
    timestamp: '2 mins ago',
    type: 'node_reward',
    amount: +12.5,
    sender: 'Mesh Network Engine',
    recipient: 'Your Wallet (Fluid Member)',
    note: 'Automated 15-min Node Routing Proof-of-Mesh',
    txHash: '0xd9f8...11a2'
  },
  {
    id: 'tx-8811',
    timestamp: '1 hour ago',
    type: 'dev_split',
    amount: +4.2,
    sender: 'Fair Developer Split Pool',
    recipient: 'Your Wallet',
    note: 'Developer Contribution Split #209',
    txHash: '0x44c1...99ef'
  },
  {
    id: 'tx-8810',
    timestamp: '4 hours ago',
    type: 'app_cashback',
    amount: +25.0,
    sender: 'Trojan App: P2P AirDrop Hub',
    recipient: 'Your Wallet',
    note: 'Viral Share Bonus - 5 New Members Onboarded',
    txHash: '0xbb32...77f1'
  },
  {
    id: 'tx-8809',
    timestamp: '12 hours ago',
    type: 'p2p_transfer',
    amount: -10.0,
    sender: 'Your Wallet',
    recipient: 'Elite Node Operator #19',
    note: 'P2P Walkie Talkie Voice Frequency Access',
    txHash: '0xa092...3341'
  }
];

export const DEVELOPER_CONTRIBUTIONS: DeveloperContribution[] = [
  {
    id: 'dev-01',
    developer: 'FluidMotion Engine Team',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    role: 'Core Mesh Protocol & P2P Engine',
    commitsCount: 342,
    component: 'Sovereign Node Router & Verification',
    splitPercentage: 35,
    earnedNotes: 14250,
    lastContribution: '2 hours ago'
  },
  {
    id: 'dev-02',
    developer: 'Dragon9 Enigma Security Guild',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    role: 'Blockchain Cryptographic Proofs & PTT Walkie-Talkie',
    commitsCount: 218,
    component: 'Zero-Knowledge Ledger & Voice Audio Stream',
    splitPercentage: 25,
    earnedNotes: 10180,
    lastContribution: '5 hours ago'
  },
  {
    id: 'dev-03',
    developer: 'Holiday Park Community Builders',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
    role: 'Holiday Parks & Regional Gateways',
    commitsCount: 165,
    component: 'Local WiFi Hotspot Mesh Automation',
    splitPercentage: 20,
    earnedNotes: 8140,
    lastContribution: '1 day ago'
  },
  {
    id: 'dev-04',
    developer: 'Sovereign Community Apps Collective',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80',
    role: 'P2P Apps, Add-ons & Non-Technical Onboarding',
    commitsCount: 142,
    component: 'P2P AirDrop & Quick SMS Join Link',
    splitPercentage: 20,
    earnedNotes: 8140,
    lastContribution: 'Yesterday'
  }
];

export const ECOSYSTEM_APPS: AddonApp[] = [
  {
    id: 'app-airdrop',
    title: 'P2P AirDrop DropZone',
    tagline: 'Instant zero-data file sharing across nearby mesh devices',
    category: 'P2P Sharing',
    iconName: 'Zap',
    downloadsCount: 184200,
    meshRequirement: 'Broadcasting Node Active',
    embeddedMeshFeature: 'Background Packet Relay - Earns Harmony Notes per MB shared',
    featured: true
  },
  {
    id: 'app-walkie',
    title: 'Dragon9 P2P Radio PTT & Baby Monitor',
    tagline: 'Encrypted push-to-talk walkie talkie with Mates link, Baby Monitor, and WhisperWind',
    category: 'Communication',
    iconName: 'Radio',
    downloadsCount: 94100,
    meshRequirement: 'Direct Peer Link',
    embeddedMeshFeature: 'Encrypted Peer-to-Peer Voice Mesh without Cellular Signal',
    featured: true
  },
  {
    id: 'app-stream',
    title: 'DecentraStream Media Box',
    tagline: 'Stream peer-hosted high-definition media without bandwidth limits',
    category: 'Media',
    iconName: 'Tv',
    downloadsCount: 310500,
    meshRequirement: 'Holiday Park or Gateway Node',
    embeddedMeshFeature: 'Distributed Bit-Torrent Mesh Caching',
    featured: true
  },
  {
    id: 'app-theatre',
    title: 'Sovereign Theatre & Cinema Box',
    tagline: 'Peer-to-peer 4K streaming, campsite movie nights, & community live theatre broadcasts',
    category: 'Entertainment & Theatre',
    iconName: 'Film',
    downloadsCount: 268400,
    meshRequirement: 'High-Speed Local Gateway',
    embeddedMeshFeature: 'Mesh P2P Video Multicast • $0 Streaming Data Charges',
    featured: true
  },
  {
    id: 'app-creative',
    title: 'Creative Mesh Studio & DAW',
    tagline: 'Collaborative audio synthesis, visual art production, & community creative sharing over P2P',
    category: 'Creative Arts',
    iconName: 'Palette',
    downloadsCount: 195300,
    meshRequirement: 'P2P Node Sync',
    embeddedMeshFeature: 'Zero-Latency Real-Time Audio & Creative Asset Mesh Replication',
    featured: true
  },
  {
    id: 'app-wallet',
    title: 'Harmony Notes Vault',
    tagline: 'Instant free balance transfer, node yield tracker, & developer split ledger',
    category: 'Finance',
    iconName: 'Wallet',
    downloadsCount: 220000,
    meshRequirement: 'Blockchain Verification Link',
    embeddedMeshFeature: 'Zero-Gas Fee Peer-to-Peer Settlement'
  }
];

export const INITIAL_MATES: MateTalkie[] = [
  {
    id: 'mate-01',
    name: 'Dave (Vista Node 04)',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    status: 'online',
    nodeLocation: 'Pitch 14 - Holiday Park',
    distanceKm: 0.35,
    signalStrengthPct: 98,
    batteryPct: 88,
    frequencyChannel: '99.9 MHz',
    lastActive: 'Active now'
  },
  {
    id: 'mate-02',
    name: 'Sarah (Cornwall Pitch 12)',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    status: 'baby_monitor',
    nodeLocation: 'Cornwall Coastal Mesh',
    distanceKm: 1.2,
    signalStrengthPct: 92,
    batteryPct: 74,
    frequencyChannel: '88.4 MHz (Nursery)',
    lastActive: 'Baby Monitor Active 👶'
  },
  {
    id: 'mate-03',
    name: 'Gaz (Highland Mobile Mesh)',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
    status: 'whisper_wind',
    nodeLocation: 'Scottish Highlands',
    distanceKm: 4.8,
    signalStrengthPct: 84,
    batteryPct: 95,
    frequencyChannel: '104.2 MHz (Stealth)',
    lastActive: 'WhisperWind Active 🌬️'
  },
  {
    id: 'mate-04',
    name: 'Liam (Bristol Node #88)',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80',
    status: 'online',
    nodeLocation: 'Bristol Mobile Mesh',
    distanceKm: 2.1,
    signalStrengthPct: 90,
    batteryPct: 62,
    frequencyChannel: '99.9 MHz',
    lastActive: '2 mins ago'
  }
];

export const WALKIE_TALKIE_CHANNELS: WalkieTalkieChannel[] = [
  {
    id: 'chan-01',
    name: 'Elite Dragon9 Enigma Core',
    frequency: '99.9 MHz (Crypto-Key 0x9D9)',
    encrypted: true,
    accessLevel: 'Elite Dragon9',
    activeListeners: 142
  },
  {
    id: 'chan-02',
    name: 'Holiday Parks Global Relay',
    frequency: '88.4 MHz (Open Mesh)',
    encrypted: false,
    accessLevel: 'Public',
    activeListeners: 890
  },
  {
    id: 'chan-03',
    name: 'Sovereign ISP Developers Channel',
    frequency: '104.2 MHz (Dev Mesh)',
    encrypted: true,
    accessLevel: 'Community',
    activeListeners: 310
  }
];

export const INITIAL_MESSAGES: WalkieTalkieMessage[] = [
  {
    id: 'msg-01',
    channelId: 'chan-01',
    sender: 'Dragon9 Commander (Node #01)',
    timestamp: '2 mins ago',
    isAudio: true,
    audioDurationSec: 4,
    text: '[Audio Voice Pulse] Sunshine Cove Holiday Park Node throughput increased to 2.5 Gbps. All members report $0 cellular charges.',
    dragonSignSignature: '0x99a1...ff88'
  },
  {
    id: 'msg-02',
    channelId: 'chan-01',
    sender: 'Highland Peer Operator',
    timestamp: '5 mins ago',
    isAudio: false,
    text: 'Pine Hills Holiday Resort Node synced to Dragon9 blockchain ledger. Harmony Notes distribution verified.',
    dragonSignSignature: '0x33b2...11a0'
  },
  {
    id: 'msg-03',
    channelId: 'chan-02',
    sender: 'Cornwall Mesh Guest',
    timestamp: '12 mins ago',
    isAudio: true,
    audioDurationSec: 3,
    text: '[Audio Voice Pulse] Joined mesh instantly via SMS link! Streamed HD video smoothly on 0 mobile data.',
    dragonSignSignature: '0x77c4...bb22'
  }
];
