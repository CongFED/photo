export interface Reservation {
  startDate: string;
  endDate: string;
  bookedUnits: number;
}

export interface AvailabilityEntry {
  productId: string;
  totalUnits: number;
  reservations: Reservation[];
}

export interface AvailabilityResult {
  totalUnits: number;
  bookedUnits: number;
  availableUnits: number;
}

export interface Promotion {
  id: string;
  minDays: number;
  discountPercent: number;
  label: string;
  description: string;
}
