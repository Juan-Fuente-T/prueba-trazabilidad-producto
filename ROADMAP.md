# Roadmap & Technical Debt

Listado de mejoras técnicas, refactorizaciones y funcionalidades pendientes para futuras iteraciones.

## 🎨 UI/UX
- [ ] **Spinners:** (Descartado) Se usa UI Optimista, pero evaluar feedback visual en operaciones lentas.
- [ ] **Móvil:** Revisar el Header en dispositivos muy pequeños (width < 350px).
- [ ] **Feedback:** Limpiar datos de inputs al cerrar modales y resetear mensajes de éxito/error.
- [ ] **Interacción:** Deshabilitar botones e inputs visualmente mientras se procesan transacciones.
- [ ] **Interacción:** Resaltar botones de nuevo custodio seleccionado antes del pulsar el boton de confirmación. No permitir a un custodio seleccione su propio botón(deshabilitar)
- [ ] **Paginación:** Implementar paginación en el listado de lotes para manejar grandes volúmenes de datos.
- [ ] **Home:** Valorar añadir botón manual de "Refrescar lista".

## 🛠 Arquitectura & Code Quality
- [ ] **State Management:** Eliminar *prop drilling* excesivo. Migrar estado global a **Context API** o **Zustand**.
- [ ] **Data Fetching:** Migrar de `fetch/useEffect` nativo a **TanStack Query** para mejor gestión de caché, reintentos y estados de carga.
- [ ] **Imágenes:** Dejar de guardar base64 en DB. Implementar servicio de almacenamiento (Cloudinary, etc.) y guardar solo la URL.
- [ ] **Testing:** Implementar test unitarios y de integración (Jest + React Testing Library).

## 🔒 Seguridad & Backend
- [ ] **Auth:** Añadir autenticación real (Front/Back) usando el email de conexión con blockchain.
- [ ] **Optimización:** Mover la lógica de filtrado y búsqueda del Frontend al Backend.
- [ ] **Acciones Rápidas:** Consultar datos desde la DB (indexada) en lugar de la Blockchain para los modales de Transfer/Delete (mejora de velocidad).

## 📝 Notas de Decisión
- **TanStack vs Fetch:** Actualmente se usa `fetch` nativo para mantener el control manual sobre la UI optimista en esta fase del MVP, aunque se planea migrar a TanStack Query para escalar.