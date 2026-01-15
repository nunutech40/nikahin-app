import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

config({ path: ".env.local" });

export default defineConfig({
    schema: "./src/db/schema.ts",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        host: process.env.DB_HOST || "157.10.161.215",
        port: Number(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER || "nunu_admin",
        password: process.env.DB_PASSWORD || "nunu_admin_17",
        database: process.env.DB_NAME || "nikahin_db_dev",
        ssl: false,
    },
    verbose: true,
    strict: true,
});
