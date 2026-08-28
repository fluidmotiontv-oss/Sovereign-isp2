import React, { useState, useEffect } from 'react';
import { ViewMode, ActiveTab, MeshNode, HarmonyNoteTransaction, WalkieTalkieChannel, WalkieTalkieMessage, AddonApp, MateTalkie, DeveloperContribution, BandwidthUsage, NodeType } from './types';
import { HeaderNav } from './components/HeaderNav';
import { MobileAppView } from './components/MobileAppView';
import { NodeMonitor } from './components/NodeMonitor';
import { BillingAndAnalytics } from './components/BillingAndAnalytics';
import { QuickSetup } from './components/QuickSetup';
import { WalkieTalkie } from './components/WalkieTalkie';
import { EcosystemAppsHub } from './components/EcosystemAppsHub';
import { DeveloperLedger } from './components/DeveloperLedger';
import { AIAssistantModal } from './components/AIAssistantModal';
import { AvatarForge } from './components/AvatarForge';
import { TideSynthTab } from './components/TideSynthTab';
import { Dragon9Terminal } from './components/Dragon9Terminal';
import { 
  INITIAL_NODES, 
  MONTHLY_BANDWIDTH_HISTORY, 
  HARMONY_NOTE_TRANSACTIONS, 
  DEVELOPER_CONTRIBUTIONS, 
  ECOSYSTEM_APPS, 
  INITIAL_MATES,
  WALKIE_TALKIE_CHANNELS, 
  INITIAL_MESSAGES 
} from './data/mockData';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('mobile');
  const [activeTab, setActiveTab] = useState<ActiveTab>('monitor');

  // State
  const [nodes, setNodes] = useState<MeshNode[]>(INITIAL_NODES);
  const [harmonyBalance, setHarmonyBalance] = useState<number>(1245.80);
  const [transactions, setTransactions] = useState<HarmonyNoteTransaction[]>(HARMONY_NOTE_TRANSACTIONS);
  const [history, setHistory] = useState<BandwidthUsage[]>(MONTHLY_BANDWIDTH_HISTORY);
  const [channels, setChannels] = useState<WalkieTalkieChannel[]>(WALKIE_TALKIE_CHANNELS);
  const [messages, setMessages] = useState<WalkieTalkieMessage[]>(INITIAL_MESSAGES);
  const [apps, setApps] = useState<AddonApp[]>(ECOSYSTEM_APPS);
  const [mates, setMates] = useState<MateTalkie[]>(INITIAL_MATES);
  const [developers, setDevelopers] = useState<DeveloperContribution[]>(DEVELOPER_CONTRIBUTIONS);
  const [isAiOpen, setIsAiOpen] = useState<boolean>(false);

  // Fetch initial data from backend API if available
  useEffect(() => {
    fetch('/api/nodes')
      .then(res => res.json())
      .then(data => {
        if (data?.nodes) setNodes(data.nodes);
      })
      .catch(() => {
        // Fallback to local initial nodes if backend is initializing
      });

    fetch('/api/billing')
      .then(res => res.json())
      .then(data => {
        if (data?.harmonyNotesBalance) setHarmonyBalance(data.harmonyNotesBalance);
        if (data?.transactions) setTransactions(data.transactions);
      })
      .catch(() => {});
  }, []);

  // Live mesh heartbeat simulation - increments harmony balance slightly every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setHarmonyBalance(prev => +(prev + 0.2).toFixed(1));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Deploy New Node Handler
  const handleDeployNode = (name: string, type: NodeType, location: string) => {
    fetch('/api/nodes/deploy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, type, location })
    })
      .then(res => res.json())
      .then(data => {
        if (data?.node) {
          setNodes(prev => [data.node, ...prev]);
        }
        if (data?.walletBalance) {
          setHarmonyBalance(data.walletBalance);
        }
      })
      .catch(() => {
        // Local fallback
        const newNode: MeshNode = {
          id: `node-${Date.now().toString(36)}`,
          name,
          type,
          status: 'online',
          location,
          coordinates: { x: Math.floor(Math.random() * 50) + 25, y: Math.floor(Math.random() * 50) + 25 },
          lat: 51.5074,
          lng: -0.1278,
          connectedPeers: 32,
          bandwidthMbps: 850,
          latencyMs: 7,
          uptimePercentage: 100,
          harmonyEarned24h: 50,
          blockchainVerified: true,
          blockHash: `0x${Math.random().toString(16).substring(2, 10)}...d9`,
          operator: 'You (Local Mesh Operator)'
        };
        setNodes(prev => [newNode, ...prev]);
        setHarmonyBalance(prev => +(prev + 50.0).toFixed(1));
      });
  };

  // Send Walkie Talkie Message Handler
  const handleSendMessage = (channelId: string, text: string, isAudio: boolean) => {
    fetch('/api/walkie-talkie/transmit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channelId, text, isAudio, sender: 'You (Dragon9 Member)' })
    })
      .then(res => res.json())
      .then(data => {
        if (data?.message) {
          setMessages(prev => [data.message, ...prev]);
        }
      })
      .catch(() => {
        const newMsg: WalkieTalkieMessage = {
          id: `msg-${Date.now().toString(36)}`,
          channelId,
          sender: 'You (Dragon9 Member)',
          timestamp: 'Just now',
          isAudio,
          audioDurationSec: isAudio ? 3 : undefined,
          text,
          dragonSignSignature: `0x${Math.random().toString(16).substring(2, 10)}...d9`
        };
        setMessages(prev => [newMsg, ...prev]);
      });
  };

  const onlineCount = nodes.filter(n => n.status === 'online').length;

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 flex flex-col antialiased">
      {/* Navigation Header */}
      <HeaderNav
        viewMode={viewMode}
        setViewMode={setViewMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        harmonyBalance={harmonyBalance}
        onlineCount={onlineCount}
        totalCount={nodes.length}
        onOpenAi={() => setIsAiOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 py-6">
        {viewMode === 'mobile' ? (
          <MobileAppView
            nodes={nodes}
            harmonyBalance={harmonyBalance}
            onOpenWalkie={() => {
              setViewMode('desktop');
              setActiveTab('walkie');
            }}
            onDeployNode={() => {
              setViewMode('desktop');
              setActiveTab('monitor');
            }}
          />
        ) : (
          <div>
            {activeTab === 'monitor' && (
              <NodeMonitor
                nodes={nodes}
                onDeployNode={handleDeployNode}
              />
            )}

            {activeTab === 'billing' && (
              <BillingAndAnalytics
                harmonyBalance={harmonyBalance}
                transactions={transactions}
                history={history}
                onTransactionCreated={(newTx, updatedBalance) => {
                  setTransactions(prev => [newTx, ...prev]);
                  setHarmonyBalance(updatedBalance);
                }}
              />
            )}

            {activeTab === 'setup' && (
              <QuickSetup />
            )}

            {activeTab === 'walkie' && (
              <WalkieTalkie
                channels={channels}
                messages={messages}
                mates={mates}
                onSendMessage={handleSendMessage}
                onAddMate={(newMate) => setMates(prev => [newMate, ...prev])}
              />
            )}

            {activeTab === 'apps' && (
              <EcosystemAppsHub apps={apps} />
            )}

            {activeTab === 'ledger' && (
              <DeveloperLedger developers={developers} />
            )}

            {activeTab === 'avatar_forge' && (
              <AvatarForge />
            )}

            {activeTab === 'tide_synth' && (
              <TideSynthTab />
            )}

            {activeTab === 'terminal' && (
              <Dragon9Terminal nodes={nodes} />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070a13] py-6 px-4 text-center text-xs text-slate-500 space-y-1">
        <p className="font-medium text-slate-400">
          Sovereign ISP • Fluid Motion TV • Dragon9 Heart Decentralized Data Mesh Ecosystem
        </p>
        <p>
          Free Peer-to-Peer Internet for All Registered Members • Blockchain Verified • Zero Carrier Fees
        </p>
      </footer>

      {/* Dragon9 AI Assistant Modal */}
      <AIAssistantModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
      />
    </div>
  );
}
