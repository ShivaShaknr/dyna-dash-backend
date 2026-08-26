import { createEmbedding } from "./embeddingService.js";
import { pineconeIndex } from "../config/pinecone.js";

export async function retrieveKnowledge(question: string) {
  const embedding = await createEmbedding(question);

  const result = await pineconeIndex.query({
    vector: embedding,
    topK: 3,
    includeMetadata: true,
  });

  return result.matches.map((match) => ({
    id: match.id,
    score: match.score,
    text: match.metadata?.text,
  }));
}