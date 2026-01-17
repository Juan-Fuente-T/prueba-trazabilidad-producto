package com.juanfuente.trazabilidad_producto_blockchain.controller;

import com.juanfuente.trazabilidad_producto_blockchain.DTOs.common.ApiResponse;
import com.juanfuente.trazabilidad_producto_blockchain.model.ProductEvent;
import com.juanfuente.trazabilidad_producto_blockchain.service.ProductEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductEventController {
    private final ProductEventService productEventService;
    /**
     * Endpoint para consultar la trazabilidad de un producto.
     * GET /api/products/{blockchainId}/history
     * * @param blockchainId El ID del producto.
     * @return Respuesta estandarizada con la lista de eventos históricos.
     */
    @GetMapping("/{blockchainId}/history")
    public ResponseEntity<ApiResponse<List<ProductEvent>>> getProductHistory(@PathVariable Long blockchainId) {
        List<ProductEvent> history = productEventService.getProductHistory(blockchainId);
        return ResponseEntity.ok(new ApiResponse<>("Historial obtenido", history));
    }
}
