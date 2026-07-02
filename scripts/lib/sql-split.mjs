/**
 * Split SQL into statements, respecting dollar-quoted blocks ($$ ... $$).
 */
export function stripSqlLineComments(sql) {
  return sql
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n");
}

export function splitSqlStatements(sql) {
  const input = stripSqlLineComments(sql);
  const statements = [];
  let current = "";
  let i = 0;
  let inSingleQuote = false;
  /** When set, we're inside $tag$ ... $tag$ */
  let dollarTag = null;

  while (i < input.length) {
    if (!inSingleQuote && input[i] === "$") {
      const rest = input.slice(i);
      const open = rest.match(/^\$([A-Za-z0-9_]*)\$/);
      if (open) {
        const tag = open[1];
        const delimiter = `$${tag}$`;
        if (dollarTag === null) {
          dollarTag = tag;
          current += delimiter;
          i += delimiter.length;
          continue;
        }
        if (dollarTag === tag) {
          dollarTag = null;
          current += delimiter;
          i += delimiter.length;
          continue;
        }
      }
    }

    const ch = input[i];

    if (dollarTag === null && ch === "'" && input[i - 1] !== "\\") {
      inSingleQuote = !inSingleQuote;
      current += ch;
      i += 1;
      continue;
    }

    if (dollarTag === null && !inSingleQuote && ch === ";") {
      const trimmed = current.trim();
      if (trimmed.length > 0) {
        statements.push(trimmed);
      }
      current = "";
      i += 1;
      continue;
    }

    current += ch;
    i += 1;
  }

  const tail = current.trim();
  if (tail.length > 0) {
    statements.push(tail);
  }

  return statements;
}

/**
 * Returns true when the file should be sent as one query (pg supports multi-statement strings).
 */
export function preferSingleQuery(sql) {
  return splitSqlStatements(sql).length > 1 && sql.includes("$$");
}
