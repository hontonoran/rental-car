import { BACKEND_BASE_URL } from "@/lib/backend";
import { NextResponse } from "next/server";

interface CarRouteContext {
  params: Promise<{ carId: string }>;
}

export async function GET(_request: Request, { params }: CarRouteContext) {
  const { carId } = await params;
  const response = await fetch(`${BACKEND_BASE_URL}/cars/${carId}`, {
    cache: "no-store",
  });
  const data = await response.json();

  return NextResponse.json(data, { status: response.status });
}
