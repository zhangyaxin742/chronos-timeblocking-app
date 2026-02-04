'use client';

import { useEffect } from 'react';
import { useChronosStore } from '@/store';
import { cn } from '@/lib/utils';
import { Check, Trash2, RefreshCw, Inbox } from 'lucide-react';
import type { Task } from '@chronos/shared';

export function BacklogPanel() {
  const { 
    backlogTasks, 
    fetchBacklogTasks, 
    toggleTaskComplete, 
    deleteTask,
    rolloverTasks 
  } = useChronosStore();

  useEffect(() => {
    fetchBacklogTasks();
  }, [fetchBacklogTasks]);

  const handleRollover = async () => {
    const count = await rolloverTasks();
    if (count && count > 0) {
      // Could show a toast here
    }
  };

  if (backlogTasks.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Inbox className="w-4 h-4 text-gray-500" />
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Backlog ({backlogTasks.length})
            </h3>
          </div>
          <button
            onClick={handleRollover}
            className="flex items-center gap-1 text-xs text-brand-primary hover:underline"
          >
            <RefreshCw className="w-3 h-3" />
            Check for rollover
          </button>
        </div>
        
        <div className="space-y-2">
          {backlogTasks.slice(0, 5).map((task) => (
            <BacklogTaskItem 
              key={task.id} 
              task={task} 
              onToggle={toggleTaskComplete}
              onDelete={deleteTask}
            />
          ))}
          {backlogTasks.length > 5 && (
            <p className="text-xs text-gray-500 text-center py-1">
              +{backlogTasks.length - 5} more tasks
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

interface BacklogTaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

function BacklogTaskItem({ task, onToggle, onDelete }: BacklogTaskItemProps) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 group">
      <button
        onClick={() => onToggle(task.id)}
        className={cn(
          'w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors',
          task.is_completed
            ? 'bg-green-500 border-green-500'
            : 'border-gray-300 dark:border-gray-600 hover:border-brand-primary'
        )}
      >
        {task.is_completed && <Check className="w-3 h-3 text-white" />}
      </button>
      
      <span
        className={cn(
          'flex-1 text-sm',
          task.is_completed
            ? 'line-through text-gray-400 dark:text-gray-500'
            : 'text-gray-900 dark:text-white'
        )}
      >
        {task.title}
      </span>

      <button
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
      >
        <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
      </button>
    </div>
  );
}
