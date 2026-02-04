'use client';

import { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Category } from '@chronos/shared';

interface CategorySelectorProps {
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export function CategorySelector({ categories, selectedId, onSelect }: CategorySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedCategory = categories.find((c) => c.id === selectedId);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between px-4 py-2.5 rounded-lg',
          'border border-gray-300 dark:border-gray-600',
          'bg-white dark:bg-gray-700',
          'text-gray-900 dark:text-white',
          'focus:ring-2 focus:ring-brand-primary focus:border-transparent'
        )}
      >
        <div className="flex items-center gap-2">
          {selectedCategory ? (
            <>
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: selectedCategory.color }}
              />
              <span>{selectedCategory.emoji}</span>
              <span>{selectedCategory.name}</span>
            </>
          ) : (
            <span className="text-gray-500">Select a category</span>
          )}
        </div>
        <ChevronDown className={cn('w-5 h-5 text-gray-400 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => {
                onSelect(category.id);
                setIsOpen(false);
              }}
              className={cn(
                'w-full flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700',
                selectedId === category.id && 'bg-gray-50 dark:bg-gray-700'
              )}
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span>{category.emoji}</span>
              <span className="flex-1 text-left text-gray-900 dark:text-white">
                {category.name}
              </span>
              {selectedId === category.id && (
                <Check className="w-4 h-4 text-brand-primary" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
