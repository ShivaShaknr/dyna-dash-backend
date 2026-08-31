import { openai } from "../config/openai.js";
import { pineconeIndex } from "../config/pinecone.js";
import { businessRules } from "../knowledge/businessRules.js";

export async function createEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  return response.data[0].embedding;
}

export async function updateBusinessRulesEmbedding() {
  const embedding = await createEmbedding(businessRules);

  await pineconeIndex.upsert({
    records: [
      {
        id: "business-rules",
        values: embedding,
        metadata: {
          text: businessRules,
          type: "business-rules",
        },
      },
    ],
  });

  console.log("Business rules updated successfully in Pinecone");
}