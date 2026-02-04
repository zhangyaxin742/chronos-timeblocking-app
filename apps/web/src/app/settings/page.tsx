'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { ArrowLeft, Sun, Moon, Monitor, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

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
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Settings</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Theme */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <h2 className="font-medium text-gray-900 dark:text-white mb-4">Appearance</h2>
          <div className="grid grid-cols-3 gap-2">
            {themeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setTheme(option.value)}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-xl transition-all',
                  theme === option.value
                    ? 'bg-brand-primary/10 ring-2 ring-brand-primary'
                    : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                )}
              >
                <option.icon className={cn(
                  'w-6 h-6',
                  theme === option.value ? 'text-brand-primary' : 'text-gray-500'
                )} />
                <span className={cn(
                  'text-sm font-medium',
                  theme === option.value ? 'text-brand-primary' : 'text-gray-700 dark:text-gray-300'
                )}>
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Navigation */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <button
            onClick={() => router.push('/categories')}
            className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="font-medium text-gray-900 dark:text-white">Manage Categories</span>
            <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
          </button>
        </section>

        {/* Account */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-3 px-4 py-4 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">{isLoggingOut ? 'Logging out...' : 'Log Out'}</span>
          </button>
        </section>

        {/* Version */}
        <p className="text-center text-sm text-gray-400">
          CHRONOS v1.0.0
        </p>
      </main>
    </div>
  );
}
