package com.juanfuente.trazabilidad_producto_blockchain.repository;

import com.juanfuente.trazabilidad_producto_blockchain.model.ProductEvent;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ProductEventRepository extends MongoRepository<ProductEvent, String> {
    List<ProductEvent> findByProductBlockchainId(Long productBlockchainId);

    Optional<ProductEvent> findByTransactionHash(String transactionHash);

    List<ProductEvent> findByIsVerifiedFalse();
}