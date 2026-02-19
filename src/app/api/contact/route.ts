import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
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
