import { apiGet, apiPost, apiPut, apiDelete, apiPatch, ENDPOINTS } from './apiClient';

/**
 * Ejemplos de uso del nuevo cliente API
 * Estos son ejemplos, no es necesario incluir este archivo en la aplicación final
 */

// ===== AUTENTICACIÓN =====

// Iniciar sesión
export const login = async (email: string, password: string) => {
  return await apiPost(ENDPOINTS.AUTH.LOGIN, { email, password });
};

// Verificar si la sesión está activa
export const checkSession = async () => {
  return await apiGet(ENDPOINTS.AUTH.CHECK_SESSION);
};

// Cerrar sesión
export const logout = async () => {
  return await apiPost(ENDPOINTS.AUTH.LOGOUT);
};

// ===== PRODUCTOS =====

// Buscar productos
export const searchProducts = async (searchParams: any) => {
  return await apiPost(ENDPOINTS.PRODUCTS.SEARCH, searchParams);
};

// Obtener detalle de producto
export const getProductDetail = async (productId: string) => {
  return await apiGet(ENDPOINTS.PRODUCTS.PRODUCT_DETAIL, {}, { id: productId });
};

// ===== RESEÑAS =====

// Obtener reseñas de un producto
export const getProductReviews = async (productId: string, page: number = 1, limit: number = 10) => {
  return await apiGet(
    ENDPOINTS.REVIEWS.GET_PRODUCT_REVIEWS,
    { productId },
    { page, limit }
  );
};

// Crear una reseña
export const createReview = async (productId: string, reviewData: any) => {
  return await apiPost(
    ENDPOINTS.REVIEWS.CREATE_REVIEW,
    reviewData,
    { productId }
  );
};

// Votar por una reseña
export const voteReview = async (reviewId: string, vote: 'up' | 'down') => {
  return await apiPost(
    ENDPOINTS.REVIEWS.VOTE_REVIEW,
    { vote },
    { reviewId }
  );
};

// ===== ÓRDENES =====

// Crear una orden
export const createOrder = async (orderData: any) => {
  return await apiPost(ENDPOINTS.ORDERS.CREATE, orderData);
};

// Obtener detalles de una orden
export const getOrderDetails = async (orderId: string) => {
  return await apiGet(
    ENDPOINTS.ORDERS.GET_ORDER_DETAILS,
    { orderId }
  );
};

// Cancelar una orden
export const cancelOrder = async (orderId: string, reason: string) => {
  return await apiPost(
    ENDPOINTS.ORDERS.CANCEL_ORDER,
    { reason },
    { orderId }
  );
};

// ===== USUARIO =====

// Obtener perfil de usuario
export const getUserProfile = async () => {
  return await apiGet(ENDPOINTS.USER.GET_PROFILE);
};

// Actualizar perfil de usuario
export const updateUserProfile = async (profileData: any) => {
  return await apiPatch(ENDPOINTS.USER.UPDATE_PROFILE, profileData);
};

// Obtener direcciones del usuario
export const getUserAddresses = async () => {
  return await apiGet(ENDPOINTS.USER.GET_ADDRESSES);
};

// Añadir una dirección
export const addUserAddress = async (addressData: any) => {
  return await apiPost(ENDPOINTS.USER.ADD_ADDRESS, addressData);
};

// Actualizar una dirección
export const updateUserAddress = async (addressId: string, addressData: any) => {
  return await apiPut(
    ENDPOINTS.USER.UPDATE_ADDRESS,
    addressData,
    { addressId }
  );
};

// Eliminar una dirección
export const deleteUserAddress = async (addressId: string) => {
  return await apiDelete(
    ENDPOINTS.USER.DELETE_ADDRESS,
    { addressId }
  );
}; 