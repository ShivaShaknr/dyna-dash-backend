import { openai } from "../config/openai.js";

export type IntentResult = {
  intent: "greeting" | "data_query";
};

export async function findIntent(
  question: string
): Promise<IntentResult> {
  const response = await openai.chat.completions.create({
    model: "gpt-5-mini",
    messages: [
      {
        role: "system",
        content: `
Classify the user's intent.

Return JSON only.

Possible intents:

{
  "intent": "greeting"
}

or

{
  "intent": "data_query"
}

Rules:
- greeting: hello, hi, hey, good morning, good evening, how are you, thanks, thank you, etc.
- data_query: anything asking about business/database data, comparison, count, trend, booking, venue, payment, users, reports, analytics, or follow-up questions about previous data.
`,
      },
      {
        role: "user",
        content: question,
      },
    ],
  });

  const content =
    response.choices[0]?.message?.content?.trim();

  if (!content) {
    return {
      intent: "data_query",
    };
  }

  try {
    return JSON.parse(content);
  } catch {
    return {
      intent: "data_query",
    };
  }
}