import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ENDPOINTS from "@/api";
import { useAuthStore } from "@/store/auth.store";
import { notification } from "antd";

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // 'verifying', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState("");
  const { login, updateUser, user: currentUser, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");
      const email = searchParams.get("email");

      console.log("🔍 Iniciando verificación de email:", { token: token?.substring(0, 10) + "...", email });

      if (!token || !email) {
        console.error("❌ Parámetros de verificación faltantes:", { token: !!token, email: !!email });
        setStatus("error");
        setErrorMessage("Faltan parámetros de verificación");
        return;
      }

      try {
        console.log("📡 Enviando petición de verificación...");
        
        // Usamos la URL de verificación de correo del backend
        const response = await axios.get(
          `${ENDPOINTS.AUTH.VERIFY_EMAIL.url}?token=${token}&email=${encodeURIComponent(email)}`
        );

        console.log("✅ Respuesta de verificación recibida:", response.data);

        if (response.data.success) {
          console.log("🎉 Verificación exitosa");
          
          // Si el backend devuelve un nuevo token, actualizar la sesión
          if (response.data.data?.token) {
            console.log("🔄 Actualizando token de autenticación...");
            
            const authToken = response.data.data.token;
            const expiresAt = response.data.data.expiresAt;

            // Si ya hay un usuario autenticado, actualizarlo
            if (isAuthenticated && currentUser) {
              console.log("👤 Actualizando usuario existente con estado verificado");
              
              // Actualizar el usuario actual con el estado verificado
              const updatedUser = {
                ...currentUser,
                verified: true,
                // Asegurar que el campo emailVerified también se actualice si existe
                emailVerified: true
              };
              
              // Usar login para actualizar tanto el token como el usuario
              login(updatedUser, authToken, expiresAt);
              
            } else {
              console.log("🔐 No hay sesión activa, esperando inicio de sesión manual");
            }
          } else {
            // Si no hay token nuevo pero el usuario está autenticado, solo actualizar el estado
            if (isAuthenticated && currentUser) {
              console.log("📝 Actualizando estado de verificación del usuario actual");
              const updatedUser = {
                ...currentUser,
                verified: true,
                emailVerified: true
              };
              updateUser(updatedUser);
            }
          }

          setStatus("success");
          
          // Mostrar notificación de éxito
          notification.success({
            message: "¡Email verificado!",
            description: "Tu correo electrónico ha sido verificado exitosamente. Ahora puedes acceder a todas las funcionalidades.",
            duration: 6,
          });

          // Redirigir después de un breve delay para que el usuario vea el mensaje
          setTimeout(() => {
            navigate("/", { replace: true });
          }, 3000);
          
        } else {
          console.error("❌ Verificación fallida:", response.data.message);
          setStatus("error");
          setErrorMessage(response.data.message || "Error de verificación");
        }
      } catch (error: any) {
        console.error("💥 Error durante la verificación:", error);
        
        const errorMsg = error.response?.data?.message || "Error al conectar con el servidor";
        console.error("📋 Detalles del error:", {
          status: error.response?.status,
          message: errorMsg,
          code: error.response?.data?.code
        });
        
        setStatus("error");
        setErrorMessage(errorMsg);
        
        // Mostrar notificación de error
        notification.error({
          message: "Error de verificación",
          description: errorMsg,
          duration: 8,
        });
      }
    };

    verifyEmail();
  }, [searchParams, login, updateUser, currentUser, isAuthenticated, navigate]);

  // Renderizar diferentes vistas según el estado
  if (status === "verifying") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">
            Verificando tu correo electrónico...
          </h2>
          <p className="text-gray-600">
            Por favor espera mientras procesamos tu verificación.
          </p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
        <div className="text-center bg-green-50 rounded-lg p-8 max-w-md">
          <svg
            className="w-16 h-16 text-green-500 mb-4 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
          <h2 className="text-2xl font-bold text-green-700 mb-2">
            ¡Verificación exitosa!
          </h2>
          <p className="text-center text-gray-700 mb-6">
            Tu correo electrónico ha sido verificado correctamente. 
            Serás redirigido al inicio en unos segundos.
          </p>
          <button
            onClick={() => navigate("/", { replace: true })}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-300"
          >
            Ir a la página principal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
      <div className="text-center bg-red-50 rounded-lg p-8 max-w-md">
        <svg
          className="w-16 h-16 text-red-500 mb-4 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
        <h2 className="text-2xl font-bold text-red-700 mb-2">
          Error de verificación
        </h2>
        <p className="text-center text-gray-700 mb-6">{errorMessage}</p>
        <div className="space-y-3">
          <button
            onClick={() => navigate("/", { replace: true })}
            className="w-full px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
          >
            Volver al inicio
          </button>
          {isAuthenticated && (
            <button
              onClick={() => navigate("/account", { replace: true })}
              className="w-full px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition duration-300"
            >
              Ir a mi cuenta
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
