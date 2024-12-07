import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// 初始化Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

// 根据环境选择正确的 URL
const baseUrl = process.env.NODE_ENV === "development"
  ? process.env.NEXT_PUBLIC_LOCAL_URL
  : process.env.NEXT_PUBLIC_SITE_URL;

export async function POST(request: Request) {
  try {
    // 解析请求体
    const { priceId, userId, locale } = await request.json();

    // 验证必要参数
    if (!priceId || !userId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // 获取价格信息及其关联的产品元数据
    const price = await stripe.prices.retrieve(priceId, {
      expand: ["product"], // 展开产品信息
    });

    // 获取产品元数据
    const productMetadata = (price.product as Stripe.Product).metadata;
    const { credits, valid_year } = productMetadata;

    if (!credits || !valid_year) {
      return NextResponse.json(
        {
          error:
            "Product metadata missing required fields (credits or valid_year)",
        },
        { status: 400 }
      );
    }

    // 验证用户身份
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user || user.id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 创建Stripe结账会话
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: user.email,
      metadata: {
        userId: userId,
        credits: credits,
        valid_year: valid_year,
        ...productMetadata,
      },
      success_url: `${baseUrl}/${locale}/payment/success`,
      cancel_url: `${baseUrl}/${locale}/payment/cancel`,
    });

    // 创建支付记录
    const { error: insertError } = await supabase
      .from("character_payment")
      .insert({
        user_id: userId,
        stripe_session_id: checkoutSession.id,
        price_id: priceId,
        amount: price.unit_amount ? price.unit_amount / 100 : 0,
        currency: price.currency,
        status: "pending",
        credits: parseInt(credits),
        product_metadata: productMetadata,
      })
      .select();

    if (insertError) {
      console.error("Error creating payment record:", insertError);
      // 记录详细错误信息
      console.error("Detailed error:", {
        userId,
        sessionId: checkoutSession.id,
        error: insertError
      });
      
      // 如果是关键错误，可以选择中断流程
      return NextResponse.json(
        { error: "Failed to create payment record" },
        { status: 500 }
      );
    }

    // 返回结账URL和产品元数据
    return NextResponse.json({
      url: checkoutSession.url,
      productMetadata,
    });
  } catch (error) {
    console.error("Checkout session error:", error);
    return NextResponse.json(
      { error: "Error creating checkout session" },
      { status: 500 }
    );
  }
}
