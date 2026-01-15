import { config } from "dotenv";
import { Pool } from "pg";

// Load environment variables
config({ path: ".env.local" });


// ============================================
// CREATE DATABASE SCRIPT
// ============================================

async function createDatabase() {
    const isDevelopment = process.env.NODE_ENV === "development";
    const dbName = isDevelopment ? "undangan_dev" : "undangan_db";

    // Connect to postgres database first
    const pool = new Pool({
        host: process.env.DB_HOST || "157.10.161.215",
        port: Number(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER || "nunu_admin",
        password: process.env.DB_PASSWORD || "nunu_admin_17",
        database: "postgres", // Connect to default postgres database
        ssl: false,
    });

    try {
        console.log(`🔍 Checking if database "${dbName}" exists...`);

        // Check if database exists
        const checkResult = await pool.query(
            `SELECT 1 FROM pg_database WHERE datname = $1`,
            [dbName]
        );

        if (checkResult.rows.length > 0) {
            console.log(`✅ Database "${dbName}" already exists!`);
        } else {
            console.log(`📦 Creating database "${dbName}"...`);
            await pool.query(`CREATE DATABASE ${dbName}`);
            console.log(`✅ Database "${dbName}" created successfully!`);
        }
    } catch (error) {
        console.error("❌ Error creating database:", error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

createDatabase();
