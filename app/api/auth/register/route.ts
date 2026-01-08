import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { hashPassword, createToken, setAuthCookie } from "@/lib/auth-utils";
import * as Yup from "yup";

const registerSchema = Yup.object().shape({
  name: Yup.string().required(),
  email: Yup.string().email().required(),
  password: Yup.string().min(6).required(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    try {
      await registerSchema.validate(body);
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    const { name, email, password } = body;

    await connectToDatabase();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = createToken({
      id: newUser._id,
      email: newUser.email,
      name: newUser.name,
    });
    const cookie = setAuthCookie(token);

    return NextResponse.json(
      {
        user: { id: newUser._id, email: newUser.email, name: newUser.name },
      },
      {
        status: 201,
        headers: { "Set-Cookie": cookie },
      }
    );
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
