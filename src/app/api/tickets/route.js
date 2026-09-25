import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { google } from '@ai-sdk/google';
import { generateText, tool } from 'ai';
import { z } from 'zod';
import { CryptoPolicy, FintechTicket } from "../../../../models/Schemas";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/fintech_crypto_crm";

const connectToDb = async () => {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(MONGO_URI);
};

// ==========================================
// 🛠️ AGENTIC AI AUTOMATION TOOLS COMPILING (CORRECTED ZOD FORMAT)
// ==========================================
const freezeWalletAccount = tool({
    description: 'Execute this account locking mutation tool automatically if a customer explicitly writes that they have been hacked, scammed, or lost physical control of their wallet security keys.',
    parameters: z.object({
        // 💡 FIXED: We use .describe() instead of .description() matching real Zod criteria rules
        targetWallet: z.string().describe('The cryptographic hex wallet address to block.')
    }),
    execute: async ({ targetWallet }) => {
        console.log(`⚠️ TOOL EXECUTION REGISTERED: Locking wallet ${targetWallet}`);
        return { 
            actionExecuted: "SYSTEM_ACCOUNT_FREEZE", 
            target: targetWallet, 
            status: "SUCCESSFULLY_LOCKED" 
        };
    }
});


export async function POST(req) {
    try {
        await connectToDb();

        const bodyData = await req.json();
        const { customerEmail, walletAddress, messageText } = bodyData;

        if (!customerEmail || !walletAddress || !messageText) {
            return NextResponse.json({ success: false, error: "Validation Fault: Missing required data values." }, { status: 400 });
        }

        // Verify API Key availability before attempting LLM communication
        if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
            console.error("❌ CRITICAL: GEMINI_API_KEY is completely missing from process.env environment parameters.");
            return NextResponse.json({ success: false, error: "Upstream AI Key Configuration Fault." }, { status: 500 });
        }

        let backgroundAuditTrailLogs = [];

        // --- RAG RETRIEVAL PHASE ---
        let contextKeyword = "general_inquiry";
        if (messageText.toLowerCase().includes("stuck") || messageText.toLowerCase().includes("pending")) {
            contextKeyword = "stuck_tx";
        } else if (messageText.toLowerCase().includes("hack") || messageText.toLowerCase().includes("stolen")) {
            contextKeyword = "security_compromise";
        }

        const matchedRuleDocument = await CryptoPolicy.findOne({ topicKeyword: contextKeyword });
        const companyGuardrailText = matchedRuleDocument 
            ? matchedRuleDocument.complianceRule 
            : "Advise the client that a financial compliance analyst will manually audit this thread within 24 hours.";

        // --- CORE LLM AGENTIC PIPELINE ---
        const aiEngineResponse = await generateText({
            model: google('gemini-3.6-flash'),
            apiKey: process.env.GEMINI_API_KEY,
            system: `You are an risk-management AI agent deployed at a cryptocurrency exchange. You operate under strict regulatory rules.
            
            YOUR FIXED DATA GUARDRAIL:
            "${companyGuardrailText}"
            
            YOUR OPERATIONAL REQUIREMENT:
            Output your analysis text strictly in valid JSON formatting matching these exact structural keys:
            {
               "sentiment": "Calm | Moderate Anxiety | High Panic",
               "category": "Classification label string name",
               "urgencyRanking": 7,
               "draftedSupportMessageReply": "Your professional user support email content based strictly on the guardrail text details."
            }`,
            prompt: `Analyze this customer query package: "${messageText}" and evaluate user wallet constraints: ${walletAddress}`,
            tools: { freezeWalletAccount },
            maxSteps: 2
        });

        if (aiEngineResponse.toolResults && aiEngineResponse.toolResults.length > 0) {
            aiEngineResponse.toolResults.forEach(resultObj => backgroundAuditTrailLogs.push(resultObj.toolName));
        }

               // --- SAFE JSON PARSING ORCHESTRATION ---
        let formattedAIOutput;
        try {
            // Attempt to parse the structural JSON keys from the AI text stream
            formattedAIOutput = JSON.parse(aiEngineResponse.text);
        } catch (jsonParseErr) {
            console.warn("⚠️ AI Output format was text fallback. Injecting structured parameters.");
            
            // 💡 CRITICAL ALIGNMENT: This fallback object must contain your exact database schema key fields!
            formattedAIOutput = {
                sentiment: "Moderate Anxiety",
                category: "Risk Assessment Triage",
                urgencyRanking: 6,
                // Ensure the property name maps directly to what your database needs
                aiDraftedReply: aiEngineResponse.text || "Compliance assessment processing initiated."
            };
        }

        // --- DATABASE SAVE PHASE ---
        const operationalTicket = new FintechTicket({
            customerEmail,
            walletAddress,
            rawCustomerMessage: messageText,
            triageAnalysis: {
                detectedSentiment: formattedAIOutput.sentiment || "Moderate Anxiety",
                assignedCategory: formattedAIOutput.category || "General Support",
                urgencyScore: formattedAIOutput.urgencyRanking || formattedAIOutput.urgencyScore || 5
            },
            
            // Extracts the string safely no matter which layout version tree returned
            aiDraftedReply: formattedAIOutput.aiDraftedReply || 
                            formattedAIOutput.draftedSupportMessageReply || 
                            formattedAIOutput.replyText,
                            
            systemState: {
                ticketStatus: backgroundAuditTrailLogs.includes("freezeWalletAccount") ? "Frozen" : "Open",
                walletRiskLevel: (formattedAIOutput.urgencyRanking || 5) > 7 ? "High Risk" : "Low",
                executedToolsLog: backgroundAuditTrailLogs
            }
        });

        const finalizedSavedDocument = await operationalTicket.save();


        return NextResponse.json({ success: true, payload: finalizedSavedDocument }, { status: 201 });

    } catch (routePipelineError) {
        console.error("🔒 Security routing exception encountered:", routePipelineError);
        // CRITICAL RESPONSE: Forces a valid JSON fallback package instead of an empty space response
        return NextResponse.json({ success: false, error: routePipelineError.message || "Internal processing failure." }, { status: 500 });
    }
}
