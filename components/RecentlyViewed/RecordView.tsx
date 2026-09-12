"use client";

import { useEffect } from "react";
import { recordRecentlyViewed } from "@/hooks/useRecentlyViewed";

export default function RecordView({ carId }: { carId: string }) {
  useEffect(() => {
    recordRecentlyViewed(carId);
  }, [carId]);

  return null;
}
