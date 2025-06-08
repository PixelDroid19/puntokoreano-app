// 🔒 Utilidades de validación mejoradas para formularios
// Previene emotes, caracteres especiales y garantiza longitudes mínimas

export const ValidationUtils = {
  // ✅ Validaciones para nombres y apellidos
  validateName: (value: string, fieldName: string = "campo") => {
    if (!value) return `El ${fieldName} es requerido`;
    
    const cleaned = value.trim();
    
    // Verificar longitud mínima
    if (cleaned.length < 2) {
      return `El ${fieldName} debe tener al menos 2 caracteres`;
    }
    
    // Verificar longitud máxima
    if (cleaned.length > 30) {
      return `El ${fieldName} no puede exceder 30 caracteres`;
    }
    
    // Verificar que solo contenga letras y espacios
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ\s]+$/.test(cleaned)) {
      return `El ${fieldName} solo puede contener letras`;
    }
    
    // Verificar que no sea solo espacios
    if (!/[A-Za-zÁÉÍÓÚáéíóúÜüÑñ]/.test(cleaned)) {
      return `El ${fieldName} no puede estar vacío`;
    }
    
    return null;
  },

  // ✅ Validación para nombre en tarjeta de crédito
  validateCardHolder: (value: string) => {
    if (!value) return "El nombre del titular es requerido";
    
    const cleaned = value.trim().replace(/\s+/g, ' ');
    
    // Verificar longitud mínima (requisito del backend)
    if (cleaned.length < 5) {
      return "El nombre debe tener al menos 5 caracteres";
    }
    
    // Verificar longitud máxima
    if (cleaned.length > 50) {
      return "El nombre no puede exceder 50 caracteres";
    }
    
    // Verificar que solo contenga letras, espacios y caracteres latinos válidos
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ\s]+$/.test(cleaned)) {
      return "El nombre solo puede contener letras y espacios";
    }
    
    // Verificar que tenga al menos un nombre y un apellido
    const nameParts = cleaned.split(' ').filter(part => part.length > 0);
    if (nameParts.length < 2) {
      return "Debe incluir al menos nombre y apellido";
    }
    
    // Verificar que cada parte tenga al menos 2 caracteres
    if (nameParts.some(part => part.length < 2)) {
      return "Cada nombre/apellido debe tener al menos 2 caracteres";
    }
    
    return null;
  },

  // ✅ Validación para emails
  validateEmail: (value: string) => {
    if (!value) return "El correo electrónico es requerido";
    
    // Verificar longitud máxima
    if (value.length > 100) {
      return "El correo no puede exceder 100 caracteres";
    }
    
    // Verificar que no contenga caracteres especiales peligrosos
    if (/[<>'"{}\\]/.test(value)) {
      return "El correo contiene caracteres no válidos";
    }
    
    // Verificar formato de email básico
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Formato de correo inválido";
    }
    
    return null;
  },

  // ✅ Validación para teléfonos colombianos
  validateColombianPhone: (value: string) => {
    if (!value) return "El número celular es requerido";
    
    const cleaned = value.replace(/\D/g, "");
    
    // Verificar longitud exacta
    if (cleaned.length !== 10) {
      return "El número debe tener exactamente 10 dígitos";
    }
    
    // Verificar que comience con 3 (celulares en Colombia)
    if (!cleaned.startsWith("3")) {
      return "El número celular debe comenzar con 3";
    }
    
    return null;
  },

  // ✅ Validación para direcciones
  validateAddress: (value: string) => {
    if (!value) return "La dirección es requerida";
    
    const cleaned = value.trim();
    
    // Verificar longitud mínima
    if (cleaned.length < 8) {
      return "La dirección debe tener al menos 8 caracteres";
    }
    
    // Verificar longitud máxima
    if (cleaned.length > 100) {
      return "La dirección no puede exceder 100 caracteres";
    }
    
    // Verificar que contenga al menos una letra y un número
    if (!/[A-Za-zÁÉÍÓÚáéíóúÜüÑñ]/.test(cleaned)) {
      return "La dirección debe contener letras";
    }
    
    if (!/\d/.test(cleaned)) {
      return "La dirección debe contener al menos un número";
    }
    
    // Verificar que no contenga caracteres peligrosos
    if (/[<>'"{}\\]/.test(cleaned)) {
      return "La dirección contiene caracteres no válidos";
    }
    
    return null;
  },

  // ✅ Validación para ciudades
  validateCity: (value: string) => {
    if (!value) return "La ciudad es requerida";
    
    const cleaned = value.trim();
    
    // Verificar longitud mínima
    if (cleaned.length < 3) {
      return "La ciudad debe tener al menos 3 caracteres";
    }
    
    // Verificar longitud máxima
    if (cleaned.length > 50) {
      return "La ciudad no puede exceder 50 caracteres";
    }
    
    // Verificar que solo contenga letras, espacios y algunos caracteres especiales
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ\s\-\.]+$/.test(cleaned)) {
      return "La ciudad solo puede contener letras, espacios, guiones y puntos";
    }
    
    // Verificar que no sea solo espacios o caracteres especiales
    if (!/[A-Za-zÁÉÍÓÚáéíóúÜüÑñ]/.test(cleaned)) {
      return "La ciudad debe contener al menos una letra";
    }
    
    return null;
  },

  // ✅ Validación para números de tarjeta
  validateCardNumber: (value: string) => {
    if (!value) return "El número de tarjeta es requerido";
    
    const cleaned = value.replace(/\s/g, "");
    
    // Verificar solo números
    if (!/^\d+$/.test(cleaned)) {
      return "El número de tarjeta solo puede contener dígitos";
    }
    
    // Verificar longitud (13-19 dígitos)
    if (cleaned.length < 13 || cleaned.length > 19) {
      return "El número de tarjeta debe tener entre 13 y 19 dígitos";
    }
    
    return null;
  },

  // ✅ Validación para fecha de expiración
  validateExpiry: (value: string) => {
    if (!value) return "La fecha de expiración es requerida";
    
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length !== 4) {
      return "Formato inválido (MM/YY)";
    }
    
    const month = parseInt(cleaned.slice(0, 2));
    const year = parseInt(cleaned.slice(2, 4));
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    
    if (month < 1 || month > 12) {
      return "Mes inválido";
    }
    
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return "La tarjeta está vencida";
    }
    
    return null;
  },

  // ✅ Validación para CVV
  validateCVV: (value: string) => {
    if (!value) return "El CVV es requerido";
    
    if (!/^\d{3,4}$/.test(value)) {
      return "El CVV debe tener 3 o 4 dígitos";
    }
    
    return null;
  },
};

// 🔧 Formateadores de texto para prevenir caracteres inválidos
export const TextFormatters = {
  // Formateador para nombres (solo letras y espacios)
  formatName: (value: string) => {
    if (!value) return value;
    return value
      .replace(/[^A-Za-zÁÉÍÓÚáéíóúÜüÑñ\s]/g, "")
      .replace(/\s+/g, " ")
      .slice(0, 30);
  },

  // Formateador para nombres de tarjeta
  formatCardHolder: (value: string) => {
    if (!value) return value;
    return value
      .replace(/[^A-Za-zÁÉÍÓÚáéíóúÜüÑñ\s]/g, "")
      .replace(/\s+/g, " ")
      .slice(0, 50)
      .toUpperCase();
  },

  // Formateador para emails
  formatEmail: (value: string) => {
    if (!value) return value;
    return value
      .replace(/[<>'"{}\\]/g, "")
      .slice(0, 100)
      .toLowerCase();
  },

  // Formateador para teléfonos
  formatPhone: (value: string) => {
    if (!value) return value;
    return value
      .replace(/\D/g, "")
      .slice(0, 10);
  },

  // Formateador para direcciones
  formatAddress: (value: string) => {
    if (!value) return value;
    return value
      .replace(/[<>'"{}\\]/g, "")
      .slice(0, 100);
  },

  // Formateador para ciudades
  formatCity: (value: string) => {
    if (!value) return value;
    return value
      .replace(/[^A-Za-zÁÉÍÓÚáéíóúÜüÑñ\s\-\.]/g, "")
      .replace(/\s+/g, " ")
      .slice(0, 50);
  },

  // Formateador para números de tarjeta
  formatCardNumber: (value: string) => {
    if (!value) return value;
    const cleaned = value.replace(/\D/g, "").slice(0, 19);
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(" ") : cleaned;
  },

  // Formateador para fecha de expiración
  formatExpiry: (value: string) => {
    if (!value) return value;
    const cleaned = value.replace(/\D/g, "").slice(0, 4);
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  },
};

// 🚨 Analizador de errores del backend
export const ErrorParser = {
  parseBackendError: (error: any) => {
    let errorMessage = "Error al procesar la solicitud. Por favor intente nuevamente.";
    let errorDetails = "";

    if (error.response?.data?.message) {
      const backendMessage = error.response.data.message;
      
      // Extraer errores específicos de tokenización de tarjeta
      if (backendMessage.includes("Card tokenization failed")) {
        try {
          const jsonMatch = backendMessage.match(/\{.*\}/);
          if (jsonMatch) {
            const errorData = JSON.parse(jsonMatch[0]);
            
            const fieldErrors = [];
            
            if (errorData.card_holder) {
              fieldErrors.push(`Titular: ${errorData.card_holder.join(", ")}`);
            }
            if (errorData.number) {
              fieldErrors.push(`Número de tarjeta: ${errorData.number.join(", ")}`);
            }
            if (errorData.cvc) {
              fieldErrors.push(`CVV: ${errorData.cvc.join(", ")}`);
            }
            if (errorData.exp_month || errorData.exp_year) {
              fieldErrors.push("Fecha de expiración inválida");
            }
            
            if (fieldErrors.length > 0) {
              errorMessage = "Error en los datos de la tarjeta";
              errorDetails = fieldErrors.join(" • ");
            }
          }
        } catch (parseError) {
          console.error("Error parsing backend error:", parseError);
        }
      } else if (backendMessage.includes("Payment failed")) {
        errorMessage = "El pago fue rechazado";
        errorDetails = "Verifique los datos de su tarjeta o intente con otro método de pago";
      } else if (backendMessage.includes("Insufficient funds")) {
        errorMessage = "Fondos insuficientes";
        errorDetails = "Su tarjeta no tiene saldo suficiente para esta transacción";
      } else if (backendMessage.includes("Invalid card")) {
        errorMessage = "Tarjeta inválida";
        errorDetails = "Los datos de la tarjeta son incorrectos";
      } else {
        errorMessage = backendMessage;
      }
    }

    return {
      message: errorMessage,
      details: errorDetails || error.response?.data?.error || 
               "Por favor verifique los datos e intente nuevamente.",
    };
  },
}; 