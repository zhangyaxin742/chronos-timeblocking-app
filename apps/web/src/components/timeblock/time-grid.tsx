'use client';

import { TIME_GRID } from '@chronos/shared';

interface TimeGridProps {
  startHour: number;
  endHour: number;
}

export function TimeGrid({ startHour, endHour }: TimeGridProps) {
  const hours = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    hours.push(hour);
  }

  const formatHour = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour} ${period}`;
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {hours.map((hour, index) => (
        <div key={hour}>
          {/* Hour line */}
          <div
            className="absolute left-0 right-0 border-t border-gray-200 dark:border-gray-700"
            style={{ top: index * 4 * TIME_GRID.SLOT_HEIGHT }}
          >
            <span className="absolute left-2 -top-2.5 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 px-1">
              {formatHour(hour)}
            </span>
          </div>

          {/* Half-hour line */}
          <div
            className="absolute left-[60px] right-0 border-t border-gray-100 dark:border-gray-800"
            style={{ top: (index * 4 + 2) * TIME_GRID.SLOT_HEIGHT }}
          />
        </div>
      ))}
    </div>
  );
}
