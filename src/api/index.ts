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
  };
  PRODUCTS: {
    GET_ALL: ApiEndpoint;
    SEARCH: ApiEndpoint;
    PRODUCT_DETAIL: ApiEndpoint;
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
}

const getBaseUrl = (): string => {
  const env = import.meta.env.MODE;

  const urls: Record<string, string> = {
    development: "http://localhost:5000/api/v1",
    production: import.meta.env.VITE_API_URL,
  };

  return urls[env] || urls.development;
};

export const BASE_URL = getBaseUrl();

const ENDPOINTS: Endpoints = {
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
  },

  PRODUCTS: {
    PRODUCT_DETAIL: {
      url: `${BASE_URL}/products/detail`,
      method: "GET",
    },
    GET_ALL: {
      url: `${BASE_URL}/products/get-products`,
      method: "GET",
    },
    SEARCH: {
      url: `${BASE_URL}/products/search`,
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
};

export default ENDPOINTS;
