import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import WorkoutPlan from "@/models/WorkoutPlan";
import { getUserFromRequest } from "@/lib/auth-utils";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    await connectToDatabase();

    const plan = await WorkoutPlan.findOneAndDelete({
      _id: id,
      userId: user.id, // Ensure ownership
    });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Plan deleted successfully" });
  } catch (error) {
    console.error("Error deleting workout plan:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // This endpoint can be used to set a plan as active
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();

    await connectToDatabase();

    // If setting to active, we might want to deactivate others.
    // Assuming body contains { isActive: true }
    if (body.isActive) {
      await WorkoutPlan.updateMany({ userId: user.id }, { isActive: false });
    }

    const plan = await WorkoutPlan.findOneAndUpdate(
      { _id: id, userId: user.id },
      { $set: body },
      { new: true }
    );

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...plan.toObject(),
      id: plan._id.toString(),
    });
  } catch (error) {
    console.error("Error updating workout plan:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
