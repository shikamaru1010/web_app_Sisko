import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, note, items, total, orderDetails } = body;

    // Validate required fields
    if (!name || !phone || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert order into Supabase
    const supabase = createServerSupabaseClient();
    const { data: order, error: dbError } = await supabase
      .from("orders")
      .insert({
        customer_name: name,
        customer_phone: phone,
        note: note || "",
        items,
        total,
        order_details: orderDetails || "",
        status: "new",
        estimated_minutes: null,
      })
      .select("id")
      .single();

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return NextResponse.json(
        { error: "Failed to save order" },
        { status: 500 }
      );
    }

    // Send email notification (non-blocking — email failure doesn't fail the order)
    try {
      const resendApiKey = process.env.RESEND_API_KEY;
      const restaurantEmail = process.env.RESTAURANT_EMAIL;

      if (resendApiKey && restaurantEmail) {
        const resend = new Resend(resendApiKey);

        const now = new Date().toLocaleString("sr-RS", {
          timeZone: "Europe/Belgrade",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        const itemRows = items
          .map(
            (item: { name: string; size?: string; quantity: number; price: number }) =>
              `<tr>
                <td style="padding:6px 12px;border-bottom:1px solid #eee;">${item.name}${item.size ? ` (${item.size})` : ""}</td>
                <td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
                <td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:right;">${(item.price * item.quantity).toLocaleString("sr-RS")} дин</td>
              </tr>`
          )
          .join("");

        const html = `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
            <h1 style="color:#A61C1C;border-bottom:2px solid #A61C1C;padding-bottom:10px;">
              Нова поруџбина
            </h1>
            <table style="width:100%;margin-bottom:16px;">
              <tr><td style="color:#666;padding:4px 0;">Име:</td><td style="font-weight:bold;">${name}</td></tr>
              <tr><td style="color:#666;padding:4px 0;">Телефон:</td><td style="font-weight:bold;">${phone}</td></tr>
              <tr><td style="color:#666;padding:4px 0;">Време:</td><td style="font-weight:bold;">${now}</td></tr>
            </table>
            ${note ? `<div style="background:#fff8e1;padding:10px 14px;border-radius:6px;margin-bottom:16px;border-left:3px solid #ffa000;"><strong>Напомена:</strong> ${note}</div>` : ""}
            <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
              <thead>
                <tr style="background:#f5f5f5;">
                  <th style="padding:8px 12px;text-align:left;">Ставка</th>
                  <th style="padding:8px 12px;text-align:center;">Кол.</th>
                  <th style="padding:8px 12px;text-align:right;">Цена</th>
                </tr>
              </thead>
              <tbody>${itemRows}</tbody>
            </table>
            <div style="background:#A61C1C;color:white;padding:14px 20px;border-radius:8px;text-align:right;font-size:18px;">
              <strong>Укупно: ${total.toLocaleString("sr-RS")} дин</strong>
            </div>
          </div>
        `;

        await resend.emails.send({
          from: "Месара Шишко <onboarding@resend.dev>",
          to: restaurantEmail,
          subject: `Нова поруџбина — ${name}`,
          html,
        });
      }
    } catch (emailError) {
      console.error("Email send error (order still saved):", emailError);
    }

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error("Order error:", error);
    return NextResponse.json(
      { error: "Failed to process order" },
      { status: 500 }
    );
  }
}
