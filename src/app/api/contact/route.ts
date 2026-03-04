import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Trim and validate inputs
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (name.length > 100) {
      return NextResponse.json({ error: "Name too long" }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    if (message.length > 2000) {
      return NextResponse.json({ error: "Message too long" }, { status: 400 });
    }

    // Log contact inquiry (in production, send via email service)
    console.log("=== NEW CONTACT INQUIRY ===");
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Message: ${message}`);
    console.log("===========================");

    // TODO: Add email sending with Resend API or Nodemailer
    // import { Resend } from 'resend';
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'contact@mesara-sisko.rs',
    //   to: RESTAURANT_EMAIL,
    //   subject: `Kontakt upit - ${name}`,
    //   text: `Ime: ${name}\nEmail: ${email}\n\nPoruka:\n${message}`,
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to process inquiry" },
      { status: 500 }
    );
  }
}
