# Frontend Genérico para Sistema de Gestión Educativa

Este proyecto es un frontend genérico desarrollado para interactuar con un backend de sistema de gestión educativa. Permite visualizar y gestionar diferentes entidades del sistema a través de una interfaz moderna y adaptable.

## Características

- **Interfaz Dinámica**: Detecta automáticamente las entidades disponibles en el backend
- **Operaciones CRUD**: Permite crear, leer, actualizar y eliminar registros de cualquier entidad
- **Búsqueda en Tiempo Real**: Filtra los datos de las tablas sin necesidad de recargar
- **Diseño Moderno**: Tema oscuro con efectos visuales y animaciones
- **Responsive**: Adaptable a diferentes tamaños de pantalla

## Tecnologías Utilizadas

- **React**: Biblioteca para construir interfaces de usuario
- **TypeScript**: Superset de JavaScript con tipado estático
- **Tailwind CSS**: Framework de utilidades CSS
- **Framer Motion**: Biblioteca para animaciones
- **React Hook Form**: Manejo de formularios
- **Axios**: Cliente HTTP para realizar peticiones al backend
- **React Icons**: Iconos para la interfaz
- **React Hot Toast**: Notificaciones elegantes

## Estructura del Proyecto

- **src/services.ts**: Servicios para comunicación con la API
- **src/types.ts**: Definiciones de tipos TypeScript
- **src/components.tsx**: Componentes reutilizables de la interfaz
- **src/App.tsx**: Componente principal de la aplicación
- **src/App.css**: Estilos adicionales para la aplicación
- **src/index.css**: Estilos globales y configuración de Tailwind

## Configuración

El proyecto está configurado para conectarse a un backend en `http://localhost:5171/api`. Si necesitas cambiar esta URL, puedes modificarla en el archivo `src/services.ts`.

## Instalación y Ejecución

1. Clona el repositorio
2. Instala las dependencias:
   ```
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```
   npm run dev
   ```
4. Abre tu navegador en `http://localhost:5173`

## Compilación para Producción

Para compilar el proyecto para producción:

```
npm run build
```

Los archivos compilados se encontrarán en el directorio `dist`.

## Entidades Soportadas

El frontend está diseñado para trabajar con las siguientes entidades:

- Usuario
- Rol
- Ciudad
- Curso
- Modalidad
- Factura
- Equipo
- Proveedor

## Licencia

Este proyecto está bajo la Licencia MIT.