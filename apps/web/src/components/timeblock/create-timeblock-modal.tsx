'use client';

import { useState } from 'react';
import { useChronosStore } from '@/store';
import { Modal } from '@/components/ui/modal';
import { CategorySelector } from './category-selector';
import { parseDuration } from '@chronos/shared';

export function CreateTimeblockModal() {
  const {
    isCreatingTimeblock,
    setIsCreatingTimeblock,
    categories,
    selectedDate,
    createTimeblock,
  } = useChronosStore();

  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState('09:00');
  const [duration, setDuration] = useState('1h');
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setIsCreatingTimeblock(false);
    setTitle('');
    setCategoryId(null);
    setStartTime('09:00');
    setDuration('1h');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const parsed = parseDuration(duration);
    if (!parsed.isValid) {
      return;
    }
    const durationMinutes = parsed.minutes;

    setIsLoading(true);

    // Calculate end time
    const [hours, minutes] = startTime.split(':').map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + durationMinutes;
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    const endTime = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;

    await createTimeblock({
      title: title || undefined,
      category_id: categoryId || undefined,
      date: selectedDate,
      start_time: startTime,
      end_time: endTime,
      duration_minutes: durationMinutes,
    });

    setIsLoading(false);
    handleClose();
  };

  return (
    <Modal
      isOpen={isCreatingTimeblock}
      onClose={handleClose}
      title="New Timeblock"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="input-label">Title (optional)</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input"
            placeholder="What are you working on?"
          />
        </div>

        {/* Category */}
        <div>
          <label className="input-label">Category</label>
          <CategorySelector
            categories={categories}
            selectedId={categoryId}
            onSelect={setCategoryId}
          />
        </div>

        {/* Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="input-label">Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="input"
            />
          </div>

          <div>
            <label className="input-label">Duration</label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="input"
              placeholder="1h 30m"
            />
            <p 
              className="mt-1 text-xs"
              style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
            >
              e.g., 1h, 30m, 1h 30m
            </p>
          </div>
        </div>

        {/* Actions */}
        <div 
          className="flex gap-3 pt-4"
          style={{ borderTop: '1px solid var(--border-subtle)' }}
        >
          <button
            type="button"
            onClick={handleClose}
            className="btn-secondary flex-1 py-2.5"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary flex-1 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating...' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
