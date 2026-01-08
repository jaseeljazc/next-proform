import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

 const prompt = `
Create a Kerala-style ${body.goal} meal plan.

Rules:
- Kerala foods only
- Diet: ${body.dietType}
- Meals/day: ${body.mealsPerDay}
- Budget: ${body.budget}
- No explanations

Return JSON ONLY:

{
  "calories": number,
  "meals": [
    {
      "name": "Breakfast | Lunch | Snack | Dinner",
      "time": "8:00 AM",
      "foods": [
        {
          "name": "Food",
          "calories": number,
          "protein": number,
          "carbs": number,
          "fats": number
        }
      ]
    }
  ]
}
`;


    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.OPENROUTER_MODEL,
          messages: [
            {
              role: "system",
              content: "Return ONLY valid JSON. No text.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          response_format: { type: "json_object" },
          temperature: 0.3,
        }),
      }
    );

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Empty AI response");
    }

    return NextResponse.json(JSON.parse(content));
  } catch (error) {
    console.error("Meal Plan Error:", error);
    return NextResponse.json(
      { error: "Failed to generate meal plan" },
      { status: 500 }
    );
  }
}
