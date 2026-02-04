'use client';

import { useEffect, useState } from 'react';
import { TIME_GRID } from '@chronos/shared';

interface CurrentTimeIndicatorProps {
  startHour: number;
}

export function CurrentTimeIndicator({ startHour }: CurrentTimeIndicatorProps) {
  const [position, setPosition] = useState<number | null>(null);

  useEffect(() => {
    const updatePosition = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      
      // Only show if within visible range
      if (hours < startHour || hours > 23) {
        setPosition(null);
        return;
      }
      
      const totalMinutes = (hours - startHour) * 60 + minutes;
      const pos = (totalMinutes / 15) * TIME_GRID.SLOT_HEIGHT;
      setPosition(pos);
    };

    updatePosition();
    const interval = setInterval(updatePosition, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [startHour]);

  if (position === null) return null;

  return (
    <div
      className="absolute left-0 right-0 z-20 pointer-events-none"
      style={{ top: position }}
    >
      <div className="relative">
        <div className="absolute left-[52px] w-3 h-3 -mt-1.5 rounded-full bg-red-500" />
        <div className="absolute left-[60px] right-0 h-0.5 bg-red-500" />
      </div>
    </div>
  );
}
