'use client';

import { useEffect, useRef, useState } from 'react';
import { useChronosStore } from '@/store';
import { TimeGrid } from './time-grid';
import { TimeblockCard } from './timeblock-card';
import { CurrentTimeIndicator } from './current-time-indicator';
import { cn } from '@/lib/utils';
import { TIME_GRID } from '@chronos/shared';

export function DayView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { timeblocks, setIsCreatingTimeblock } = useChronosStore();
  const [dragStart, setDragStart] = useState<{ y: number; slotIndex: number } | null>(null);
  const [dragEnd, setDragEnd] = useState<number | null>(null);

  const startHour = 6;
  const endHour = 23;
  const totalSlots = (endHour - startHour + 1) * 4;
  const gridHeight = totalSlots * TIME_GRID.SLOT_HEIGHT;

  useEffect(() => {
    // Scroll to 8 AM on mount
    if (containerRef.current) {
      const scrollTo = (8 - startHour) * 4 * TIME_GRID.SLOT_HEIGHT;
      containerRef.current.scrollTop = scrollTo;
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target !== e.currentTarget) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top + (containerRef.current?.scrollTop || 0);
    const slotIndex = Math.floor(y / TIME_GRID.SLOT_HEIGHT);
    
    setDragStart({ y, slotIndex });
    setDragEnd(slotIndex);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragStart) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top + (containerRef.current?.scrollTop || 0);
    const slotIndex = Math.floor(y / TIME_GRID.SLOT_HEIGHT);
    
    setDragEnd(slotIndex);
  };

  const handleMouseUp = () => {
    if (dragStart && dragEnd !== null) {
      const startSlot = Math.min(dragStart.slotIndex, dragEnd);
      const endSlot = Math.max(dragStart.slotIndex, dragEnd);
      
      if (endSlot - startSlot >= 1) {
        // Store the drag info and open modal
        useChronosStore.setState({
          isCreatingTimeblock: true,
          // We'll pass the time info through a different mechanism
        });
      }
    }
    
    setDragStart(null);
    setDragEnd(null);
  };

  const getDragPreviewStyle = () => {
    if (!dragStart || dragEnd === null) return null;
    
    const startSlot = Math.min(dragStart.slotIndex, dragEnd);
    const endSlot = Math.max(dragStart.slotIndex, dragEnd);
    const slots = endSlot - startSlot + 1;
    
    return {
      top: startSlot * TIME_GRID.SLOT_HEIGHT,
      height: slots * TIME_GRID.SLOT_HEIGHT,
    };
  };

  const dragPreviewStyle = getDragPreviewStyle();

  return (
    <div
      ref={containerRef}
      className="relative h-[calc(100vh-64px)] overflow-y-auto"
    >
      <div
        className="relative"
        style={{ height: gridHeight }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <TimeGrid startHour={startHour} endHour={endHour} />
        <CurrentTimeIndicator startHour={startHour} />
        
        {/* Timeblocks */}
        {timeblocks.map((timeblock) => (
          <TimeblockCard key={timeblock.id} timeblock={timeblock} startHour={startHour} />
        ))}

        {/* Drag preview - monochrome */}
        {dragPreviewStyle && (
          <div
            className="absolute left-[60px] right-4 pointer-events-none"
            style={{
              ...dragPreviewStyle,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px dashed var(--border-strong)',
              borderRadius: '2px',
            }}
          />
        )}
      </div>
    </div>
  );
}
