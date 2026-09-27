import { Booking, BookingItem, CustomerInfo, PricingResult } from '@/types/booking';
import { demoBookings } from '@/data/bookings';
import { mockDelay, randomDelay } from '@/lib/delay';
import { generateBookingCode } from '@/lib/utils';

/**
 * Mock Booking Service
 * All operations are frontend-only.
 * Replace with real API when backend is ready.
 */

// In-memory storage for bookings created during the session
let sessionBookings: Booking[] = [];

export async function createBooking(
  items: BookingItem[],
  startDate: string,
  endDate: string,
  receiveTime: string,
  returnTime: string,
  customer: CustomerInfo,
  pricing: PricingResult
): Promise<Booking> {
  // Simulate API delay
  await randomDelay(800, 1200);

  const booking: Booking = {
    id: `bk-session-${Date.now()}`,
    code: generateBookingCode(),
    status: 'PENDING',
    items,
    startDate,
    endDate,
    receiveTime,
    returnTime,
    customer,
    pricing,
    createdAt: new Date().toISOString(),
  };

  sessionBookings.push(booking);

  // Also save to localStorage for persistence
  try {
    const stored = localStorage.getItem('demo-bookings');
    const existing = stored ? JSON.parse(stored) : [];
    existing.push(booking);
    localStorage.setItem('demo-bookings', JSON.stringify(existing));
  } catch {
    // localStorage not available
  }

  return booking;
}

export async function lookupBooking(
  code: string,
  phone: string
): Promise<Booking | null> {
  await mockDelay(700);

  // Search in demo bookings
  const demoResult = demoBookings.find(
    (b) => b.code.toUpperCase() === code.toUpperCase() && b.customer.phone === phone
  );
  if (demoResult) return demoResult;

  // Search in session bookings
  const sessionResult = sessionBookings.find(
    (b) => b.code.toUpperCase() === code.toUpperCase() && b.customer.phone === phone
  );
  if (sessionResult) return sessionResult;

  // Search in localStorage
  try {
    const stored = localStorage.getItem('demo-bookings');
    if (stored) {
      const storedBookings: Booking[] = JSON.parse(stored);
      const localResult = storedBookings.find(
        (b) => b.code.toUpperCase() === code.toUpperCase() && b.customer.phone === phone
      );
      if (localResult) return localResult;
    }
  } catch {
    // localStorage not available
  }

  return null;
}

export async function getBookingByCode(code: string): Promise<Booking | null> {
  await mockDelay(300);

  const allBookings = [...demoBookings, ...sessionBookings];
  return allBookings.find((b) => b.code.toUpperCase() === code.toUpperCase()) ?? null;
}

export async function getAllBookings(): Promise<Booking[]> {
  await mockDelay(300);
  let localList: Booking[] = [];
  try {
    const stored = localStorage.getItem('demo-bookings');
    if (stored) {
      localList = JSON.parse(stored);
    }
  } catch {
    // localStorage not available
  }
  const map = new Map<string, Booking>();
  [...demoBookings, ...sessionBookings, ...localList].forEach((b) => {
    map.set(b.id, b);
  });
  return Array.from(map.values());
}

export async function getUserBookings(email?: string, phone?: string): Promise<Booking[]> {
  const all = await getAllBookings();
  if (!email && !phone) return all;

  const filtered = all.filter((b) => {
    const matchEmail = email && b.customer.email.toLowerCase() === email.toLowerCase();
    const matchPhone = phone && b.customer.phone === phone;
    return matchEmail || matchPhone;
  });

  // If no specific match for this email/phone, provide at least the demo bookings for an authentic preview
  return filtered.length > 0 ? filtered : all.slice(0, 3);
}

export async function cancelBooking(id: string): Promise<boolean> {
  await mockDelay(300);
  let localList: Booking[] = [];
  try {
    const stored = localStorage.getItem('demo-bookings');
    if (stored) localList = JSON.parse(stored);
    localList = localList.map((b) => (b.id === id ? { ...b, status: 'RETURNED' as const } : b));
    localStorage.setItem('demo-bookings', JSON.stringify(localList));
  } catch {
    // ignore
  }
  sessionBookings = sessionBookings.map((b) => (b.id === id ? { ...b, status: 'RETURNED' as const } : b));
  return true;
}
