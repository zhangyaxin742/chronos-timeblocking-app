'use client';

import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { ChevronLeft, ChevronRight, Sun, Moon, Settings } from 'lucide-react';
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
    <header 
      className="sticky top-0 z-40 border-b transition-colors"
      style={{ 
        backgroundColor: 'var(--bg-primary)', 
        borderColor: 'var(--border-subtle)' 
      }}
    >
      <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo - Text only, typewriter style */}
        <div className="flex items-center gap-3">
          <span 
            className="font-semibold text-lg tracking-wider uppercase"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}
          >
            CHRONOS
          </span>
          <span 
            className="text-sm hidden sm:block"
            style={{ color: 'var(--text-muted)' }}
          >
            /
          </span>
          <span 
            className="text-sm hidden sm:block"
            style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}
          >
            {new Date(selectedDate).getFullYear()} W{getWeekNumber(new Date(selectedDate))}
          </span>
        </div>

        {/* Date Navigation */}
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrevDay}
            className="btn-icon"
            aria-label="Previous day"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
          </button>

          <button
            onClick={handleToday}
            className={cn(
              'px-4 py-2 text-sm font-medium transition-all rounded-sm',
              isToday(selectedDate)
                ? 'text-[var(--bg-primary)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            )}
            style={{ 
              fontFamily: 'var(--font-mono)',
              backgroundColor: isToday(selectedDate) ? 'var(--text-primary)' : 'transparent',
              border: isToday(selectedDate) ? 'none' : '1px solid var(--border-default)',
            }}
          >
            {formatDateDisplay(selectedDate)}
          </button>

          <button
            onClick={handleNextDay}
            className="btn-icon"
            aria-label="Next day"
          >
            <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={toggleTheme}
            className="btn-icon"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4" strokeWidth={1.5} />
            ) : (
              <Moon className="w-4 h-4" strokeWidth={1.5} />
            )}
          </button>

          <button
            onClick={() => router.push('/settings')}
            className="btn-icon"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </header>
  );
}

function getWeekNumber(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return weekNo.toString().padStart(2, '0');
}
