import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import User from "@/app/models/user.model";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) return NextResponse.json({ plan: "free" });

    const user = await User.findOne({ email });

    return NextResponse.json({
      plan: user?.plan || "free"
    });

  } catch (e) {
    return NextResponse.json({ plan: "free" });
  }
}