import { BACKEND_BASE_URL } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

interface BookingRouteContext {
  params: Promise<{ carId: string }>;
}

export async function POST(
  request: NextRequest,
  { params }: BookingRouteContext,
) {
  const { carId } = await params;
  const body = await request.json();

  const response = await fetch(
    `${BACKEND_BASE_URL}/cars/${carId}/booking-requests`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );
  const data = await response.json().catch(() => ({}));

  return NextResponse.json(data, { status: response.status });
}
