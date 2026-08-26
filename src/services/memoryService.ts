import { ChatMessage } from "../models/chatMessage";

export async function getHistory(sessionId: string) {
  const messages = await ChatMessage.find({
    sessionId,
  })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  return messages.reverse();
}

export async function addMessage(
  sessionId: string,
  role: "user" | "assistant",
  content: string
) {
  await ChatMessage.create({
    sessionId,
    role,
    content,
  });
}