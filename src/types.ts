export type ViewMode = 'mobile' | 'desktop';

export type ActiveTab = 
  | 'monitor' 
  | 'billing' 
  | 'setup' 
  | 'walkie' 
  | 'apps' 
  | 'ledger' 
  | 'ai'
  | 'avatar_forge'
  | 'tide_synth'
  | 'terminal';

export type NodeStatus = 'online' | 'degraded' | 'offline' | 'syncing';
export type NodeType = 'server' | 'community_relay' | 'holiday_park' | 'mobile_hotspot' | 'peer_node';

export interface MeshNode {
  id: string;
  name: string;
  type: NodeType;
  status: NodeStatus;
  location: string;
  coordinates: { x: number; y: number }; // percentage position on map canvas
  lat: number;
  lng: number;
  connectedPeers: number;
  bandwidthMbps: number;
  latencyMs: number;
  uptimePercentage: number;
  harmonyEarned24h: number;
  blockchainVerified: boolean;
  blockHash: string;
  operator: string;
}

export interface BandwidthUsage {
  month: string;
  downloadGB: number;
  uploadGB: number;
  p2pMeshRoutedGB: number;
  carrierCostSavedUsd: number;
}

export interface HarmonyNoteTransaction {
  id: string;
  timestamp: string;
  type: 'node_reward' | 'p2p_transfer' | 'dev_split' | 'app_cashback';
  amount: number;
  sender: string;
  recipient: string;
  note: string;
  txHash: string;
}

export interface DeveloperContribution {
  id: string;
  developer: string;
  avatar: string;
  role: string;
  commitsCount: number;
  component: string;
  splitPercentage: number;
  earnedNotes: number;
  lastContribution: string;
}

export interface DistressBeaconAlert {
  id: string;
  timestamp: string;
  location: string;
  coordinates: { x: number; y: number };
  status: 'active' | 'responding' | 'resolved';
  closestPeersCount: number;
  anonymousNote: string;
  responders: { id: string; name: string; distanceMeters: number; status: string }[];
}

export interface IncomingPlasmaCall {
  id: string;
  callerName: string;
  callerNode: string;
  callerAvatar: string;
  timestamp: string;
  frequencyChannel: string;
  isAnsweringMachineActive?: boolean;
}

export interface AddonApp {
  id: string;
  title: string;
  tagline: string;
  category: 'P2P Sharing' | 'Communication' | 'Media' | 'Finance' | 'Entertainment & Theatre' | 'Creative Arts';
  iconName: string;
  downloadsCount: number;
  meshRequirement: string;
  embeddedMeshFeature: string;
  featured?: boolean;
}

export interface MateTalkie {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'busy' | 'baby_monitor' | 'whisper_wind' | 'offline';
  nodeLocation: string;
  distanceKm: number;
  signalStrengthPct: number;
  batteryPct: number;
  frequencyChannel: string;
  lastActive: string;
}

export interface WalkieTalkieChannel {
  id: string;
  name: string;
  frequency: string;
  encrypted: boolean;
  accessLevel: 'Public' | 'Community' | 'Elite Dragon9';
  activeListeners: number;
}

export interface WalkieTalkieMessage {
  id: string;
  channelId: string;
  sender: string;
  timestamp: string;
  isAudio: boolean;
  audioDurationSec?: number;
  text?: string;
  dragonSignSignature: string;
}

export interface DirectorPersona {
  id: string;
  name: string;
  tagline: string;
  avatar?: string;
  voice?: string;
}

export interface StorySegment {
  id: string;
  title: string;
  durationSec: number;
  description?: string;
  thumbnailUrl?: string;
}

