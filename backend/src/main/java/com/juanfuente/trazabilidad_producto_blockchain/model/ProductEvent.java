package com.juanfuente.trazabilidad_producto_blockchain.model;

import lombok.Data;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
;import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
@Data
@Document(collection = "product_events")
public class ProductEvent {
    @Id
    private String id;

    @NotNull(message = "El ID del producto asociado es obligatorio")
    @Indexed // Indexa para poder buscar rápido "todos los eventos del producto 5"
    private Long productBlockchainId;

    @NotBlank(message = "El hash de la transacción es obligatorio")
    @Indexed(unique = true) // No puede haber dos eventos con el mismo hash
    private String transactionHash;

    @NotBlank(message = "El hash del producto es obligatorio")
    @Indexed(unique = true)
    private String productHash;

    @NotBlank(message = "La dirección de origen (from) es obligatoria")
    private String fromAddress;

    @NotBlank(message = "La dirección de destino (to) es obligatoria")
    private String toAddress;

    @NotNull(message = "El tipo de evento es obligatorio")
    private EventType type; // CREATED, TRANSFERRED...

    @NotNull(message = "La fecha del evento es obligatoria")
    private Long timestamp;
}