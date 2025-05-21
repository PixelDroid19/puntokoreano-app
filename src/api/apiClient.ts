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
};

export { ENDPOINTS };
export default apiClient;
