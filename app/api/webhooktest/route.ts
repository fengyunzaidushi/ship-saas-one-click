import { NextResponse } from "next/server";

export async function POST(request: Request) {
  console.log("Test webhook endpoint hit");

  return NextResponse.json({
    status: "success",
    message: "Test webhook endpoint is working",
  });
}
