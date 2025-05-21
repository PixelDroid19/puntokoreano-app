import axios, { AxiosInstance, AxiosError, AxiosResponse, AxiosRequestConfig } from "axios";
import { notification } from "antd";
import { useAuthStore } from "../store/auth.store";
import { BASE_URL } from "../api";

// Tipo para la estructura de respuesta de error del servidor
interface ApiErrorResponse {
  message: string;
  [key: string]: any;
}

// Crear una instancia personalizada de axios
const axiosInstance: AxiosInstance = axios.create({
  // baseURL no debería ser la raíz, sino una URL que no termine en API
  // Es mejor omitir baseURL si no es necesario o definir endpoints completos
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Lista de endpoints que no necesitan validación de token
const PUBLIC_ENDPOINTS = [
  '/auth/ecommerce/login',
  '/auth/ecommerce/register',
  '/auth/encryption-key',
  '/auth/verify-email',
  '/settings/about',
  '/highlighted-services',
  '/products/search',
  '/products/vehicle-filter-options',
  '/products/detail',
  '/filters/get-filters',
  '/groups/get-groups',
  '/blog',
  '/payment/config',
  '/payment/methods'
];

// Almacenamiento de la última validación de token para no hacer demasiadas peticiones
const tokenValidationCache = {
  isValid: false,
  lastChecked: 0,
  validityTimeWindow: 5 * 60 * 1000, // 5 minutos
};

// Verificar si un endpoint es público (no necesita token)
const isPublicEndpoint = (url: string) => {
  if (!url) return false;

  return PUBLIC_ENDPOINTS.some(endpoint => url.includes(endpoint));
};

// Verificar validez del token mediante caché o llamada al servidor
const validateToken = async (): Promise<boolean> => {
  const { token, logout } = useAuthStore.getState();
  
  // Si no hay token, no es válido
  if (!token) {
    return false;
  }
  
  const now = Date.now();

  // Si tenemos una validación reciente, usamos el caché
  if (tokenValidationCache.lastChecked > 0 && 
      now - tokenValidationCache.lastChecked < tokenValidationCache.validityTimeWindow) {
    return tokenValidationCache.isValid;
  }
  
  try {
    // Llamada al endpoint de verificación de sesión
    const checkSessionUrl = `${BASE_URL}/auth/ecommerce/check-session`;
    
    // Usamos axios directamente para evitar ciclos infinitos
    const response = await axios.get(checkSessionUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    // Actualizar caché de validación
    tokenValidationCache.isValid = response.status === 200;
    tokenValidationCache.lastChecked = now;
    
    return tokenValidationCache.isValid;
  } catch (error) {
    // Si hay un error en la validación, asumimos que el token no es válido
    tokenValidationCache.isValid = false;
    tokenValidationCache.lastChecked = now;
    
    // Cerrar sesión al detectar token inválido
    await logout();
    
    return false;
  }
};

// Configurar interceptores
const setupAxiosInterceptors = () => {
  axiosInstance.interceptors.request.use(
    async (config) => {
      const { token } = useAuthStore.getState();
      
      // Si hay token y no es un endpoint público, verificamos validez
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
        
        // Solo validar token para endpoints que no son públicos
        if (config.url && !isPublicEndpoint(config.url)) {
          const isTokenValid = await validateToken();
          
          if (!isTokenValid) {
            // Si el token no es válido, rechazamos la petición
            // El error será capturado por el interceptor de respuesta
            return Promise.reject(new Error("Token inválido o sesión expirada"));
          }
        }
      }
      
      // Asegúrate de que la URL completa esté formada y no sea solo la base
      // Esto evita solicitudes a la URL base
      if (!config.url) {
        console.error("Se está intentando hacer una solicitud sin URL específica");
        // Rechazar peticiones sin URL específica para evitar llamadas a la raíz
        return Promise.reject(new Error("URL de solicitud no especificada"));
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Interceptor de respuesta para manejar errores
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError<ApiErrorResponse>) => {
      const responseData = error.response?.data; // Accede de forma segura a los datos de la respuesta
      const status = error.response?.status;

      // Manejar errores de autorización (401) o token expirado
      if (status === 401 || responseData?.code === "TOKEN_EXPIRED") {
        const { logout } = useAuthStore.getState();
        await logout();
        
        notification.error({
          message: "Sesión expirada",
          description: "Tu sesión ha caducado. Por favor, vuelve a iniciar sesión.",
        });
        
        // Invalidar caché de validación
        tokenValidationCache.isValid = false;
        tokenValidationCache.lastChecked = 0;
        
        return Promise.reject(error);
      }

      // Solo procesar si hay datos en la respuesta y un mensaje
      if (responseData && responseData.message) {
        // --- Lógica para determinar el mensaje a mostrar ---
        const originalErrorMessage = responseData.message;
        const validationErrorPrefix = "Payment processing failed: Validation error: ";
        let displayMessage = originalErrorMessage;

        // Verificar si el mensaje original tiene el formato específico de error de validación anidado
        if (originalErrorMessage.startsWith(validationErrorPrefix)) {
          const jsonString = originalErrorMessage.substring(validationErrorPrefix.length);

          try {
            const validationDetails = JSON.parse(jsonString);
            let foundSpecificMessage = false;
            for (const key in validationDetails) {
              if (Object.prototype.hasOwnProperty.call(validationDetails, key)) {
                const value = validationDetails[key];
                if (Array.isArray(value) && value.length > 0) {
                  displayMessage = value[0];
                  foundSpecificMessage = true;
                  break;
                }
              }
            }

            if (!foundSpecificMessage) {
              console.warn("Interceptor: JSON interno parseado pero sin mensajes de validación esperados.", validationDetails);
            }
          } catch (e) {
            console.error("Interceptor: Error al parsear el string JSON incrustado:", e);
          }
        }

        notification.error({
          message: displayMessage || "Ha ocurrido un error",
        });
      } else {
        console.error("Interceptor: Error de respuesta sin data o message:", error);
        notification.error({
          message: "Ha ocurrido un error",
          description: "No se pudo obtener la información detallada del error de la API.",
        });
      }

      return Promise.reject(error);
    }
  );
};

// Inicializar interceptores
setupAxiosInterceptors();

export default axiosInstance;
