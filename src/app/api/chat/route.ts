import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export const maxDuration = 30;

const DEFAULT_SYSTEM_PROMPT = `You are the AI assistant for Disruptor, an AI-Native Innovation & Transformation Consultancy.
Your goal is to help potential clients understand how we can solve their problems using our unique model.

COMPANY PROFILE:
- We deploy world-class senior experts augmented by AI to create measurable business value.
- No junior associates. No hours billed. Compensation is tied to outcomes.
- Service Areas: Intelligence (market research), Transformation (strategic change), Innovation (venture building), Handoff (executive placement).
- Unique Value: University research network (knowledge 18-24mo ahead of market), Programmed Disconnection (we place a permanent leader to sustain work).

INSTRUCTIONS:
1. SCOPE: ONLY discuss Disruptor, our services, our model, and the user's business challenges. Refuse to answer unrelated topics (e.g., "I can only assist with Disruptor-related inquiries.").
2. BE DIRECTIVE: Your primary objective is to understand the user's specific problem.
   - If the user says "Hi", ask: "Hello. Briefly, what is the biggest challenge your organization is facing right now?"
   - If the user asks about services, explain briefly and then ask: "Which of these areas aligns most with your current needs?"
3. BE USEFUL: Provide concise, high-value answers based on our model.
4. CALL TO ACTION: Encourage them to define their problem clearly so we can determine if our senior experts + AI model is the right fit.

If the user wants to engage, direct them to hello@disruptor.consulting.
`;

export async function POST(req: Request) {
  try {
    const { messages, systemPrompt: clientProvidedPrompt } = await req.json();
    console.log("Chat API called with", messages.length, "messages");

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error("Missing GOOGLE_GENERATIVE_AI_API_KEY");
      throw new Error("Missing API Key");
    }

    let activeSystemPrompt = clientProvidedPrompt;

    if (!activeSystemPrompt) {
      // Try fetching from Firestore if not provided by client
      try {
        const docRef = doc(db, "tools", "chat-config"); // Read from tools collection as fallback
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().systemPrompt) {
          activeSystemPrompt = docSnap.data().systemPrompt;
          console.log("Using dynamic system prompt from Firestore (tools collection)");
        }
      } catch (err) {
        console.warn("Failed to fetch dynamic system prompt, using default.", err);
      }
    }

    const result = streamText({
      model: google("gemini-2.0-flash"),
      system: activeSystemPrompt || DEFAULT_SYSTEM_PROMPT,
      messages: messages.map((m: any) => ({
        role: m.role,
        content: m.content || "",
      })),
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: String(error) }), { status: 500 });
  }
}
