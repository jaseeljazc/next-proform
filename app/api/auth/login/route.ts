import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { verifyPassword, createToken, setAuthCookie } from "@/lib/auth-utils";
import * as Yup from "yup";

const loginSchema = Yup.object().shape({
  email: Yup.string().email().required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    try {
      await loginSchema.validate(body);
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    const { email, password } = body;

    await connectToDatabase();

    // Explicitly select password since it's hidden by default in the model
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = createToken({
      id: user._id,
      email: user.email,
      name: user.name,
    });
    const cookie = setAuthCookie(token);

    return NextResponse.json(
      {
        user: { id: user._id, email: user.email, name: user.name },
      },
      {
        status: 200,
        headers: { "Set-Cookie": cookie },
      }
    );
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
