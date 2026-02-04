'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToasterState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
}

const toasterState: ToasterState = {
  toasts: [],
  addToast: () => '',
  removeToast: () => {},
};

let listeners: (() => void)[] = [];

function emitChange() {
  listeners.forEach((listener) => listener());
}

export function toast(options: Omit<Toast, 'id'>): string {
  const id = Math.random().toString(36).substring(2, 9);
  toasterState.toasts = [...toasterState.toasts, { ...options, id }];
  emitChange();

  if (options.duration !== 0) {
    setTimeout(() => {
      dismissToast(id);
    }, options.duration || 5000);
  }

  return id;
}

export function dismissToast(id: string) {
  toasterState.toasts = toasterState.toasts.filter((t) => t.id !== id);
  emitChange();
}

function useToasterStore() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = () => setToasts([...toasterState.toasts]);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  return toasts;
}

const typeStyles = {
  success: 'bg-green-500 text-white',
  error: 'bg-red-500 text-white',
  warning: 'bg-yellow-500 text-white',
  info: 'bg-blue-500 text-white',
};

export function Toaster() {
  const toasts = useToasterStore();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            'flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg animate-modal',
            t.type ? typeStyles[t.type] : 'bg-gray-800 text-white dark:bg-gray-700'
          )}
        >
          <span className="text-sm font-medium">{t.message}</span>
          {t.action && (
            <button
              onClick={() => {
                t.action?.onClick();
                dismissToast(t.id);
              }}
              className="text-sm font-semibold underline hover:no-underline"
            >
              {t.action.label}
            </button>
          )}
          <button
            onClick={() => dismissToast(t.id)}
            className="ml-2 rounded-full p-1 hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
