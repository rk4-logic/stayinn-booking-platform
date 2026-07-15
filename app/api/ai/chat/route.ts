import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { messages } = await req.json();

    // System prompt — tells Claude what role to play
    const systemPrompt = `You are a helpful travel assistant for StayInn, 
a hotel booking platform. Help users find the perfect accommodation.

You can help with:
- Recommending hotels based on preferences
- Explaining different property types (hotel, villa, apartment, etc.)
- Suggesting destinations
- Answering questions about amenities
- Helping users understand pricing

Keep responses concise and helpful. When recommending properties,
suggest the user use the search filters on the properties page.
Always be friendly and professional.`;

    // Stream the response back to user
    // This means user sees text appearing word by word instead of waiting
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-6",
        max_tokens: 1024,
        system: systemPrompt,
        messages,
        stream: true, // enable streaming
      }),
    });

    // Pass the stream directly to the browser
    // TransformStream converts Anthropic's format to plain text
    const stream = new TransformStream({
      transform(chunk, controller) {
        const text = new TextDecoder().decode(chunk);
        const lines = text.split("\n").filter((line) => line.trim());

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") return;

            try {
              const parsed = JSON.parse(data);
              // Extract text delta from streaming response
              if (parsed.type === "content_block_delta") {
                const textChunk = parsed.delta?.text ?? "";
                if (textChunk) {
                  controller.enqueue(new TextEncoder().encode(textChunk));
                }
              }
            } catch {
              // skip malformed chunks
            }
          }
        }
      },
    });

    response.body?.pipeTo(stream.writable);

    return new Response(stream.readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("AI chat error:", error);
    return new Response("AI service unavailable", { status: 500 });
  }
}