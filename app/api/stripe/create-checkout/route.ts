import { createCheckout } from "@/libs/stripe";
import { createClient } from "@/libs/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import config from "@/config";

// This function is used to create a Stripe Checkout Session (one-time payment or subscription)
// It's called by the <ButtonCheckout /> component
// Users must be authenticated. It will prefill the Checkout data with their email and/or credit card (if any)
export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.priceId) {
    return NextResponse.json(
      { error: "Price ID is required" },
      { status: 400 }
    );
  } else if (!body.successUrl || !body.cancelUrl) {
    return NextResponse.json(
      { error: "Success and cancel URLs are required" },
      { status: 400 }
    );
  } else if (!body.mode) {
    return NextResponse.json(
      {
        error:
          "Mode is required (either 'payment' for one-time payments or 'subscription' for recurring subscription)",
      },
      { status: 400 }
    );
  }

  try {
    const supabase = createClient();
    
    const { data: userData, error: authError } = await supabase.auth.getUser();
    if (authError || !userData?.user) {
      return NextResponse.json(
        { error: "User not authenticated", detail: authError?.message },
        { status: 401 }
      );
    }

    const { user } = userData;
    const { priceId, mode, successUrl, cancelUrl } = body;

    const { data, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user?.id)
      .single();

    if (profileError) {
      console.error("Profile fetch error:", profileError.message);
      return NextResponse.json(
        { error: "Could not fetch user profile", detail: profileError.message },
        { status: 500 }
      );
    }

    const stripeSessionURL = await createCheckout({
      user: {
        userId:user?.id,
        email: data?.email,
        customerId: data?.customer_id,
      },
      mode,
      clientReferenceId: user?.id,
      successUrl,
      cancelUrl,
      priceId,
      
    });


    return NextResponse.json({ url: stripeSessionURL });
  } catch (e) {
    console.error("General error:", e);
    return NextResponse.json({ error: e?.message || "Internal Server Error" }, { status: 500 });
  }
}
