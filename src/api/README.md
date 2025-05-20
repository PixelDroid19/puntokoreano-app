# Cliente API para Punto Koreano

Este módulo proporciona una implementación centralizada para manejar todas las solicitudes HTTP en la aplicación Punto Koreano.

## Características

- Instancia personalizada de Axios con interceptores
- Manejo automático de tokens de autenticación
- Gestión centralizada de errores y notificaciones
- Funciones helper para cada tipo de petición (GET, POST, PUT, PATCH, DELETE)
- Soporte para parámetros de URL, query params y headers personalizados
- Tipado fuerte con TypeScript

## Estructura

- `index.ts`: Definición de endpoints y configuración base
- `apiClient.ts`: Cliente API con instancia personalizada de Axios y funciones helper
- `examples.ts`: Ejemplos de uso (opcional, solo para referencia)

## Cómo usar

### Importar

```typescript
import { apiGet, apiPost, apiPut, apiPatch, apiDelete, ENDPOINTS } from '@/api/apiClient';
```

### Peticiones GET

```typescript
// GET simple
const products = await apiGet(ENDPOINTS.PRODUCTS.SEARCH);

// GET con parámetros en URL (/products/:id)
const productDetail = await apiGet(
  ENDPOINTS.PRODUCTS.PRODUCT_DETAIL,
  { id: '123' } // Reemplaza :id en la URL
);

// GET con query params (?page=1&limit=10)
const productReviews = await apiGet(
  ENDPOINTS.REVIEWS.GET_PRODUCT_REVIEWS,
  { productId: '123' }, // Parámetros de URL
  { page: 1, limit: 10 } // Query params
);
```

### Peticiones POST

```typescript
// POST simple con datos
const loginResponse = await apiPost(
  ENDPOINTS.AUTH.LOGIN,
  { email: 'usuario@ejemplo.com', password: 'contraseña' }
);

// POST con parámetros en URL
const newReview = await apiPost(
  ENDPOINTS.REVIEWS.CREATE_REVIEW,
  { rating: 5, comment: '¡Excelente producto!' },
  { productId: '123' } // Reemplaza :productId en la URL
);
```

### Peticiones PUT

```typescript
// PUT con parámetros en URL
const updatedAddress = await apiPut(
  ENDPOINTS.USER.UPDATE_ADDRESS,
  { street: 'Nueva Calle', city: 'Medellín' },
  { addressId: '456' } // Reemplaza :addressId en la URL
);
```

### Peticiones PATCH

```typescript
// PATCH para actualización parcial
const profileUpdate = await apiPatch(
  ENDPOINTS.USER.UPDATE_PROFILE,
  { name: 'Nuevo Nombre' }
);
```

### Peticiones DELETE

```typescript
// DELETE con parámetros en URL
const deletedAddress = await apiDelete(
  ENDPOINTS.USER.DELETE_ADDRESS,
  { addressId: '456' } // Reemplaza :addressId en la URL
);
```

## Manejo de Errores

Los errores son manejados automáticamente por los interceptores de Axios. Las respuestas de error mostrarán notificaciones con información relevante y, en caso de errores de autenticación (401 o 403), el usuario será desconectado automáticamente.

## Extensión

Para añadir nuevos endpoints, simplemente actualiza el objeto `ENDPOINTS` en `index.ts` con la nueva configuración. 