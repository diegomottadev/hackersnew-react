import { describe, it, expect } from 'vitest';
import { formatNumber, formatRelativeTime } from './format';

describe('formatNumber', () => {
  it('adds thousands separators', () => {
    expect(formatNumber(1234567)).toBe('1,234,567');
  });

  it('shows 0 for missing values', () => {
    expect(formatNumber(null)).toBe('0');
    expect(formatNumber(undefined)).toBe('0');
  });
});

describe('formatRelativeTime', () => {
  const now = Date.parse('2026-10-05T12:00:00Z');

  it('uses the biggest unit that fits', () => {
    expect(formatRelativeTime('2026-10-02T12:00:00Z', now)).toBe('3 days ago');
    expect(formatRelativeTime('2026-10-05T10:00:00Z', now)).toBe('2 hours ago');
    expect(formatRelativeTime('2019-10-05T12:00:00Z', now)).toBe('7 years ago');
  });

  it('says "just now" under a minute', () => {
    expect(formatRelativeTime('2026-10-05T11:59:30Z', now)).toBe('just now');
  });

  it('returns null for a missing or invalid date', () => {
    expect(formatRelativeTime(null, now)).toBeNull();
    expect(formatRelativeTime('yesterday-ish', now)).toBeNull();
  });
});
