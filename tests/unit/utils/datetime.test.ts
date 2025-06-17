import {
  getLocaleDateTimeString,
  getLocaleDateString,
  getLocaleTimeString,
  getDateDayName,
  formatTimeNumberHours,
  isDateInPast,
} from '../../../src/utils/datetime';

describe('DateTime Utilities', () => {
  const testDate = new Date('2024-04-15T14:30:00Z');
  const timezone = 'America/Edmonton';

  describe('getLocaleDateTimeString', () => {
    it('should return localized date time string', () => {
      const result = getLocaleDateTimeString(testDate, timezone);
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toMatch(/\d{4}-\d{2}-\d{2}/); // Contains date
    });
  });

  describe('getLocaleDateString', () => {
    it('should return date in YYYY-MM-DD format', () => {
      const result = getLocaleDateString(testDate, timezone);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should handle different timezones', () => {
      const utcResult = getLocaleDateString(testDate, 'UTC');
      const edmontonResult = getLocaleDateString(testDate, 'America/Edmonton');
      
      expect(utcResult).toBeDefined();
      expect(edmontonResult).toBeDefined();
    });
  });

  describe('getLocaleTimeString', () => {
    it('should return time string', () => {
      const result = getLocaleTimeString(testDate, timezone);
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toMatch(/\d{1,2}:\d{2}/); // Contains time
    });
  });

  describe('getDateDayName', () => {
    it('should return day name', () => {
      const result = getDateDayName(testDate, timezone);
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])
        .toContain(result);
    });
  });

  describe('formatTimeNumberHours', () => {
    it('should format whole hours correctly', () => {
      expect(formatTimeNumberHours(9)).toBe('09:00');
      expect(formatTimeNumberHours(14)).toBe('14:00');
    });

    it('should format fractional hours correctly', () => {
      expect(formatTimeNumberHours(9.5)).toBe('09:30');
      expect(formatTimeNumberHours(14.25)).toBe('14:15');
      expect(formatTimeNumberHours(18.75)).toBe('18:45');
    });

    it('should pad with zeros when needed', () => {
      expect(formatTimeNumberHours(5)).toBe('05:00');
      expect(formatTimeNumberHours(0.25)).toBe('00:15');
    });
  });

  describe('isDateInPast', () => {
    beforeEach(() => {
      // Mock the current date to be consistent
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-04-15'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return true for past dates', () => {
      expect(isDateInPast('2024-04-14', timezone)).toBe(true);
      expect(isDateInPast('2024-03-15', timezone)).toBe(true);
    });

    it('should return false for future dates', () => {
      expect(isDateInPast('2024-04-16', timezone)).toBe(false);
      expect(isDateInPast('2024-05-15', timezone)).toBe(false);
    });

    it('should return false for today', () => {
      expect(isDateInPast('2024-04-15', timezone)).toBe(false);
    });
  });
}); 