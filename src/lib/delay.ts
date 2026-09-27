/**
 * Simulate async delay for mock services
 * Makes demo feel like a real app with loading states
 */
export function mockDelay(ms: number = 700): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Random delay between min and max milliseconds
 */
export function randomDelay(min: number = 400, max: number = 1200): Promise<void> {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return mockDelay(ms);
}
