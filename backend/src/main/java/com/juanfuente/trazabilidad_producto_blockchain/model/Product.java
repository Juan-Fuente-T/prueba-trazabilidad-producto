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
    private String id; // ID en Mongo

    @NotNull
    @Indexed(unique = true)
    private Long blockchainId; // El ID numérico en el contrato

    @NotNull
    private Long quantity;

    @NotBlank
    @Indexed(unique = true)
    private String characterizationHash; // `0x${string}`

    @NotBlank
    private String currentOwner; // `0x${string}`

    @NotBlank
    private Long timestamp; // bigint en TS -> Long en Java

    private boolean active; // exists: boolean

    // --- DATOS solo en Mongo) ---
    @NotBlank(message = "El nombre no puede estar vacío")
    private String name;

    private String description;

    private String imageUrl;
}