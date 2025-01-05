import {
  PostgreSqlContainer,
  type StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import type { Options } from "postgres";
import postgres from "postgres";
import type { GlobalSetupContext } from "vitest/node";
import * as schema from "./src/libs/drizzle/schema";

declare module "vitest" {
  export interface ProvidedContext {
    connection: Options<{}>;
  }
}

let container: StartedPostgreSqlContainer;

export const setup = async ({ provide }: GlobalSetupContext): Promise<void> => {
  container = await new PostgreSqlContainer().start();

  const options: Options<{}> = {
    host: container.getHost(),
    port: container.getPort(),
    database: container.getDatabase(),
    user: container.getUsername(),
    password: container.getPassword(),
  };

  provide("connection", options);
  const client = await postgres(options);

  const database = drizzle(client, { schema });

  try {
    await migrate(database, {
      migrationsFolder: "./src/libs/drizzle/migrations",
    });
  } finally {
    await client.end();
  }
};

export const teardown = async (): Promise<void> => {
  await container.stop();
};
