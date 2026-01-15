import { config } from "dotenv";
import { Pool } from "pg";

// Load environment variables
config({ path: ".env.local" });

// ============================================
// LIST DATABASES SCRIPT
// ============================================

async function listDatabases() {
    const pool = new Pool({
        host: process.env.DB_HOST || "157.10.161.215",
        port: Number(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER || "nunu_admin",
        password: process.env.DB_PASSWORD || "nunu_admin_17",
        database: "postgres",
        ssl: false,
    });

    try {
        console.log("🔍 Listing available databases...\n");

        const result = await pool.query(
            `SELECT datname FROM pg_database WHERE datistemplate = false ORDER BY datname`
        );

        console.log("Available databases:");
        result.rows.forEach((row, index) => {
            console.log(`  ${index + 1}. ${row.datname}`);
        });

        console.log("\n✅ Query completed successfully!");
    } catch (error) {
        console.error("❌ Error listing databases:", error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

listDatabases();
