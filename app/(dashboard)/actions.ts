'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const signOut = async () => {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error === null) {
    redirect('/login');
  }
};
