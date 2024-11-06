'use server';

import { createClient } from '@/lib/supabase/server';
import { errors } from 'core/consts';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function login(
  _prevState: { message: string },
  formData: FormData
) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    const text =
      error.status && error.status in errors
        ? errors[error.status]
        : "Noma'lum xatolik";

    return {
      message: `Xatolik: ${text}`
    };
  }

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function signup(
  _prevState: { message: string },
  formData: FormData
) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    const text =
      error.status && error.status in errors
        ? errors[error.status]
        : "Noma'lum xatolik";

    return {
      message: `Xatolik: ${text}`
    };
  }

  revalidatePath('/', 'layout');

  return {
    message: "Muvaffaqqiyatli ro'yhatdan o'tdingiz. E-mailingizni tasdiqlang."
  };
}
