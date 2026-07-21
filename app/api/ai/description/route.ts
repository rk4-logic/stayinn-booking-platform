import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import genAI from "@/lib/gemini";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "AI service not configured" },
      { status: 503 }
    );
  }

  try {
    const { propertyName, propertyType, location, amenities } =
      await req.json();

    if (!propertyName?.trim()) {
      return NextResponse.json(
        { error: "Property name is required" },
        { status: 400 }
      );
    }

    const prompt = `You are a professional hotel copywriter. Write a compelling, 
professional property description for a hotel listing website.

Property Details:
- Name: ${propertyName}
- Type: ${propertyType || "property"}
- Location: ${location || "not specified"}
- Amenities: ${Array.isArray(amenities) && amenities.length > 0 ? amenities.join(", ") : "not specified"}

Write a description that is:
- 2-3 paragraphs long
- Engaging and professional
- Highlights the best features
- Appeals to travelers
- Does NOT use excessive adjectives or clichés

Return only the description text, no headers or formatting.`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const description = result.response.text();

    return NextResponse.json({ description });
  } catch (error) {
    console.error("AI description error:", error);
    return NextResponse.json(
      { error: "Failed to generate description" },
      { status: 500 }
    );
  }
}