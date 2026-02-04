'use client';

import { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import type { Category } from '@chronos/shared';

interface CategorySelectorProps {
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

// Get border style for category distinction
function getCategoryBorderStyle(name?: string): string {
  const n = name?.toLowerCase() || '';
  if (n.includes('work')) return 'solid';
  if (n.includes('personal')) return 'dashed';
  if (n.includes('focus')) return 'double';
  if (n.includes('health')) return 'dotted';
  return 'solid';
}

export function CategorySelector({ categories, selectedId, onSelect }: CategorySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedCategory = categories.find((c) => c.id === selectedId);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 transition-all"
        style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--border-default)',
          borderRadius: '2px',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-mono)',
        }}
      >
        <div className="flex items-center gap-3">
          {selectedCategory ? (
            <>
              <div
                className="w-6 h-3"
                style={{ 
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderLeft: `3px ${getCategoryBorderStyle(selectedCategory.name)} var(--text-tertiary)`,
                }}
              />
              <span style={{ color: 'var(--text-primary)' }}>{selectedCategory.name}</span>
            </>
          ) : (
            <span style={{ color: 'var(--text-muted)' }}>Select a category</span>
          )}
        </div>
        <ChevronDown 
          className="w-4 h-4 transition-transform" 
          style={{ 
            color: 'var(--text-tertiary)',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
          }}
          strokeWidth={1.5}
        />
      </button>

      {isOpen && (
        <div 
          className="absolute z-10 w-full mt-1 max-h-60 overflow-y-auto"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            borderRadius: '2px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          }}
        >
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => {
                onSelect(category.id);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 transition-colors"
              style={{
                backgroundColor: selectedId === category.id ? 'var(--bg-tertiary)' : 'transparent',
                fontFamily: 'var(--font-mono)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = selectedId === category.id ? 'var(--bg-tertiary)' : 'transparent'}
            >
              <div
                className="w-6 h-3"
                style={{ 
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderLeft: `3px ${getCategoryBorderStyle(category.name)} var(--text-tertiary)`,
                }}
              />
              <span 
                className="flex-1 text-left"
                style={{ color: 'var(--text-primary)' }}
              >
                {category.name}
              </span>
              {selectedId === category.id && (
                <Check className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} strokeWidth={1.5} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
