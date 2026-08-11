import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { isOverdue } from './dates';

describe('isOverdue', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-11T09:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('is not overdue with no due date', () => {
    expect(isOverdue(undefined)).toBe(false);
  });

  it('is not overdue when due today', () => {
    expect(isOverdue('2026-08-11')).toBe(false);
  });

  it('is not overdue when due in the future', () => {
    expect(isOverdue('2026-08-12')).toBe(false);
  });

  it('is overdue when due date has passed', () => {
    expect(isOverdue('2026-08-10')).toBe(true);
  });
});
