/**
 * Date utility functions for the rental system
 */

/**
 * Format a date string to DD/MM/YYYY
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

/**
 * Format date to YYYY-MM-DD for input[type="date"]
 */
export function toInputDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/**
 * Parse a YYYY-MM-DD string to Date
 */
export function parseInputDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Calculate the number of rental days between two dates
 */
export function calculateRentalDays(startDate: Date | string, endDate: Date | string): number {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays);
}

/**
 * Check if two date ranges overlap
 */
export function dateRangesOverlap(
  start1: Date | string,
  end1: Date | string,
  start2: Date | string,
  end2: Date | string
): boolean {
  const s1 = typeof start1 === 'string' ? new Date(start1) : start1;
  const e1 = typeof end1 === 'string' ? new Date(end1) : end1;
  const s2 = typeof start2 === 'string' ? new Date(start2) : start2;
  const e2 = typeof end2 === 'string' ? new Date(end2) : end2;
  return s1 < e2 && s2 < e1;
}

/**
 * Get today's date with time zeroed out
 */
export function getToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

/**
 * Get a future date from today
 */
export function getFutureDate(daysFromNow: number): Date {
  const date = getToday();
  date.setDate(date.getDate() + daysFromNow);
  return date;
}

/**
 * Format a date range as a readable string
 */
export function formatDateRange(startDate: string, endDate: string): string {
  return `${formatDate(startDate)} → ${formatDate(endDate)}`;
}

/**
 * Available pickup/return time slots
 */
export const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00',
];
