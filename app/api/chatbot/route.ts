import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000", // change after deploy
          "X-Title": "Fitness AI Coach",
        },
        body: JSON.stringify({
          model: process.env.OPENROUTER_MODEL,
          messages: [
            {
              role: "system",
           content: `
You are a fitness coach chatbot.

CRITICAL RULES (MANDATORY):
- NO explanations
- NO storytelling
- NO paragraphs
- NO tips unless asked
- NO repetition
- Use ONLY bullet points
- Max 5 bullets TOTAL
- Each bullet ≤ 12 words
- Be factual and direct
- If comparison is needed, use 1-line table only

ALLOWED FORMAT ONLY:

Title:
• bullet
• bullet

OR

Title:
• bullet
• bullet
• bullet

If user asks "why", answer in 2 bullets MAX.
If user asks comparison, give 1 table + 1 conclusion bullet.

Do NOT add extra sections.
Do NOT add summaries.
Do NOT add recommendations unless explicitly asked.
`

            },
            ...messages,
          ],
        }),
      }
    );

    const data = await response.json();

    const reply =
      data?.choices?.[0]?.message?.content ??
      "Sorry, I couldn't generate a response.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chatbot API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
