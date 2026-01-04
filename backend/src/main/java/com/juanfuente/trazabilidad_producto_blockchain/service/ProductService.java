package com.juanfuente.trazabilidad_producto_blockchain.service;

import com.juanfuente.trazabilidad_producto_blockchain.DTOs.product.response.ProductResponse;
import com.juanfuente.trazabilidad_producto_blockchain.model.Product;
import com.juanfuente.trazabilidad_producto_blockchain.model.ProductEvent;
import com.juanfuente.trazabilidad_producto_blockchain.model.EventType;
import com.juanfuente.trazabilidad_producto_blockchain.repository.ProductRepository;
import com.juanfuente.trazabilidad_producto_blockchain.repository.ProductEventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor // Inyecta los repositorios automáticamente (Lombok)
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductEventRepository eventRepository;

    /**
     * Registra un nuevo producto en la base de datos tras ser creado en Blockchain.
     * <p>
     * Este método realiza dos acciones atómicas:
     * 1. Persiste la entidad Producto completa (con datos off-chain y on-chain).
     * 2. Genera automáticamente el evento "Génesis" (CREATED) en el historial.
     * * @param product El objeto con los datos ricos (nombre, foto) y de blockchain (hash, id).
     *
     * @param creationTxHash El hash de la transacción de creación en Ethereum.
     * @return El producto guardado con su ID interno de MongoDB generado.
     */
    @Transactional
    public ProductResponse registerProduct(Product product, String creationTxHash) {
        if (productRepository.existsByBlockchainId(product.getBlockchainId())) {
            throw new RuntimeException("Error: El producto con ID " + product.getBlockchainId() + " ya existe en la BD.");
        }
        // Guarda el producto completo (Mongo genera el _id interno)
        Product savedProduct = productRepository.save(product);

        logEvent(product, creationTxHash,
                "0x0000000000000000000000000000000000000000",
                product.getCurrentOwner(),
                EventType.CREATED);

        return ProductResponse.fromEntity(savedProduct);
    }

    /**
     * Procesa la transferencia de propiedad de un producto existente, sincronizando el estado off-chain.
     * <p>
     * Este método garantiza la integridad de los datos mediante:
     * 1. Validación de existencia del producto por su ID de Blockchain.
     * 2. Verificación de seguridad comparando el Hash recibido con el almacenado (evita desincronización).
     * 3. Actualización del propietario actual (currentOwner).
     * 4. Registro inmutable del evento de transferencia (TRANSFERRED) en el historial.
     *
     * @param blockchainId El ID numérico del producto en el Smart Contract.
     * @param txHash El hash de la transacción de transferencia confirmada en Ethereum.
     * @param newOwnerAddress La dirección (0x...) del nuevo propietario.
     * @param expectedProductHash El hash de caracterización actual para validar la integridad antes de modificar.
     * @throws RuntimeException Si el producto no existe o el hash no coincide.
     */
    @Transactional
    public ProductResponse transferProduct(Long blockchainId, String txHash, String newOwnerAddress, String expectedProductHash) {
        Product product = getProductOrThrow(blockchainId);

        if (!product.getCharacterizationHash().equals(expectedProductHash)) {
            throw new RuntimeException("ALERTA DE SEGURIDAD: El hash del producto no coincide. Datos desincronizados.");
        }

        String oldOwner = product.getCurrentOwner();
        product.setCurrentOwner(newOwnerAddress);
        Product transferredProduct = productRepository.save(product);

        logEvent(product, txHash, oldOwner, newOwnerAddress, EventType.TRANSFERRED);

        //Convierte la Entidad a DTO antes de devolverla
        return ProductResponse.fromEntity(transferredProduct);
    }

    /**
     * Ejecuta el borrado lógico (Soft Delete) de un producto del catálogo activo.
     * <p>
     * La operación no elimina el registro físico, sino que lo marca como inactivo para preservar la historia.
     * Pasos que realiza:
     * 1. Valida identidad e integridad del producto (ID y Hash).
     * 2. Marca el flag 'active' a false.
     * 3. Genera un evento de tipo DELETED en la traza de auditoría, asignando el destino a la dirección nula.
     *
     * @param blockchainId El ID del producto a eliminar.
     * @param txHash El hash de la transacción de borrado (burn) en Blockchain.
     * @param expectedProductHash El hash de seguridad para confirmar que se borra el activo correcto.
     * @throws RuntimeException Si hay inconsistencia de datos o el producto no se encuentra.
     */
    @Transactional
    public ProductResponse deleteProduct(Long blockchainId, String txHash, String expectedProductHash) {
        Product product = getProductOrThrow(blockchainId);

        if (!product.getCharacterizationHash().equals(expectedProductHash)) {
            throw new RuntimeException("ALERTA DE SEGURIDAD: El hash del producto no coincide. Datos desincronizados.");
        }

        // 1. Actualiza estado (Soft Delete)
        product.setActive(false);
        Product deletedProduct = productRepository.save(product);

        logEvent(product, txHash, product.getCurrentOwner(),
                "0x0000000000000000000000000000000000000000",
                EventType.DELETED);

        return ProductResponse.fromEntity(deletedProduct);
    }

    /**
     * Recupera el catálogo completo de productos disponibles.
     * * @return Una lista de todos los productos registrados en el sistema.
     */
    public List<Product> getAllProducts() {
        // Podrías filtrar por active=true si no quieres mostrar los borrados
        return productRepository.findAll();
    }

    /**
     * Busca un producto específico utilizando su identificador de Blockchain.
     * * @param blockchainId El ID numérico asignado por el Smart Contract (ej: 1, 2, 3).
     *
     * @return El objeto Producto si existe, o null si no se encuentra.
     */
    public Product getProductByBlockchainId(Long blockchainId) {
        return productRepository.findByBlockchainId(blockchainId);
    }

    /**
     * Obtiene la traza de auditoría completa (trazabilidad) de un producto.
     * * @param blockchainId El ID del producto a consultar.
     *
     * @return Lista cronológica de todos los eventos (Creación, Transferencias, Borrado) asociados.
     */
    public List<ProductEvent> getProductHistory(Long blockchainId) {
        return eventRepository.findByProductBlockchainId(blockchainId);
    }

    /**
     * Método auxiliar interno encargado de centralizar la lógica de auditoría.
     * <p>
     * Crea y persiste un registro inmutable (ProductEvent) que documenta cualquier cambio
     * de estado en el ciclo de vida del producto.
     * Nota: Obtiene el hash de caracterización directamente de la entidad Producto
     * para asegurar que el evento queda vinculado al estado validado actual.
     *
     * @param product La entidad producto actualizada (fuente de verdad).
     * @param txHash El hash de la transacción en la red Ethereum.
     * @param from Dirección de origen (o nula en creación).
     * @param to Dirección de destino (o nula en borrado).
     * @param type El tipo de operación realizada (CREATED, TRANSFERRED, DELETED).
     */
    @Transactional
    private void logEvent(Product product, String txHash, String from, String to, EventType type) {
        ProductEvent event = new ProductEvent();
        event.setProductBlockchainId(product.getBlockchainId());
        // Coge el hash del producto REAL de la BD para asegurar integridad
        event.setProductHash(product.getCharacterizationHash());
        event.setTransactionHash(txHash);
        event.setFromAddress(from);
        event.setToAddress(to);
        event.setType(type);
        event.setTimestamp(System.currentTimeMillis());

        eventRepository.save(event);
    }

    /**
     * Helper de recuperación segura con estrategia "Fail-Fast".
     * <p>
     * Busca un producto por su ID de Blockchain y lanza una excepción inmediata
     * si no se encuentra, evitando comprobaciones nulas repetitivas (Boilerplate)
     * en los métodos principales.
     *
     * @param id El identificador numérico del producto en Blockchain.
     * @return La entidad Product encontrada.
     * @throws RuntimeException Si el producto no existe en la base de datos.
     */
    private Product getProductOrThrow(Long id) {
        Product p = productRepository.findByBlockchainId(id);
        if (p == null) throw new RuntimeException("Producto " + id + " no encontrado");
        return p;
    }
}