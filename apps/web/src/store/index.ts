import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import type { Category, Timeblock, Task, Profile } from '@chronos/shared';

interface ChronosState {
  // User
  user: Profile | null;
  isLoading: boolean;
  
  // Date navigation
  selectedDate: string;
  
  // Categories
  categories: Category[];
  
  // Timeblocks
  timeblocks: Timeblock[];
  selectedTimeblock: Timeblock | null;
  
  // Tasks
  tasks: Task[];
  backlogTasks: Task[];
  
  // UI State
  isCreatingTimeblock: boolean;
  isEditingTimeblock: boolean;
  showOnboarding: boolean;
  
  // Actions
  setUser: (user: Profile | null) => void;
  setSelectedDate: (date: string) => void;
  setCategories: (categories: Category[]) => void;
  setTimeblocks: (timeblocks: Timeblock[]) => void;
  setSelectedTimeblock: (timeblock: Timeblock | null) => void;
  setTasks: (tasks: Task[]) => void;
  setBacklogTasks: (tasks: Task[]) => void;
  setIsCreatingTimeblock: (value: boolean) => void;
  setIsEditingTimeblock: (value: boolean) => void;
  setShowOnboarding: (value: boolean) => void;
  
  // Data fetching
  fetchCategories: () => Promise<void>;
  fetchTimeblocks: (date: string) => Promise<void>;
  fetchTasks: (timeblockId?: string) => Promise<void>;
  fetchBacklogTasks: () => Promise<void>;
  
  // CRUD operations
  createCategory: (data: Partial<Category>) => Promise<Category | null>;
  updateCategory: (id: string, data: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  
  createTimeblock: (data: Partial<Timeblock>) => Promise<Timeblock | null>;
  updateTimeblock: (id: string, data: Partial<Timeblock>) => Promise<void>;
  deleteTimeblock: (id: string) => Promise<void>;
  
  createTask: (data: Partial<Task>) => Promise<Task | null>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskComplete: (id: string) => Promise<void>;
  rolloverTasks: () => Promise<number | undefined>;
  
  // Edge function helpers
  duplicateTimeblock: (timeblockId: string, targetDate: string, targetTime: string, includeTasks?: boolean) => Promise<Timeblock | null>;
  exportData: () => Promise<any>;
}

const getTodayISO = () => new Date().toISOString().split('T')[0];

export const useChronosStore = create<ChronosState>((set, get) => ({
  // Initial state
  user: null,
  isLoading: true,
  selectedDate: getTodayISO(),
  categories: [],
  timeblocks: [],
  selectedTimeblock: null,
  tasks: [],
  backlogTasks: [],
  isCreatingTimeblock: false,
  isEditingTimeblock: false,
  showOnboarding: false,
  
  // Setters
  setUser: (user) => set({ user }),
  setSelectedDate: (date) => {
    set({ selectedDate: date });
    get().fetchTimeblocks(date);
  },
  setCategories: (categories) => set({ categories }),
  setTimeblocks: (timeblocks) => set({ timeblocks }),
  setSelectedTimeblock: (timeblock) => set({ selectedTimeblock: timeblock }),
  setTasks: (tasks) => set({ tasks }),
  setBacklogTasks: (tasks) => set({ backlogTasks: tasks }),
  setIsCreatingTimeblock: (value) => set({ isCreatingTimeblock: value }),
  setIsEditingTimeblock: (value) => set({ isEditingTimeblock: value }),
  setShowOnboarding: (value) => set({ showOnboarding: value }),
  
  // Fetch categories
  fetchCategories: async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_archived', false)
      .order('sort_order');
    
    if (!error && data) {
      set({ categories: data });
    }
  },
  
  // Fetch timeblocks for a specific date
  fetchTimeblocks: async (date: string) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('timeblocks')
      .select(`
        *,
        category:categories(*),
        tasks(*)
      `)
      .eq('date', date)
      .order('start_time');
    
    if (!error && data) {
      set({ timeblocks: data });
    }
  },
  
  // Fetch tasks
  fetchTasks: async (timeblockId?: string) => {
    const supabase = createClient();
    let query = supabase.from('tasks').select('*');
    
    if (timeblockId) {
      query = query.eq('timeblock_id', timeblockId);
    }
    
    const { data, error } = await query.order('sort_order');
    
    if (!error && data) {
      set({ tasks: data });
    }
  },
  
  // Fetch backlog tasks (tasks without timeblock)
  fetchBacklogTasks: async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .is('timeblock_id', null)
      .eq('is_completed', false)
      .order('sort_order');
    
    if (!error && data) {
      set({ backlogTasks: data });
    }
  },
  
  // Category CRUD
  createCategory: async (data) => {
    const supabase = createClient();
    const { data: category, error } = await supabase
      .from('categories')
      .insert(data)
      .select()
      .single();
    
    if (!error && category) {
      set({ categories: [...get().categories, category] });
      return category;
    }
    return null;
  },
  
  updateCategory: async (id, data) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('categories')
      .update(data)
      .eq('id', id);
    
    if (!error) {
      set({
        categories: get().categories.map((c) =>
          c.id === id ? { ...c, ...data } : c
        ),
      });
    }
  },
  
  deleteCategory: async (id) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (!error) {
      set({ categories: get().categories.filter((c) => c.id !== id) });
    }
  },
  
  // Timeblock CRUD
  createTimeblock: async (data) => {
    const supabase = createClient();
    const { data: timeblock, error } = await supabase
      .from('timeblocks')
      .insert(data)
      .select(`
        *,
        category:categories(*)
      `)
      .single();
    
    if (!error && timeblock) {
      set({ timeblocks: [...get().timeblocks, timeblock] });
      return timeblock;
    }
    return null;
  },
  
  updateTimeblock: async (id, data) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('timeblocks')
      .update(data)
      .eq('id', id);
    
    if (!error) {
      set({
        timeblocks: get().timeblocks.map((t) =>
          t.id === id ? { ...t, ...data } : t
        ),
      });
    }
  },
  
  deleteTimeblock: async (id) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('timeblocks')
      .delete()
      .eq('id', id);
    
    if (!error) {
      set({ timeblocks: get().timeblocks.filter((t) => t.id !== id) });
    }
  },
  
  // Task CRUD
  createTask: async (data) => {
    const supabase = createClient();
    const { data: task, error } = await supabase
      .from('tasks')
      .insert(data)
      .select()
      .single();
    
    if (!error && task) {
      if (task.timeblock_id) {
        // Refresh timeblocks to get updated tasks
        get().fetchTimeblocks(get().selectedDate);
      } else {
        set({ backlogTasks: [...get().backlogTasks, task] });
      }
      return task;
    }
    return null;
  },
  
  updateTask: async (id, data) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('tasks')
      .update(data)
      .eq('id', id);
    
    if (!error) {
      get().fetchTimeblocks(get().selectedDate);
      get().fetchBacklogTasks();
    }
  },
  
  deleteTask: async (id) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (!error) {
      get().fetchTimeblocks(get().selectedDate);
      get().fetchBacklogTasks();
    }
  },
  
  rolloverTasks: async () => {
    const supabase = createClient();
    const { data, error } = await supabase.functions.invoke('rollover-tasks');

    if (error) {
      console.error('Failed to rollover tasks:', error);
      return undefined;
    }

    // Refresh data
    get().fetchBacklogTasks();
    get().fetchTimeblocks(get().selectedDate);

    return data?.rolled_over || 0;
  },

  toggleTaskComplete: async (id) => {
    const allTasks = [...get().tasks, ...get().backlogTasks];
    const task = allTasks.find((t) => t.id === id);
    
    if (task) {
      const supabase = createClient();
      const { error } = await supabase
        .from('tasks')
        .update({
          is_completed: !task.is_completed,
          completed_at: !task.is_completed ? new Date().toISOString() : null,
        })
        .eq('id', id);
      
      if (!error) {
        get().fetchTimeblocks(get().selectedDate);
        get().fetchBacklogTasks();
      }
    }
  },

  // Edge function: Duplicate a timeblock to a new date/time
  duplicateTimeblock: async (timeblockId, targetDate, targetTime, includeTasks = true) => {
    const supabase = createClient();
    const { data, error } = await supabase.functions.invoke('duplicate-timeblock', {
      body: {
        timeblock_id: timeblockId,
        target_date: targetDate,
        target_time: targetTime,
        include_tasks: includeTasks,
      },
    });

    if (error) {
      console.error('Failed to duplicate timeblock:', error);
      return null;
    }

    // Refresh timeblocks if duplicated to current date
    if (targetDate === get().selectedDate) {
      get().fetchTimeblocks(get().selectedDate);
    }

    return data?.timeblock || null;
  },

  // Edge function: Export all user data
  exportData: async () => {
    const supabase = createClient();
    const { data, error } = await supabase.functions.invoke('export-data');

    if (error) {
      console.error('Failed to export data:', error);
      return null;
    }

    return data;
  },
}));
