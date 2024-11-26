import { PaymentMethod, PaymentStatus, TPaymentType } from './types';
export const ROUTES = {
  home: '/',
  orders: '/orders',
  newOrder: '/orders/new',
  clients: '/clients',
  products: '/products',
  settings: '/settings'
};

export const errors: Record<number, string> = {
  400: "Ishlamaydigan so'rov", // Bad Request
  401: 'Avtorizatsiya xatoligi', // Unauthorized
  403: 'Ruxsat etilmagan', // Forbidden
  404: 'Topilmadi', // Not Found
  409: "Nizoli holat, bunday ma'lumot mavjud", // Conflict
  422: "Noto'g'ri ma'lumot", // Unprocessable Entity
  429: "Ko'p so'rovlar", // Too Many Requests
  500: 'Ichki server xatoligi', // Internal Server Error
  503: 'Xizmat mavjud emas' // Service Unavailable
};

export const paymentMethodOptions: {
  label: string;
  value: keyof typeof PaymentMethod;
}[] = [
  {
    label: 'Naqd',
    value: 'cash'
  },
  {
    label: 'Plastik karta',
    value: 'card'
  },
  {
    label: 'Bank orqali',
    value: 'bank_transfer'
  },
  {
    label: "Bo'lib to'lash",
    value: 'BNPL'
  }
];

export const paymentStatusOptions: {
  label: string;
  value: keyof typeof PaymentStatus;
}[] = [
  {
    label: "Endi to'lanadi",
    value: 'pending'
  },
  {
    label: "To'liq to'landi",
    value: 'paid'
  },
  {
    label: 'Qisman',
    value: 'partial'
  },
  {
    label: "To'lanmadi",
    value: 'failed'
  }
];

export const currencyOptions = [
  {
    label: "So'm",
    value: 'UZS'
  },
  {
    label: 'Dollar',
    value: 'USD'
  }
];

export const paymentTypeOptions: {
  label: string;
  value: TPaymentType;
}[] = [
  {
    label: "To'liq",
    value: 'full'
  },
  {
    label: 'Qisman',
    value: 'partial'
  },
  {
    label: 'Qarz',
    value: 'debt'
  }
];
