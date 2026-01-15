import { config } from "dotenv";
import { Pool } from "pg";

// Load environment variables
config({ path: ".env.local" });

// ============================================
// CREATE SCHEMA SCRIPT
// ============================================

async function createSchema() {
    const pool = new Pool({
        host: process.env.DB_HOST || "157.10.161.215",
        port: Number(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER || "nunu_admin",
        password: process.env.DB_PASSWORD || "nunu_admin_17",
        database: process.env.DB_NAME || "omni_db_dev",
        ssl: false,
    });

    try {
        console.log("🔍 Checking if schema 'nikahin' exists...\n");

        // Check if schema exists
        const checkResult = await pool.query(
            `SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'nikahin'`
        );

        if (checkResult.rows.length > 0) {
            console.log("✅ Schema 'nikahin' already exists!");
        } else {
            console.log("📦 Creating schema 'nikahin'...");
            await pool.query(`CREATE SCHEMA nikahin`);
            console.log("✅ Schema 'nikahin' created successfully!");
        }

        console.log("\n📊 Granting permissions...");
        await pool.query(`GRANT ALL ON SCHEMA nikahin TO ${process.env.DB_USER}`);
        await pool.query(`GRANT ALL ON ALL TABLES IN SCHEMA nikahin TO ${process.env.DB_USER}`);
        await pool.query(`GRANT ALL ON ALL SEQUENCES IN SCHEMA nikahin TO ${process.env.DB_USER}`);
        console.log("✅ Permissions granted!");

    } catch (error) {
        console.error("❌ Error creating schema:", error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

createSchema();
