import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { CategoriesClient } from './categories-client';

export default async function CategoriesPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return <CategoriesClient />;
}
