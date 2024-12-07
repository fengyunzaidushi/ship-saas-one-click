import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const supabase = await createClient();

    // Get authenticated user using getUser() instead of getSession()
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });
    }

    // Get user profile using the verified user.id
    const { data: profile, error: profileError } = await supabase
      .from('character_profile')
      .select('credits')
      .eq('id', user.id)  // Use the verified user.id
      .single();

    if (profileError) {
      throw profileError;
    }

    return new NextResponse(JSON.stringify(profile), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in GET /api/profile:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}

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
      .from("character_profile")
      .select("id")
      .eq("id", user.id)
      .single();

    if (!fetchError && profile) {
      return NextResponse.json({ message: "Profile already exists" });
    }

    // 创建新用户档案
    const { error: insertError } = await supabase
      .from("character_profile")
      .insert([
        {
          id: user.id,
          name: user.user_metadata?.full_name ?? "",
          email: user.email ?? "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
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
