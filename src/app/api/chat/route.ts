import { google } from "@ai-sdk/google";
import { streamText, tool, stepCountIs } from "ai";
import { Resend } from "resend";
import { z } from "zod";

export const maxDuration = 30;

const resend = new Resend(process.env.RESEND_API_KEY);

const SYSTEM_PROMPT = `You are the AI assistant for Disruptor, an AI-Native Innovation & Transformation Consultancy. You help potential clients and talent understand our services and how we can help them.

Key facts about Disruptor:
- We deploy world-class senior experts augmented by AI to create measurable business value.
- No junior associates. No hours billed. Compensation is tied to outcomes.
- Four service areas: Intelligence (market research & analysis), Transformation (strategic change), Innovation (venture building & labs), and Handoff (executive placement & succession).
- We have a university research network (RGI/Crummer, MIT, Georgia Tech) that gives us knowledge 18-24 months before it becomes mainstream.
- Every engagement includes programmed disconnection — we place a permanent leader to carry the work forward.
- We serve two audiences: clients/prospects (CEOs, PE firms, boards) and talent (senior advisors, university fellows).
- Contact: hello@disruptor.consulting
- Locations: Winter Park, FL · Boston, MA · Atlanta, GA

Be concise, professional, and helpful. Keep responses short (2-4 sentences max unless the user asks for detail). 

STRICT SCOPE ENFORCEMENT:
- You ONLY discuss topics related to Disruptor, AI-driven transformation, strategic innovation, market intelligence, and organizational design.
- If you cannot answer a question from the user precisely (e.g., specific pricing, confidential clients, or technical details not listed above), DO NOT invent the answer. 
- Instead, respond exactly like this: "I do not have the information to respond to that at the moment. Can you leave me your contact information so we can get back to you?"
- Once the user provides an email address or phone number, use the "notifyPedro" tool to send their information.

If someone wants to engage our services, encourage them to request a discovery call or email hello@disruptor.consulting. If someone wants to join as talent, direct them to the profile registration section below. Do not provide a separate email for talent inquiries.`;

export async function POST(req: Request) {
  console.log("POST request received at /api/chat");

  try {
    const { messages } = await req.json();
    console.log("Messages received count:", messages.length);

    // Map messages to ensure they match the CoreMessage format expected by streamText
    const coreMessages = messages.map((m: any) => {
      let content = "";
      if (typeof m.content === "string") {
        content = m.content;
      } else if (m.parts && Array.isArray(m.parts)) {
        content = m.parts
          .filter((p: any) => p.type === "text")
          .map((p: any) => p.text)
          .join("");
      } else if (m.text) {
        content = m.text;
      }

      return {
        role: m.role,
        content: content,
      };
    });

    const result = streamText({
      model: google("gemini-2.0-flash"),
      system: SYSTEM_PROMPT,
      messages: coreMessages,
      tools: {
        notifyPedro: tool({
          description: 'Send lead contact information to Pedro when a user wants to be contacted because the AI couldn\'t answer a specific question.',
          inputSchema: z.object({
            email: z.string().email().optional().describe('The user\'s email address'),
            phone: z.string().optional().describe('The user\'s phone number'),
            question: z.string().describe('The original question the user wanted answered'),
          }),
          execute: async ({ email, phone, question }) => {
            console.log("Tool executing: notifyPedro", { email, phone, question });

            if (!process.env.RESEND_API_KEY) {
              console.warn("RESEND_API_KEY is missing. Cannot send notification.");
              return { success: false, message: "Notification service unavailable." };
            }

            try {
              await resend.emails.send({
                from: 'Disruptor AI <onboarding@resend.dev>',
                to: 'pedro.moneo@gmail.com',
                subject: 'New Lead: Information Request',
                text: `You have a new lead from the Disruptor website.\n\nQuestion: ${question}\nEmail: ${email || "Not provided"}\nPhone: ${phone || "Not provided"}\n\nPlease follow up as soon as possible.`,
              });
              return { success: true, message: "Information received. We will get back to you soon!" };
            } catch (error: any) {
              console.error("Error sending email via Resend:", error);
              return { success: false, message: "Failed to send notification." };
            }
          },
        }),
      },
      // In this version of the SDK, maxSteps is replaced by stopWhen
      stopWhen: stepCountIs(5),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("CRITICAL ERROR in /api/chat:", error);
    return new Response(JSON.stringify({
      error: "Internal Server Error",
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
