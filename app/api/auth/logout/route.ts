import { NextRequest, NextResponse } from "next/server";
import { removeAuthCookie } from "@/lib/auth-utils";

export async function POST(req: NextRequest) {
  const cookie = removeAuthCookie();

  return NextResponse.json(
    { message: "Logged out successfully" },
    {
      status: 200,
      headers: { "Set-Cookie": cookie },
    }
  );
}
