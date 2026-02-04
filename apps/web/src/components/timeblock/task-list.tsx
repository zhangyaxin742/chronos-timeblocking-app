'use client';

import { useChronosStore } from '@/store';
import { Check, Trash2 } from 'lucide-react';
import type { Task } from '@chronos/shared';

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  const { toggleTaskComplete, deleteTask } = useChronosStore();

  if (tasks.length === 0) {
    return (
      <p 
        className="text-sm"
        style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
      >
        No tasks yet
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center gap-3 group py-1"
          style={{ borderBottom: '1px solid var(--border-subtle)' }}
        >
          <button
            onClick={() => toggleTaskComplete(task.id)}
            className="w-4 h-4 flex items-center justify-center flex-shrink-0 transition-colors"
            style={{
              border: `1px solid ${task.is_completed ? 'var(--text-tertiary)' : 'var(--border-strong)'}`,
              borderRadius: '2px',
              backgroundColor: task.is_completed ? 'var(--text-tertiary)' : 'transparent',
            }}
          >
            {task.is_completed && <Check className="w-2.5 h-2.5" style={{ color: 'var(--bg-primary)' }} />}
          </button>
          
          <span
            className="flex-1 text-sm"
            style={{ 
              fontFamily: 'var(--font-mono)',
              color: task.is_completed ? 'var(--text-muted)' : 'var(--text-primary)',
              textDecoration: task.is_completed ? 'line-through' : 'none'
            }}
          >
            {task.title}
          </span>

          <button
            onClick={() => deleteTask(task.id)}
            className="opacity-0 group-hover:opacity-100 p-1 transition-all"
            style={{ borderRadius: '2px' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Trash2 className="w-4 h-4" style={{ color: 'var(--text-muted)' }} strokeWidth={1.5} />
          </button>
        </div>
      ))}
    </div>
  );
}
