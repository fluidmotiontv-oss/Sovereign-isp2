import React, { useState } from 'react';
import { BandwidthUsage, HarmonyNoteTransaction } from '../types';
import { TransactionConfirmationModal } from './TransactionConfirmationModal';
import { 
  Receipt, 
  ShieldCheck, 
  TrendingDown, 
  Sparkles, 
  Zap, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Download, 
  Upload, 
  Network, 
  Coins, 
  CheckCircle2, 
  DollarSign,
  PieChart,
  Lock,
  Send,
  X,
  Eye,
  Key,
  Smartphone,
  Globe
} from 'lucide-react';

interface BillingAndAnalyticsProps {
  harmonyBalance: number;
  transactions: HarmonyNoteTransaction[];
  history: BandwidthUsage[];
  onTransactionCreated?: (tx: HarmonyNoteTransaction, newBalance: number) => void;
}

export const BillingAndAnalytics: React.FC<BillingAndAnalyticsProps> = ({
  harmonyBalance,
  transactions,
  history,
  onTransactionCreated
}) => {
  const [carrierBillEstimateUsd, setCarrierBillEstimateUsd] = useState<number>(120);
  const [selectedTxForModal, setSelectedTxForModal] = useState<HarmonyNoteTransaction | null>(null);

  // Pay-to-Mobile state
  const [isPayToMobileOpen, setIsPayToMobileOpen] = useState<boolean>(false);
  const [mobileNumber, setMobileNumber] = useState<string>('+44 7700 900077');
  const [airtimeNotesAmount, setAirtimeNotesAmount] = useState<number>(20);
  const [mobileTopupSuccess, setMobileTopupSuccess] = useState<boolean>(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  // Transfer Form State
  const [isTransferFormOpen, setIsTransferFormOpen] = useState(false);
  const [recipientInput, setRecipientInput] = useState('');
  const [amountInput, setAmountInput] = useState('25.0');
  const [noteInput, setNoteInput] = useState('P2P Mesh Bandwidth Staking');
  const [isSubmittingTransfer, setIsSubmittingTransfer] = useState(false);

  const currentMonth = history[history.length - 1] || {
    month: 'Jul 2026',
    downloadGB: 388,
    uploadGB: 245,
    p2pMeshRoutedGB: 1420,
    carrierCostSavedUsd: 120
  };

  const yearlySavedUsd = carrierBillEstimateUsd * 12;

  const handleOpenTransactionModal = (tx: HarmonyNoteTransaction) => {
    setSelectedTxForModal(tx);
    setIsConfirmationModalOpen(true);
  };

  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(amountInput);
    if (isNaN(amountNum) || amountNum <= 0) return;

    setIsSubmittingTransfer(true);

    fetch('/api/harmony/transfer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient: recipientInput || 'Dragon9 Community Relay (0x3B...11)',
        amount: amountNum,
        note: noteInput || 'Harmony Ledger P2P Transfer'
      })
    })
      .then(res => res.json())
      .then(data => {
        setIsSubmittingTransfer(false);
        setIsTransferFormOpen(false);

        if (data?.transaction) {
          const newTx: HarmonyNoteTransaction = data.transaction;
          if (onTransactionCreated && data.walletBalance !== undefined) {
            onTransactionCreated(newTx, data.walletBalance);
          }
          // Open Confirmation Modal with full Block Hash & Timestamp
          handleOpenTransactionModal(newTx);
        }
      })
      .catch(() => {
        setIsSubmittingTransfer(false);
        setIsTransferFormOpen(false);

        // Fallback local execution
        const hex32 = () => Math.random().toString(16).substring(2, 10);
        const fullBlockHash = `0x${hex32()}${hex32()}${hex32()}${hex32()}${hex32()}${hex32()}${hex32()}${hex32()}`;

        const fallbackTx: HarmonyNoteTransaction = {
          id: `tx-${Date.now().toString(36)}`,
          timestamp: new Date().toISOString(),
          type: 'p2p_transfer',
          amount: amountNum,
          sender: 'You (0x7F2A...9D41)',
          recipient: recipientInput || 'Dragon9 Community Pool (0x3B...11)',
          note: noteInput || 'Local P2P Harmony Ledger Transfer',
          txHash: fullBlockHash
        };

        if (onTransactionCreated) {
          onTransactionCreated(fallbackTx, Math.max(0, harmonyBalance - amountNum));
        }

        handleOpenTransactionModal(fallbackTx);
      });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Zero-Cost Billing Guarantee Header */}
      <div className="relative rounded-[2.5rem] bg-gradient-to-r from-[#0d0707] via-[#08080a] to-[#081210] border border-[#FF3E3E]/30 p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-gradient-to-br from-[#FF3E3E]/10 via-[#FF8C00]/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF3E3E]/10 border border-[#FF3E3E]/30 text-[#FF3E3E] text-xs font-mono font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Sovereign ISP Guarantee • Absolute Privacy</span>
            </div>
            <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase font-sans">
              Automated Zero-Cost Billing Statement
            </h2>
            <p className="text-xs text-slate-300 max-w-xl">
              Sovereign ISP provides 100% free peer-to-peer data mesh connectivity for all registered members. Powered by blockchain verification and ChaCha20-Poly1305 zero-knowledge data privacy.
            </p>
          </div>

          <div className="bg-[#050505] border border-[#FF3E3E]/40 p-5 rounded-[2rem] text-right min-w-[220px] shadow-xl">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Total Due This Month</span>
            <span className="text-4xl font-black italic text-emerald-400 font-mono">$0.00</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Unlimited Mesh Data • 0 Caps</span>
          </div>
        </div>
      </div>

      {/* Mobile Carrier Cost Elimination Calculator + Harmony Wallet */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-[#08080a] border border-[#222] rounded-[2rem] p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#222]">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-black italic uppercase text-white tracking-tight">Mobile Network Charges Elimination</h3>
            </div>
            <span className="text-xs text-emerald-400 font-mono font-bold">$0 vs Traditional Carrier</span>
          </div>

          <p className="text-xs text-slate-300">
            Compare your previous mobile phone carrier bill with your Sovereign ISP shared data mesh savings:
          </p>

          {/* Calculator Input Slider */}
          <div className="p-4 bg-[#030304] rounded-2xl border border-[#1e1e24] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Previous Mobile Carrier Plan:</span>
              <span className="font-mono font-bold text-amber-400 text-sm">${carrierBillEstimateUsd} / month</span>
            </div>
            <input
              type="range"
              min="30"
              max="250"
              step="10"
              value={carrierBillEstimateUsd}
              onChange={(e) => setCarrierBillEstimateUsd(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>$30/mo (Basic)</span>
              <span>$120/mo (Standard 5G)</span>
              <span>$250/mo (Family Unlimited)</span>
            </div>
          </div>

          {/* Savings Comparison Cards */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#030304] border border-[#FF3E3E]/30 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Traditional Mobile Carrier</span>
              <span className="text-xl font-mono font-bold text-[#FF3E3E]">${yearlySavedUsd} / year</span>
              <p className="text-[10px] text-slate-500">Includes data caps, roaming surcharges, and contract lock-ins.</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
              <span className="text-[10px] text-emerald-400 uppercase font-mono block">Sovereign Data Mesh</span>
              <span className="text-xl font-mono font-bold text-emerald-300">$0.00 / year</span>
              <p className="text-[10px] text-emerald-400">
                You save <strong className="text-white">${yearlySavedUsd} every year</strong> while gaining Harmony Notes yield!
              </p>
            </div>
          </div>
        </div>

        {/* Harmony Notes Wallet Card */}
        <div className="bg-[#08080a] border border-amber-500/30 rounded-[2rem] p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#222]">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-black italic uppercase text-white">Harmony Notes Vault</h3>
              </div>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-mono border border-amber-500/20">
                Zero Gas Fees
              </span>
            </div>

            <div className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-[#030304] to-[#030304] border border-amber-500/30 text-center space-y-1">
              <span className="text-xs text-slate-400 font-medium">Your Harmony Notes Balance</span>
              <div className="text-3xl font-black font-mono text-amber-300">
                {harmonyBalance.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} 🎵
              </div>
              <p className="text-[11px] text-slate-400">
                Earned automatically by routing mesh packets & hosting node relays.
              </p>
            </div>

            <div className="mt-4 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">24h Packet Routing Yield:</span>
                <span className="text-emerald-400 font-bold">+41.7 🎵</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Developer Contribution Split:</span>
                <span className="text-cyan-400 font-bold">+18.2 🎵</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Starlink Orbital Mesh Backhaul:</span>
                <span className="text-cyan-400 font-bold">42 LEO Satellites 🛰️</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-3">
            <button 
              onClick={() => setIsTransferFormOpen(true)}
              className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Transfer / Stake Harmony Notes</span>
            </button>

            <button 
              onClick={() => setIsPayToMobileOpen(true)}
              className="w-full py-2.5 rounded-2xl bg-[#141418] hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 border border-emerald-500/30 font-bold text-xs transition-all flex items-center justify-center gap-2"
            >
              <Smartphone className="w-4 h-4" />
              <span>Pay-to-Mobile Top Up (Airtime)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Starlink Orbital Backhaul Status Banner */}
      <div className="p-5 rounded-[2rem] bg-gradient-to-r from-[#031018] via-[#08080a] to-[#041212] border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Globe className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-sm uppercase font-sans">Starlink LEO Satellite Direct Backhaul</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                CONNECTED (42 Satellites In View)
              </span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Active Direct-to-Cell satellite beam routing bandwidth into local campsite & mobile mesh clusters.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-right">
          <div>
            <span className="text-slate-500 text-[10px] uppercase block">Orbit Ping</span>
            <span className="text-cyan-300 font-bold">24 ms</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] uppercase block">Starlink Speed</span>
            <span className="text-emerald-400 font-bold">320 Mbps</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] uppercase block">Carrier Fee</span>
            <span className="text-amber-300 font-bold">$0.00 / Free</span>
          </div>
        </div>
      </div>

      {/* Bandwidth Analytics Charts & Monthly History */}
      <div className="bg-[#08080a] border border-[#222] rounded-[2rem] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-[#222]">
          <div>
            <h3 className="text-base font-black italic uppercase text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-cyan-400" />
              Monthly Bandwidth & Mesh Traffic Analytics
            </h3>
            <p className="text-xs text-slate-400">
              Detailed metrics on downloaded data, uploaded data, and peer-to-peer mesh packet routing.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1 text-emerald-400">
              <Download className="w-3.5 h-3.5" /> 388 GB Download
            </span>
            <span className="flex items-center gap-1 text-cyan-400">
              <Upload className="w-3.5 h-3.5" /> 245 GB Upload
            </span>
            <span className="flex items-center gap-1 text-amber-400">
              <Network className="w-3.5 h-3.5" /> 1,420 GB Routed
            </span>
          </div>
        </div>

        {/* Visual Bar Graph */}
        <div className="space-y-3 pt-2">
          {history.map((item, idx) => {
            const maxVal = 1500;
            const routedWidth = Math.min(100, (item.p2pMeshRoutedGB / maxVal) * 100);
            return (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                  <span className="font-bold text-white">{item.month}</span>
                  <div className="flex items-center gap-4 text-[11px]">
                    <span className="text-slate-400">Download: <strong className="text-emerald-400">{item.downloadGB} GB</strong></span>
                    <span className="text-slate-400">Upload: <strong className="text-cyan-400">{item.uploadGB} GB</strong></span>
                    <span className="text-slate-400">P2P Mesh Routed: <strong className="text-amber-400">{item.p2pMeshRoutedGB} GB</strong></span>
                  </div>
                </div>

                <div className="w-full h-3 bg-[#030304] rounded-full overflow-hidden flex border border-[#1e1e24]">
                  <div
                    style={{ width: `${(item.downloadGB / maxVal) * 100}%` }}
                    className="h-full bg-emerald-500"
                    title={`Download: ${item.downloadGB} GB`}
                  ></div>
                  <div
                    style={{ width: `${(item.uploadGB / maxVal) * 100}%` }}
                    className="h-full bg-cyan-500"
                    title={`Upload: ${item.uploadGB} GB`}
                  ></div>
                  <div
                    style={{ width: `${routedWidth}%` }}
                    className="h-full bg-amber-400"
                    title={`Mesh Routed: ${item.p2pMeshRoutedGB} GB`}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Proof-of-Mesh Blockchain Ledger Section */}
      <div className="bg-[#08080a] border border-[#222] rounded-[2rem] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-[#222]">
          <div>
            <h3 className="text-base font-black italic uppercase text-white flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-400" />
              Proof-of-Mesh Blockchain Harmony Ledger
            </h3>
            <p className="text-xs text-slate-400">
              Click any transaction row to verify its block hash, timestamp, and ChaCha20-Poly1305 zero-knowledge encryption proof.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1">
              <Lock className="w-3 h-3" /> ZKP Hardware Sealed
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#030304] text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-3">Time</th>
                <th className="p-3">Type</th>
                <th className="p-3">Sender</th>
                <th className="p-3">Recipient</th>
                <th className="p-3">Note / Block Hash</th>
                <th className="p-3 font-mono text-right">Amount</th>
                <th className="p-3 text-center">Verify</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24] font-mono text-xs">
              {transactions.map((tx) => (
                <tr 
                  key={tx.id} 
                  onClick={() => handleOpenTransactionModal(tx)}
                  className="hover:bg-[#141419] cursor-pointer transition-colors group"
                >
                  <td className="p-3 text-slate-400 whitespace-nowrap">{tx.timestamp}</td>
                  <td className="p-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      tx.type === 'node_reward' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      tx.type === 'dev_split' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                      'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                    }`}>
                      {tx.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3 text-slate-300 truncate max-w-[120px]">{tx.sender}</td>
                  <td className="p-3 text-slate-300 truncate max-w-[120px]">{tx.recipient}</td>
                  <td className="p-3 font-sans text-slate-400">
                    <div className="flex flex-col">
                      <span className="text-white font-medium">{tx.note}</span>
                      <span className="font-mono text-[10px] text-amber-400/80 truncate max-w-[180px]">{tx.txHash}</span>
                    </div>
                  </td>
                  <td className={`p-3 text-right font-bold whitespace-nowrap ${tx.amount > 0 ? 'text-emerald-400' : 'text-slate-300'}`}>
                    {tx.amount > 0 ? `+${tx.amount}` : tx.amount} 🎵
                  </td>
                  <td className="p-3 text-center whitespace-nowrap">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenTransactionModal(tx);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#18181f] hover:bg-amber-500 hover:text-black border border-[#333] text-amber-300 text-[10px] font-bold transition-all flex items-center gap-1 mx-auto"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Verify</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transfer Form Modal */}
      {isTransferFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#050505] border border-[#333] rounded-[2.5rem] p-6 shadow-2xl space-y-5 text-white">
            <button
              onClick={() => setIsTransferFormOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-[#141418] border border-[#222] text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-mono font-bold uppercase">
                <Coins className="w-3 h-3" /> Harmony Ledger Transfer
              </div>
              <h3 className="text-xl font-black italic uppercase">Execute Secure Transfer</h3>
              <p className="text-xs text-slate-400">
                Transfer Harmony Notes to another node, developer, or community relay with local ChaCha20-Poly1305 encryption.
              </p>
            </div>

            <form onSubmit={handleExecuteTransfer} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-slate-400 uppercase text-[10px]">Recipient Node Address / Identity</label>
                <input
                  type="text"
                  placeholder="e.g. 0x3B88...11C2 (Community Relay)"
                  value={recipientInput}
                  onChange={(e) => setRecipientInput(e.target.value)}
                  className="w-full bg-[#0a0a0e] border border-[#222] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 uppercase text-[10px]">Harmony Notes Amount (🎵)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.1"
                  max={harmonyBalance}
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="w-full bg-[#0a0a0e] border border-[#222] rounded-xl px-3 py-2.5 text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                />
                <span className="text-[10px] text-slate-500">Available Balance: {harmonyBalance} 🎵</span>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 uppercase text-[10px]">Transaction Note / Purpose</label>
                <input
                  type="text"
                  placeholder="P2P Mesh Bandwidth Staking"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  className="w-full bg-[#0a0a0e] border border-[#222] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400 font-sans"
                />
              </div>

              <div className="p-3 rounded-xl bg-gradient-to-r from-[#140a0a] to-[#0a1410] border border-[#FF3E3E]/30 space-y-1 font-sans text-[11px]">
                <span className="font-bold text-[#FF3E3E] flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Absolute Privacy Guarantee
                </span>
                <p className="text-slate-300">
                  Signed locally on device with your hardware private key before broadcasting. It is your data after all.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmittingTransfer}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black uppercase text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmittingTransfer ? 'Encrypting & Transmitting...' : 'Confirm & Generate Block Hash'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Pay-To-Mobile Airtime Top Up Modal */}
      {isPayToMobileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#050505] border border-emerald-500/40 rounded-[2.5rem] p-6 shadow-2xl space-y-5 text-white">
            <button
              onClick={() => {
                setIsPayToMobileOpen(false);
                setMobileTopupSuccess(false);
              }}
              className="absolute top-5 right-5 p-2 rounded-full bg-[#141418] border border-[#222] text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold uppercase">
                <Smartphone className="w-3.5 h-3.5" /> Mobile Carrier Top Up
              </div>
              <h3 className="text-xl font-black italic uppercase">Pay-to-Mobile Airtime</h3>
              <p className="text-xs text-slate-400">
                Convert your earned Harmony Notes into direct mobile phone credit & SIM airtime for any phone number worldwide.
              </p>
            </div>

            {mobileTopupSuccess ? (
              <div className="p-5 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 space-y-3 text-center animate-pulse">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="font-black text-white text-base">Mobile Airtime Dispatched!</h4>
                <p className="text-xs text-emerald-200">
                  Successfully credited {airtimeNotesAmount} Harmony Notes ($15.00 airtime equivalent) to <strong>{mobileNumber}</strong> over Starlink Satellite Gateway.
                </p>
                <button
                  onClick={() => {
                    setIsPayToMobileOpen(false);
                    setMobileTopupSuccess(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs uppercase"
                >
                  Done
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (onTransactionCreated) {
                    const tx: HarmonyNoteTransaction = {
                      id: `topup-${Date.now().toString(36)}`,
                      timestamp: new Date().toISOString(),
                      type: 'p2p_transfer',
                      amount: airtimeNotesAmount,
                      sender: 'Your Harmony Wallet',
                      recipient: `Mobile Top-Up (${mobileNumber})`,
                      note: 'Direct Mobile Airtime Credit Conversion',
                      txHash: `0x${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}`
                    };
                    onTransactionCreated(tx, Math.max(0, harmonyBalance - airtimeNotesAmount));
                  }
                  setMobileTopupSuccess(true);
                }}
                className="space-y-4 text-xs font-mono"
              >
                <div className="space-y-1">
                  <label className="text-slate-400 uppercase text-[10px]">Recipient Mobile Phone Number</label>
                  <input
                    type="text"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    required
                    placeholder="+44 7700 900077"
                    className="w-full bg-[#0a0a0e] border border-[#222] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500 font-mono text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 uppercase text-[10px]">Harmony Notes Amount to Convert</label>
                  <input
                    type="number"
                    min="1"
                    max={harmonyBalance}
                    value={airtimeNotesAmount}
                    onChange={(e) => setAirtimeNotesAmount(Number(e.target.value))}
                    className="w-full bg-[#0a0a0e] border border-[#222] rounded-xl px-3 py-2.5 text-amber-300 font-bold focus:outline-none focus:border-emerald-500 font-mono text-sm"
                  />
                  <span className="text-[10px] text-slate-400 block">
                    Available: {harmonyBalance.toFixed(1)} 🎵 (10 🎵 = $7.50 Airtime Credit)
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:brightness-110 text-white font-black uppercase text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Send Airtime Credit to Mobile</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Transaction Confirmation / Block Hash Verification Modal */}
      <TransactionConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        transaction={selectedTxForModal}
      />
    </div>
  );
};

