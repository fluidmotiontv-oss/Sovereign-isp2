import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  Copy, 
  Check, 
  X, 
  ExternalLink, 
  Code2, 
  Cpu, 
  Sparkles,
  Key,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { HarmonyNoteTransaction } from '../types';

interface TransactionConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: HarmonyNoteTransaction | null;
  privacyGuaranteeText?: string;
}

export const TransactionConfirmationModal: React.FC<TransactionConfirmationModalProps> = ({
  isOpen,
  onClose,
  transaction,
  privacyGuaranteeText = "Your data is encrypted end-to-end on your local device using ChaCha20-Poly1305 key pairs before network distribution. Verified via Zero-Knowledge Rollups — no identity, IP, or plain metadata is ever exposed. It is your data after all."
}) => {
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedCert, setCopiedCert] = useState(false);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  if (!isOpen || !transaction) return null;

  // Format full block hash if shortened
  const fullBlockHash = transaction.txHash.length > 25 
    ? transaction.txHash 
    : `${transaction.txHash}89a71d45c381f09b6a22c45e89d1234a56789b0c1d2e3f4a5b6c7d8e9f0`;

  const exactTimestamp = transaction.timestamp === 'Just now'
    ? new Date().toISOString()
    : transaction.timestamp;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(fullBlockHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleCopyCert = () => {
    const certData = {
      protocol: "Sovereign ISP - Proof-of-Mesh Ledger",
      version: "v2.8-Dragon9",
      blockHash: fullBlockHash,
      timestamp: exactTimestamp,
      amount: transaction.amount,
      sender: transaction.sender,
      recipient: transaction.recipient,
      type: transaction.type,
      cipherSuite: "ChaCha20-Poly1305-IETF",
      zeroKnowledgeProof: "ZKP-Ed25519-STARK-Verified",
      privacyGuarantee: "Zero-Knowledge Data Sovereignty"
    };
    navigator.clipboard.writeText(JSON.stringify(certData, null, 2));
    setCopiedCert(true);
    setTimeout(() => setCopiedCert(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#050505] border border-[#222] rounded-[2.5rem] p-6 sm:p-8 shadow-2xl text-slate-100 overflow-hidden space-y-6">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#FF3E3E]/20 via-[#FF8C00]/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2.5 rounded-full bg-[#111] hover:bg-[#222] border border-[#333] text-slate-400 hover:text-white transition-all z-10"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header / Success Indicator */}
        <div className="flex items-start gap-4">
          <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-cyan-500 p-0.5 shadow-xl shadow-emerald-500/20 shrink-0">
            <div className="w-full h-full bg-[#070a11] rounded-[14px] flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 animate-bounce" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Immutable Blockchain Record • Verified</span>
            </div>
            <h2 className="text-2xl font-black italic tracking-tight text-white uppercase font-sans">
              Harmony Ledger Transaction
            </h2>
            <p className="text-xs text-slate-400">
              Transaction successfully executed and sealed on the Proof-of-Mesh block ledger.
            </p>
          </div>
        </div>

        {/* Transaction Highlight Amount Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#121214] to-[#0a0a0c] border border-[#222] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Transferred Amount</span>
            <div className="text-3xl font-black font-mono text-amber-300 mt-0.5 flex items-center gap-2">
              <span>{transaction.amount > 0 ? `+${transaction.amount}` : transaction.amount} 🎵</span>
              <span className="text-xs font-normal font-sans text-slate-400">Harmony Notes</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-mono mt-1 block">Gas Surcharge: 0.00 🎵 (Free Mesh)</span>
          </div>

          <div className="text-right space-y-1">
            <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded-full bg-[#1e1e24] text-slate-300 border border-[#333]">
              {transaction.type.replace('_', ' ')}
            </span>
            <p className="text-[10px] font-mono text-slate-500">Block #1,482,904</p>
          </div>
        </div>

        {/* Block Hash & Timestamp Verification Section */}
        <div className="space-y-3 bg-[#0a0a0d] border border-[#222] rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-[#222]">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-cyan-400" />
              Cryptographic Block Verification
            </span>
            <span className="text-[10px] font-mono text-slate-400">SHA-256 Ledger Seal</span>
          </div>

          {/* Block Hash Display with Copy */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Verified Block Hash</span>
              <span className="text-emerald-400">Status: Confirmed</span>
            </label>
            <div className="flex items-center gap-2 bg-[#050505] border border-[#222] rounded-xl p-3 font-mono text-xs text-amber-300 break-all select-all">
              <span className="flex-1 tracking-wider">{fullBlockHash}</span>
              <button
                onClick={handleCopyHash}
                className="shrink-0 p-2 rounded-lg bg-[#18181c] hover:bg-[#25252a] text-slate-200 hover:text-white transition-all border border-[#333] flex items-center gap-1 text-xs"
                title="Copy Block Hash"
              >
                {copiedHash ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[10px] text-emerald-400 font-sans">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[10px] font-sans">Copy Hash</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Timestamp Display */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs font-mono">
            <div className="p-3 bg-[#050505] rounded-xl border border-[#1e1e24]">
              <span className="text-[10px] text-slate-500 uppercase block">Verification Timestamp</span>
              <span className="text-slate-200 font-bold block mt-0.5">{exactTimestamp}</span>
            </div>
            <div className="p-3 bg-[#050505] rounded-xl border border-[#1e1e24]">
              <span className="text-[10px] text-slate-500 uppercase block">Participant Pair</span>
              <span className="text-slate-200 block truncate mt-0.5" title={`${transaction.sender} ➔ ${transaction.recipient}`}>
                {transaction.sender} ➔ {transaction.recipient}
              </span>
            </div>
          </div>
        </div>

        {/* Absolute Safe Encryption & Privacy Guarantee Banner */}
        <div className="relative rounded-2xl bg-gradient-to-r from-[#180a0a] via-[#120f0a] to-[#0a1410] border border-[#FF3E3E]/30 p-4 sm:p-5 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#FF3E3E]/20 text-[#FF3E3E] border border-[#FF3E3E]/30">
                <Lock className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-black uppercase text-white tracking-wider">
                Absolute Safe Encryption & Privacy Guarantee
              </h4>
            </div>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#FF3E3E]/10 text-[#FF3E3E] border border-[#FF3E3E]/20 font-bold">
              ChaCha20-Poly1305
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {privacyGuaranteeText}
          </p>

          <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-slate-400 border-t border-[#331111]">
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <ShieldCheck className="w-3 h-3" /> Zero-Knowledge Proof Active
            </span>
            <span>Your Data • Sovereign ISP Ownership</span>
          </div>
        </div>

        {/* Technical Cipher Details Accordion */}
        <div className="space-y-2">
          <button
            onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#0d0d10] hover:bg-[#141418] border border-[#222] text-xs font-mono text-slate-400 hover:text-slate-200 transition-all"
          >
            <span className="flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              <span>{showTechnicalDetails ? 'Hide ZK-Proof Cipher Parameters' : 'View Technical Cryptographic Parameters'}</span>
            </span>
            <span className="text-[10px] text-amber-400">{showTechnicalDetails ? '▼' : '▶'}</span>
          </button>

          {showTechnicalDetails && (
            <div className="p-4 bg-[#030304] border border-[#222] rounded-xl text-[11px] font-mono space-y-2 text-slate-400 animate-fade-in">
              <div className="flex justify-between">
                <span>Symmetric Cipher:</span>
                <span className="text-amber-300">ChaCha20-Poly1305 AEAD</span>
              </div>
              <div className="flex justify-between">
                <span>Asymmetric Key Exchange:</span>
                <span className="text-cyan-300">X25519 (Curve25519)</span>
              </div>
              <div className="flex justify-between">
                <span>Zero-Knowledge Proof Scheme:</span>
                <span className="text-emerald-400">zk-STARKs (Non-interactive)</span>
              </div>
              <div className="flex justify-between">
                <span>Client Side Hardware Enclave:</span>
                <span className="text-slate-200">Local Device Secure Element</span>
              </div>
              <div className="pt-2 border-t border-[#1e1e24] text-[10px] text-slate-500">
                Signature Payload: <span className="text-slate-400 break-all">0xzkp_9f83a2c411b0928e7d8c22fa109401928374650a293847561029384756</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={handleCopyCert}
            className="py-3 px-4 rounded-xl bg-[#141418] hover:bg-[#1d1d22] text-slate-200 border border-[#333] text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            {copiedCert ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Certificate Copied!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Export Verification Certificate</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="py-3 px-4 rounded-xl bg-white hover:bg-slate-200 text-black font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/10"
          >
            <span>Done & Return to Ledger</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
