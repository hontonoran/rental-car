export interface CarLocation {
  country: string;
  city: string;
  address: string;
}

export interface Car {
  id: string;
  year: number;
  brand: string;
  model: string;
  type: string;
  img: string;
  description: string;
  fuelConsumption: number;
  engine: string;
  features: string[];
  rentalPrice: string;
  rentalCompany: string;
  location: CarLocation;
  rentalConditions: string[];
  mileage: number;
  stockNumber?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CarsResponse {
  cars: Car[];
  page: number;
  perPage?: number;
  totalPages: number;
  totalCars?: number;
}

export interface CarFilters {
  brand?: string;
  rentalPrice?: string;
  minMileage?: string;
  maxMileage?: string;
}

export interface FiltersResponse {
  brands: string[];
  price: {
    min: number;
    max: number;
  };
}

export interface BookingRequestPayload {
  name: string;
  email: string;
  bookingDate?: string;
  comment?: string;
}
