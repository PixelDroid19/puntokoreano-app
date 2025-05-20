/**
 * Utilidades para la gestión de correos electrónicos
 */

/**
 * Genera una URL de verificación de correo electrónico
 * @param email Correo electrónico del usuario
 * @param token Token de verificación
 * @returns URL completa para verificar el correo
 */
export const generateVerificationUrl = (email: string, token: string): string => {
  const baseUrl = import.meta.env.MODE === 'production' 
    ? import.meta.env.VITE_FRONTEND_URL || 'https://puntokoreano.com'
    : 'http://localhost:5173';
    
  return `${baseUrl}/verify-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;
};

/**
 * Formatea una plantilla de correo electrónico reemplazando variables
 * @param template Plantilla de correo con variables {{variable}}
 * @param variables Objeto con las variables a reemplazar
 * @returns Plantilla con las variables reemplazadas
 */
export const formatEmailTemplate = (template: string, variables: Record<string, string>): string => {
  let formattedTemplate = template;
  
  Object.entries(variables).forEach(([key, value]) => {
    formattedTemplate = formattedTemplate.replace(new RegExp(`{{${key}}}`, 'g'), value);
  });
  
  return formattedTemplate;
}; 