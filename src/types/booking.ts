export type BookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'READY'
  | 'PICKED_UP'
  | 'RETURNED'
  | 'COMPLETED';

export type RentalPurpose =
  | 'personal'
  | 'wedding'
  | 'event'
  | 'travel'
  | 'commercial'
  | 'studio'
  | 'other';

export interface BookingItem {
  productId: string;
  productName: string;
  productImage: string;
  pricePerDay: number;
  deposit: number;
  quantity: number;
}

export interface CustomerInfo {
  fullName: string;
  phone: string;
  email: string;
  birthDate?: string;
  idNumber?: string;
  address?: string;
  socialContact?: string;
  purpose: RentalPurpose;
  usageLocation?: string;
  notes?: string;
  agreedToPolicy: boolean;
}

export interface PricingResult {
  rentalDays: number;
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  total: number;
  deposit: number;
}

export interface Booking {
  id: string;
  code: string;
  status: BookingStatus;
  items: BookingItem[];
  startDate: string;
  endDate: string;
  receiveTime: string;
  returnTime: string;
  customer: CustomerInfo;
  pricing: PricingResult;
  createdAt: string;
}

export interface BookingStatusStep {
  status: BookingStatus;
  label: string;
  description: string;
  completed: boolean;
  current: boolean;
  timestamp?: string;
}
