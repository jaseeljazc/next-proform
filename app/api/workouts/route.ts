import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY!;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL!;

/**
 * Safely extract JSON from AI response
 */
function extractJSON(text: string) {
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error("No JSON object found in AI response");
  }

  const jsonString = text.slice(firstBrace, lastBrace + 1);
  return JSON.parse(jsonString);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { goal, experience, equipment, daysPerWeek, timePerSession, split } =
      body;

    const prompt = `
Generate a workout plan in JSON format.
RETURN ONLY JSON. DO NOT enclose it in markdown code blocks.

Goal: ${goal}
Experience: ${experience}
Equipment: ${equipment}
Days/week: ${daysPerWeek}
Time/session: ${timePerSession} min
Split: ${split}

Structure the JSON exactly like this:
{
  "name": "Custom ${split} Plan",
  "goal": "${goal}",
  "split": "${split}",
  "days": [
    {
      "day": "Day 1",
      "name": "Push (Chest/Shoulders/Triceps)",
      "exercises": [
        {
          "name": "Exercise Name",
          "sets": 3,
          "reps": "8-12",
          "rest": "60s",
          "videoUrl": "https://www.youtube.com/results?search_query=Exercise+Name+tutorial"
        }
      ]
    }
  ]
}

Rules:
- Create ${daysPerWeek} days.
- Be specific with exercise names.
- Provide appropriate sets (usually 3-4) and reps (e.g., "8-12", "5x5", "Failure").
- Include rest times.
- Include a "videoUrl" for EACH exercise. Use the format: https://www.youtube.com/results?search_query={Exercise Name}+tutorial
`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "Workout Generator",
        },
        body: JSON.stringify({
          model: OPENROUTER_MODEL,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.4,
          max_tokens: 2000,
        }),
      }
    );

    const data = await response.json();
    const aiMessage = data?.choices?.[0]?.message?.content;

    if (!aiMessage) {
      throw new Error("Empty AI response");
    }

    const planJSON = extractJSON(aiMessage);

    return NextResponse.json({
      plan: planJSON,
    });
  } catch (error: any) {
    console.error("Workout AI Error:", error);

    return NextResponse.json(
      {
        error: "Failed to generate workout plan",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
