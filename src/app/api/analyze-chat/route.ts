import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        const { messages, userContext } = await req.json();

        if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
            throw new Error("Missing API Key");
        }

        if (!messages || messages.length === 0) {
            return new Response(JSON.stringify({ summary: "No messages to analyze." }), { status: 200 });
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
    ${messages.map((m: any) => `${m.role.toUpperCase()}: ${m.content}`).join("\n")}
    `;

        const { text } = await generateText({
            model: google("gemini-2.0-flash"),
            prompt: prompt,
        });

        return new Response(JSON.stringify({ summary: text }), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Analysis Error:", error);
        return new Response(JSON.stringify({ error: "Failed to analyze chat" }), { status: 500 });
    }
}
