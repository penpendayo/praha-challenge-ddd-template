import postgres from "postgres";
import type { Sql } from "postgres";
import { afterAll, beforeAll, inject } from "vitest";

let sql: Sql;

beforeAll(async () => {
  const options = inject("connection");
  sql = postgres(options);
});

afterAll(async () => {
  // 全テーブルを TRUNCATE する
  const tables = await sql`
    SELECT table_name 
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      AND table_name NOT LIKE 'pg_%'
      AND table_name NOT LIKE 'sql_%'
  `;

  console.log("✅️", tables);
  for (const { table_name } of tables) {
    await sql.unsafe(`TRUNCATE TABLE "${table_name}" CASCADE`);
  }
});
