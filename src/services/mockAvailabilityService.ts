import { AvailabilityResult } from '@/types/availability';
import { checkMockAvailability } from '@/lib/mockAvailability';
import { mockDelay } from '@/lib/delay';

/**
 * Mock Availability Service
 * Wraps the availability engine with async delay for realistic UX.
 * Replace with real API when backend is ready.
 */

export async function checkAvailability(
  productId: string,
  startDate: string,
  endDate: string
): Promise<AvailabilityResult> {
  await mockDelay(500);
  return checkMockAvailability(productId, startDate, endDate);
}

export async function checkMultipleAvailability(
  productIds: string[],
  startDate: string,
  endDate: string
): Promise<Record<string, AvailabilityResult>> {
  await mockDelay(600);

  const results: Record<string, AvailabilityResult> = {};
  for (const id of productIds) {
    results[id] = checkMockAvailability(id, startDate, endDate);
  }
  return results;
}
