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
    const displayHour = hour % 12 || 12;
    const period = hour >= 12 ? 'p' : 'a';
    return `${displayHour}${period}`;
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {hours.map((hour, index) => (
        <div key={hour}>
          {/* Hour line */}
          <div
            className="absolute left-0 right-0"
            style={{ 
              top: index * 4 * TIME_GRID.SLOT_HEIGHT,
              borderTop: '1px solid var(--border-subtle)'
            }}
          >
            <span 
              className="absolute left-2 -top-2.5 text-xs px-1"
              style={{ 
                color: 'var(--text-muted)',
                backgroundColor: 'var(--bg-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.64rem',
                textTransform: 'lowercase'
              }}
            >
              {formatHour(hour)}
            </span>
          </div>

          {/* Half-hour line */}
          <div
            className="absolute left-[60px] right-0"
            style={{ 
              top: (index * 4 + 2) * TIME_GRID.SLOT_HEIGHT,
              borderTop: '1px dashed var(--border-subtle)',
              opacity: 0.5
            }}
          />
        </div>
      ))}
    </div>
  );
}
