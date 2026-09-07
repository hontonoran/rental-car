import { BACKEND_BASE_URL } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_PARAMS = [
  "page",
  "perPage",
  "brand",
  "price",
  "minMileage",
  "maxMileage",
];

export async function GET(request: NextRequest) {
  const incomingUrl = new URL(request.url);
  const backendUrl = new URL(`${BACKEND_BASE_URL}/cars`);

  ALLOWED_PARAMS.forEach((key) => {
    const value = incomingUrl.searchParams.get(key);

    if (value) {
      backendUrl.searchParams.set(key, value);
    }
  });

  const response = await fetch(backendUrl, {
    cache: "no-store",
  });
  const data = await response.json();

  return NextResponse.json(data, { status: response.status });
}
