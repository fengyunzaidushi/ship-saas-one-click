import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const supabase = await createClient();

    // 验证用户身份
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 检查用户档案是否已存在
    const { data: profile, error: fetchError } = await supabase
      .schema("site_saas")
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    if (!fetchError && profile) {
      return NextResponse.json({ message: "Profile already exists" });
    }

    // 创建新用户档案
    const { error: insertError } = await supabase
      .schema("site_saas")
      .from("profiles")
      .insert([
        {
          id: user.id,
          name: user.user_metadata?.full_name ?? "",
          email: user.email ?? "",
          image: user.user_metadata?.avatar_url ?? "",
          has_access: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          tokens: 10000,
        },
      ]);

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json({ message: "Profile created successfully" });
  } catch (error) {
    console.error("Error in profile creation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
