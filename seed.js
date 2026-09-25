import mongoose from 'mongoose';
import { CryptoPolicy } from './models/Schemas.js'; // Imports your schema file path cleanly

// 1. Hardcode your local MongoDB collection connection string URI
const MONGO_URI = "mongodb+srv://rautgauri812_db_user:ouOg1KUkQH2uwvkW@cluster0.yik9fq8.mongodb.net/?appName=Cluster0";

async function seedComplianceDatabase() {
    try {
        console.log("📡 Opening standalone direct handshake to MongoDB database node...");
        await mongoose.connect(MONGO_URI);
        console.log("✅ Successful cluster authentication achieved.");

        // 2. Clear out any old dummy data entries to ensure a clean test state
        await CryptoPolicy.deleteMany({});
        console.log("🧹 Previous policy documents dropped safely.");

        // 3. Insert real, professional fintech compliance data guidelines
        const rulesPayload = [
            {
                topicKeyword: "stuck_tx",
                complianceRule: "DEX-NET-CONGESTION-RULE: High network congestion on blockchain networks like Ethereum or Polygon can cause temporary block confirmation latencies. Transactions pending under 6 hours are held secure inside the validator mempool. Do not re-submit or accelerate nonces manually.",
                regulatoryReference: "FINTECH-REG-SEC-102"
            },
            {
                topicKeyword: "security_compromise",
                complianceRule: "FRAUD-ISOLATION-PROTOCOL: Immediate system level protective lockdown initiated. When account compromise, stolen private keys, or hacking incidents are flagged, outgoing transactional node pipelines must be frozen instantly to protect client liquidity assets.",
                regulatoryReference: "CYBER-FRAUD-MITIGATION-ACT"
            }
        ];

        await CryptoPolicy.insertMany(rulesPayload);
        console.log("\n🚀 Success: Database successfully seeded with active corporate rules!");

    } catch (error) {
        console.error("❌ Seeding Operation Abortion Exception:", error.message);
    } finally {
        // 4. Always close your standalone script connection cleanly
        await mongoose.disconnect();
        console.log("🔌 Safe database socket separation completed.");
    }
}

// Execute the automation script
seedComplianceDatabase();
