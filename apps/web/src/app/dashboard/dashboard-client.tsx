'use client';

import { useEffect } from 'react';
import { useChronosStore } from '@/store';
import { Header } from '@/components/layout/header';
import { DayView } from '@/components/timeblock/day-view';
import { CreateTimeblockModal } from '@/components/timeblock/create-timeblock-modal';
import { TimeblockDetailModal } from '@/components/timeblock/timeblock-detail-modal';
import { BacklogPanel } from '@/components/timeblock/backlog-panel';
import { FloatingActionButton } from '@/components/ui/floating-action-button';

export function DashboardClient() {
  const {
    selectedDate,
    fetchCategories,
    fetchTimeblocks,
    fetchBacklogTasks,
    isCreatingTimeblock,
    selectedTimeblock,
  } = useChronosStore();

  useEffect(() => {
    fetchCategories();
    fetchTimeblocks(selectedDate);
    fetchBacklogTasks();
  }, [fetchCategories, fetchTimeblocks, fetchBacklogTasks, selectedDate]);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full">
        <DayView />
      </main>
      <BacklogPanel />
      <FloatingActionButton />
      {isCreatingTimeblock && <CreateTimeblockModal />}
      {selectedTimeblock && <TimeblockDetailModal />}
    </div>
  );
}
