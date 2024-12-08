import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createServerClient } from "@/lib/supabase/server-client";

// 初始化 Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

// Webhook 签名密钥
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
console.log("endpointSecret", endpointSecret);
const debug = true;

export async function POST(request: NextRequest) {
  console.log('Received a POST request at /api/webhook/stripe');
  // 添加详细的请求日志
  console.log('Webhook Request URL:', request.url);
  console.log('Webhook Request Method:', request.method);
  console.log('Webhook Request Headers:', Object.fromEntries(request.headers.entries()));

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, stripe-signature",
  };

  // 处理 OPTIONS 请求
  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 200, headers });
  }

  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    // 验证必要的环境变量
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error("STRIPE_WEBHOOK_SECRET is not configured");
      return new NextResponse(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers }
      );
    }

    if (!signature) {
      console.error("No stripe signature found");
      return new NextResponse(
        JSON.stringify({ error: "No stripe signature found" }),
        { status: 400, headers }
      );
    }

    // 构建事件对象
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature!,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
      console.log("Successfully constructed event:", event.type);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return new NextResponse(
        JSON.stringify({ 
          error: "Webhook signature verification failed",
          details: err instanceof Error ? err.message : "Unknown error"
        }),
        { status: 400, headers }
      );
    }

    // 处理事件
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("Processing checkout session:", session.id);

      // 获取 Supabase 客户端
      const supabase = createServerClient();
      console.log("session.metadata:", session.metadata);

      const metadata = session.metadata as {
        userId: string;
        credits: string;
        valid_year: string;
      } | null;

      if (!metadata) {
        console.error("No metadata found in session");
        return NextResponse.json(
          { error: "Missing metadata" },
          { status: 400 }
        );
      }

      const { userId, credits, valid_year } = metadata;

      if (!userId || !credits || !valid_year) {
        console.error("Missing metadata in session:", session.id);
        return NextResponse.json(
          { error: "Missing required metadata" },
          { status: 400 }
        );
      }

      // 更新支付记录状态
      const { error: updatePaymentError } = await supabase
        .from("character_payment")
        .update({
          status: "completed",
          stripe_payment_intent_id: session.payment_intent as string,
        })
        .eq("stripe_session_id", session.id);

      if (updatePaymentError) {
        console.error("Error updating payment record:", updatePaymentError);
      }

      // 获取用户当前信用点数
      const { data: userData, error: userError } = await supabase
        .from("character_profile")
        .select("credits, valid_date")
        .eq("id", userId)
        .single();

      if (userError) {
        console.error("Error fetching user data:", userError);
        
        // 如果是因为找不到用户，则创建新用户记录
        if (userError.code === 'PGRST116') {
          const { error: insertError } = await supabase
            .from("character_profile")
            .insert({
              id: userId,
              credits: parseInt(credits),
              valid_date: new Date(Date.now() + parseInt(valid_year) * 365 * 24 * 60 * 60 * 1000).toISOString()
            });

          if (insertError) {
            console.error("Error creating new user profile:", insertError);
            return NextResponse.json(
              { error: "Error creating user profile" },
              { status: 500 }
            );
          }

          // 创建成功后直接
          return new NextResponse(JSON.stringify({ received: true }), {
            status: 200,
            headers,
          });
        }

        // 如果是其他错误，返回500
        return NextResponse.json(
          { error: "Error fetching user data" },
          { status: 500 }
        );
      }

      // 计算新的信用点数和有效期
      const currentCredits = userData?.credits || 0;
      const newCredits = currentCredits + parseInt(credits);
      const validYears = parseInt(valid_year);

      // 计算新的有效期
      const currentDate = new Date();
      const newValidDate = userData?.valid_date
        ? new Date(
            Math.max(
              currentDate.getTime(),
              new Date(userData.valid_date).getTime()
            )
          )
        : currentDate;
      newValidDate.setFullYear(newValidDate.getFullYear() + validYears);

      // 更新用户信用点数和有效期
      const { error: updateUserError } = await supabase
        .from("character_profile")
        .update({
          credits: newCredits,
          valid_date: newValidDate.toISOString(),
        })
        .eq("id", userId);

      if (updateUserError) {
        console.error("Error updating user credits:", updateUserError);
        return NextResponse.json(
          { error: "Error updating user credits" },
          { status: 500 }
        );
      }
    }

    return new NextResponse(JSON.stringify({ received: true }), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Webhook handler failed:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Webhook handler failed",
        details: error instanceof Error ? error.message : "Unknown error"
      }),
      { status: 500, headers }
    );
  }
}

// 添加配置以增加请求体大小限制
export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
