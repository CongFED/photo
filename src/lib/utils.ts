/**
 * Format a number as Vietnamese currency (VND)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
}

/**
 * Generate a random booking code
 * Format: THC-YYYYMMDD-XXXX
 */
export function generateBookingCode(): string {
  const now = new Date();
  const dateStr = now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `THC-${dateStr}-${code}`;
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Pluralize a Vietnamese unit (simple version)
 */
export function pluralize(count: number, singular: string): string {
  return `${count} ${singular}`;
}

/**
 * Get initials from a full name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * cn utility for conditional classnames
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
