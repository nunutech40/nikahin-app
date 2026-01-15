import { config } from "dotenv";
import { testConnection } from "./index";

// Load environment variables
config({ path: ".env.local" });

async function runTest() {
    console.log("🚀 Testing database connection...");
    const success = await testConnection();
    if (success) {
        console.log("✅ Connection verified!");
        process.exit(0);
    } else {
        console.log("❌ Connection failed!");
        process.exit(1);
    }
}

runTest();
