export const API_ROUTES = {
  AUTH: {
    CHECK_SESSION: '/api/auth/check-session',
    CALLBACK: '/auth/callback',
  },
  PAYMENT: {
    WEBHOOK: '/api/webhook/stripe',
    CHECKOUT: '/api/create-checkout-session',
  },
  PROFILE: '/api/profile',
} as const;

// API 权限配置
export const API_PERMISSIONS = {
  PUBLIC: [
    API_ROUTES.AUTH.CHECK_SESSION,
    API_ROUTES.AUTH.CALLBACK,
    API_ROUTES.PAYMENT.WEBHOOK,
  ],
  PROTECTED: [
    API_ROUTES.PAYMENT.CHECKOUT,
    API_ROUTES.PROFILE,
  ],
} as const; 