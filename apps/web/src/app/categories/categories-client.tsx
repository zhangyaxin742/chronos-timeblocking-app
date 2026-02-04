'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useChronosStore } from '@/store';
import { Header } from '@/components/layout/header';
import { CATEGORY_COLORS } from '@chronos/shared';
import { Plus, Pencil, Trash2, ArrowLeft, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const EMOJI_OPTIONS = ['💼', '🏃', '📚', '🎨', '🍽️', '😴', '🎮', '🏠', '💪', '🧘', '📝', '💡', '🎯', '🌟', '❤️', '🔥'];
const COLOR_HEX_VALUES = CATEGORY_COLORS.map(c => c.hex);

export function CategoriesClient() {
  const router = useRouter();
  const { categories, fetchCategories, createCategory, updateCategory, deleteCategory } = useChronosStore();
  
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState(COLOR_HEX_VALUES[0]);
  const [emoji, setEmoji] = useState('💼');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const resetForm = () => {
    setName('');
    setColor(COLOR_HEX_VALUES[0]);
    setEmoji('💼');
    setIsCreating(false);
    setEditingId(null);
  };

  const handleCreate = async () => {
    if (!name.trim()) return;
    setIsLoading(true);
    await createCategory({ name: name.trim(), color, emoji });
    setIsLoading(false);
    resetForm();
  };

  const handleUpdate = async () => {
    if (!editingId || !name.trim()) return;
    setIsLoading(true);
    await updateCategory(editingId, { name: name.trim(), color, emoji });
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
    setColor(category.color);
    setEmoji(category.emoji || '💼');
    setIsCreating(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Categories</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4">
        {/* Category list */}
        <div className="space-y-2 mb-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                style={{ backgroundColor: category.color + '20' }}
              >
                {category.emoji || '📁'}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white">{category.name}</div>
                <div
                  className="w-4 h-4 rounded-full mt-1"
                  style={{ backgroundColor: category.color }}
                />
              </div>
              <button
                onClick={() => startEdit(category)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Pencil className="w-4 h-4 text-gray-500" />
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          ))}
        </div>

        {/* Create/Edit form */}
        {(isCreating || editingId) && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-4">
            <h3 className="font-medium text-gray-900 dark:text-white mb-4">
              {editingId ? 'Edit Category' : 'New Category'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  placeholder="Category name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_HEX_VALUES.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={cn(
                        'w-8 h-8 rounded-full transition-transform',
                        color === c && 'ring-2 ring-offset-2 ring-gray-900 dark:ring-white scale-110'
                      )}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Emoji
                </label>
                <div className="flex flex-wrap gap-2">
                  {EMOJI_OPTIONS.map((e) => (
                    <button
                      key={e}
                      onClick={() => setEmoji(e)}
                      className={cn(
                        'w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all',
                        emoji === e
                          ? 'bg-brand-primary/20 ring-2 ring-brand-primary'
                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                      )}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={resetForm}
                  className="flex-1 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingId ? handleUpdate : handleCreate}
                  disabled={isLoading || !name.trim()}
                  className="flex-1 py-2.5 rounded-lg font-medium text-white bg-brand-primary hover:bg-brand-primary-dark transition-colors disabled:opacity-50"
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
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-brand-primary hover:text-brand-primary transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Category
          </button>
        )}
      </main>
    </div>
  );
}
