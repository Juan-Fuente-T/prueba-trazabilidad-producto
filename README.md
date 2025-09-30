# Product Traceability DApp

Aplicación descentralizada para trazabilidad de productos en blockchain.

##  Decisiones de Diseño y Alcance

### Ciclo de vida completo
Aunque los requisitos mencionaban "seguimiento de eventos a lo largo del ciclo de vida", no especificaban qué funcionalidades debían implementarse. Para asegurar una cobertura completa, implementé el ciclo de vida completo:
- **Registro** de productos
- **Transferencia** de propiedad entre addresses
- **Eliminación** lógica (soft delete)

### Testing exhaustivo
Los requisitos pedían cobertura de "registro de productos" y "registro de eventos". Para una cobertura más robusta, incluí:
- Tests de la función de registro de productos (happy paths)
- Tests de casos en registro de productos (reverts)
- Validación de eventos para las tres operaciones

**Nota:** Soy consciente de que se podría mejorar mucho el test, pero consideré que para esta prueba técnica el alcance actual demuestra capacidad de testing sin excederse en tiempo de desarrollo.

### Optimización de gas
Durante el desarrollo, optimicé el storage layout del struct `Product`, reduciendo de 4 a 3 slots de almacenamiento mediante reordenamiento de variables:

**Antes (4 slots):**
![Storage antes](./screenshots/FirstProductTracker.svg)

**Después (3 slots):**
![Storage después](./screenshots/LatestProductTracker.svg)

Esta optimización reduce el costo de gas, aunque en este caso concreto la diferencia no es significativa.

## ⚠️ Alcance y limitaciones conocidas

### Frontend funcional, no pulido
La interfaz está diseñada para **demostrar funcionalidad**, no para producción. Algunos aspectos pendientes de mejora:
- **UX/UI:** Diseño básico sin cuidado visual y usabilidad mejorable (por ejemplo no hay indicador de red correcta (Sepolia))
- **Manejo de errores:** Algunos casos no están cubiertos (por ejemplo los inputs de los modales no se limpian al cerrar/reabrir)
- **Validaciones:** Podrían ser más exhaustivas en inputs (por ejemplo, los campos numéricos aceptan decimales o letras)
- **Feedback al usuario:** Estados de carga y errores podrían ser más informativos
- **Responsive design:** No está optimizado para móvil

En un proyecto real, estos aspectos requerirían iteraciones adicionales de UX, testing de usuario, y refinamiento.

### Smart contract - Enfoque pragmático
El contrato prioriza claridad y cumplimiento de requisitos. Mejoras potenciales en un proyecto real:
- **Roles:** Implementar access control si hubiera múltiples actores (fabricantes, distribuidores, retailers)
- **Metadata:** URI para información adicional del producto (imágenes, certificaciones)
- **Batch operations:** Registrar múltiples productos en una transacción

Para esta prueba técnica, el contrato cubre los requisitos fundamentales sin añadir complejidad innecesaria.

## Características

- Registro de productos con hash de caracterización
- Transferencia de propiedad entre addresses
- Sistema de eliminación lógica (soft delete)
- Notificaciones en tiempo real de eventos
- Interfaz responsiva con RainbowKit

### Frontend con eventos en tiempo real
Aunque no estaba explícitamente requerido, implementé:
- Escucha de eventos del contrato (`ProductRegistered`, `ProductTransferred`, `ProductDeleted`)
- Notificaciones en tiempo real en la UI
- Sistema de búsqueda con card de producto

## Arquitectura

![alt text](screenshots/DiagramaArquitecturaCetim.PNG)

## Stack Tecnológico

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Blockchain**: Solidity ^0.8.20 + Foundry
- **Web3**: viem + wagmi + rainbowkit
- **Estilos**: Tailwind CSS
- **Testing**: Forge (Foundry)

## Flujo de Usuario

![alt text](screenshots/DiagramaDeFlujoCetim.PNG)

## Testing

![alt text](screenshots/Coverage_Test_ProductTracker.PNG)

## Despliegue

### Se optimiza la memoria para mejorar el rendimiento y el coste

#### Primera comprobación. La dirección del owner(slot 24 del struct) y el booleano(slot 4) estan ocupando slots imcompletos.

![alt text](./screenshots/FirstProductTracker.svg)

#### Segunda comprobación. La dirección del owner y el booleano ahora ocupan un solo slot(slot 3).

![alt text](./screenshots/LatestProductTracker.svg)


### Se despliega en Sepolia

![alt text](./screenshots/Deploy_Sepolia.PNG)

### Se verifica en Etherscan

![alt text](./screenshots/Etherscan_Verified.PNG)

#### Contrato verificado en Sepolia

Address: 0xE509E7039bd8D78518822B5cBE80E93D84D2c452

- [Ver en Etherscan](https://sepolia.etherscan.io/address/0xE509E7039bd8D78518822B5cBE80E93D84D2c452)

#### Transacciones de ejemplo:

![alt text](screenshots/Transaccion_Confirmada.PNG)

![alt text](screenshots/TransaccionesProducto.PNG)

- [Registro de producto](https://sepolia.etherscan.io/tx/0xfc4eb7b755387a268dec099002cc1ad06bb682132774c5d653dabf278a0a0390)
- [Transferencia](https://sepolia.etherscan.io/tx/0x7fc3e74a2ba26c90c59d1a6ccc4665849ce8922a96eb5709068c9955a76f214e)
- [Eliminación](https://sepolia.etherscan.io/tx/0x4660c5cbe584791efad71d628521974ba7228d7fd6e60e12489c42daa6d399b0) Eliminación

📦 Instalación
# Clonar repo
git clone https://github.com/Juan-Fuente-T/prueba-trazabilidad-producto.git

# Instalar dependencias
npm install

# Compilar contratos
forge build

# Ejecutar tests
forge test

# Iniciar frontend
npm run dev

🔐 Variables de Entorno

NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...
SEPOLIA_RPC_URL=...
PRIVATE_KEY=...
ETHERSCAN_API_KEY=...