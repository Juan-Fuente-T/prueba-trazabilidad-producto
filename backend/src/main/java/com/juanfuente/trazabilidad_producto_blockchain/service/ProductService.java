package com.juanfuente.trazabilidad_producto_blockchain.service;

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
     * @param creationTxHash El hash de la transacción de creación en Ethereum.
     * @return El producto guardado con su ID interno de MongoDB generado.
     */
    @Transactional
    public Product registerProduct(Product product, String creationTxHash) {
        // 1. Guardamos el producto completo (Mongo genera el _id interno)
        Product savedProduct = productRepository.save(product);

        // 2. Creamos el Evento Génesis (CREATED)
        ProductEvent event = new ProductEvent();
        event.setProductBlockchainId(product.getBlockchainId());
        event.setTransactionHash(creationTxHash); // Guarda el hash de la transacción
        event.setProductHash(product.getCharacterizationHash()); // Guarda el hash del producto
        event.setFromAddress("0x0000000000000000000000000000000000000000"); // Origen nulo
        event.setToAddress(product.getCurrentOwner());
        event.setType(EventType.CREATED);
        event.setTimestamp(LocalDateTime.now());

        eventRepository.save(event);

        return savedProduct;
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
     * @return El objeto Producto si existe, o null si no se encuentra.
     */
    public Product getProductByBlockchainId(Long blockchainId) {
        return productRepository.findByBlockchainId(blockchainId);
    }

    /**
     * Obtiene la traza de auditoría completa (trazabilidad) de un producto.
     * * @param blockchainId El ID del producto a consultar.
     * @return Lista cronológica de todos los eventos (Creación, Transferencias, Borrado) asociados.
     */
    public List<ProductEvent> getProductHistory(Long blockchainId) {
        return eventRepository.findByProductBlockchainId(blockchainId);
    }

    /**
     * Procesa y registra un evento que ha ocurrido en la Blockchain (Transferencia o Borrado).
     * <p>
     * Además de guardar el evento en el historial, este método actúa como sincronizador
     * del estado actual del producto, actualizando su dueño (currentOwner) o su
     * estado de actividad (active) según corresponda.
     *
     * @param blockchainId El ID del producto en el Smart Contract.
     * @param productHash El hash de caracterización para validar la integridad del producto.
     * @param txHash El hash de la transacción del evento.
     * @param from Dirección de origen (quien envía).
     * @param to Dirección de destino (quien recibe).
     * @param type El tipo de evento (TRANSFERRED, DELETED, etc.).
     * @throws RuntimeException Si el producto no existe o el hash no coincide (integridad comprometida).
     */
    @Transactional
    public void registerEvent(Long blockchainId, String productHash, String txHash, String from, String to, EventType type) {
        // Comprueba que el hash que envía el evento coincide con el de la BBDD.
        Product product = productRepository.findByBlockchainId(blockchainId);

        if (product == null) {
            throw new RuntimeException("El producto con ID Blockchain " + blockchainId + " no existe.");
        }

        if (!product.getCharacterizationHash().equals(productHash)) {
            throw new RuntimeException("ALERTA DE INTEGRIDAD: El hash del evento no coincide con el del producto.");
        }

        // Guarda el evento en el historial
        ProductEvent event = new ProductEvent();
        event.setProductBlockchainId(blockchainId);
        event.setProductHash(productHash);
        event.setTransactionHash(txHash);
        event.setFromAddress(from);
        event.setToAddress(to);
        event.setType(type);
        event.setTimestamp(LocalDateTime.now());
        eventRepository.save(event);

        // Actualiza el estado del producto, sustituye a Transfer y Delete products
        if (type == EventType.TRANSFERRED) {
            product.setCurrentOwner(to);
        } else if (type == EventType.DELETED) {
            product.setActive(false);
        }
        productRepository.save(product);
    }
}