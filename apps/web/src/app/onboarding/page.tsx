'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, ChevronRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChronosStore } from '@/store';
import { CATEGORY_COLORS, DEFAULT_CATEGORIES } from '@chronos/shared';

const STEPS = [
  { id: 'welcome', title: 'Welcome' },
  { id: 'categories', title: 'Categories' },
  { id: 'ready', title: 'Ready' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { createCategory } = useChronosStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    DEFAULT_CATEGORIES.map((c) => c.name)
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = async () => {
    if (currentStep === 1) {
      // Create selected categories
      setIsLoading(true);
      for (const cat of DEFAULT_CATEGORIES) {
        if (selectedCategories.includes(cat.name)) {
          await createCategory(cat);
        }
      }
      setIsLoading(false);
    }
    
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push('/dashboard');
    }
  };

  const toggleCategory = (name: string) => {
    setSelectedCategories((prev) =>
      prev.includes(name)
        ? prev.filter((n) => n !== name)
        : [...prev, name]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Progress */}
      <div className="p-4">
        <div className="max-w-md mx-auto flex gap-2">
          {STEPS.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                'flex-1 h-1 rounded-full transition-colors',
                index <= currentStep
                  ? 'bg-brand-primary'
                  : 'bg-gray-200 dark:bg-gray-700'
              )}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {currentStep === 0 && (
            <div className="text-center animate-fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-brand-primary mb-6">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Welcome to CHRONOS
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Take control of your time with visual timeblocking. Plan your day, track your tasks, and achieve more.
              </p>
              <div className="space-y-4 text-left bg-white dark:bg-gray-800 rounded-2xl p-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">📅</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Visual Timeblocking</h3>
                    <p className="text-sm text-gray-500">See your day at a glance with color-coded blocks</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">✅</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Embedded Tasks</h3>
                    <p className="text-sm text-gray-500">Add tasks directly to your timeblocks</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🎯</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Categories</h3>
                    <p className="text-sm text-gray-500">Organize your time with custom categories</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="animate-fade-in">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                Choose Your Categories
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
                Select the categories you want to start with. You can always add more later.
              </p>
              <div className="space-y-3">
                {DEFAULT_CATEGORIES.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => toggleCategory(category.name)}
                    className={cn(
                      'w-full flex items-center gap-4 p-4 rounded-xl transition-all',
                      selectedCategories.includes(category.name)
                        ? 'bg-white dark:bg-gray-800 shadow-md ring-2 ring-brand-primary'
                        : 'bg-white dark:bg-gray-800 shadow-sm hover:shadow-md'
                    )}
                  >
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                      style={{ backgroundColor: category.color + '20' }}
                    >
                      {category.emoji}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {category.name}
                      </div>
                      <div
                        className="w-4 h-4 rounded-full mt-1"
                        style={{ backgroundColor: category.color }}
                      />
                    </div>
                    <div
                      className={cn(
                        'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors',
                        selectedCategories.includes(category.name)
                          ? 'bg-brand-primary border-brand-primary'
                          : 'border-gray-300 dark:border-gray-600'
                      )}
                    >
                      {selectedCategories.includes(category.name) && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="text-center animate-fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
                <Check className="w-10 h-10 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                You&apos;re All Set!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Start planning your day with CHRONOS. Tap the + button to create your first timeblock.
              </p>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-left">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Quick Tips:</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Tap and drag on the timeline to create a timeblock</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Use natural language for duration (e.g., &quot;1h 30m&quot;)</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Swipe left/right to navigate between days</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Tap a timeblock to add tasks or edit details</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleNext}
            disabled={isLoading}
            className={cn(
              'w-full flex items-center justify-center gap-2 py-4 rounded-xl font-medium text-white transition-all',
              'bg-brand-primary hover:bg-brand-primary-dark',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {isLoading ? (
              'Setting up...'
            ) : currentStep === STEPS.length - 1 ? (
              'Get Started'
            ) : (
              <>
                Continue
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
