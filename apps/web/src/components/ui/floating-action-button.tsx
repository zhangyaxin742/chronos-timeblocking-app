'use client';

import { Plus } from 'lucide-react';
import { useChronosStore } from '@/store';
import { cn } from '@/lib/utils';

export function FloatingActionButton() {
  const { setIsCreatingTimeblock } = useChronosStore();

  return (
    <button
      onClick={() => setIsCreatingTimeblock(true)}
      className={cn(
        'fixed bottom-6 right-6 z-50',
        'w-14 h-14 rounded-full',
        'bg-brand-primary hover:bg-brand-primary-dark',
        'shadow-lg hover:shadow-xl',
        'flex items-center justify-center',
        'transition-all duration-200',
        'active:scale-95'
      )}
      aria-label="Create timeblock"
    >
      <Plus className="w-6 h-6 text-white" />
    </button>
  );
}
