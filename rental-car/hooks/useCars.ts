"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getCars } from "@/lib/api";
import type { CarFilters } from "@/types/car";

export function useCars(filters: CarFilters) {
  return useInfiniteQuery({
    queryKey: ["cars", filters],
    queryFn: ({ pageParam }) => getCars(pageParam, filters),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const currentPage = Number(lastPage.page);

      return currentPage < lastPage.totalPages ? currentPage + 1 : undefined;
    },
  });
}
