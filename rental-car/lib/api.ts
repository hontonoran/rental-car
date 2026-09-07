import axios from "axios";
import type {
  BookingRequestPayload,
  Car,
  CarFilters,
  CarsResponse,
  FiltersResponse,
} from "@/types/car";

const api = axios.create({
  baseURL: "/api",
});

export async function getCars(
  page: number,
  filters: CarFilters,
): Promise<CarsResponse> {
  const { data } = await api.get<CarsResponse>("/cars", {
    params: {
      page,
      perPage: 8,
      brand: filters.brand || undefined,
      price: filters.rentalPrice || undefined,
      minMileage: filters.minMileage || undefined,
      maxMileage: filters.maxMileage || undefined,
    },
  });

  return data;
}

export async function getCarFilters(): Promise<FiltersResponse> {
  const { data } = await api.get<FiltersResponse>("/cars/filters");

  return data;
}

export async function getCarById(carId: string): Promise<Car> {
  const { data } = await api.get<Car>(`/cars/${carId}`);

  return data;
}

export async function createBookingRequest(
  carId: string,
  payload: BookingRequestPayload,
) {
  const { data } = await api.post(
    `/cars/${carId}/booking-requests`,
    payload,
  );

  return data;
}
