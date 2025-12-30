package com.juanfuente.trazabilidad_producto_blockchain.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "products")
public class Product {
    @Id
    private String id;

    @NotNull(message = "El ID de Blockchain es obligatorio")
    @Indexed(unique = true)
    private Long blockchainId; // El ID numérico en el Smart Contract (ej: 1, 2, 3)
    @NotBlank(message = "El nombre no puede estar vacío")
    private String name;
    private String description;
    private String imageUrl;
    @NotBlank(message = "El dueño actual es obligatorio")
    private String currentOwner; // Dirección 0x...
    @NotBlank(message = "El estado es obligatorio")
    private String status; // "ACTIVE", "BURNED"
    @NotBlank(message = "El hash es obligatorio")
    private String characterizationHash; // El hash en Blockchain
}