import axiosInstance from "../utils/axiosInterceptor";
import ENDPOINTS, { ApiEndpoint } from "./index";

interface RequestOptions {
  params?: Record<string, any>;
  data?: any;
  headers?: Record<string, string>;
}

/**
 * Función para realizar peticiones HTTP usando la instancia personalizada de Axios
 * @param endpoint Configuración del endpoint (url y método)
 * @param options Opciones adicionales (params, data, headers)
 * @returns Promise con la respuesta
 */
const apiClient = async <T = any>(
  endpoint: ApiEndpoint,
  options: RequestOptions = {}
): Promise<T> => {
  const { url, method } = endpoint;
  const { params, data, headers } = options;

  try {
    const response = await axiosInstance({
      url,
      method,
      params,
      data,
      headers,
    });

    return response.data;
  } catch (error) {
    // El manejo de errores ya está implementado en los interceptores
    throw error;
  }
};

/**
 * Función para reemplazar parámetros en la URL
 * Por ejemplo: /users/:id -> /users/123
 * @param url URL con parámetros
 * @param params Objeto con los parámetros a reemplazar
 * @returns URL con los parámetros reemplazados
 */
export const buildUrl = (
  url: string,
  params: Record<string, string | number>
): string => {
  let finalUrl = url;
  Object.keys(params).forEach((key) => {
    finalUrl = finalUrl.replace(`:${key}`, String(params[key]));
  });
  return finalUrl;
};

// Funciones helper para cada tipo de petición
export const apiGet = <T = any>(
  endpoint: ApiEndpoint,
  urlParams?: Record<string, string | number>,
  queryParams?: Record<string, any>,
  headers?: Record<string, string>
): Promise<T> => {
  let url = endpoint.url;
  if (urlParams) {
    url = buildUrl(url, urlParams);
  }
  return apiClient<T>({ ...endpoint, url }, { params: queryParams, headers });
};

export const apiPost = <T = any>(
  endpoint: ApiEndpoint,
  data?: any,
  urlParams?: Record<string, string | number>,
  headers?: Record<string, string>
): Promise<T> => {
  let url = endpoint.url;
  if (urlParams) {
    url = buildUrl(url, urlParams);
  }
  return apiClient<T>({ ...endpoint, url }, { data, headers });
};

export const apiPut = <T = any>(
  endpoint: ApiEndpoint,
  data?: any,
  urlParams?: Record<string, string | number>,
  headers?: Record<string, string>
): Promise<T> => {
  let url = endpoint.url;
  if (urlParams) {
    url = buildUrl(url, urlParams);
  }
  return apiClient<T>({ ...endpoint, url }, { data, headers });
};

export const apiPatch = <T = any>(
  endpoint: ApiEndpoint,
  data?: any,
  urlParams?: Record<string, string | number>,
  headers?: Record<string, string>
): Promise<T> => {
  let url = endpoint.url;
  if (urlParams) {
    url = buildUrl(url, urlParams);
  }
  return apiClient<T>({ ...endpoint, url }, { data, headers });
};

export const apiDelete = <T = any>(
  endpoint: ApiEndpoint,
  urlParams?: Record<string, string | number>,
  data?: any,
  headers?: Record<string, string>
): Promise<T> => {
  let url = endpoint.url;
  if (urlParams) {
    url = buildUrl(url, urlParams);
  }
  return apiClient<T>({ ...endpoint, url }, { data, headers });
};

// Funciones específicas para la integración con Wompi
export const wompiService = {
  /**
   * Configura el modo de usuario (desarrollo o producción)
   * @param userData - Datos del usuario incluyendo modo de desarrollo
   */
  setUserMode: async (userData: { isDevelopment: boolean }) => {
    return apiPost(ENDPOINTS.PAYMENT.SET_USER_MODE, userData);
  },

  /**
   * Obtiene los métodos de pago disponibles
   * @param isDevelopment - Indica si se debe usar el entorno de desarrollo
   */
  getPaymentMethods: async (isDevelopment?: boolean) => {
    return apiGet(ENDPOINTS.PAYMENT.METHODS, undefined, { development: isDevelopment });
  },

  /**
   * Obtiene los tokens de aceptación de Wompi
   * @param userData - Datos del usuario
   */
  getAcceptanceTokens: async (userData?: { isDevelopment: boolean }) => {
    return apiPost(ENDPOINTS.PAYMENT.ACCEPTANCE_TOKENS, { userData });
  },

  /**
   * Tokeniza una tarjeta de crédito
   * @param cardData - Datos de la tarjeta
   * @param acceptedTerms - Indica si se aceptaron los términos
   * @param userData - Datos del usuario
   */
  tokenizeCard: async (
    cardData: {
      number: string;
      exp_month: string;
      exp_year: string;
      cvc: string;
      card_holder: string;
    },
    acceptedTerms: boolean,
    userData?: { isDevelopment: boolean }
  ) => {
    return apiPost(ENDPOINTS.PAYMENT.TOKENIZE_CARD, {
      cardData,
      acceptedTerms,
      userData
    });
  },

  /**
   * Procesa un pago para una orden
   * @param orderId - ID de la orden
   * @param paymentMethod - Método de pago
   * @param userData - Datos del usuario
   */
  processPayment: async (
    orderId: string,
    paymentMethod: any,
    userData?: { isDevelopment: boolean }
  ) => {
    return apiPost(
      ENDPOINTS.ORDERS.PROCESS_PAYMENT,
      {
        payment_method: paymentMethod,
        userData
      },
      { id: orderId }
    );
  },

  /**
   * Verifica el estado de un pago
   * @param orderId - ID de la orden
   */
  checkPaymentStatus: async (orderId: string) => {
    return apiGet(ENDPOINTS.ORDERS.PAYMENT_STATUS, { orderId });
  },

  /**
   * Crea una nueva orden
   * @param orderData - Datos de la orden
   */
  createOrder: async (orderData: {
    customer: {
      name: string;
      email: string;
      phone?: string;
      userData?: {
        isDevelopment: boolean;
      };
    };
    items: Array<{
      code: string;
      name: string;
      price: number;
      quantity: number;
    }>;
  }) => {
    return apiPost(ENDPOINTS.ORDERS.CREATE, orderData);
  },

  /**
   * Obtiene los detalles de una orden
   * @param orderId - ID de la orden
   */
  getOrderDetails: async (orderId: string) => {
    return apiGet(ENDPOINTS.ORDERS.GET_ORDER, { id: orderId });
  },

  /**
   * Calcula el costo de envío
   * @param data - Datos para el cálculo
   */
  calculateShipping: async (data: {
    items: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
    }>;
    shipping_address: {
      name: string;
      street: string;
      city: string;
      state: string;
      country: string;
      zip: string;
      phone: string;
      email: string;
      type: string;
    };
    shipping_method: string;
  }) => {
    return apiPost(ENDPOINTS.ORDERS.CALCULATE_SHIPPING, data);
  },

  /**
   * Obtiene datos de prueba para un método de pago específico
   * @param method - Método de pago
   * @param status - Estado deseado (approved, declined)
   */
  getTestData: (method: string, status: 'approved' | 'declined') => {
    const testData: Record<string, Record<string, any>> = {
      CARD: {
        approved: {
          cardNumber: '4242 4242 4242 4242',
          expiry: '12/29',
          cvv: '123',
          cardHolder: 'APPROVED',
          installments: 1
        },
        declined: {
          cardNumber: '4111 1111 1111 1111',
          expiry: '12/29',
          cvv: '123',
          cardHolder: 'REJECTED',
          installments: 1
        }
      },
      NEQUI: {
        approved: {
          phone: '3991111111'
        },
        declined: {
          phone: '3992222222'
        }
      },
      PSE: {
        approved: {
          user_type: 0,
          user_legal_id_type: 'CC',
          user_legal_id: '1234567890',
          financial_institution_code: '1',
          payment_description: 'Pago de prueba aprobado'
        },
        declined: {
          user_type: 0,
          user_legal_id_type: 'CC',
          user_legal_id: '1234567890',
          financial_institution_code: '2',
          payment_description: 'Pago de prueba rechazado'
        }
      }
    };

    return testData[method]?.[status] || null;
  }
};

export { ENDPOINTS };
export default apiClient;
