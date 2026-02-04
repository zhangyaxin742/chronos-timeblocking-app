'use client';

import { useEffect } from 'react';
import { useChronosStore } from '@/store';
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
    <div style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)' }}>
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Inbox className="w-4 h-4" style={{ color: 'var(--text-muted)' }} strokeWidth={1.5} />
            <h3 
              className="text-xs font-medium uppercase tracking-wider"
              style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}
            >
              Backlog ({backlogTasks.length})
            </h3>
          </div>
          <button
            onClick={handleRollover}
            className="flex items-center gap-1 text-xs transition-colors"
            style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
          >
            <RefreshCw className="w-3 h-3" strokeWidth={1.5} />
            Check rollover
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
            <p 
              className="text-xs text-center py-1"
              style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
            >
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
    <div 
      className="flex items-center gap-3 p-3 group"
      style={{ 
        backgroundColor: 'var(--bg-tertiary)', 
        borderRadius: '2px',
        border: '1px solid var(--border-subtle)'
      }}
    >
      <button
        onClick={() => onToggle(task.id)}
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
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 p-1 transition-all"
        style={{ borderRadius: '2px' }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-elevated)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        <Trash2 className="w-4 h-4" style={{ color: 'var(--text-muted)' }} strokeWidth={1.5} />
      </button>
    </div>
  );
}
