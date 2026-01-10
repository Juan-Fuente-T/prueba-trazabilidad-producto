package com.juanfuente.trazabilidad_producto_blockchain.DTOs.product.request;

import com.juanfuente.trazabilidad_producto_blockchain.model.Product;
import lombok.Data;

@Data
public class RegisterProductRequest {
    private Product product;       // Datos del producto (nombre, owner, blockchainId...)
    private String creationTxHash; // El hash de la transacción de creación
}
