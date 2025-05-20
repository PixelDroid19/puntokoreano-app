// src/api/types.ts
export interface ApiEndpoint {
  url: string;
  method: string;
}

export interface Endpoints {
  AUTH: {
    LOGIN: ApiEndpoint;
    CHECK_SESSION: ApiEndpoint;
    REGISTER: ApiEndpoint;
    LOGOUT: ApiEndpoint;
    ENCRYPTION_KEY: ApiEndpoint;
    VERIFY_EMAIL: ApiEndpoint;
  };
  PRODUCTS: {
    SEARCH: ApiEndpoint;
    PRODUCT_DETAIL: ApiEndpoint;
    VEHICLE_FILTER_OPTIONS: ApiEndpoint;
  };
  FILTERS: {
    GET_ALL: ApiEndpoint;
  };
  GROUPS: {
    GET_ALL: ApiEndpoint;
  };
  REVIEWS: {
    GET_PRODUCT_REVIEWS: ApiEndpoint;
    GET_REVIEW_STATS: ApiEndpoint;
    CREATE_REVIEW: ApiEndpoint;
    VOTE_REVIEW: ApiEndpoint;
    REPORT_REVIEW: ApiEndpoint;
    CHECK_CAN_REVIEW: ApiEndpoint;

    /*   UPDATE_REVIEW: ApiEndpoint;
    DELETE_REVIEW: ApiEndpoint;
    GET_USER_REVIEWS: ApiEndpoint;
 
    GET_PENDING_REVIEWS: ApiEndpoint;
    MODERATE_REVIEW: ApiEndpoint;
    GET_REVIEW_ANALYTICS: ApiEndpoint;
    BULK_MODERATE_REVIEWS: ApiEndpoint;

   
    GET_REVIEW_STATUS: ApiEndpoint; */
  };
  NOTIFICATIONS: {
    SEND: ApiEndpoint;
    GET_ALL: ApiEndpoint;
    MARK_AS_READ: ApiEndpoint;
  };

  BLOG: {
    GET_PUBLISHED: ApiEndpoint;
    GET_BY_SLUG: ApiEndpoint;
    GET_CATEGORIES: ApiEndpoint;
    GET_TAGS: ApiEndpoint;
    GET_FEATURED: ApiEndpoint;
    GET_RELATED: ApiEndpoint;
  };
  ORDERS: {
    CREATE: ApiEndpoint;
    GET_ORDER: ApiEndpoint;
    CALCULATE_SHIPPING: ApiEndpoint;
    GET_USER_ORDERS: ApiEndpoint;
    GET_ORDER_DETAILS: ApiEndpoint;
    CANCEL_ORDER: ApiEndpoint;
    TRACK_ORDER: ApiEndpoint;
    PROCESS_PAYMENT: ApiEndpoint;
    PAYMENT_STATUS: ApiEndpoint;
  };
  PAYMENT: {
    WOMPI_NEQUI_PAYMENT: ApiEndpoint;
    TRANSACTION_STATUS: ApiEndpoint;
    CREATE_INTENT: ApiEndpoint;
    CREATE_TRANSACTION: ApiEndpoint;
    CONFIG: ApiEndpoint;
    WEBHOOK: ApiEndpoint;
    METHODS: ApiEndpoint;
    TOKENIZE_CARD: ApiEndpoint;
    TOKENIZE_NEQUI: ApiEndpoint;
    NEQUI_TOKEN_STATUS: ApiEndpoint;
    NEQUI_TOKEN_POLL: ApiEndpoint;
    NEQUI_PAYMENT_SOURCE: ApiEndpoint;
  };
  SETTINGS: {
    GET_PUBLIC_ABOUT: ApiEndpoint;
    GET_ACHIEVEMENTS: ApiEndpoint;
    GET_HIGHLIGHTED_SERVICES: ApiEndpoint;
  };
  USER: {
    GET_REVIEWS: ApiEndpoint;
    GET_ORDERS: ApiEndpoint;
    GET_PROFILE: ApiEndpoint;
    UPDATE_PROFILE: ApiEndpoint;
    CHANGE_PASSWORD: ApiEndpoint;
    GET_ADDRESSES: ApiEndpoint;
    ADD_ADDRESS: ApiEndpoint;
    UPDATE_ADDRESS: ApiEndpoint;
    DELETE_ADDRESS: ApiEndpoint;
    SET_DEFAULT_ADDRESS: ApiEndpoint;
    GET_PAYMENT_METHODS: ApiEndpoint;
    ADD_PAYMENT_METHOD: ApiEndpoint;
    DELETE_PAYMENT_METHOD: ApiEndpoint;
    SET_DEFAULT_PAYMENT_METHOD: ApiEndpoint;
    GET_WISHLIST: ApiEndpoint;
    ADD_TO_WISHLIST: ApiEndpoint;
    REMOVE_FROM_WISHLIST: ApiEndpoint;
    GET_USER_REVIEWS: ApiEndpoint;
  };
}

const getBaseUrl = (): string => {
  const env = import.meta.env.MODE;

  const urls: Record<string, string> = {
    development: "http://localhost:5000/api/v1",
    production: import.meta.env.VITE_API_REST_URL,
  };

  return urls[env] || urls.development;
};

export const BASE_URL = getBaseUrl();

const ENDPOINTS: Endpoints = {
  SETTINGS: {
    GET_PUBLIC_ABOUT: {
      url: `${BASE_URL}/settings/about`,
      method: "GET",
    },
    GET_ACHIEVEMENTS: {
      url: `${BASE_URL}/highlighted-services/achievements`,
      method: "GET",
    },
    GET_HIGHLIGHTED_SERVICES: {
      url: `${BASE_URL}/highlighted-services`,
      method: "GET",
    },
  },
  AUTH: {
    LOGIN: {
      url: `${BASE_URL}/auth/ecommerce/login`,
      method: "POST",
    },
    REGISTER: {
      url: `${BASE_URL}/auth/ecommerce/register`,
      method: "POST",
    },
    LOGOUT: {
      url: `${BASE_URL}/auth/ecommerce/logout`,
      method: "POST",
    },
    CHECK_SESSION: {
      url: `${BASE_URL}/auth/ecommerce/check-session`,
      method: "GET",
    },
    ENCRYPTION_KEY: {
      url: `${BASE_URL}/auth/encryption-key`,
      method: "GET",
    },
    VERIFY_EMAIL: {
      url: `${BASE_URL}/auth/verify-email`,
      method: "GET",
    },
  },
  PAYMENT: {
    WOMPI_NEQUI_PAYMENT: {
      url: `${BASE_URL}/payment/wompi/nequi/payment`,
      method: "POST",
    },
    TRANSACTION_STATUS: {
      url: `${BASE_URL}/payment/transaction`,
      method: "GET",
    },
    CREATE_INTENT: {
      url: `${BASE_URL}/payment/create-payment-intent`,
      method: "POST",
    },
    CREATE_TRANSACTION: {
      url: `${BASE_URL}/payment/create-transaction`,
      method: "POST",
    },
    TOKENIZE_CARD: {
      url: `${BASE_URL}/payment/wompi/tokenize-card`,
      method: "POST",
    },
    CONFIG: {
      url: `${BASE_URL}/payment/config`,
      method: "GET",
    },
    WEBHOOK: {
      url: `${BASE_URL}/payment/webhook`,
      method: "POST",
    },
    METHODS: {
      url: `${BASE_URL}/payment/methods`,
      method: "GET",
    },
    TOKENIZE_NEQUI: {
      url: `${BASE_URL}/payment/wompi/tokenize-nequi`,
      method: "POST",
    },
    NEQUI_TOKEN_STATUS: {
      url: `${BASE_URL}/payment/wompi/nequi-token/:tokenId`,
      method: "GET",
    },
    NEQUI_TOKEN_POLL: {
      url: `${BASE_URL}/payment/wompi/nequi-token/:tokenId/poll`,
      method: "GET",
    },
    NEQUI_PAYMENT_SOURCE: {
      url: `${BASE_URL}/payment/wompi/nequi-payment-source`,
      method: "POST",
    },
  },
  ORDERS: {
    CREATE: {
      url: `${BASE_URL}/orders`,
      method: "POST",
    },
    GET_ORDER: {
      url: `${BASE_URL}/orders/getOrder/:id`,
      method: "GET",
    },
    CALCULATE_SHIPPING: {
      url: `${BASE_URL}/orders/calculate-shipping`,
      method: "POST",
    },
    GET_USER_ORDERS: {
      url: `${BASE_URL}/orders/user`,
      method: "GET",
    },
    GET_ORDER_DETAILS: {
      url: `${BASE_URL}/orders/:orderId/details`,
      method: "GET",
    },
    CANCEL_ORDER: {
      url: `${BASE_URL}/orders/:orderId/cancel`,
      method: "POST",
    },
    TRACK_ORDER: {
      url: `${BASE_URL}/orders/:orderId/track`,
      method: "GET",
    },
    PROCESS_PAYMENT: {
      url: `${BASE_URL}/orders/payment/process`,
      method: "POST",
    },
    PAYMENT_STATUS: {
      url: `${BASE_URL}/orders/payment/status/:orderId`,
      method: "GET",
    },
  },
  USER: {
    GET_REVIEWS: {
      url: `${BASE_URL}/user/reviews`,
      method: "GET",
    },
    GET_ORDERS: {
      url: `${BASE_URL}/user/orders`,
      method: "GET",
    },
    GET_PROFILE: {
      url: `${BASE_URL}/user/profile`,
      method: "GET",
    },
    UPDATE_PROFILE: {
      url: `${BASE_URL}/user/profile`,
      method: "PATCH",
    },
    CHANGE_PASSWORD: {
      url: `${BASE_URL}/user/change-password`,
      method: "POST",
    },
    GET_ADDRESSES: {
      url: `${BASE_URL}/user/addresses`,
      method: "GET",
    },
    ADD_ADDRESS: {
      url: `${BASE_URL}/user/addresses`,
      method: "POST",
    },
    UPDATE_ADDRESS: {
      url: `${BASE_URL}/user/addresses/:addressId`,
      method: "PUT",
    },
    DELETE_ADDRESS: {
      url: `${BASE_URL}/user/addresses/:addressId`,
      method: "DELETE",
    },
    SET_DEFAULT_ADDRESS: {
      url: `${BASE_URL}/user/addresses/:addressId/default`,
      method: "PUT",
    },
    GET_PAYMENT_METHODS: {
      url: `${BASE_URL}/user/payment-methods`,
      method: "GET",
    },
    ADD_PAYMENT_METHOD: {
      url: `${BASE_URL}/user/payment-methods`,
      method: "POST",
    },
    DELETE_PAYMENT_METHOD: {
      url: `${BASE_URL}/user/payment-methods/:methodId`,
      method: "DELETE",
    },
    SET_DEFAULT_PAYMENT_METHOD: {
      url: `${BASE_URL}/user/payment-methods/:methodId/default`,
      method: "PUT",
    },
    GET_WISHLIST: {
      url: `${BASE_URL}/user/wishlist`,
      method: "GET",
    },
    ADD_TO_WISHLIST: {
      url: `${BASE_URL}/user/wishlist/:productId`,
      method: "POST",
    },
    REMOVE_FROM_WISHLIST: {
      url: `${BASE_URL}/user/wishlist/:productId`,
      method: "DELETE",
    },
    GET_USER_REVIEWS: {
      url: `${BASE_URL}/user/reviews`,
      method: "GET",
    },
  },
  PRODUCTS: {
    SEARCH: {
      url: `${BASE_URL}/products/search`,
      method: "POST",
    },
    VEHICLE_FILTER_OPTIONS: {
      url: `${BASE_URL}/products/vehicle-filter-options`, 
      method: "GET",
    },
    PRODUCT_DETAIL: {
      url: `${BASE_URL}/products/detail/:id`,
      method: "GET",
    },
  },

  FILTERS: {
    GET_ALL: {
      url: `${BASE_URL}/filters/get-filters`,
      method: "GET",
    },
  },

  GROUPS: {
    GET_ALL: {
      url: `${BASE_URL}/groups/get-groups`,
      method: "GET",
    },
  },

  REVIEWS: {
    GET_PRODUCT_REVIEWS: {
      url: `${BASE_URL}/reviews/product/:productId`,
      method: "GET",
    },
    GET_REVIEW_STATS: {
      url: `${BASE_URL}/reviews/stats/product/:productId`,
      method: "GET",
    },
    CREATE_REVIEW: {
      url: `${BASE_URL}/reviews/product/:productId`,
      method: "POST",
    },
    VOTE_REVIEW: {
      url: `${BASE_URL}/reviews/:reviewId/vote`,
      method: "POST",
    },
    REPORT_REVIEW: {
      url: `${BASE_URL}/reviews/:reviewId/report`,
      method: "POST",
    },
    CHECK_CAN_REVIEW: {
      url: `${BASE_URL}/reviews/can-review/:productId`,
      method: "GET",
    },
  },

  NOTIFICATIONS: {
    SEND: {
      url: `${BASE_URL}/notifications/send`,
      method: "POST",
    },
    GET_ALL: {
      url: `${BASE_URL}/notifications`,
      method: "GET",
    },
    MARK_AS_READ: {
      url: `${BASE_URL}/notifications/mark-read`,
      method: "POST",
    },
  },
  BLOG: {
    GET_PUBLISHED: { url: `${BASE_URL}/blog`, method: "GET" },
    GET_BY_SLUG: { url: `${BASE_URL}/blog/post/:slug`, method: "GET" },
    GET_CATEGORIES: { url: `${BASE_URL}/blog/categories`, method: "GET" },
    GET_TAGS: { url: `${BASE_URL}/blog/tags`, method: "GET" },
    GET_FEATURED: { url: `${BASE_URL}/blog/featured`, method: "GET" },
    GET_RELATED: { url: `${BASE_URL}/blog/related`, method: "GET" },
  },
};

export default ENDPOINTS;
