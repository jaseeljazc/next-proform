import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import MealPlan from "@/models/MealPlan";
import { getUserFromRequest } from "@/lib/auth-utils";

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const plans = await MealPlan.find({ userId: user.id }).sort({
      createdAt: -1,
    });

    const formattedPlans = plans.map((plan) => ({
      ...plan.toObject(),
      id: plan._id.toString(),
    }));

    return NextResponse.json(formattedPlans);
  } catch (error) {
    console.error("Error fetching meal plans:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, goal, dietType, calories, meals } = body;

    if (!name || !meals) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await connectToDatabase();

    const newPlan = await MealPlan.create({
      userId: user.id,
      name,
      goal,
      dietType,
      calories,
      meals,
      isActive: false,
    });

    return NextResponse.json(
      {
        ...newPlan.toObject(),
        id: newPlan._id.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating meal plan:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
