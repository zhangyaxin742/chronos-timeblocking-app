'use client';

import { useChronosStore } from '@/store';
import { cn } from '@/lib/utils';
import { TIME_GRID, formatTime, getTimeblockFillColor } from '@chronos/shared';
import type { Timeblock } from '@chronos/shared';
import { Check } from 'lucide-react';

interface TimeblockCardProps {
  timeblock: Timeblock;
  startHour: number;
}

export function TimeblockCard({ timeblock, startHour }: TimeblockCardProps) {
  const { setSelectedTimeblock, toggleTaskComplete } = useChronosStore();

  const categoryColor = timeblock.category?.color || '#4A90E2';
  
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

  return (
    <div
      onClick={handleClick}
      className={cn(
        'absolute left-[60px] right-4 mx-1 rounded-lg cursor-pointer',
        'transition-all duration-150 hover:shadow-md',
        'animate-timeblock-appear'
      )}
      style={{
        top,
        height: Math.max(height, TIME_GRID.SLOT_HEIGHT),
        backgroundColor: getTimeblockFillColor(categoryColor, 0.2),
        borderLeft: `3px solid ${categoryColor}`,
      }}
    >
      <div className="p-2 h-full overflow-hidden">
        {/* Title */}
        <div
          className="font-medium text-sm truncate"
          style={{ color: categoryColor }}
        >
          {timeblock.title || timeblock.category?.name || 'Untitled'}
        </div>

        {/* Time */}
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {formatTime(timeblock.start_time)} - {formatTime(timeblock.end_time)}
        </div>

        {/* Tasks (if space allows) */}
        {height >= 120 && timeblock.tasks && timeblock.tasks.length > 0 && (
          <div className="mt-2 space-y-1">
            {timeblock.tasks.slice(0, 3).map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-2 text-xs"
                onClick={(e) => handleTaskToggle(e, task.id)}
              >
                <div
                  className={cn(
                    'w-4 h-4 rounded border flex items-center justify-center flex-shrink-0',
                    task.is_completed
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-300 dark:border-gray-600'
                  )}
                >
                  {task.is_completed && <Check className="w-3 h-3 text-white" />}
                </div>
                <span
                  className={cn(
                    'truncate',
                    task.is_completed && 'line-through text-gray-400'
                  )}
                >
                  {task.title}
                </span>
              </div>
            ))}
            {timeblock.tasks.length > 3 && (
              <div className="text-xs text-gray-400">
                +{timeblock.tasks.length - 3} more
              </div>
            )}
          </div>
        )}

        {/* Category emoji */}
        {timeblock.category?.emoji && height >= 60 && (
          <div className="absolute bottom-2 right-2 text-lg">
            {timeblock.category.emoji}
          </div>
        )}
      </div>
    </div>
  );
}
