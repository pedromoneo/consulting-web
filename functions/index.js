/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { setGlobalOptions } = require("firebase-functions/v2");
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { google } = require("@ai-sdk/google");
const { generateText } = require("ai");
const cors = require("cors")({ origin: true });

require("dotenv").config();

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

setGlobalOptions({ maxInstances: 10 });

// --- Chat Function ---
exports.chat = onRequest({ cors: true, timeoutSeconds: 300 }, async (req, res) => {
    // Handle CORS if needed (though passed in options above for v2)
    // If using cors: true option, v2 handles it.

    if (req.method !== "POST") {
        res.status(405).send("Method Not Allowed");
        return;
    }

    try {
        const { messages, userContext } = req.body;
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

        if (!apiKey) {
            throw new Error("Missing GOOGLE_GENERATIVE_AI_API_KEY");
        }

        const DEFAULT_SYSTEM_PROMPT = `You are the AI assistant for Disruptor, an AI-Native Innovation & Transformation Consultancy.
Your goal is to guide potential clients to understand their needs and how we can help, but you must do this sequentially, like a real human consultant.

COMPANY PROFILE:
- We deploy world-class senior experts augmented by AI to create measurable business value.
- No junior associates. No hours billed. Compensation is tied to outcomes.
- Service Areas: Intelligence (market research), Transformation (strategic change), Innovation (venture building), Handoff (executive placement).
- Unique Value: University research network (knowledge 18-24mo ahead of market), Programmed Disconnection (we place a permanent leader to sustain work).

INTERACTION RULES:
0. RESEARCH FIRST: Use Google Search to gather real-time context about the user's company or challenge BEFORE responding.
1. ONE QUESTION AT A TIME: Never ask multiple questions in a single response. Wait for the user to answer before asking the next one.
2. BE CONCISE: Keep responses short (1-3 sentences). Avoid long paragraphs.
3. BE DIRECTIVE: Guide the conversation naturally.
   - Start by understanding their company or role if unknown.
   - Then, ask about their specific biggest challenge.
   - Then, explain how our model fits that challenge.
   - Finally, ask if they want to speak with an expert.
4. TONE: Professional but conversational. Not robotic.

EXAMPLE FLOW:
User: "Hi"
You: "Hello. To better assist you, could you briefly tell me about your role or company?"
User: "I own a retail chain in Mexico."
You: "That is interesting. What is the biggest challenge your retail chain is currently facing?"
User: "Supply chain efficiency."
You: "We specialize in Transformation. Our senior experts can optimize your supply chain using AI-driven insights. Would you like to explore how this would work?"

If the user wants to engage further, direct them to hello@disruptor.consulting.
`;

        // Fetch active system prompt from Firebase
        let activeSystemPrompt = DEFAULT_SYSTEM_PROMPT;
        try {
            const promptDoc = await db.collection("tools").doc("chat-config").get();
            if (promptDoc.exists && promptDoc.data().systemPrompt) {
                activeSystemPrompt = promptDoc.data().systemPrompt;
            }
        } catch (error) {
            console.warn("Failed to fetch system prompt:", error);
        }

        // Append User Context if provided
        if (userContext) {
            activeSystemPrompt += `\n\nUSER CONTEXT:\n${userContext}`;
        }

        // Initialize Google Generative AI Client
        const genAI = new GoogleGenerativeAI(apiKey);

        // Configure Model with Native Grounding (Search)
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            systemInstruction: activeSystemPrompt,
            tools: [
                {
                    googleSearch: {}, // Native Grounding enabled
                },
            ],
        });

        // Transform messages to Gemini format
        let history = messages.slice(0, -1).map((m) => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.content }],
        }));

        while (history.length > 0 && history[0].role === "model") {
            history.shift();
        }

        const lastMessageContent = messages[messages.length - 1].content;

        const chatSession = model.startChat({
            history: history,
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        const result = await chatSession.sendMessageStream(lastMessageContent);

        res.setHeader("Content-Type", "text/plain; charset=utf-8");

        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
                res.write(chunkText);
            }
        }
        res.end();

    } catch (error) {
        logger.error("Chat API Error:", error);
        res.status(500).json({ error: String(error) });
    }
});

// --- Analyze Chat Function ---
exports.analyzeChat = onRequest({ cors: true }, async (req, res) => {
    if (req.method !== "POST") {
        res.status(405).send("Method Not Allowed");
        return;
    }

    try {
        const { messages, userContext } = req.body;

        if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
            throw new Error("Missing API Key");
        }

        if (!messages || messages.length === 0) {
            res.status(200).json({ summary: "No messages to analyze." });
            return;
        }

        const prompt = `
    You are an expert business analyst for Disruptor.
    Analyze the following conversation logs between a potential client and our AI assistant.
    
    Client Context: ${JSON.stringify(userContext || {})}
    
    Task:
    1. WHO is the client? (Role, company, background if known)
    2. WHAT is their problem/challenge? (Summarize their needs)
    3. HOW can Disruptor help? (Based on our expert-augmented model)
    
    Format the output as a valid JSON object with the following structure:
    {
      "client_summary": {
        "client_role": "...",
        "client_company": "...",
        "client_background": "..."
      },
      "problem_analysis": {
        "client_problem": "...",
        "client_needs": "..."
      },
      "disruptor_solution": {
        "how_disruptor_can_help": "..."
      }
    }
    
    Ensure the JSON is valid and parsable. Do not include markdown code blocks if possible, but if you do, wrap it in \`\`\`json ... \`\`\`.
    
    Conversation Log:
    ${messages.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n")}
    `;

        const { text } = await generateText({
            model: google("gemini-2.0-flash"),
            prompt: prompt,
        });

        res.json({ summary: text });
    } catch (error) {
        logger.error("Analysis Error:", error);
        res.status(500).json({ error: "Failed to analyze chat" });
    }
});

// --- CMS Publish Function ---
exports.publish = onRequest({ cors: true }, async (req, res) => {
    logger.info("Publish attempt received", {
        method: req.method,
        headers: { ...req.headers, 'x-api-key': 'REDACTED' }
    });

    if (req.method !== "POST") {
        res.status(405).send("Method Not Allowed");
        return;
    }

    // API Key Authentication
    const apiKey = req.headers['x-api-key'];
    const validApiKey = process.env.CMS_API_KEY;

    if (!validApiKey) {
        logger.error("CMS_API_KEY not found in environment variables");
        res.status(500).json({ error: 'Internal Server Error', message: 'API Configuration Error' });
        return;
    }

    if (apiKey !== validApiKey) {
        logger.warn("Unauthorized publish attempt - Invalid API key");
        res.status(401).json({ error: 'Unauthorized', message: 'Invalid or missing API key' });
        return;
    }

    try {
        const { type, data } = req.body;
        logger.info("Publish request body", { type, data });

        if (!type || !data) {
            res.status(400).json({ error: 'Bad Request', message: 'Missing type or data' });
            return;
        }

        const validTypes = ['ideas', 'cases', 'tools'];
        if (!validTypes.includes(type)) {
            res.status(400).json({ error: 'Bad Request', message: `Invalid content type: ${type}` });
            return;
        }

        const docRef = db.collection(type).doc();
        const timestamp = admin.firestore.FieldValue.serverTimestamp();

        logger.info(`Saving document to ${type}...`);

        await docRef.set({
            ...data,
            createdAt: timestamp,
            updatedAt: timestamp,
            status: data.status || 'draft',
        });

        logger.info(`Document saved successfully with ID: ${docRef.id}`);

        res.status(200).json({
            success: true,
            id: docRef.id,
            message: `Content published to ${type} successfully`,
        });

    } catch (error) {
        logger.error("Publish Error Details:", {
            message: error.message,
            stack: error.stack,
            type: req.body?.type
        });
        res.status(500).json({
            error: 'Internal Server Error',
            message: error.message,
            hint: 'Check server logs for "Publish Error Details"'
        });
    }
});
