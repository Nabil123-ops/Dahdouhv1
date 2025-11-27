import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import User from "@/app/models/user.model";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    console.log("NOWPayments Webhook:", body);

    const {
      order_id,               // "advanced" or "creator"
      customer_email,         // user email
      payment_status,
    } = body;

    // Only activate subscription after successful payment
    if (payment_status !== "finished") {
      return NextResponse.json({ status: "ignored" });
    }

    // Determine plan from order_id
    let plan = "free";
    let expires = null;

    if (order_id === "advanced") {
      plan = "advanced";
      expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    } 
    
    if (order_id === "creator") {
      plan = "creator";
      expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }

    // Update user in DB
    const updatedUser = await User.findOneAndUpdate(
      { email: customer_email },
      { plan, expires },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Webhook error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}