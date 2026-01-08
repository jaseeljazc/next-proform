import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import WorkoutLog from "@/models/WorkoutLog";
import { getUserFromRequest } from "@/lib/auth-utils";

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const logs = await WorkoutLog.find({ userId: user.id }).sort({ date: -1 }).lean();

    const payload = logs.map((l: any) => ({
      id: l._id.toString(),
      date: l.date.toISOString(),
      week: l.week,
      dayName: l.dayName,
      exercises: l.exercises,
    }));

    return NextResponse.json(payload);
  } catch (error: any) {
    console.error("Fetch logs error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const { date, week, dayName, exercises } = body;
    if (!date || !week || !dayName || !exercises) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await connectToDatabase();

    const created = await WorkoutLog.create({
      userId: user.id,
      date: new Date(date),
      week,
      dayName,
      exercises,
    });

    const payload = {
      id: created._id.toString(),
      date: created.date.toISOString(),
      week: created.week,
      dayName: created.dayName,
      exercises: created.exercises,
    };

    return NextResponse.json(payload, { status: 201 });
  } catch (error: any) {
    console.error("Create log error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
