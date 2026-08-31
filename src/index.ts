import "dotenv/config";

import express from "express";
import cors from "cors";

import { connectMongoDB } from "./config/mongodb.js";
import chatRoutes from "./routes/chatRoutes.js";
import { uploadKnowledge } from "./services/knowledgeService.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
  })
);

app.use(express.json({
  limit: "1mb",
}));

app.get("/", (_req, res) => {
  return res.json({
    message: "AI Dashboard Chatbot API is running",
  });
});

app.get("/health", (_req, res) => {
  return res.json({
    success: true,
    status: "ok",
    services: {
      supabase: !!process.env.SUPABASE_URL,
      postgres: !!process.env.DATABASE_URL,
      pinecone: !!process.env.PINECONE_API_KEY,
      openai: !!process.env.OPENAI_API_KEY,
      mongodb: !!process.env.MONGODB_URI,
    },
  });
});

// Keeps existing frontend endpoints:
// /ask
// /history/:sessionId
app.use("/", chatRoutes);

app.get("/upload-knowledge", async (_req, res) => {
    try {
      const result = await uploadKnowledge();
  
      return res.json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : String(error),
      });
    }
  });

const PORT = Number(process.env.PORT) || 5000;

async function startServer() {
  try {
    await connectMongoDB();

    app.listen(PORT, () => {
      console.log(
        `Server running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Server startup failed:",
      error
    );

    process.exit(1);
  }
}

startServer();