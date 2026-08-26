const BLOCKED_KEYWORDS = [
    "insert",
    "update",
    "delete",
    "drop",
    "alter",
    "truncate",
    "create",
    "grant",
    "revoke",
    "comment",
    "copy",
  ];
  
  export function validateSQL(sql: string) {
    const normalized = sql.trim().toLowerCase();
  
    if (!normalized.startsWith("select") && !normalized.startsWith("with")) {
      return {
        valid: false,
        error: "Only SELECT queries are allowed",
      };
    }
  
    for (const keyword of BLOCKED_KEYWORDS) {
      const regex = new RegExp(`\\b${keyword}\\b`, "i");
  
      if (regex.test(sql)) {
        return {
          valid: false,
          error: `Blocked SQL keyword detected: ${keyword}`,
        };
      }
    }
  
    if (sql.includes(";") && sql.trim().slice(0, -1).includes(";")) {
      return {
        valid: false,
        error: "Multiple SQL statements are not allowed",
      };
    }
  
    return {
      valid: true,
    };
  }