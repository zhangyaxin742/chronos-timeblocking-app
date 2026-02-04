// User Profile
export interface Profile {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  timezone: string;
  preferences: UserPreferences;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  start_of_week: 'sunday' | 'monday';
  day_start_hour: number;
  day_end_hour: number;
  default_duration_minutes: number;
}

// Category
export interface Category {
  id: string;
  user_id: string;
  name: string;
  color: string;
  emoji: string | null;
  sort_order: number;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export type CategoryColor = {
  name: string;
  hex: string;
  rgba: string;
};

// Timeblock
export interface Timeblock {
  id: string;
  user_id: string;
  category_id: string | null;
  title: string | null;
  date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  status: TimeblockStatus;
  created_at: string;
  updated_at: string;
  category?: Category;
  tasks?: Task[];
}

export type TimeblockStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export interface CreateTimeblockInput {
  category_id?: string;
  title?: string;
  date: string;
  start_time: string;
  end_time: string;
}

export interface UpdateTimeblockInput {
  category_id?: string;
  title?: string;
  date?: string;
  start_time?: string;
  end_time?: string;
  status?: TimeblockStatus;
}

// Task
export interface Task {
  id: string;
  user_id: string;
  timeblock_id: string | null;
  category_id: string | null;
  title: string;
  description: string | null;
  priority: TaskPriority;
  due_date: string | null;
  estimated_minutes: number | null;
  is_completed: boolean;
  completed_at: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type TaskPriority = 'none' | 'low' | 'medium' | 'high';

export interface CreateTaskInput {
  timeblock_id?: string;
  category_id?: string;
  title: string;
  description?: string;
  priority?: TaskPriority;
  due_date?: string;
  estimated_minutes?: number;
}

export interface UpdateTaskInput {
  timeblock_id?: string;
  category_id?: string;
  title?: string;
  description?: string;
  priority?: TaskPriority;
  due_date?: string;
  estimated_minutes?: number;
  is_completed?: boolean;
  sort_order?: number;
}

// API Response types
export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}

export interface ApiError {
  message: string;
  code?: string;
}

// Duration parsing
export interface ParsedDuration {
  minutes: number;
  isValid: boolean;
  error?: string;
}

// Time grid
export interface TimeSlot {
  hour: number;
  minute: number;
  label: string;
}

// Drag and drop
export interface DragState {
  isDragging: boolean;
  draggedItem: Timeblock | Task | null;
  dragType: 'timeblock' | 'task' | null;
  startPosition: { x: number; y: number } | null;
  currentPosition: { x: number; y: number } | null;
}
