export const SEED_ANCHOR_DATE: Date = new Date('2026-07-01T00:00:00.000Z');

/**
 * Formats a date to YYYY-MM-DD string (UTC)
 * @param date - The date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Gets a relative date by adding/subtracting days from the seed anchor date
 * @param daysOffset - Number of days to offset (can be negative)
 * @returns Date object representing the relative date
 */
export function getRelativeDate(daysOffset: number): Date {
  const time = SEED_ANCHOR_DATE.getTime() + (daysOffset * 24 * 60 * 60 * 1000);
  return new Date(time);
}