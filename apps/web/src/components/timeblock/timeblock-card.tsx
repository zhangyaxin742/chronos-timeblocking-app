'use client';

import { useChronosStore } from '@/store';
import { TIME_GRID, formatTime } from '@chronos/shared';
import type { Timeblock } from '@chronos/shared';
import { Check } from 'lucide-react';

interface TimeblockCardProps {
  timeblock: Timeblock;
  startHour: number;
}

// Get border style based on category name for monochrome distinction
function getCategoryBorderStyle(categoryName?: string): string {
  const name = categoryName?.toLowerCase() || '';
  if (name.includes('work')) return 'solid';
  if (name.includes('personal')) return 'dashed';
  if (name.includes('focus')) return 'double';
  if (name.includes('health')) return 'dotted';
  return 'solid';
}

export function TimeblockCard({ timeblock, startHour }: TimeblockCardProps) {
  const { setSelectedTimeblock, toggleTaskComplete } = useChronosStore();

  // Calculate position and height
  const [startHours, startMinutes] = timeblock.start_time.split(':').map(Number);
  const startSlot = (startHours - startHour) * 4 + Math.floor(startMinutes / 15);
  const top = startSlot * TIME_GRID.SLOT_HEIGHT;
  const height = (timeblock.duration_minutes / 15) * TIME_GRID.SLOT_HEIGHT;

  const handleClick = () => {
    setSelectedTimeblock(timeblock);
  };

  const handleTaskToggle = (e: React.MouseEvent, taskId: string) => {
    e.stopPropagation();
    toggleTaskComplete(taskId);
  };

  const borderStyle = getCategoryBorderStyle(timeblock.category?.name);

  return (
    <div
      onClick={handleClick}
      className="absolute left-[60px] right-4 mx-1 cursor-pointer transition-all duration-150"
      style={{
        top,
        height: Math.max(height, TIME_GRID.SLOT_HEIGHT),
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid var(--border-default)',
        borderLeft: `3px ${borderStyle} var(--text-tertiary)`,
        borderRadius: '2px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
        e.currentTarget.style.borderColor = 'var(--border-strong)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
        e.currentTarget.style.borderColor = 'var(--border-default)';
      }}
    >
      <div className="p-3 h-full overflow-hidden">
        {/* Title */}
        <div
          className="font-medium text-sm truncate"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}
        >
          {timeblock.title || timeblock.category?.name || 'Untitled'}
        </div>

        {/* Time */}
        <div 
          className="text-xs mt-0.5"
          style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}
        >
          {formatTime(timeblock.start_time)} - {formatTime(timeblock.end_time)}
        </div>

        {/* Category label */}
        {timeblock.category?.name && (
          <div 
            className="text-xs mt-1 uppercase tracking-wider"
            style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.6rem' }}
          >
            {timeblock.category.name}
          </div>
        )}

        {/* Tasks (if space allows) */}
        {height >= 120 && timeblock.tasks && timeblock.tasks.length > 0 && (
          <div className="mt-3 space-y-1.5">
            {timeblock.tasks.slice(0, 3).map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-2 text-xs cursor-pointer"
                onClick={(e) => handleTaskToggle(e, task.id)}
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                <div
                  className="w-4 h-4 flex items-center justify-center flex-shrink-0"
                  style={{
                    border: `1px solid ${task.is_completed ? 'var(--text-tertiary)' : 'var(--border-strong)'}`,
                    borderRadius: '2px',
                    background: task.is_completed ? 'var(--text-tertiary)' : 'transparent',
                  }}
                >
                  {task.is_completed && <Check className="w-2.5 h-2.5" style={{ color: 'var(--bg-primary)' }} />}
                </div>
                <span
                  style={{ 
                    color: task.is_completed ? 'var(--text-muted)' : 'var(--text-secondary)',
                    textDecoration: task.is_completed ? 'line-through' : 'none'
                  }}
                  className="truncate"
                >
                  {task.title}
                </span>
              </div>
            ))}
            {timeblock.tasks.length > 3 && (
              <div 
                className="text-xs"
                style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
              >
                +{timeblock.tasks.length - 3} more
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
