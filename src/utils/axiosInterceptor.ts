import axios, { AxiosInstance, AxiosError, AxiosResponse } from "axios";
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

// Configurar interceptores
const setupAxiosInterceptors = () => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const { token } = useAuthStore.getState();
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
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

      // Solo procesar si hay datos en la respuesta y un mensaje
      if (responseData && responseData.message) {
        const { logout } = useAuthStore.getState();

        // Manejar expiración de token específicamente (esto se mantiene)
        if (responseData.code === "TOKEN_EXPIRED") {
          logout();
          // Opcional: Mostrar una notificación específica para sesión expirada
           notification.error({
             message: "Sesión expirada",
             description: "Tu sesión ha caducado. Por favor, vuelve a iniciar sesión.",
           });
          return Promise.reject(error); // Siempre rechazar la promesa en caso de error
        }

        // --- Lógica para determinar el mensaje a mostrar ---
        const originalErrorMessage = responseData.message;
        const validationErrorPrefix = "Payment processing failed: Validation error: "; // Prefijo a buscar
        let displayMessage = originalErrorMessage; // Por defecto, mostramos el mensaje original

        // Verificar si el mensaje original tiene el formato específico de error de validación anidado
        if (originalErrorMessage.startsWith(validationErrorPrefix)) {
          const jsonString = originalErrorMessage.substring(validationErrorPrefix.length); // Extraer el string JSON anidado

          try {
            const validationDetails = JSON.parse(jsonString); // Parsear el string JSON

            // Intentar encontrar el mensaje específico dentro del objeto parseado.
            // La estructura esperada es típicamente { "clave": ["mensaje"] }.
            // Iteramos sobre las claves para ser un poco más flexibles.
            let foundSpecificMessage = false;
            for (const key in validationDetails) {
              // Verificar que la propiedad pertenezca al objeto directamente
              if (Object.prototype.hasOwnProperty.call(validationDetails, key)) {
                const value = validationDetails[key];
                // Si el valor es un array y tiene elementos
                if (Array.isArray(value) && value.length > 0) {
                  // Tomamos el primer elemento del array como el mensaje específico
                  displayMessage = value[0];
                  foundSpecificMessage = true;
                  break; // Ya encontramos un mensaje, salimos del bucle
                }
              }
            }

            // Si se parseó el JSON, pero no encontramos el array con mensajes en el formato esperado
            if (!foundSpecificMessage) {
               console.warn("Interceptor: JSON interno parseado pero sin mensajes de validación esperados.", validationDetails);
               // En este caso, 'displayMessage' se queda con el 'originalErrorMessage' que
               // incluye el prefijo y el JSON (aunque el JSON interno no tuviera el array esperado).
               // Opcional: Puedes poner un fallback más genérico si prefieres no mostrar el JSON parcial.
               // displayMessage = "Formato de detalles de validación inesperado.";
            }

          } catch (e) {
            // Si falla el parseo del string JSON incrustado (ej. JSON mal formado)
            console.error("Interceptor: Error al parsear el string JSON incrustado:", e);
            // En este caso, 'displayMessage' se queda con el 'originalErrorMessage' que
            // incluye el prefijo y el intento de JSON mal formado.
            // Opcional: Puedes poner un fallback más genérico para errores de parseo.
            // displayMessage = "Error al procesar los detalles del error.";
          }
        }
        // Si el mensaje original NO empieza con el prefijo de validación,
        // la variable 'displayMessage' se mantiene con el 'originalErrorMessage' por defecto.
        // Si hubo error de parseo o estructura interna inesperada,
        // 'displayMessage' también puede haber quedado como 'originalErrorMessage'
        // (dependiendo de los fallbacks opcionales comentados arriba).

        // --- Mostrar notificación con el mensaje determinado ---
        notification.error({
          // Usamos 'displayMessage' para el texto principal de la notificación
          // Si por alguna razón 'displayMessage' está vacío, usamos un fallback genérico final
          message: displayMessage || "Ha ocurrido un error",
          // Puedes agregar una descripción si necesitas más detalle además del mensaje principal
          // description: "Detalles técnicos: " + originalErrorMessage, // Ejemplo
        });

      } else {
         // Caso: La respuesta de error no tiene la propiedad 'data' o 'message'
         console.error("Interceptor: Error de respuesta sin data o message:", error);
          notification.error({
            message: "Ha ocurrido un error",
            description: "No se pudo obtener la información detallada del error de la API.",
          });
      }

      return Promise.reject(error); // Propagar el error para que el código que hizo la llamada también pueda manejarlo
    }
  );
};

// Inicializar interceptores
setupAxiosInterceptors();

export default axiosInstance;
