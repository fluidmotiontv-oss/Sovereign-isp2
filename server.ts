import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { INITIAL_NODES, MONTHLY_BANDWIDTH_HISTORY, HARMONY_NOTE_TRANSACTIONS, DEVELOPER_CONTRIBUTIONS, ECOSYSTEM_APPS, WALKIE_TALKIE_CHANNELS, INITIAL_MESSAGES } from "./src/data/mockData.js";

async function startServer() {
  const app = express();
  const PORT = 3000;
  const startTime = Date.now();

  // Basic security and request parsing
  app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    next();
  });
  app.use(express.json({ limit: "5mb" }));

  // Mutable state in memory for live updates
  let nodes = [...INITIAL_NODES];
  let transactions = [...HARMONY_NOTE_TRANSACTIONS];
  let messages = [...INITIAL_MESSAGES];
  let userWalletHarmonyNotes = 1245.80;

  // Initialize Gemini client lazily
  const getAiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not configured.");
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // API Routes
  app.get("/api/health", (_req, res) => {
    const memory = process.memoryUsage();
    res.json({
      status: "online",
      app: "Sovereign ISP - Fluid Motion Dragon9 Mesh",
      version: "2.4.1",
      environment: process.env.NODE_ENV || "development",
      uptimeSec: Math.floor((Date.now() - startTime) / 1000),
      memoryMb: {
        rss: Math.round(memory.rss / (1024 * 1024)),
        heapTotal: Math.round(memory.heapTotal / (1024 * 1024)),
        heapUsed: Math.round(memory.heapUsed / (1024 * 1024)),
      },
      activeNodes: nodes.filter(n => n.status === 'online').length,
      totalNodes: nodes.length,
      userSavingsUsd: 120.00,
      timestamp: new Date().toISOString()
    });
  });

  // Get nodes list
  app.get("/api/nodes", (_req, res) => {
    res.json({ nodes });
  });

  // Deploy / update node
  app.post("/api/nodes/deploy", (req, res) => {
    const { name, type, location } = req.body;
    if (!name || !type || !location) {
      res.status(400).json({ error: "Missing node name, type, or location" });
      return;
    }

    const newNode = {
      id: `node-${Date.now().toString(36)}`,
      name,
      type: type || 'peer_node',
      status: 'online' as const,
      location,
      coordinates: { x: Math.floor(Math.random() * 60) + 20, y: Math.floor(Math.random() * 60) + 20 },
      lat: 51.5074 + (Math.random() - 0.5) * 4,
      lng: -0.1278 + (Math.random() - 0.5) * 4,
      connectedPeers: Math.floor(Math.random() * 50) + 10,
      bandwidthMbps: Math.floor(Math.random() * 1000) + 200,
      latencyMs: Math.floor(Math.random() * 15) + 3,
      uptimePercentage: 100.0,
      harmonyEarned24h: 50,
      blockchainVerified: true,
      blockHash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
      operator: 'You (Local Mesh Node)'
    };

    nodes.unshift(newNode);

    // Add reward transaction
    const newTx = {
      id: `tx-${Date.now().toString(36)}`,
      timestamp: 'Just now',
      type: 'node_reward' as const,
      amount: 50.0,
      sender: 'Mesh Network Verification',
      recipient: 'Your Wallet',
      note: `New Node Activation Bonus: ${name}`,
      txHash: newNode.blockHash
    };
    transactions.unshift(newTx);
    userWalletHarmonyNotes += 50.0;

    res.json({ success: true, node: newNode, walletBalance: userWalletHarmonyNotes });
  });

  // Get Billing & Wallet Summary
  app.get("/api/billing", (_req, res) => {
    res.json({
      monthlyFeeUsd: 0.00,
      hiddenFeesUsd: 0.00,
      usageCap: "Unlimited (Free Data)",
      carrierCostSavedUsd: 120.00,
      yearlyCarrierSavedUsd: 1440.00,
      harmonyNotesBalance: userWalletHarmonyNotes,
      meshDataRouted24hGB: 1420,
      transactions
    });
  });

  // Transfer / Stake Harmony Notes on Harmony Ledger
  app.post("/api/harmony/transfer", (req, res) => {
    const { recipient, amount, note, type } = req.body;
    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      res.status(400).json({ error: "Invalid transfer amount" });
      return;
    }

    // Generate 64-character SHA-256 style cryptographic block hash
    const hex32 = () => Math.random().toString(16).substring(2, 10);
    const fullBlockHash = `0x${hex32()}${hex32()}${hex32()}${hex32()}${hex32()}${hex32()}${hex32()}${hex32()}`;

    const newTx = {
      id: `tx-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
      type: (type || 'p2p_transfer') as any,
      amount: transferAmount,
      sender: 'You (0x7F2A...9D41)',
      recipient: recipient || 'Dragon9 Community Pool (0x3B...11)',
      note: note || 'P2P Harmony Ledger Transfer & Bandwidth Verification',
      txHash: fullBlockHash
    };

    transactions.unshift(newTx);
    userWalletHarmonyNotes = Math.max(0, +(userWalletHarmonyNotes - transferAmount).toFixed(1));

    res.json({
      success: true,
      transaction: newTx,
      walletBalance: userWalletHarmonyNotes,
      privacyGuarantee: "ChaCha20-Poly1305 Local Hardware Encrypted. Zero metadata leaves device. It is your data after all."
    });
  });

  // Get Analytics
  app.get("/api/analytics", (_req, res) => {
    res.json({
      history: MONTHLY_BANDWIDTH_HISTORY,
      currentMonth: MONTHLY_BANDWIDTH_HISTORY[MONTHLY_BANDWIDTH_HISTORY.length - 1],
      totalNodesActive: nodes.length,
      averageLatencyMs: 8.2,
      networkUptime: 99.96
    });
  });

  // Get Walkie Talkie Channels & Messages
  app.get("/api/walkie-talkie", (_req, res) => {
    res.json({
      channels: WALKIE_TALKIE_CHANNELS,
      messages
    });
  });

  // Send Walkie Talkie Message / Audio Transmission
  app.post("/api/walkie-talkie/transmit", (req, res) => {
    const { channelId, text, isAudio, sender } = req.body;
    const newMsg = {
      id: `msg-${Date.now().toString(36)}`,
      channelId: channelId || 'chan-01',
      sender: sender || 'You (Dragon9 Peer)',
      timestamp: 'Just now',
      isAudio: !!isAudio,
      audioDurationSec: isAudio ? Math.floor(Math.random() * 5) + 2 : undefined,
      text: text || (isAudio ? '[Audio Voice Pulse Encrypted]' : ''),
      dragonSignSignature: `0x${Math.random().toString(16).substring(2, 10)}...d9`
    };

    messages.unshift(newMsg);
    res.json({ success: true, message: newMsg });
  });

  // Ecosystem & Add-on Apps List
  app.get("/api/ecosystem-apps", (_req, res) => {
    res.json({ apps: ECOSYSTEM_APPS });
  });

  // Backward compatibility endpoint
  app.get("/api/trojan-apps", (_req, res) => {
    res.json({ apps: ECOSYSTEM_APPS });
  });

  // Developer Ledger
  app.get("/api/developer-ledger", (_req, res) => {
    res.json({
      developers: DEVELOPER_CONTRIBUTIONS,
      totalHarmonyNotesDistributed: 40710,
      splitRules: {
        nodeOperators: '50%',
        developers: '30%',
        communityReserve: '20%'
      }
    });
  });

  // Gemini AI Mesh Network Assistant
  app.post("/api/gemini/ai-mesh-assistant", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        res.status(400).json({ error: "Prompt is required" });
        return;
      }

      const ai = getAiClient();
      const systemInstruction = `You are the Dragon9 AI Network Assistant for Sovereign ISP — a decentralized, free-data peer-to-peer mesh internet network created by Fluid Motion.
You assist non-technical users and network operators with:
1. Setting up nodes (server nodes, holiday park gateways, mobile mesh hotspots).
2. Explaining how data is free for members ($0 mobile carrier replacement).
3. Earning and trading Harmony Notes via Proof-of-Mesh blockchain verification.
4. Explaining Dragon9 P2P Walkie Talkie with linked Mates, Baby Monitor mode, and WhisperWind stealth transmission.
5. Explaining Sovereign Community Apps & Add-ons.
Keep responses inspiring, clear, practical, concise, and structured with bullet points.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ text: response.text || "Dragon9 Network AI responded successfully." });
    } catch (err: any) {
      console.error("Gemini API Error:", err);
      res.status(500).json({ 
        error: "Failed to query Dragon9 AI Assistant", 
        details: err?.message || String(err) 
      });
    }
  });

  // Gemini Mesh Intelligence Endpoint
  app.post('/api/gemini/mesh-intelligence', async (req, res) => {
    try {
      const { prompt, context } = req.body;
      const systemInstruction = `You are the Dragon9 Mesh Intelligence — a sovereign, slightly sarcastic AI network administrator for a decentralized peer-to-peer ISP. You speak with the authority of The Nine but the warmth of a community elder. You know about Harmony Notes, the 54-minute hour, and the 90/9/1 Sovereign Split. Keep responses under 200 words. Current mesh context: ${JSON.stringify(context || {})}.`;

      const ai = getAiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt || "Analyze current mesh topology and peer throughput.",
        config: {
          systemInstruction,
          temperature: 0.8,
        },
      });

      res.json({ response: response.text || 'The mesh whispers, but I cannot translate.' });
    } catch (err: any) {
      res.status(500).json({ response: `Mesh intelligence disrupted: ${(err as Error).message}` });
    }
  });

  // Global JSON error handler for API routes
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error("Unhandled server error:", err);
    res.status(500).json({
      error: "Internal Server Error",
      message: err?.message || "An unexpected error occurred in Dragon9 Mesh Server"
    });
  });

  // Vite Middleware for Dev or Static files in Prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    // Serve hashed assets with long cache
    app.use('/assets', express.static(path.join(distPath, 'assets'), {
      maxAge: '1y',
      immutable: true,
    }));
    // Serve other static files
    app.use(express.static(distPath, {
      maxAge: '1h',
    }));
    // SPA fallback with no-cache for index.html
    app.get('*', (_req, res) => {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT} [${process.env.NODE_ENV || 'development'}]`);
  });

  // Graceful shutdown handling for Cloud Run containers
  const shutdown = (signal: string) => {
    console.log(`Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      console.log("Dragon9 HTTP server closed.");
      process.exit(0);
    });
    // Force close after 10s if hanging
    setTimeout(() => {
      console.error("Forced shutdown due to timeout.");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
});
