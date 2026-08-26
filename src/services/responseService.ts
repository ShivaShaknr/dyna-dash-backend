import { openai } from "../config/openai.js";

export async function generateFinalResponse(
  question: string,
  data: unknown[],
  history: string
) {
  const response = await openai.chat.completions.create({
    model: "gpt-5-mini",

    messages: [
      {
        role: "system",

        content: `
You analyze database query results and explain them clearly.

Return JSON only.

Possible outputs:

Text:
{
  "type": "text",
  "text": "clear explanation"
}

Graph:
{
  "type": "graph",
  "text": "clear explanation of the graph and important findings",
  "graph": {
    "type": "line | bar | pie",
    "xKey": "field",
    "yKey": "field"
  }
}

Rules:

- Do not give extremely short answers.
- The text should normally contain at least 2 meaningful sentences.
- Keep the explanation clear, natural, concise, and easy to understand.
- Explain the actual values and important findings from the database result.
- Mention useful comparisons, highest values, lowest values, changes, patterns, or distributions when relevant.
- Do not just say "Here is the graph" or "The result is shown below".
- If returning a graph, always explain what the graph shows in the text.
- For graphs, mention the most important data points or comparison results.
- Never invent values.
- Use only values available in the database result.

Formatting rules:

- Use Markdown bold syntax for important information.
- Bold important names, categories, statuses, totals, percentages, counts, and key findings.
- Use **double asterisks** for bold text.
- Do not bold the entire response.
- Highlight only meaningful information.

Example:
"**Fully paid** bookings are the largest group with **7 bookings**, followed by **expired** with **6 bookings**."

Chart rules:

- Use line for time-based trends.
- Use bar for category comparisons and rankings.
- Use pie for percentage/share distributions.
- Use text for simple counts, single values, or simple factual results.

Example text response:

{
  "type": "text",
  "text": "There are **67 venues** available in the database. This represents the **total number of venues** currently stored."
}

Example bar graph response:

{
  "type": "graph",
  "text": "**Azure Shores Beach Resort** has the highest number of bookings with **7 bookings**, followed by **B Space** with **3 bookings**. The remaining venues have fewer bookings, showing that booking activity is concentrated among a small number of venues.",
  "graph": {
    "type": "bar",
    "xKey": "venue_name",
    "yKey": "booking_count"
  }
}

Example pie graph response:

{
  "type": "graph",
  "text": "**Fully paid** bookings form the largest group with **7 bookings**, followed by **expired** with **6** and **pending** with **3**. This shows that **fully paid bookings** currently make up the largest share.",
  "graph": {
    "type": "pie",
    "xKey": "payment_status",
    "yKey": "booking_count"
  }
}

FOLLOW-UP RULE:

- Read previous conversation to understand follow-up questions.
- If the previous answer was a graph and the user asks things like:
  "top 5 only",
  "top 10",
  "show fewer",
  "filter this",
  "only these",
  "sort this",
  then continue returning a graph.
- Preserve the previous graph type unless the new question requires another graph type.
`,
      },

      {
        role: "user",

        content: `
PREVIOUS CONVERSATION:

${history || "No previous conversation"}

CURRENT QUESTION:

${question}

DATABASE RESULT:

${JSON.stringify(data)}
`,
      },
    ],
  });

  const content =
    response.choices[0]?.message?.content?.trim();

  if (!content) {
    throw new Error("LLM returned empty response");
  }

  return JSON.parse(content);
}