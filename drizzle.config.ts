import type { Config } from "drizzle-kit";

import { env } from "~/env";

export default {
  driver: "turso",
  schema: "./src/server/db/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: env.TURSO_CONNECTION_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  },
  tablesFilter: ["rethinking-economics-isb_*"],
} satisfies Config;
