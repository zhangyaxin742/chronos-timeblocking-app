import type { CategoryColor, UserPreferences } from './types';

// Category color palette from PRD
export const CATEGORY_COLORS: CategoryColor[] = [
  { name: 'Blue', hex: '#4A90E2', rgba: 'rgba(74, 144, 226, 0.2)' },
  { name: 'Green', hex: '#7ED321', rgba: 'rgba(126, 211, 33, 0.2)' },
  { name: 'Red', hex: '#E74C3C', rgba: 'rgba(231, 76, 60, 0.2)' },
  { name: 'Purple', hex: '#9B59B6', rgba: 'rgba(155, 89, 182, 0.2)' },
  { name: 'Yellow', hex: '#F1C40F', rgba: 'rgba(241, 196, 15, 0.2)' },
  { name: 'Orange', hex: '#E67E22', rgba: 'rgba(230, 126, 34, 0.2)' },
];

// Default categories created on signup
export const DEFAULT_CATEGORIES = [
  { name: 'Work', color: '#4A90E2', emoji: '💼' },
  { name: 'Personal', color: '#7ED321', emoji: '🏠' },
  { name: 'Focus', color: '#9B59B6', emoji: '🎯' },
  { name: 'Health', color: '#E74C3C', emoji: '❤️' },
];

// Time grid configuration
export const TIME_GRID = {
  SLOT_HEIGHT: 60, // pixels per 15-minute slot
  SLOTS_PER_HOUR: 4,
  MIN_TIMEBLOCK_SLOTS: 1, // minimum 15 minutes
  TIME_AXIS_WIDTH: 60, // pixels
  DEFAULT_START_HOUR: 6,
  DEFAULT_END_HOUR: 23,
};

// Duration parsing patterns
export const DURATION_PATTERNS = {
  SIMPLE: /^(\d+\.?\d*)\s*(h|hr|hrs|hour|hours|m|min|mins|minute|minutes)$/i,
  COMPOUND: /^(\d+)\s*h\s*(\d+)\s*m$/i,
};

// Default user preferences
export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  start_of_week: 'monday',
  day_start_hour: 6,
  day_end_hour: 23,
  default_duration_minutes: 60,
};

// Animation durations (ms)
export const ANIMATIONS = {
  MODAL: 200,
  TIMEBLOCK_APPEAR: 150,
  TIMEBLOCK_DELETE: 200,
  TASK_CHECK: 300,
  DAY_TRANSITION: 250,
  THEME_TOGGLE: 200,
};

// Validation limits
export const LIMITS = {
  CATEGORY_NAME_MAX: 20,
  TASK_TITLE_MAX: 100,
  TASK_DESCRIPTION_MAX: 500,
  TIMEBLOCK_TITLE_MAX: 100,
  MAX_CATEGORIES: 12,
  UNDO_TOAST_DURATION: 5000,
};

// Priority colors
export const PRIORITY_COLORS = {
  none: 'transparent',
  low: '#3B82F6',
  medium: '#F59E0B',
  high: '#EF4444',
};

// Semantic colors
export const SEMANTIC_COLORS = {
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
};

// Brand colors
export const BRAND_COLORS = {
  primary: '#4A90E2',
  primaryDark: '#357ABD',
  primaryLight: '#A8D0F7',
};
