import { retrieveKnowledge } from "./retrievalService.js";
import { generateSQL } from "./sqlGeneratorService.js";
import { validateSQL } from "./sqlValidatorService.js";
import { executeSQL } from "./sqlExecutorService.js";
import { generateFinalResponse } from "./responseService.js";
import { getHistory, addMessage } from "./memoryService.js";
import { findIntent } from "./intentFindService.js";

export async function processQuestion(
  question: string,
  sessionId: string
) {
  const history = await getHistory(sessionId);

  const historyText = history
    .map((item) => `${item.role}: ${item.content}`)
    .join("\n");

  // STEP 1: Detect intent
  const intentResult = await findIntent(question);

  // STEP 2: Greeting → no Pinecone, no SQL, no Supabase
  if (intentResult.intent === "greeting") {
    const response = {
      type: "text" as const,
      text:
        "Hello! 👋 I can help you explore your business data, compare results, analyze trends, and generate visual insights. What would you like to know?",
    };

    await addMessage(
      sessionId,
      "user",
      question
    );

    await addMessage(
      sessionId,
      "assistant",
      JSON.stringify({
        response,
        data: [],
      })
    );

    return {
      question,
      sql: null,
      data: [],
      response,
    };
  }

  // STEP 3: Actual data query
  const retrieved = await retrieveKnowledge(question);

  const knowledge = retrieved
    .map((item) => item.text)
    .filter(Boolean)
    .join("\n\n");

  if (!knowledge) {
    throw new Error(
      "No relevant database knowledge found"
    );
  }

  const sql = await generateSQL(
    question,
    knowledge,
    historyText
  );

  const validation = validateSQL(sql);

  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const data = await executeSQL(sql);

  const response = await generateFinalResponse(
    question,
    data,
    historyText
  );

  await addMessage(
    sessionId,
    "user",
    question
  );

  await addMessage(
    sessionId,
    "assistant",
    JSON.stringify({
      response,
      data,
    })
  );

  return {
    question,
    sql,
    data,
    response,
  };
}