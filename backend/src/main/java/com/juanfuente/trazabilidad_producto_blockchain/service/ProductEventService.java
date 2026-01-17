package com.juanfuente.trazabilidad_producto_blockchain.service;

import com.juanfuente.trazabilidad_producto_blockchain.model.EventType;
import com.juanfuente.trazabilidad_producto_blockchain.model.Product;
import com.juanfuente.trazabilidad_producto_blockchain.model.ProductEvent;
import com.juanfuente.trazabilidad_producto_blockchain.repository.ProductEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor // Inyecta los repositorios automáticamente (Lombok)
public class ProductEventService {

    private final ProductEventRepository productEventRepository;

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
    public void registerEvent(Product product, String txHash, String from, String to, EventType type) {
        ProductEvent event = new ProductEvent();
        event.setProductBlockchainId(product.getBlockchainId());
        // Coge el hash del producto REAL de la BD para asegurar integridad
        event.setProductHash(product.getCharacterizationHash());
        event.setTransactionHash(txHash);
        event.setFromAddress(from);
        event.setToAddress(to);
        event.setType(type);
        event.setTimestamp(System.currentTimeMillis());

        productEventRepository.save(event);
    }


    /**
     * Marca un evento como verificado.
     *
     * @param txHash El hash de la transacción a marcar.
     */
    public void markEventAsVerified(String txHash) {
        Optional<ProductEvent> eventOpt = productEventRepository.findByTransactionHash(txHash);

        if (eventOpt.isPresent()) {
            ProductEvent event = eventOpt.get();

            if (!event.isVerified()) {
                event.setVerified(true);
                productEventRepository.save(event);
                System.out.println("✅ Evento verificado y guardado: " + txHash);
            } else {
                System.out.println("ℹ️ El evento ya estaba verificado: " + txHash);
            }
        }
    }

    /**
     * Obtiene la traza de auditoría completa (trazabilidad) de un producto.
     * * @param blockchainId El ID del producto a consultar.
     *
     * @return Lista cronológica de todos los eventos (Creación, Transferencias, Borrado) asociados.
     */
    public List<ProductEvent> getProductHistory(Long blockchainId) {
        return productEventRepository.findByProductBlockchainId(blockchainId);
    }
}