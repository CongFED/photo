import { PricingResult } from '@/types/booking';
import { calculateRentalDays } from './date';

/**
 * Discount tiers for rental duration
 */
const DISCOUNT_TIERS = [
  { minDays: 7, discountPercent: 20 },
  { minDays: 5, discountPercent: 15 },
  { minDays: 3, discountPercent: 10 },
];

/**
 * Get the discount percentage for a given number of rental days
 */
export function getDiscountPercent(rentalDays: number): number {
  for (const tier of DISCOUNT_TIERS) {
    if (rentalDays >= tier.minDays) {
      return tier.discountPercent;
    }
  }
  return 0;
}

/**
 * Calculate the full rental price breakdown
 * 
 * @param pricePerDay - Price per day for one unit
 * @param startDate - Rental start date
 * @param endDate - Rental end date
 * @param deposit - Deposit amount
 * @param quantity - Number of units
 */
export function calculateRentalPrice(
  pricePerDay: number,
  startDate: Date | string,
  endDate: Date | string,
  deposit: number = 0,
  quantity: number = 1
): PricingResult {
  const rentalDays = calculateRentalDays(startDate, endDate);
  const subtotal = pricePerDay * rentalDays * quantity;
  const discountPercent = getDiscountPercent(rentalDays);
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const total = subtotal - discountAmount;

  return {
    rentalDays,
    subtotal,
    discountPercent,
    discountAmount,
    total,
    deposit: deposit * quantity,
  };
}
