import { createEmbedding } from "./embeddingService.js";
import { pineconeIndex } from "../config/pinecone.js";

import { schemaKnowledge } from "../knowledge/schemaKnowledge.js";
import { relationshipKnowledge } from "../knowledge/relationshipKnowledge.js";
import { businessRules } from "../knowledge/businessRules.js";

export async function uploadKnowledge() {
  const knowledgeItems = [
    {
      id: "schema-knowledge",
      text: schemaKnowledge,
      type: "schema",
    },
    {
      id: "relationship-knowledge",
      text: relationshipKnowledge,
      type: "relationships",
    },
    {
      id: "business-rules",
      text: businessRules,
      type: "business-rules",
    },
  ];

  const records = [];

  for (const item of knowledgeItems) {
    const embedding = await createEmbedding(item.text);

    records.push({
      id: item.id,
      values: embedding,
      metadata: {
        text: item.text,
        type: item.type,
      },
    });
  }

  await pineconeIndex.upsert({
    records,
  });

  return {
    success: true,
    message: "Knowledge uploaded successfully",
    records: knowledgeItems.length,
  };
}