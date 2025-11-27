import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { plan, email } = await req.json();
    const API_KEY = process.env.NOWPAYMENTS_API_KEY;

    if (!API_KEY) {
      return NextResponse.json(
        { error: "Missing NOWPayments API key" },
        { status: 500 }
      );
    }

    // Plan prices in USD
    const priceMap: any = {
      advanced: 3.75,
      creator: 9.99,
    };

    if (!priceMap[plan]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // Create NOWPayments invoice
    const invoiceRes = await fetch("https://api.nowpayments.io/v1/invoice", {
      method: "POST",
      headers: {
        "x-api-key": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price_amount: priceMap[plan],
        price_currency: "usd",
        pay_currency: "usdttrc20",
        order_id: plan, // 🔥 send plan for webhook
        order_description: `Dahdouh AI ${plan} plan for ${email}`,
        success_url: "https://dahdouhai.live/success",
        cancel_url: "https://dahdouhai.live/cancel",
        customer_email: email,
      }),
    });

    const invoiceData = await invoiceRes.json();
    return NextResponse.json(invoiceData);
  } catch (e: any) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}