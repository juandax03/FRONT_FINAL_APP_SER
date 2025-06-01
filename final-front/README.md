# Sistema de Gestión Educativa

## Configuración del Proxy para API

Este proyecto utiliza un proxy en Vercel para comunicarse con el backend HTTP desde un frontend HTTPS, evitando problemas de bloqueo por parte del navegador.

### Estructura del Proxy

- `/api/usuario.js`: Proxy específico para la entidad Usuario
- `/api/[entity].js`: Proxy dinámico que maneja cualquier entidad y todos los métodos HTTP (GET, POST, PUT, DELETE)

### Cómo funciona

1. El frontend hace peticiones a `/api/[entidad]` (por ejemplo, `/api/usuario`)
2. El servidor de Vercel intercepta estas peticiones y las redirige a través de las funciones serverless en la carpeta `/api`
3. Estas funciones hacen la petición real al backend HTTP (`http://apifinalsw2025.tryasp.net/api/[entidad]`)
4. La respuesta se devuelve al frontend

### Ventajas

- Evita problemas de CORS y Mixed Content
- Permite llamar desde HTTPS (frontend) a HTTP (backend)
- Oculta la URL real del backend al cliente
- Permite añadir lógica adicional en el proxy si es necesario

### Despliegue

El proyecto está configurado para desplegarse automáticamente en Vercel. Cuando se hace push a la rama principal, Vercel detectará la carpeta `/api` y desplegará las funciones serverless.