package com.juanfuente.trazabilidad_producto_blockchain.DTOs.product.response;

import com.juanfuente.trazabilidad_producto_blockchain.model.Product;

import java.time.ZoneId;
import java.util.Date;

public record ProductResponse(
        String id, // ID de Mongo
        Long blockchainId,
        Long quantity,
        String characterizationHash,
        String currentOwner,
        Boolean active,
        Long timestamp,
        String name,
        String description,
        String imageUrl
) {
    // MAPPER INTEGRADO: Convierte de Entidad (BD) a Response (DTO)
    public static ProductResponse fromEntity(Product p) {
        if (p == null) return null;

        return new ProductResponse(
                p.getId(), // El _id de Mongo
                p.getBlockchainId(),
                p.getQuantity(),
                p.getCharacterizationHash(),
                p.getCurrentOwner(),
                p.isActive(),
                p.getTimestamp(),
                p.getName(),
                p.getDescription(),
                p.getImageUrl()
        );
    }
}