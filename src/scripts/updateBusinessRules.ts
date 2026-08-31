import "dotenv/config";

import { updateBusinessRulesEmbedding } from "../services/embeddingService.js";

async function main() {
  await updateBusinessRulesEmbedding();
  console.log("Business rules update completed.");
}

main().catch((error) => {
  console.error("Failed to update business rules:", error);
  process.exit(1);
});