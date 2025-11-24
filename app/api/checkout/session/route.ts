// import Stripe from "stripe";
// import { NextRequest, NextResponse } from "next/server";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-09-30.clover" });

// export async function POST(req: NextRequest) {
//   try {
//     const { item } = await req.json(); // ensure same key as frontend

//     const origin = req.headers.get("x-forwarded-proto")
//       ? `${req.headers.get("x-forwarded-proto")}://${req.headers.get("host")}`
//       : req.headers.get("origin") || "http://localhost:3000";

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       mode: "payment",
//       line_items: (Array.isArray(item) ? item : [item]).map((i: any) => (        console.log(i),{

//         price_data: {
//           currency: "usd",
//           product_data: { name: i.eventDetails.mainTitle },
//           unit_amount: i.subtotal * 100,
//         },
//         quantity: 1,
//       })),
//       success_url: `${origin}/success`,
//       cancel_url: `${origin}/cancel`,
//     });

//     if (!session.url) throw new Error("Stripe session URL not created");

//     return NextResponse.json({ url: session.url });
//   } catch (err: any) {
//     console.error("Stripe Error:", err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }



import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { item } = await req.json();

    const origin = req.headers.get("x-forwarded-proto")
      ? `${req.headers.get("x-forwarded-proto")}://${req.headers.get("host")}`
      : req.headers.get("origin") || "http://localhost:3000";

    const itemsArray = Array.isArray(item) ? item : [item];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: itemsArray.map((i: any) => {
        console.log("Stripe item:", i);

        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: i?.eventDetails?.mainTitle || "Event Ticket",
            },
            unit_amount: Number(i?.subtotal) * 100,
          },
          quantity: 1,
        };
      }),
      success_url: `${origin}/success`,
      cancel_url: `${origin}/cancel`,
    });

    if (!session.url) throw new Error("Stripe session URL not created");

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
