import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import WorkoutPlan from "@/models/WorkoutPlan";
import { getUserFromRequest } from "@/lib/auth-utils";

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const plans = await WorkoutPlan.find({ userId: user.id }).sort({
      createdAt: -1,
    });

    // Determine active plan (logic can be refined, currently relying on DB flag or client-side logic)
    // For now, returning all plans. The client maps them to the WorkoutPlan interface.

    // Transform _id to id for frontend compatibility if needed,
    // though Mongoose usually handles this or frontend can adapt.
    const formattedPlans = plans.map((plan) => ({
      ...plan.toObject(),
      id: plan._id.toString(),
    }));

    return NextResponse.json(formattedPlans);
  } catch (error) {
    console.error("Error fetching workout plans:", error);
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
    const { name, goal, split, days } = body;

    // Basic validation
    if (!name || !days) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await connectToDatabase();

    // Check if we should set this as active? For now, default is false.
    // If user wants to activate, they can do it via a separate action or we set it if it's the first one.

    const newPlan = await WorkoutPlan.create({
      userId: user.id,
      name,
      goal,
      split,
      days,
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
    console.error("Error creating workout plan:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
