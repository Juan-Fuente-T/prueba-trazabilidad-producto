# Roadmap Técnico y Deuda Técnica Detectada

Este documento detalla las áreas de mejora identificadas para transformar este MVP (Producto Mínimo Viable) en una solución de grado industrial (Enterprise Grade).

## 1. Arquitectura Frontend

- **Estado Actual:** Gestión de estado mediante "Prop Drilling" (paso de propiedades a través de múltiples niveles).
- **Solución Propuesta:** Implementar un gestor de estado global.
  - _Opción A (Sencilla):_ React Context API para gestión de usuario y carritos.
  - _Opción B (Escalable):_ **Zustand** (recomendado por ser ligero y evitar boilerplate).
- **Imágenes:** Actualmente se almacenan/simulan en Base64 o local.
  - _Mejora:_ Integración con **AWS S3** o **Cloudinary** para almacenar referencias URL en la BD, reduciendo la carga del payload JSON.

## 2. Calidad y Testing (QA)

- **Estado Actual:** Pruebas manuales funcionales y validación de transacciones on-chain.
- **Backend (Prioridad Alta):**
  - Implementar Tests Unitarios con **JUnit 5** y **Mockito**.
  - Tests de Integración para los repositorios MongoDB y la conexión Web3j.
- **Frontend:**
  - Tests E2E con **Cypress** o **Playwright** para asegurar el flujo crítico (Crear -> Transferir).

## 3. Seguridad y Backend

- **Estado Actual:** Seguridad basada en criptografía de clave pública (Wallets) para la firma de transacciones.
- **Autenticación Híbrida:**
  - Actualmente el backend es accesible públicamente.
  - _Roadmap:_ Implementar **Spring Security** + **JWT**. Aunque la firma sea con Wallet (Web3), el backend debe emitir un token de sesión para proteger los endpoints de escritura (`POST /api/products`).
- **Gestión de Errores:**
  - Implementar un `@ControllerAdvice` global en Spring Boot para estandarizar las respuestas de error (HTTP 400, 500) y no exponer stacktraces al cliente.

## 4. Arquitectura de Datos (MongoDB & Blockchain)

- **Estado Actual:** Arquitectura híbrida.
  - **Off-Chain (MongoDB):** Almacena la información descriptiva, imágenes y metadatos ricos. Se ha elegido **NoSQL** por su flexibilidad para manejar eventos heterogéneos en la cadena de suministro.
  - **On-Chain (Ethereum/Sepolia):** Garantiza la inmutabilidad y la "fuente de verdad" mediante hashes criptográficos.
- **Evolución Propuesta:**
  - Implementar **Sharding** en MongoDB para escalar con millones de eventos.
  - Integración con **IPFS** para descentralizar también el almacenamiento de imágenes, eliminando la dependencia de servidores centralizados.

## 5. Interfaz de Usuario (UX Industrial)

- **Estado Actual:** Diseño enfocado en la claridad visual y la facilidad de uso (tarjetas, flujos guiados).
- **Evolución Propuesta:**
  - **Vista Operario:** Implementación de **Data Grids** (Tablas de alta densidad) con previsualización de activos para gestión masiva de inventario.
  - **Dashboards de Métricas:** Gráficos de tiempo de permanencia en cada fase (ej. tiempo medio entre Lonja y Enlatado).

## 6. Estrategia de Despliegue

- Separación de entornos para demo:
  - **Versión Reclutador:** UI guiada con explicaciones paso a paso.
  - **Versión Industria:** Dashboard denso (Data Grids), sin tutoriales, enfocado en productividad.
