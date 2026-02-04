'use client';

import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Clock, ChevronLeft, ChevronRight, Sun, Moon, Settings } from 'lucide-react';
import { useChronosStore } from '@/store';
import { cn } from '@/lib/utils';
import { addDays, formatDateDisplay, isToday, getTodayISO } from '@chronos/shared';

export function Header() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { selectedDate, setSelectedDate } = useChronosStore();

  const handlePrevDay = () => {
    setSelectedDate(addDays(selectedDate, -1));
  };

  const handleNextDay = () => {
    setSelectedDate(addDays(selectedDate, 1));
  };

  const handleToday = () => {
    setSelectedDate(getTodayISO());
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-lg text-gray-900 dark:text-white hidden sm:block">
            CHRONOS
          </span>
        </div>

        {/* Date Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevDay}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Previous day"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>

          <button
            onClick={handleToday}
            className={cn(
              'px-4 py-2 rounded-lg font-medium transition-colors',
              isToday(selectedDate)
                ? 'bg-brand-primary text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
            )}
          >
            <span className="hidden sm:inline">{formatDateDisplay(selectedDate)}</span>
            <span className="sm:hidden">
              {isToday(selectedDate) ? 'Today' : formatDateDisplay(selectedDate)}
            </span>
          </button>

          <button
            onClick={handleNextDay}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Next day"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>

          <button
            onClick={() => router.push('/settings')}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>
    </header>
  );
}
