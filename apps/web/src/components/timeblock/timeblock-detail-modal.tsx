'use client';

import { useState } from 'react';
import { useChronosStore } from '@/store';
import { Modal } from '@/components/ui/modal';
import { CategorySelector } from './category-selector';
import { TaskList } from './task-list';
import { formatTime } from '@chronos/shared';
import { Trash2, Plus } from 'lucide-react';

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
      title={isEditing ? 'Edit Timeblock' : 'Timeblock'}
    >
      <div className="space-y-6">
        {/* Time display */}
        <div 
          className="flex items-center gap-3 text-sm"
          style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}
        >
          <span>
            {formatTime(selectedTimeblock.start_time)} - {formatTime(selectedTimeblock.end_time)}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>•</span>
          <span>{selectedTimeblock.duration_minutes} min</span>
        </div>

        {isEditing ? (
          <>
            {/* Title input */}
            <div>
              <label className="input-label">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input"
                placeholder="What are you working on?"
              />
            </div>

            {/* Category selector */}
            <div>
              <label className="input-label">Category</label>
              <CategorySelector
                categories={categories}
                selectedId={categoryId}
                onSelect={setCategoryId}
              />
            </div>

            {/* Save/Cancel buttons */}
            <div 
              className="flex gap-3 pt-4"
              style={{ borderTop: '1px solid var(--border-subtle)' }}
            >
              <button
                onClick={() => setIsEditing(false)}
                className="btn-secondary flex-1 py-2.5"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="btn-primary flex-1 py-2.5"
              >
                Save
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Display mode */}
            <div className="flex items-center gap-3">
              <h3 
                className="text-lg font-medium"
                style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}
              >
                {selectedTimeblock.title || category?.name || 'Untitled'}
              </h3>
            </div>
            
            {category?.name && (
              <div 
                className="text-xs uppercase tracking-wider"
                style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
              >
                {category.name}
              </div>
            )}

            {/* Tasks section */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
              <h4 
                className="text-xs font-medium uppercase tracking-wider mb-3"
                style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}
              >
                Tasks
              </h4>
              
              <TaskList tasks={selectedTimeblock.tasks || []} />

              {/* Add task form */}
              <form onSubmit={handleAddTask} className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="input flex-1 text-sm"
                  placeholder="Add a task..."
                />
                <button
                  type="submit"
                  className="btn-primary px-3"
                >
                  <Plus className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </form>
            </div>

            {/* Action buttons */}
            <div 
              className="flex gap-3 pt-4"
              style={{ borderTop: '1px solid var(--border-subtle)' }}
            >
              <button
                onClick={() => setIsEditing(true)}
                className="btn-secondary flex-1 py-2.5"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="btn-secondary flex items-center justify-center gap-2 px-4 py-2.5 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
