'use server';

import { ROUTES } from '@/core/consts';
import { revalidatePath } from 'next/cache';

export const revalidateCurrentOrder = async (id: string | number) => {
  revalidatePath(ROUTES.singleOrder(id));
};
