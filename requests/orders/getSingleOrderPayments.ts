import { createClient } from '@/lib/supabase/server';
import { cache } from 'react';

export const getSingleOrderPayments = cache(async (orderId: string) => {
  const supabase = await createClient();

  const { data: payments } = await supabase
    .from('payments')
    .select('*, orders(currency)')
    .eq('order_id', orderId);

  return payments || [];
});

export type TSingleOrderPayments = Awaited<
  ReturnType<typeof getSingleOrderPayments>
>;

export type TSingleOrderPayment = TSingleOrderPayments[0];
