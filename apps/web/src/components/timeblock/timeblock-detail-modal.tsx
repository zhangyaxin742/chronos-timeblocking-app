'use client';

import { useState } from 'react';
import { useChronosStore } from '@/store';
import { Modal } from '@/components/ui/modal';
import { CategorySelector } from './category-selector';
import { TaskList } from './task-list';
import { formatTime, parseDuration } from '@chronos/shared';
import { Clock, Type, Trash2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export function TimeblockDetailModal() {
  const {
    selectedTimeblock,
    setSelectedTimeblock,
    categories,
    updateTimeblock,
    deleteTimeblock,
    createTask,
  } = useChronosStore();

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(selectedTimeblock?.title || '');
  const [categoryId, setCategoryId] = useState<string | null>(
    selectedTimeblock?.category_id || null
  );
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  if (!selectedTimeblock) return null;

  const handleClose = () => {
    setSelectedTimeblock(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    await updateTimeblock(selectedTimeblock.id, {
      title: title || undefined,
      category_id: categoryId || undefined,
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteTimeblock(selectedTimeblock.id);
    setIsDeleting(false);
    handleClose();
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    await createTask({
      title: newTaskTitle.trim(),
      timeblock_id: selectedTimeblock.id,
    });
    setNewTaskTitle('');
  };

  const category = categories.find((c) => c.id === selectedTimeblock.category_id);

  return (
    <Modal
      isOpen={!!selectedTimeblock}
      onClose={handleClose}
      title={isEditing ? 'Edit Timeblock' : 'Timeblock Details'}
    >
      <div className="space-y-4">
        {/* Time display */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Clock className="w-4 h-4" />
          <span>
            {formatTime(selectedTimeblock.start_time)} - {formatTime(selectedTimeblock.end_time)}
          </span>
          <span className="text-gray-400">•</span>
          <span>{selectedTimeblock.duration_minutes} min</span>
        </div>

        {isEditing ? (
          <>
            {/* Title input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                placeholder="What are you working on?"
              />
            </div>

            {/* Category selector */}
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

            {/* Save/Cancel buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 rounded-lg font-medium text-white bg-brand-primary hover:bg-brand-primary-dark transition-colors"
              >
                Save
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Display mode */}
            <div className="flex items-center gap-3">
              {category && (
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
              )}
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {selectedTimeblock.title || category?.name || 'Untitled'}
              </h3>
              {category?.emoji && <span className="text-xl">{category.emoji}</span>}
            </div>

            {/* Tasks section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tasks
              </h4>
              
              <TaskList tasks={selectedTimeblock.tasks || []} />

              {/* Add task form */}
              <form onSubmit={handleAddTask} className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  placeholder="Add a task..."
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-lg bg-brand-primary text-white hover:bg-brand-primary-dark transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
