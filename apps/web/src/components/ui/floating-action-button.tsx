'use client';

import { Plus } from 'lucide-react';
import { useChronosStore } from '@/store';

export function FloatingActionButton() {
  const { setIsCreatingTimeblock } = useChronosStore();

  return (
    <button
      onClick={() => setIsCreatingTimeblock(true)}
      className="fab"
      aria-label="Create timeblock"
    >
      <Plus className="w-5 h-5" strokeWidth={1.5} />
    </button>
  );
}
