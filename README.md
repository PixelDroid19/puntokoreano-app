# 🇰🇷 Punto Koreano - E-commerce Frontend

Una aplicación web moderna de comercio electrónico especializada en productos coreanos, construida con React, TypeScript y las mejores prácticas de desarrollo frontend.

## 🌟 Características Principales

- **🛒 E-commerce Completo**: Catálogo de productos, carrito de compras, y proceso de checkout
- **🔐 Autenticación**: Sistema completo de registro, login y verificación por email
- **📱 Diseño Responsivo**: Optimizado para dispositivos móviles y desktop
- **🎨 UI Moderna**: Interfaz elegante con Ant Design y Tailwind CSS
- **⚡ Rendimiento Optimizado**: Code splitting, lazy loading y caching inteligente
- **🎬 Animaciones Fluidas**: Transiciones suaves con Anime.js y AOS
- **📝 Blog Integrado**: Sistema de gestión de contenido para artículos
- **💳 Pagos Seguros**: Integración con Stripe para procesamiento de pagos
- **🔍 Búsqueda Avanzada**: Filtros dinámicos y búsqueda en tiempo real
- **📊 Estado Global**: Gestión eficiente con Zustand y React Query

## 🛠️ Tecnologías Utilizadas

### Core
- **React 18** - Biblioteca principal de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server ultra-rápido

### UI/UX
- **Ant Design** - Componentes de UI empresarial
- **Tailwind CSS** - Framework de CSS utility-first
- **Lucide React** - Iconografía moderna
- **FontAwesome** - Iconos adicionales

### Estado y Datos
- **Zustand** - Estado global ligero
- **TanStack React Query** - Cache y sincronización de datos del servidor
- **React Hook Form** - Manejo eficiente de formularios
- **Zod** - Validación de esquemas

### Navegación y Enrutamiento
- **React Router v6** - Enrutamiento declarativo
- **Route Loaders** - Precarga optimizada de datos

### Animaciones
- **Anime.js** - Animaciones JavaScript avanzadas
- **AOS (Animate On Scroll)** - Animaciones por scroll
- **React Spring** - Animaciones declarativas para React
- **Lottie Web** - Animaciones vectoriales

### Pagos y Formularios
- **Stripe.js** - Procesamiento de pagos
- **Card Validator** - Validación de tarjetas de crédito
- **Crypto.js** - Encriptación del lado del cliente

### Utilidades
- **Axios** - Cliente HTTP
- **Date-fns** - Manipulación de fechas
- **Lodash** - Utilidades de JavaScript
- **Use Debounce** - Hook para debouncing
- **React Responsive** - Responsive design hooks

## 📁 Estructura del Proyecto

```
src/
├── api/                    # Configuración de API y tipos
├── assets/                 # Recursos estáticos (imágenes, fuentes)
├── components/             # Componentes reutilizables
│   ├── buttons/           # Componentes de botones
│   ├── cards/             # Componentes de tarjetas
│   ├── checkout/          # Componentes del proceso de compra
│   ├── layout/            # Componentes de layout
│   ├── Modals/            # Componentes modales
│   └── orders/            # Componentes de órdenes
├── hooks/                  # Custom hooks
├── pages/                  # Páginas principales
│   ├── about/             # Página "Acerca de"
│   ├── account/           # Gestión de cuenta de usuario
│   ├── auth/              # Autenticación (login, registro)
│   ├── blog/              # Blog y artículos
│   ├── cart/              # Carrito de compras
│   ├── home/              # Página de inicio
│   ├── product/           # Detalles de productos
│   └── store/             # Catálogo de productos
├── routes/                 # Configuración de rutas
├── services/               # Servicios de API
├── store/                  # Stores de Zustand
├── types/                  # Definiciones de TypeScript
└── utils/                  # Utilidades y helpers
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

### Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd puntokoreano-app
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
```

4. **Iniciar el servidor de desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📜 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo con host expuesto |
| `npm run build` | Construye la aplicación para producción |
| `npm run build-tsc` | Construye con verificación de tipos TypeScript |
| `npm run lint` | Ejecuta ESLint para revisar el código |
| `npm run preview` | Previsualiza la build de producción |

## ⚙️ Variables de Entorno

```env
# API Configuration
VITE_API_URL=https://api.puntokoreano.com
VITE_API_VERSION=v1

# Stripe Configuration
VITE_STRIPE_PUBLIC_KEY=pk_live_...

# Authentication
VITE_JWT_SECRET=your-jwt-secret

# Analytics (opcional)
VITE_GA_TRACKING_ID=GA-XXXXXXXXX
```

## 🎨 Configuración de Tema

El proyecto utiliza un sistema de colores personalizado definido en Tailwind:

```css
colors: {
  secondary: "#FFEC0C",      /* Amarillo principal */
  secondary_1: "#2F0C79",    /* Púrpura oscuro */
  secondary_2: "#A033CD",    /* Púrpura medio */
  secondary_3: "#E2000E",    /* Rojo principal */
}
```

### Fuentes Personalizadas
- **Karate** - Títulos principales
- **Glegoo** - Texto secundario
- **Exo** - Texto principal
- **Noto Serif** - Texto elegante
- **Lastica** - Elementos decorativos

## 🔧 Configuración de Desarrollo

### Alias de Rutas
El proyecto utiliza `@` como alias para la carpeta `src`:

```typescript
import { Component } from '@/components/Component'
import { useHook } from '@/hooks/useHook'
```

### Optimizaciones de Build
- **Tree Shaking** automático con Vite
- **Code Splitting** por rutas
- **Importación optimizada** de Ant Design
- **Compresión CSS** con cssnano
- **TypeScript** con verificación estricta

## 📱 Soporte de Navegadores

- **Chrome** >= 88
- **Firefox** >= 85
- **Safari** >= 14
- **Edge** >= 88

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Agrega nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

### Estándares de Código
- Utilizar **TypeScript** para todos los archivos
- Seguir las reglas de **ESLint** configuradas
- Componentes en **PascalCase**
- Hooks con prefijo **use**
- Archivos de utilidades en **camelCase**

## 📄 Licencia

Este proyecto es de uso privado y propietario de Punto Koreano.

## 🆘 Soporte

Para reportar bugs o solicitar nuevas características, por favor crea un issue en el repositorio o contacta al equipo de desarrollo.

---

**Desarrollado con ❤️ para la comunidad amante de la cultura coreana**
