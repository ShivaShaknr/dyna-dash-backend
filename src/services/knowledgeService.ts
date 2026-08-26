import { createEmbedding } from "./embeddingService.js";
import { pineconeIndex } from "../config/pinecone.js";
import { databaseKnowledge } from "../knowledge/databaseKnowledge.js";

export async function uploadKnowledge() {
  const embedding = await createEmbedding(databaseKnowledge);

  await pineconeIndex.upsert({
    records: [
      {
        id: "database-knowledge-1",
        values: embedding,
        metadata: {
          text: databaseKnowledge,
          type: "database-schema",
        },
      },
    ],
  });

  return {
    success: true,
    message: "Knowledge uploaded to Pinecone",
  };
}