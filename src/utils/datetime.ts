/**
 * Date and time utility functions
 */

/**
 * Get localized date and time string
 */
export function getLocaleDateTimeString(date: Date, timeZone: string): string {
  return date.toLocaleString('en-CA', { timeZone });
}

/**
 * Get localized date string (YYYY-MM-DD format)
 */
export function getLocaleDateString(date: Date, timeZone: string): string {
  return date.toLocaleDateString('en-CA', { timeZone });
}

/**
 * Get localized time string
 */
export function getLocaleTimeString(date: Date, timeZone: string): string {
  return date.toLocaleTimeString('en-CA', { timeZone });
}

/**
 * Get day name for a date
 */
export function getDateDayName(date: Date, timeZone: string): string {
  return date.toLocaleString('en-CA', { timeZone, weekday: 'long' });
}

/**
 * Format time number in hours to HH:MM format
 */
export function formatTimeNumberHours(timeNumberHrs: number): string {
  const h = Math.floor(timeNumberHrs); // get integer part
  const m = Math.round((timeNumberHrs - h) * 60); // convert fractional part to minutes

  // pad with zeros if needed
  const hh = String(h).padStart(2, '0');
  const mm = String(m).padStart(2, '0');

  return `${hh}:${mm}`;
}

/**
 * Check if a date is in the past
 */
export function isDateInPast(targetDate: string, timezone: string): boolean {
  const [currentYear, currentMonth, currentDay] = getLocaleDateString(
    new Date(),
    timezone
  ).split('-');
  const [targetYear, targetMonth, targetDay] = targetDate.split('-');
  
  const current = new Date(
    parseInt(currentYear, 10),
    parseInt(currentMonth, 10) - 1,
    parseInt(currentDay, 10)
  );
  const target = new Date(
    parseInt(targetYear, 10),
    parseInt(targetMonth, 10) - 1,
    parseInt(targetDay, 10)
  );
  
  return target.getTime() < current.getTime();
} 