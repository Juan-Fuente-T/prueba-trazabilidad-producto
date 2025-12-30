package com.juanfuente.trazabilidad_producto_blockchain.repository;


import com.juanfuente.trazabilidad_producto_blockchain.model.ProductEvent;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProductEventRepository extends MongoRepository<ProductEvent, String> {
    List<ProductEvent> findByProductBlockchainId(Long productBlockchainId);
}