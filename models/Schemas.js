import mongoose from 'mongoose';

// =====================================================================
// 💡 COLLECTION 1: The Banking & Compliance Reference Guide (For RAG)
// =====================================================================
const CryptoPolicySchema = new mongoose.Schema({
    topicKeyword: { 
        type: String, 
        required: true, 
        unique: true, 
        index: true // ⚡ Creates a fast-lookup database index for our RAG keyword scanner
    }, 
    complianceRule: { 
        type: String, 
        required: true 
    },
    regulatoryReference: { 
        type: String, 
        default: "GEN-COMPLIANCE-ACT-2026" 
    }
}, { timestamps: true }); // Automatically logs createdAt and updatedAt timestamps for corporate tracing


// =====================================================================
// 💡 COLLECTION 2: The Core Operational CRM Tickets System
// =====================================================================
const FintechTicketSchema = new mongoose.Schema({
    customerEmail: { 
        type: String, 
        required: [true, "Operational requirement: Client email must be populated."],
        lowercase: true,
        trim: true 
    },
    walletAddress: { 
        type: String, 
        required: [true, "Validation requirement: Cryptographic hex target address required."],
        trim: true 
    },
    rawCustomerMessage: { 
        type: String, 
        required: true 
    },
    
    // AI Triage & Structural Analysis Output Node
    triageAnalysis: {
        detectedSentiment: { type: String, default: "Calm / Inquiring" },
        assignedCategory: { type: String, default: "General Account Support" },
        urgencyScore: { type: Number, min: 1, max: 10, default: 1 }
    },
    
    // The final custom context-aware text response drafted by our RAG model
    aiDraftedReply: { 
        type: String, 
        required: true 
    },
    
    // Agentic State Tracker & Automated Audit Log Trail (Proves real-world full-stack logic)
    systemState: {
        ticketStatus: { 
            type: String, 
            enum: ['Open', 'Under Review', 'Resolved', 'Frozen'], 
            default: 'Open' 
        },
        walletRiskLevel: { 
            type: String, 
            enum: ['Low', 'Medium', 'High Risk'], 
            default: 'Low' 
        },
        executedToolsLog: { 
            type: [String], // Array of strings tracking background system tool actions executed by the AI
            default: [] 
        }
    }
}, { timestamps: true });


FintechTicketSchema.pre('save', function () {
    // If the AI flagged the urgency as extremely critical, escalate the risk level automatically
    if (this.triageAnalysis.urgencyScore >= 8) {
        this.systemState.walletRiskLevel = 'High Risk';
    } else if (this.triageAnalysis.urgencyScore >= 5) {
        this.systemState.walletRiskLevel = 'Medium';
    }
    
    // No need to invoke next() here anymore! Mongoose handles the handoff automatically.
});


// Next.js Hot Reload Prevention Logic: 
// In Next.js, server components reload frequently during dev mode. 
// This line stops Mongoose from throwing a crash error when it tries to compile an already existing model file.
const CryptoPolicy = mongoose.models.CryptoPolicy || mongoose.model('CryptoPolicy', CryptoPolicySchema);
const FintechTicket = mongoose.models.FintechTicket || mongoose.model('FintechTicket', FintechTicketSchema);

export { CryptoPolicy, FintechTicket };
