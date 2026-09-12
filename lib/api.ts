import axios from "axios";
import type {
  BookingRequestPayload,
  BookingRequestResponse,
  Car,
  CarFilters,
  CarsResponse,
  FiltersResponse,
} from "@/types/car";

export const CARS_PER_PAGE = 12;

export const api = axios.create({
  baseURL: "https://car-rental-api.goit.study",
});

export async function getCars(
  page: number,
  filters: CarFilters,
  signal?: AbortSignal,
): Promise<CarsResponse> {
  const { data } = await api.get<CarsResponse>("/cars", {
    signal,
    params: {
      page,
      perPage: CARS_PER_PAGE,
      brand: filters.brand || undefined,
      price: filters.price || undefined,
      minMileage: filters.minMileage || undefined,
      maxMileage: filters.maxMileage || undefined,
    },
  });

  return data;
}

export async function fetchAllCars(
  filters: CarFilters,
  signal?: AbortSignal,
): Promise<Car[]> {
  const firstPage = await getCars(1, filters, signal);
  const pageNumbers = Array.from(
    { length: Math.max(firstPage.totalPages - 1, 0) },
    (_, index) => index + 2,
  );
  const restPages = await Promise.all(
    pageNumbers.map((page) => getCars(page, filters, signal)),
  );

  return [firstPage, ...restPages].flatMap((page) => page.cars);
}

export async function getCarFilters(
  signal?: AbortSignal,
): Promise<FiltersResponse> {
  const { data } = await api.get<FiltersResponse>("/cars/filters", { signal });

  return data;
}

export async function getCarById(
  carId: string,
  signal?: AbortSignal,
): Promise<Car> {
  const { data } = await api.get<Car>(`/cars/${carId}`, { signal });

  return data;
}

export async function createBookingRequest(
  carId: string,
  payload: BookingRequestPayload,
): Promise<BookingRequestResponse> {
  const { data } = await api.post<BookingRequestResponse>(
    `/cars/${carId}/booking-requests`,
    payload,
  );

  return data;
}
