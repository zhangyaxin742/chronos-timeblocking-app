'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { ArrowLeft, Sun, Moon, Monitor, LogOut, ChevronRight } from 'lucide-react';
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
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <header 
        className="sticky top-0 z-40"
        style={{ backgroundColor: 'var(--bg-primary)', borderBottom: '1px solid var(--border-subtle)' }}
      >
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="btn-icon -ml-2"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          </button>
          <h1 
            className="text-lg font-semibold uppercase tracking-wider"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}
          >
            Settings
          </h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Theme */}
        <section 
          className="p-4"
          style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-default)', borderRadius: '4px' }}
        >
          <h2 
            className="text-xs font-medium uppercase tracking-wider mb-4"
            style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}
          >
            Appearance
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {themeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setTheme(option.value)}
                className="flex flex-col items-center gap-2 p-4 transition-all"
                style={{
                  backgroundColor: theme === option.value ? 'var(--bg-tertiary)' : 'transparent',
                  border: theme === option.value ? '1px solid var(--text-secondary)' : '1px solid var(--border-default)',
                  borderRadius: '2px',
                }}
              >
                <option.icon 
                  className="w-5 h-5" 
                  style={{ color: theme === option.value ? 'var(--text-primary)' : 'var(--text-tertiary)' }}
                  strokeWidth={1.5}
                />
                <span 
                  className="text-sm"
                  style={{ 
                    color: theme === option.value ? 'var(--text-primary)' : 'var(--text-tertiary)',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Navigation */}
        <section 
          style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-default)', borderRadius: '4px' }}
        >
          <button
            onClick={() => router.push('/categories')}
            className="w-full flex items-center justify-between px-4 py-4 transition-colors"
            style={{ fontFamily: 'var(--font-mono)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <span style={{ color: 'var(--text-primary)' }}>Manage Categories</span>
            <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} strokeWidth={1.5} />
          </button>
        </section>

        {/* Account */}
        <section 
          style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-default)', borderRadius: '4px' }}
        >
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-3 px-4 py-4 transition-colors disabled:opacity-50"
            style={{ fontFamily: 'var(--font-mono)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <LogOut className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} strokeWidth={1.5} />
            <span style={{ color: 'var(--text-secondary)' }}>
              {isLoggingOut ? 'Logging out...' : 'Log Out'}
            </span>
          </button>
        </section>

        {/* Version */}
        <p 
          className="text-center text-xs uppercase tracking-wider"
          style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
        >
          CHRONOS v1.0.0
        </p>
      </main>
    </div>
  );
}
