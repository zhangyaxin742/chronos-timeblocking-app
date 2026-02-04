import { DURATION_PATTERNS, TIME_GRID } from './constants';
import type { ParsedDuration, TimeSlot } from './types';

/**
 * Parse natural language duration input into minutes
 * Accepts formats like: "90 min", "1.5 hours", "1h 30m", "2h", "45m"
 */
export function parseDuration(input: string): ParsedDuration {
  const trimmed = input.trim().toLowerCase();
  
  if (!trimmed) {
    return { minutes: 0, isValid: false, error: 'Duration is required' };
  }

  // Try compound format first (e.g., "1h 30m")
  const compoundMatch = trimmed.match(DURATION_PATTERNS.COMPOUND);
  if (compoundMatch) {
    const hours = parseInt(compoundMatch[1], 10);
    const mins = parseInt(compoundMatch[2], 10);
    const totalMinutes = hours * 60 + mins;
    
    if (totalMinutes < 15) {
      return { minutes: 0, isValid: false, error: 'Minimum duration is 15 minutes' };
    }
    
    return { minutes: totalMinutes, isValid: true };
  }

  // Try simple format (e.g., "90 min", "1.5 hours")
  const simpleMatch = trimmed.match(DURATION_PATTERNS.SIMPLE);
  if (simpleMatch) {
    const value = parseFloat(simpleMatch[1]);
    const unit = simpleMatch[2].toLowerCase();
    
    let minutes: number;
    if (unit.startsWith('h')) {
      minutes = Math.round(value * 60);
    } else {
      minutes = Math.round(value);
    }
    
    if (minutes < 15) {
      return { minutes: 0, isValid: false, error: 'Minimum duration is 15 minutes' };
    }
    
    return { minutes, isValid: true };
  }

  // Try parsing as just a number (assume minutes)
  const numericValue = parseFloat(trimmed);
  if (!isNaN(numericValue) && numericValue >= 15) {
    return { minutes: Math.round(numericValue), isValid: true };
  }

  return { 
    minutes: 0, 
    isValid: false, 
    error: 'Invalid format. Try "90 min", "1.5 hours", or "1h 30m"' 
  };
}

/**
 * Format minutes into a human-readable duration string
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
}

/**
 * Format time string (HH:MM) to display format
 */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  
  if (minutes === 0) {
    return `${displayHours} ${period}`;
  }
  
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Generate time slots for the day view
 */
export function generateTimeSlots(startHour: number, endHour: number): TimeSlot[] {
  const slots: TimeSlot[] = [];
  
  for (let hour = startHour; hour <= endHour; hour++) {
    for (let quarter = 0; quarter < TIME_GRID.SLOTS_PER_HOUR; quarter++) {
      const minute = quarter * 15;
      slots.push({
        hour,
        minute,
        label: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
      });
    }
  }
  
  return slots;
}

/**
 * Convert time string to slot index
 */
export function timeToSlotIndex(time: string, startHour: number): number {
  const [hours, minutes] = time.split(':').map(Number);
  const hourOffset = hours - startHour;
  const quarterOffset = Math.floor(minutes / 15);
  return hourOffset * TIME_GRID.SLOTS_PER_HOUR + quarterOffset;
}

/**
 * Convert slot index to time string
 */
export function slotIndexToTime(index: number, startHour: number): string {
  const totalMinutes = index * 15;
  const hours = startHour + Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Calculate timeblock height in pixels based on duration
 */
export function calculateTimeblockHeight(durationMinutes: number): number {
  const slots = durationMinutes / 15;
  return slots * TIME_GRID.SLOT_HEIGHT;
}

/**
 * Calculate timeblock top position based on start time
 */
export function calculateTimeblockTop(startTime: string, startHour: number): number {
  const slotIndex = timeToSlotIndex(startTime, startHour);
  return slotIndex * TIME_GRID.SLOT_HEIGHT;
}

/**
 * Snap minutes to nearest 15-minute increment
 */
export function snapToGrid(minutes: number): number {
  return Math.round(minutes / 15) * 15;
}

/**
 * Format date to YYYY-MM-DD
 */
export function formatDateToISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayISO(): string {
  return formatDateToISO(new Date());
}

/**
 * Add days to a date string
 */
export function addDays(dateStr: string, days: number): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return formatDateToISO(date);
}

/**
 * Check if two time ranges overlap
 */
export function doTimesOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  return start1 < end2 && start2 < end1;
}

/**
 * Generate a color with opacity for timeblock fill
 */
export function getTimeblockFillColor(hexColor: string, opacity: number = 0.2): string {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Format date for display (e.g., "Mon, Feb 2")
 */
export function formatDateDisplay(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Check if a date is today
 */
export function isToday(dateStr: string): boolean {
  return dateStr === getTodayISO();
}

/**
 * Debounce function for auto-save
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
