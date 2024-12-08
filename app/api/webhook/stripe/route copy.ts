import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { SupabaseClient } from "@supabase/supabase-js";
import { toDateTime } from "@/lib/helpers";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
  typescript: true,
});

const supabase = new SupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const reqText = await req.text();
  return webhooksHandler(reqText, req);
}

async function webhooksHandler(
  reqText: string,
  request: NextRequest
): Promise<NextResponse> {
  const sig = request.headers.get("Stripe-Signature");

  try {
    const event = await stripe.webhooks.constructEventAsync(
      reqText,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case "checkout.session.completed":
        return handleCheckoutSessionCompleted(event);
      case "customer.subscription.created":
        return handleSubscriptionEvent(event, "created");
      case "customer.subscription.deleted":
        return handleSubscriptionEvent(event, "deleted");
      case "customer.subscription.updated":
        return handleSubscriptionEvent(event, "updated");

      default:
        return NextResponse.json({
          status: 400,
          error: "Unhandled event type",
        });
    }
  } catch (err) {
    console.error("Error constructing Stripe event:", err);
    return NextResponse.json({
      status: 500,
      error: "Webhook Error: Invalid Signature",
    });
  }
}

async function handleCheckoutSessionCompleted(
  event: Stripe.Event
): Promise<NextResponse> {
  const session = event.data.object as Stripe.Checkout.Session;
  const metadata: any = session?.metadata;
  const user_id: string = session?.client_reference_id;
  console.log(session);
  if (session.mode === "subscription") {
    // 01 upate table profiles customer_id field
    const { error: userError } = await supabase
      .from("profiles")
      .update({ customer_id: session.customer })
      .eq("id", user_id);
    if (userError) {
      console.error("Error updating customer ID:", userError);
      return NextResponse.json({
        status: 500,
        error: "Error updating customer ID",
      });
    }

    // 02 update table invoices some fields,mainly user_id
    const invoiceData = {
      invoice_id: session.invoice,
      subscription_id: session.subscription,
      user_id: user_id,
      email: session?.customer_email,
    };
    const { data, error } = await supabase
      .from("invoices")
      .insert([invoiceData]);
    if (error) {
      console.error(`Error inserting invoice:`, error);
      return NextResponse.json({
        status: 500,
        error: `Error inserting invoice`,
      });
    }

    // 03 update table supscriptions some fields,mainly user_id
    const subscriptionData = {
      id: session.subscription,
      user_id: user_id,
    };

    const { error: subscriptionError } = await supabase
      .from("subscriptions")
      .insert([subscriptionData]);
    if (subscriptionError) {
      console.error(`Error inserting subscription:`, error);
      return NextResponse.json({
        status: 500,
        error: `Error inserting subscription`,
      });
    }
  } else {
    // This is for one-time payments
    const dateTime = new Date(session.created * 1000).toISOString();
    try {
      const { data: user, error: userError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user_id);
      if (userError) throw new Error("Error fetching user");

      const paymentData = {
        user_id: user_id,
        stripe_id: session.id,
        email: metadata?.email,
        amount: session.amount_total! / 100,
        customer_details: JSON.stringify(session.customer_details),
        payment_intent: session.payment_intent,
        payment_time: dateTime,
        currency: session.currency,
      };

      const { data: paymentsData, error: paymentsError } = await supabase
        .from("payments")
        .insert([paymentData]);
      if (paymentsError) throw new Error("Error inserting payment");
      const addTokensString = session.metadata?.tokens;
      const addTokens = Number(addTokensString?.replace("M", "")) * 1000000;
      const updatedCredits = Number(user?.[0]?.tokens || 0) + addTokens;

      const { data: updatedUser, error: userUpdateError } = await supabase
        .from("profiles")
        .update({ tokens: updatedCredits })
        .eq("id", user_id);
      if (userUpdateError) throw new Error("Error updating user credits");

      return NextResponse.json({
        status: 200,
        message: "Payment and credits updated successfully",
        updatedUser,
      });
    } catch (error) {
      console.error("Error handling checkout session:", error);
      return NextResponse.json({
        status: 500,
        error,
      });
    }
  }

  return NextResponse.json({
    status: 400,
    error: "Unhandled event type",
  });
}

async function handleSubscriptionEvent(
  event: Stripe.Event,
  eventType: "created" | "updated" | "deleted"
): Promise<NextResponse> {
  const subscription = event.data.object as Stripe.Subscription;
  const subscriptionData: any = await stripe.subscriptions.retrieve(
    subscription.id,
    {
      expand: ["default_payment_method"],
    }
  );

  if (!subscriptionData) {
    console.error("Subscription data could not be fetched");
    return;
  }

  // fetch tokens metadata from table price use price_id
  const priceId = subscriptionData.items.data[0]?.price?.id;
  const { data: priceData, error: priceError } = await supabase
    .from("price")
    .select("*")
    .eq("price_id", priceId);
  if (priceError) {
    console.log(priceError);
    return NextResponse.json({
      status: 500,
      error: "Error fetching price data",
    });
  }

  // Extract metadata and tokens from priceData
  const metadata = priceData?.[0]?.metadata;
  const addTokensString = metadata?.tokens;

  const TokensPlan = Number(addTokensString?.replace("M", "")) * 1000000;
  if (eventType === "created") {
    const { data: updatedUser, error: userUpdateError } = await supabase
      .from("profiles")
      .update({ tokens: TokensPlan })
      .eq("customer_id", subscriptionData.customer);

    if (userUpdateError) {
      console.error("Error updating user credits:", userUpdateError);
      return NextResponse.json({
        status: 500,
        error: "Error updating user credits",
      });
    }
  } else if (eventType === "deleted") {
    const { data: deleteUser, error: userDeleteError } = await supabase
      .from("profiles")
      .update({ customer_id: null, tokens: 0 }) // Resetting customer_id to null
      .eq("customer_id", subscriptionData.customer);
    console.log("Subscription deleted:", subscriptionData.id);
    if (userDeleteError) {
      console.error("Error deleting user:", userDeleteError);
      return NextResponse.json({
        status: 500,
        error: "Error deleting user",
      });
    }
  } else if (eventType === "updated") {
    console.log("Subscription updated:", subscriptionData.id);
  } else {
    return NextResponse.json({
      status: 400,
      error: "Unhandled event type",
    });
  }

  // 将公共数据映射到数据库字段
  const data: any = {
    id: subscriptionData.id,
    metadata: subscriptionData.metadata,
    status: subscriptionData.status,
    price_id: subscriptionData.items.data[0]?.price?.id,
    quantity: subscriptionData.quantity || 1,
    cancel_at_period_end: subscriptionData.cancel_at_period_end,
    cancel_at: subscriptionData.cancel_at
      ? toDateTime(subscriptionData.cancel_at).toISOString()
      : null,
    canceled_at: subscriptionData.canceled_at
      ? toDateTime(subscriptionData.canceled_at).toISOString()
      : null,
    current_period_start: toDateTime(
      subscriptionData.current_period_start
    ).toISOString(),
    current_period_end: toDateTime(
      subscriptionData.current_period_end
    ).toISOString(),
    created: toDateTime(subscriptionData.created).toISOString(),
    ended_at: subscriptionData.ended_at
      ? toDateTime(subscriptionData.ended_at).toISOString()
      : null,
    trial_start: subscriptionData.trial_start
      ? toDateTime(subscriptionData.trial_start).toISOString()
      : null,
    trial_end: subscriptionData.trial_end
      ? toDateTime(subscriptionData.trial_end).toISOString()
      : null,
  };
  console.log("data is", data);

  const response = await supabase
    .from("subscriptions")
    .update(data)
    .eq("id", data.id)
    .then(({ error }) => {
      if (error) {
        console.error("Error updating subscription:", error.message);
        return NextResponse.json({
          status: 500,
          error: "Error updating subscription",
        });
      } else {
        console.log("Subscription updated successfully.");
        return NextResponse.json({
          status: 200,
          message: "Subscription updated successfully",
        });
      }
    });

  return response;
}
