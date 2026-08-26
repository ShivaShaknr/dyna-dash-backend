import { Router } from "express";

import {
  askQuestion,
  getChatHistory,
} from "../controllers/chatController.js";

const router = Router();

router.get("/ask", askQuestion);

router.get(
  "/history/:sessionId",
  getChatHistory
);

export default router;