import { config } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Load environment variables
config({ path: ".env.local" });

// ============================================
// DATABASE CONNECTION CONFIGURATION
// ============================================

const dbConfig = {
    host: process.env.DB_HOST || "157.10.161.215",
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || "nunu_admin",
    password: process.env.DB_PASSWORD || "nunu_admin_17",
    database: process.env.DB_NAME || "nikahin_db_dev",
    ssl: false,
};

// ============================================
// CONNECTION POOL
// ============================================

const pool = new Pool(dbConfig);

// Test connection on initialization
pool.on("connect", () => {
    // console.log(`✅ Connected to PostgreSQL database: ${dbConfig.database}`);
});

pool.on("error", (err) => {
    console.error("❌ Unexpected database error:", err);
    process.exit(-1);
});

// ============================================
// DRIZZLE INSTANCE
// ============================================

export const db = drizzle(pool, { schema });

// ============================================
// HELPER: Test Connection
// ============================================

export async function testConnection() {
    try {
        const client = await pool.connect();
        const result = await client.query("SELECT NOW()");
        client.release();
        console.log("✅ Database connection test successful:", result.rows[0]);
        return true;
    } catch (error) {
        console.error("❌ Database connection test failed:", error);
        return false;
    }
}

// ============================================
// GRACEFUL SHUTDOWN
// ============================================

process.on("SIGINT", async () => {
    console.log("\n🔄 Closing database connection pool...");
    await pool.end();
    console.log("✅ Database pool closed");
    process.exit(0);
});
