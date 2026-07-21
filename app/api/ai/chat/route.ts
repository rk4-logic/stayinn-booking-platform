import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import genAI from "@/lib/gemini";

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
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt,
    });

    // convert messages to Gemini format
    const history = messages.slice(0, -1).map((msg: { role: string; content: string }) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const lastMessage = messages[messages.length - 1];

    const chat = model.startChat({ history });

    // stream the response
    const streamResult = await chat.sendMessageStream(lastMessage.content);

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of streamResult.stream) {
          const text = chunk.text();
          if (text) {
            controller.enqueue(new TextEncoder().encode(text));
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("AI chat error:", error);
    return new Response("AI service unavailable", { status: 500 });
  }
}