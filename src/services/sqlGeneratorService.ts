import { openai } from "../config/openai.js";

export async function generateSQL(
  question: string,
  knowledge: string,
  history: string
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-5-mini",
    messages: [
      {
        role: "system",
        content: `
You generate PostgreSQL queries for Supabase.

Rules:
- Generate SELECT queries only.
- Never generate INSERT, UPDATE, DELETE, DROP, ALTER or TRUNCATE.
- Use only tables and columns present in the provided knowledge.
- Do not invent tables or columns.
- Use PostgreSQL syntax.
- Use previous conversation only to understand follow-up questions.
- For ranking or comparison queries, sort by the comparison metric descending.
- Limit results to 10 unless the user explicitly asks for more.
- Return only SQL.
- Do not use markdown code blocks.
`,
      },
      {
        role: "user",
        content: `
PREVIOUS CONVERSATION:

${history || "No previous conversation"}

DATABASE KNOWLEDGE:

${knowledge}

CURRENT USER QUESTION:

${question}
`,
      },
    ],
  });

  const sql =
    response.choices[0]?.message?.content?.trim() || "";

  if (!sql) {
    throw new Error("LLM did not generate SQL");
  }

  return sql;
}