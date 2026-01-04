package com.juanfuente.trazabilidad_producto_blockchain.DTOs.product.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record TransferProductRequest(
        @NotNull(message = "El ID es obligatorio")
        Long blockchainId,

        @NotBlank(message = "El hash de transacción es obligatorio")
        String txHash,

        @NotBlank(message = "El nuevo dueño es obligatorio")
        String newOwnerAddress,

        @NotBlank(message = "El hash de integridad es obligatorio")
        String expectedProductHash
) {
}
