'use client';

import { useState } from 'react';
import { useChronosStore } from '@/store';
import { Modal } from '@/components/ui/modal';
import { CategorySelector } from './category-selector';
import { parseDuration, getTodayISO } from '@chronos/shared';
import { Clock, Type } from 'lucide-react';
import { cn } from '@/lib/utils';

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
      title="Create Timeblock"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title (optional)
          </label>
          <div className="relative">
            <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              placeholder="What are you working on?"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          <CategorySelector
            categories={categories}
            selectedId={categoryId}
            onSelect={setCategoryId}
          />
        </div>

        {/* Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start Time
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Duration
            </label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              placeholder="1h 30m"
            />
            <p className="mt-1 text-xs text-gray-500">e.g., 1h, 30m, 1h 30m</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              'flex-1 py-2.5 rounded-lg font-medium text-white transition-colors',
              'bg-brand-primary hover:bg-brand-primary-dark',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {isLoading ? 'Creating...' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
