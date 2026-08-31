import { createEmbedding } from "./embeddingService.js";
import { pineconeIndex } from "../config/pinecone.js";

export async function retrieveKnowledge(question: string) {
  const embedding = await createEmbedding(question);

  const result = await pineconeIndex.query({
    vector: embedding,
    topK: 5,
    includeMetadata: true,
  });

  return result.matches
    .filter((match) => match.metadata?.text)
    .map((match) => ({
      id: match.id,
      score: match.score,
      type: match.metadata?.type,
      text: String(match.metadata?.text),
    }));
}