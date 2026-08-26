import { db } from "../config/database.js";
import { validateSQL } from "./sqlValidatorService.js";

export async function executeSQL(sql: string) {
  const validation = validateSQL(sql);

  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const result = await db.query(sql);

  return result.rows;
}