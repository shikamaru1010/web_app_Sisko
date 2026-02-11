import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, note, orderDetails, total } = body;

    // Log order (in production, this would send an email via Resend/Nodemailer)
    console.log("=== NEW ORDER ===");
    console.log(`Name: ${name}`);
    console.log(`Phone: ${phone}`);
    console.log(`Note: ${note || "N/A"}`);
    console.log(`\nItems:\n${orderDetails}`);
    console.log(`\nTotal: ${total.toLocaleString("sr-RS")} RSD`);
    console.log("=================");

    // TODO: Add email sending with Resend API
    // import { Resend } from 'resend';
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'orders@mesara-sisko.rs',
    //   to: RESTAURANT_EMAIL,
    //   subject: `Nova porudžbina - ${name}`,
    //   text: `Ime: ${name}\nTelefon: ${phone}\nNapomena: ${note}\n\nStavke:\n${orderDetails}\n\nUkupno: ${total} RSD`,
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Order error:", error);
    return NextResponse.json(
      { error: "Failed to process order" },
      { status: 500 }
    );
  }
}
