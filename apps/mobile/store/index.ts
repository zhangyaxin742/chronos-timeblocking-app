import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Category, Timeblock, Task, Profile } from '@chronos/shared';

interface ChronosState {
  user: Profile | null;
  isLoading: boolean;
  selectedDate: string;
  categories: Category[];
  timeblocks: Timeblock[];
  selectedTimeblock: Timeblock | null;
  tasks: Task[];
  backlogTasks: Task[];
  isCreatingTimeblock: boolean;
  isEditingTimeblock: boolean;
  showOnboarding: boolean;

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

  fetchCategories: () => Promise<void>;
  fetchTimeblocks: (date: string) => Promise<void>;
  fetchTasks: (timeblockId?: string) => Promise<void>;
  fetchBacklogTasks: () => Promise<void>;

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

  duplicateTimeblock: (timeblockId: string, targetDate: string, targetTime: string, includeTasks?: boolean) => Promise<Timeblock | null>;
  exportData: () => Promise<any>;
}

const getTodayISO = () => new Date().toISOString().split('T')[0];

export const useChronosStore = create<ChronosState>((set, get) => ({
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

  fetchCategories: async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order');
    if (data) set({ categories: data });
  },

  fetchTimeblocks: async (date) => {
    const { data } = await supabase
      .from('timeblocks')
      .select(`
        *,
        category:categories(*),
        tasks(*)
      `)
      .eq('date', date)
      .order('start_time');
    if (data) set({ timeblocks: data });
  },

  fetchTasks: async (timeblockId) => {
    const query = supabase.from('tasks').select('*');
    if (timeblockId) query.eq('timeblock_id', timeblockId);
    const { data } = await query.order('sort_order');
    if (data) set({ tasks: data });
  },

  fetchBacklogTasks: async () => {
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .is('timeblock_id', null)
      .eq('is_completed', false)
      .order('created_at', { ascending: false });
    if (data) set({ backlogTasks: data });
  },

  createCategory: async (data) => {
    const { data: category, error } = await supabase
      .from('categories')
      .insert(data)
      .select()
      .single();
    if (!error && category) {
      get().fetchCategories();
      return category;
    }
    return null;
  },

  updateCategory: async (id, data) => {
    const { error } = await supabase
      .from('categories')
      .update(data)
      .eq('id', id);
    if (!error) get().fetchCategories();
  },

  deleteCategory: async (id) => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    if (!error) get().fetchCategories();
  },

  createTimeblock: async (data) => {
    const { data: timeblock, error } = await supabase
      .from('timeblocks')
      .insert(data)
      .select()
      .single();
    if (!error && timeblock) {
      get().fetchTimeblocks(get().selectedDate);
      return timeblock;
    }
    return null;
  },

  updateTimeblock: async (id, data) => {
    const { error } = await supabase
      .from('timeblocks')
      .update(data)
      .eq('id', id);
    if (!error) get().fetchTimeblocks(get().selectedDate);
  },

  deleteTimeblock: async (id) => {
    const { error } = await supabase
      .from('timeblocks')
      .delete()
      .eq('id', id);
    if (!error) get().fetchTimeblocks(get().selectedDate);
  },

  createTask: async (data) => {
    const { data: task, error } = await supabase
      .from('tasks')
      .insert(data)
      .select()
      .single();
    if (!error && task) {
      if (task.timeblock_id) {
        get().fetchTimeblocks(get().selectedDate);
      } else {
        get().fetchBacklogTasks();
      }
      return task;
    }
    return null;
  },

  updateTask: async (id, data) => {
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
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    if (!error) {
      get().fetchTimeblocks(get().selectedDate);
      get().fetchBacklogTasks();
    }
  },

  toggleTaskComplete: async (id) => {
    const allTasks = [...get().tasks, ...get().backlogTasks];
    const task = allTasks.find((t) => t.id === id);
    if (task) {
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

  rolloverTasks: async () => {
    const { data, error } = await supabase.functions.invoke('rollover-tasks');
    if (error) {
      console.error('Failed to rollover tasks:', error);
      return undefined;
    }
    get().fetchBacklogTasks();
    get().fetchTimeblocks(get().selectedDate);
    return data?.rolled_over || 0;
  },

  duplicateTimeblock: async (timeblockId, targetDate, targetTime, includeTasks = true) => {
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
    if (targetDate === get().selectedDate) {
      get().fetchTimeblocks(get().selectedDate);
    }
    return data?.timeblock || null;
  },

  exportData: async () => {
    const { data, error } = await supabase.functions.invoke('export-data');
    if (error) {
      console.error('Failed to export data:', error);
      return null;
    }
    return data;
  },
}));
