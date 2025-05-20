import  { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ENDPOINTS from "@/api";
import { useAuthStore } from "@/store/auth.store";

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // 'verifying', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useAuthStore();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");
      const email = searchParams.get("email");

      if (!token || !email) {
        setStatus("error");
        setErrorMessage("Faltan parámetros de verificación");
        return;
      }

      try {
        // Usamos la URL de verificación de correo del backend
        const response = await axios.get(
          `${
            ENDPOINTS.AUTH.VERIFY_EMAIL.url
          }?token=${token}&email=${encodeURIComponent(email)}`
        );

        if (response.data.success) {
          // Guardar token si es necesario
          if (response.data.data?.token) {
            const userData = response.data.data.user;
            const authToken = response.data.data.token;
            const expiresAt = response.data.data.expiresAt;

            // Usamos la función login del store
            if (userData) {
              login(userData, authToken, expiresAt);
            }
          }
          setStatus("success");
        } else {
          setStatus("error");
          setErrorMessage(response.data.message || "Error de verificación");
        }
      } catch (error: any) {
        setStatus("error");
        setErrorMessage(
          error.response?.data?.message || "Error al conectar con el servidor"
        );
      }
    };

    verifyEmail();
  }, [searchParams, login]);

  // Renderizar diferentes vistas según el estado
  if (status === "verifying") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
        <h2 className="text-2xl font-bold mb-4">
          Verificando tu correo electrónico...
        </h2>
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 bg-green-50 rounded-lg">
        <svg
          className="w-16 h-16 text-green-500 mb-4"
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
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
        >
          Ir a la página principal
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 bg-red-50 rounded-lg">
      <svg
        className="w-16 h-16 text-red-500 mb-4"
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
      <button
        onClick={() => navigate("/")}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
      >
        Volver al inicio
      </button>
    </div>
  );
};

export default EmailVerification;
