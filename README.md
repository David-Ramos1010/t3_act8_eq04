# DentalSys - Sistema de Gestión de Clínica Dental (Actividad 8)

Aplicación web desarrollada en **React** con **Vite** para la gestión de citas e inventario de insumos/productos odontológicos. El sistema consume la API pública de **DummyJSON** para la autenticación de usuarios y las operaciones CRUD sobre el catálogo de productos.

---

##  Tecnologías Utilizadas

* **Frontend:** React 18+ & Vite
* **Estilos:** CSS3 personalizado (basado en diseño Figma de Actividad 7)
* **Navegación y Estado:** React State (`useState`, `useEffect`, `useCallback`) y Query Parameters en la URL (`URLSearchParams`)
* **API REST:** [DummyJSON API](https://dummyjson.com/)
  * `/auth/login` (Autenticación de usuarios)
  * `/products` (Paginación, Filtros y CRUD)

---

##  Funcionalidades por Fases

###  Fase 1: Autenticación y Login
* Validación de credenciales enviando `username` y `password` a la API de DummyJSON.
* Manejo de errores visuales en formulario en caso de credenciales incorrectas.
* Guardado del estado de usuario logueado en la aplicación.

###  Fase 2: Layout Base (Navbar y Sidebar)
* **Sidebar:** Navegación estilo navy (`#17183B`) acorde con la maqueta de Figma, resaltado de opción activa (píldora morada `#7C3AED`), logo de la clínica y botón de cierre de sesión en la parte inferior.
* **Navbar:** Muestra el nombre completo del usuario autenticado (ej. *Doctora Emily*), rol (*Administradora*) y su avatar oficial proveniente de la API.
* **Protección de Rutas:** Acceso restringido al Dashboard e Inventario solo si hay una sesión activa de usuario.

###  Fase 3: Tabla Interactiva y CRUD de Productos/Insumos
* **Consumo de API REST:** Carga dinámica de productos desde `/products` con soporte para filtros y búsqueda.
* **Filtros Dobles:** Búsqueda por texto (nombre/título) y filtro dropdown por categoría.
* **Paginación Interactiva:** Controles para avanzar/retroceder página e indicador de registros.
* **Selector de Paginación:** Opción para elegir la cantidad de registros a mostrar por página (`10`, `20`, `40`, `50`).
* **Sincronización con la URL:** Mantiene el estado de la navegación en los parámetros URL (`?page=1&limit=10&search=...&category=...`).
* **Operaciones CRUD en Modales:**
  * **[+] Crear:** Formulario modal para registrar un nuevo producto en la API (petición POST).
  * **[Editar]:** Modal de modificación con petición real PUT.
  * **[Borrar]:** Modal de confirmación para eliminar un producto mediante petición DELETE.
  * **Actualización en Estado Local:** Reflejo inmediato de cambios en la tabla para mejorar la experiencia de usuario (UX).

---

##  Credenciales de Prueba

Para ingresar al sistema puedes utilizar las credenciales oficiales de DummyJSON:

| Campo | Credencial |
| :--- | :--- |
| **Usuario (`username`)** | `emilys` |
| **Contraseña (`password`)** | `emilyspass` |

*(Otras credenciales válidas: `michaelw` / `michaelwpass`)*

---

##  Estructura del Proyecto

![Estructura del Proyecto](/src/assets/images/Estructura.png)

---

##  Equipo de Desarrollo

* **Actividad 8 - Equipo 04**
* Alvaréz Mora Jordi Moisés 02
* José Ramos David Efraén 19