import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export const maxDuration = 30;

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

export async function POST(req: Request) {
  try {
    const { messages, userContext } = await req.json();

    // Check environment variable for API Key
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      throw new Error("Missing GOOGLE_GENERATIVE_AI_API_KEY");
    }

    // Fetch active system prompt from Firebase
    let activeSystemPrompt = DEFAULT_SYSTEM_PROMPT;
    try {
      const promptDoc = await getDoc(doc(db, "tools", "chat-config"));
      if (promptDoc.exists() && promptDoc.data().systemPrompt) {
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
    // Using gemini-2.0-flash as requested
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: activeSystemPrompt,
      tools: [
        {
          // @ts-ignore
          googleSearch: {}, // Native Grounding enabled
        },
      ],
    });

    // Transform messages to Gemini format
    // Exclude the last message which is the current prompt
    const history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    const lastMessageContent = messages[messages.length - 1].content;

    // Start Chat Session
    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    // Send Message and Stream Response
    const result = await chat.sendMessageStream(lastMessageContent);

    // Create ReadableStream for the response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
              controller.enqueue(encoder.encode(chunkText));
            }
          }
        } catch (error) {
          console.error("Stream error:", error);
          controller.error(error);
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });

  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: String(error) }), { status: 500 });
  }
}
