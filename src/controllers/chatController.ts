import type { Request, Response } from "express";

import { processQuestion } from "../services/queryService.js";
import { getHistory } from "../services/memoryService.js";

export async function askQuestion(
  req: Request,
  res: Response
) {
  try {
    const question = req.query.question?.toString().trim();
    const sessionId =
      req.query.sessionId?.toString().trim();

    if (!question) {
      return res.status(400).json({
        success: false,
        error: "question is required",
      });
    }

    const result = await processQuestion(
      question,
      sessionId ?? ""
    );

    return res.json({
      success: true,
      sessionId,
      answer: result.response.text,
      ...result,
    });
  } catch (error) {
    console.error("Ask question error:", error);

    return res.status(500).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to process question",
    });
  }
}

export async function getChatHistory(
  req: Request,
  res: Response
) {
  try {
    const sessionId = req.params.sessionId as string;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: "sessionId is required",
      });
    }

    const history = await getHistory(sessionId);

    return res.json({
      success: true,
      sessionId,
      history,
    });
  } catch (error) {
    console.error("History error:", error);

    return res.status(500).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to load history",
    });
  }
}