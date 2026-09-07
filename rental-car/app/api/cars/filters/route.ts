import { BACKEND_BASE_URL } from "@/lib/backend";
import { NextResponse } from "next/server";

export async function GET() {
  const response = await fetch(`${BACKEND_BASE_URL}/cars/filters`, {
    cache: "no-store",
  });
  const data = await response.json();

  return NextResponse.json(data, { status: response.status });
}
