export const ROUTES = {
  home: '/',
  orders: '/orders',
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
