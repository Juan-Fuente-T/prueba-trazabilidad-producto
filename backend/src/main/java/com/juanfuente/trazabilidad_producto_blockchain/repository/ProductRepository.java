package com.juanfuente.trazabilidad_producto_blockchain.repository;

import com.juanfuente.trazabilidad_producto_blockchain.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProductRepository extends MongoRepository<Product, String> {
    Product findByBlockchainId(Long blockchainId);
    boolean existsByBlockchainId(Long blockchainId);
}