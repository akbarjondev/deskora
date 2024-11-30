import { TCurrency } from '@/core/types';

const currencies: Record<TCurrency, string> = {
  UZS: 'UZS',
  USD: 'USD'
};

export const formatPrice = (amount?: number, currency?: TCurrency) => {
  if (!amount || !currency) return '-';

  return `${amount.toLocaleString()} ${currencies[currency]}`;
};
