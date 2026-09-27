import { AvailabilityResult } from '@/types/availability';
import { availabilityData } from '@/data/availability';
import { products } from '@/data/products';
import { dateRangesOverlap } from './date';

/**
 * Check mock availability for a product in a date range.
 * This is the core availability engine — swap with API call later.
 *
 * @param productId - The product to check
 * @param startDate - Rental start date (ISO string or Date)
 * @param endDate - Rental end date (ISO string or Date)
 * @returns AvailabilityResult with total, booked, and available units
 */
export function checkMockAvailability(
  productId: string,
  startDate: string | Date,
  endDate: string | Date
): AvailabilityResult {
  const start = typeof startDate === 'string' ? startDate : startDate.toISOString().split('T')[0];
  const end = typeof endDate === 'string' ? endDate : endDate.toISOString().split('T')[0];

  // Find the product to get total units
  const product = products.find((p) => p.id === productId);
  if (!product) {
    return { totalUnits: 0, bookedUnits: 0, availableUnits: 0 };
  }

  const totalUnits = product.totalUnits;

  // Find availability entry for this product
  const entry = availabilityData.find((a) => a.productId === productId);
  if (!entry) {
    // No reservations exist => all units available
    return { totalUnits, bookedUnits: 0, availableUnits: totalUnits };
  }

  // Find the maximum number of booked units during the requested period
  let maxBooked = 0;
  for (const reservation of entry.reservations) {
    if (dateRangesOverlap(start, end, reservation.startDate, reservation.endDate)) {
      maxBooked = Math.max(maxBooked, reservation.bookedUnits);
    }
  }

  const availableUnits = Math.max(0, totalUnits - maxBooked);

  return {
    totalUnits,
    bookedUnits: maxBooked,
    availableUnits,
  };
}

/**
 * Get availability status text for display
 */
export function getAvailabilityText(result: AvailabilityResult): string {
  if (result.availableUnits === 0) {
    return 'Hết thiết bị trong khoảng thời gian này';
  }
  if (result.availableUnits === 1) {
    return `Còn 1 máy`;
  }
  return `Còn ${result.availableUnits}/${result.totalUnits} thiết bị`;
}

/**
 * Get simple availability status without date range (for listing page)
 */
export function getDefaultAvailability(productId: string): AvailabilityResult {
  const product = products.find((p) => p.id === productId);
  if (!product) {
    return { totalUnits: 0, bookedUnits: 0, availableUnits: 0 };
  }
  return {
    totalUnits: product.totalUnits,
    bookedUnits: 0,
    availableUnits: product.totalUnits,
  };
}
