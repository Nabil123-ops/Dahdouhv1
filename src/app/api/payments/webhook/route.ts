import { NextResponse } from "next/server";
import User from "@/models/User";
import dbConnect from "@/utils/dbConnect";

export async function POST(req: Request) {
  await dbConnect();
  try {
    const data = await req.json();

    // Status "finished" = payment completed
    if (data.payment_status !== "finished") {
      return NextResponse.json({ status: "ignored" });
    }

    const email = data.order_id.split("-")[0];
    const plan = data.order_description.includes("advanced")
      ? "advanced"
      : "creator";

    // Update user in DB
    await User.updateOne(
      { email },
      {
        plan,
        subscriptionActive: true,
        subscriptionExpires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}