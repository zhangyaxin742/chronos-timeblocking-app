'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useChronosStore } from '@/store';
import { Plus, Pencil, Trash2, ArrowLeft } from 'lucide-react';

// Border styles for monochrome category distinction
const BORDER_STYLES = ['solid', 'dashed', 'double', 'dotted'];

export function CategoriesClient() {
  const router = useRouter();
  const { categories, fetchCategories, createCategory, updateCategory, deleteCategory } = useChronosStore();
  
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [borderStyle, setBorderStyle] = useState('solid');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const resetForm = () => {
    setName('');
    setBorderStyle('solid');
    setIsCreating(false);
    setEditingId(null);
  };

  const handleCreate = async () => {
    if (!name.trim()) return;
    setIsLoading(true);
    await createCategory({ name: name.trim(), color: '#737373', emoji: '' });
    setIsLoading(false);
    resetForm();
  };

  const handleUpdate = async () => {
    if (!editingId || !name.trim()) return;
    setIsLoading(true);
    await updateCategory(editingId, { name: name.trim(), color: '#737373', emoji: '' });
    setIsLoading(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      await deleteCategory(id);
    }
  };

  const startEdit = (category: typeof categories[0]) => {
    setEditingId(category.id);
    setName(category.name);
    setIsCreating(false);
  };

  // Get border style based on category name
  const getCategoryBorderStyle = (categoryName: string): string => {
    const n = categoryName.toLowerCase();
    if (n.includes('work')) return 'solid';
    if (n.includes('personal')) return 'dashed';
    if (n.includes('focus')) return 'double';
    if (n.includes('health')) return 'dotted';
    return 'solid';
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <header 
        className="sticky top-0 z-40"
        style={{ backgroundColor: 'var(--bg-primary)', borderBottom: '1px solid var(--border-subtle)' }}
      >
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center gap-4">
          <button
            onClick={() => router.push('/settings')}
            className="btn-icon -ml-2"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          </button>
          <h1 
            className="text-lg font-semibold uppercase tracking-wider"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}
          >
            Categories
          </h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-6">
        {/* Category list */}
        <div className="space-y-2 mb-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center gap-4 p-4 group"
              style={{ 
                backgroundColor: 'var(--bg-secondary)', 
                border: '1px solid var(--border-default)',
                borderRadius: '4px'
              }}
            >
              {/* Border style indicator */}
              <div
                className="w-8 h-4"
                style={{ 
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderLeft: `3px ${getCategoryBorderStyle(category.name)} var(--text-tertiary)`,
                }}
              />
              <div className="flex-1">
                <div 
                  className="font-medium"
                  style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}
                >
                  {category.name}
                </div>
                <div 
                  className="text-xs uppercase tracking-wider mt-0.5"
                  style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
                >
                  {getCategoryBorderStyle(category.name)} border
                </div>
              </div>
              <button
                onClick={() => startEdit(category)}
                className="btn-icon opacity-0 group-hover:opacity-100"
              >
                <Pencil className="w-4 h-4" strokeWidth={1.5} />
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                className="btn-icon opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>
          ))}
        </div>

        {/* Create/Edit form */}
        {(isCreating || editingId) && (
          <div 
            className="p-6 mb-6"
            style={{ 
              backgroundColor: 'var(--bg-secondary)', 
              border: '1px solid var(--border-default)',
              borderRadius: '4px'
            }}
          >
            <h3 
              className="text-sm font-medium uppercase tracking-wider mb-6"
              style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}
            >
              {editingId ? 'Edit Category' : 'New Category'}
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="input-label">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input"
                  placeholder="Category name"
                />
              </div>

              <div>
                <label className="input-label">Border Style</label>
                <div className="grid grid-cols-4 gap-2">
                  {BORDER_STYLES.map((style) => (
                    <button
                      key={style}
                      onClick={() => setBorderStyle(style)}
                      className="flex flex-col items-center gap-2 p-3 transition-all"
                      style={{
                        backgroundColor: borderStyle === style ? 'var(--bg-tertiary)' : 'transparent',
                        border: borderStyle === style ? '1px solid var(--text-secondary)' : '1px solid var(--border-default)',
                        borderRadius: '2px',
                      }}
                    >
                      <div
                        className="w-full h-3"
                        style={{ 
                          backgroundColor: 'rgba(255,255,255,0.05)',
                          borderLeft: `3px ${style} var(--text-tertiary)`,
                        }}
                      />
                      <span 
                        className="text-xs capitalize"
                        style={{ 
                          color: borderStyle === style ? 'var(--text-primary)' : 'var(--text-tertiary)',
                          fontFamily: 'var(--font-mono)'
                        }}
                      >
                        {style}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div 
                className="flex gap-3 pt-4"
                style={{ borderTop: '1px solid var(--border-subtle)' }}
              >
                <button
                  onClick={resetForm}
                  className="btn-secondary flex-1 py-2.5"
                >
                  Cancel
                </button>
                <button
                  onClick={editingId ? handleUpdate : handleCreate}
                  disabled={isLoading || !name.trim()}
                  className="btn-primary flex-1 py-2.5 disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add button */}
        {!isCreating && !editingId && (
          <button
            onClick={() => setIsCreating(true)}
            className="w-full flex items-center justify-center gap-2 py-4 transition-colors"
            style={{ 
              border: '1px dashed var(--border-default)',
              borderRadius: '4px',
              color: 'var(--text-tertiary)',
              fontFamily: 'var(--font-mono)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--text-secondary)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-default)';
              e.currentTarget.style.color = 'var(--text-tertiary)';
            }}
          >
            <Plus className="w-4 h-4" strokeWidth={1.5} />
            Add Category
          </button>
        )}
      </main>
    </div>
  );
}
