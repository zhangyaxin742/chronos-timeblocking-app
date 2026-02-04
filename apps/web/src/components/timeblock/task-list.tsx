'use client';

import { useChronosStore } from '@/store';
import { cn } from '@/lib/utils';
import { Check, Trash2 } from 'lucide-react';
import type { Task } from '@chronos/shared';

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  const { toggleTaskComplete, deleteTask } = useChronosStore();

  if (tasks.length === 0) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400 italic">
        No tasks yet
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center gap-3 group"
        >
          <button
            onClick={() => toggleTaskComplete(task.id)}
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
            onClick={() => deleteTask(task.id)}
            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
          >
            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
          </button>
        </div>
      ))}
    </div>
  );
}
