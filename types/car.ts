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
  fuelConsumption: string | number;
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
  totalCars: number;
  totalPages: number;
  page: number;
  perPage: number;
}

export interface FiltersResponse {
  brands: string[];
  price: {
    min: number;
    max: number;
  };
}

export interface CarFilters {
  brand?: string;
  price?: string;
  minMileage?: string;
  maxMileage?: string;
}

export interface BookingRequestPayload {
  name: string;
  email: string;
  comment: string;
}

export interface BookingRequestResponse {
  message: string;
}
