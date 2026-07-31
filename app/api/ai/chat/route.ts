import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import genAI from "@/lib/gemini";

// Force Node.js streaming compatibility layer or use edge if preferred
export const runtime = "nodejs"; 

export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!process.env.GEMINI_API_KEY) {
    return new Response("AI service not configured", { status: 503 });
  }

  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response("Messages are required", { status: 400 });
    }

    const systemPrompt = `You are a helpful travel assistant for StayInn,
a hotel booking platform. Help users find the perfect accommodation.
You can help with recommending hotels, explaining property types,
suggesting destinations, answering questions about amenities and pricing.
Keep responses concise and helpful. Always be friendly and professional.`;

    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
      systemInstruction: systemPrompt,
    });

    // 1. Clean data completely
    const validMessages = messages.filter(
      (msg: { role: string; content: string }) =>
        msg.content?.trim() !== ""
    );

    const lastMessage = validMessages[validMessages.length - 1];

    if (!lastMessage || lastMessage.role !== "user") {
      return new Response("Last message must be from user", {
        status: 400,
      });
    }

    const rawHistory = validMessages.slice(0, -1);

    // 2. Build and enforce strict alternation for Gemini history
    const history: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];
    
    rawHistory.forEach((msg: { role: string; content: string }) => {
      const currentRole = msg.role === "assistant" ? "model" : "user";
      

      if (history.length === 0) {
        if (currentRole === "user") {
          history.push({ role: "user", parts: [{ text: msg.content }] });
        }
        return;
      }

      // If the consecutive roles match, merge their contents to prevent crash
      const lastEntry = history[history.length - 1];
      if (lastEntry.role === currentRole) {
        lastEntry.parts[0].text += "\n" + msg.content;
      } else {
        history.push({ role: currentRole, parts: [{ text: msg.content }] });
      }
    });

    const chat = model.startChat({ history });
    const streamResult = await chat.sendMessageStream(lastMessage.content);

    // 3. Construct Next-compatible stream layout
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of streamResult.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    // Return with headers that tell Next.js to handle this chunk-by-chunk
    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("AI chat error:", error);

    if (error?.status === 429 || error?.message?.includes("429")) {
      return new Response(
        "Rate limit exceeded. Please wait a few seconds.",
        { status: 429 }
      );
    }

    return new Response("AI service unavailable", {
      status: 500,
    });
  }
}
