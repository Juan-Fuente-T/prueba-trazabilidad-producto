package com.juanfuente.trazabilidad_producto_blockchain.controller;

import com.juanfuente.trazabilidad_producto_blockchain.DTOs.response.ApiResponse;
import com.juanfuente.trazabilidad_producto_blockchain.DTOs.request.RegisterEventRequest;
import com.juanfuente.trazabilidad_producto_blockchain.DTOs.request.RegisterProductRequest;
import com.juanfuente.trazabilidad_producto_blockchain.model.Product;
import com.juanfuente.trazabilidad_producto_blockchain.model.ProductEvent;
import com.juanfuente.trazabilidad_producto_blockchain.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    private final ProductService productService;

    /**
     * Endpoint para obtener el catálogo completo.
     * GET /api/products
     * * @return Respuesta estandarizada con la lista de todos los productos.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Product>>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        return ResponseEntity.ok(new ApiResponse<>("Lista de productos obtenida", products));
    }

    /**
     * Endpoint para consultar el detalle de un producto específico.
     * GET /api/products/{blockchainId}
     * * @param blockchainId El ID del producto en el contrato.
     * @return Respuesta estandarizada con el producto encontrado o error 404.
     */
    @GetMapping("/{blockchainId}")
    public ResponseEntity<ApiResponse<Product>> getProductByBlockchainId(@PathVariable Long blockchainId) {
        Product product = productService.getProductByBlockchainId(blockchainId);
        if (product == null) {
            return ResponseEntity.notFound().build(); // O devolver un ApiResponse de error
        }
        return ResponseEntity.ok(new ApiResponse<>("Producto encontrado", product));
    }

    /**
     * Endpoint para consultar la trazabilidad de un producto.
     * GET /api/products/{blockchainId}/history
     * * @param blockchainId El ID del producto.
     * @return Respuesta estandarizada con la lista de eventos históricos.
     */
    @GetMapping("/{blockchainId}/history")
    public ResponseEntity<ApiResponse<List<ProductEvent>>> getProductHistory(@PathVariable Long blockchainId) {
        List<ProductEvent> history = productService.getProductHistory(blockchainId);
        return ResponseEntity.ok(new ApiResponse<>("Historial obtenido", history));
    }

    /**
     * Endpoint para registrar un producto recién creado en la DApp.
     * POST /api/products
     * * Recibe los datos combinados del formulario (Front) y de la Blockchain.
     * * @param request DTO que contiene el objeto Product y el hash de la transacción de creación.
     * @return El producto persistido en base de datos.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Product>> registerProduct(@RequestBody RegisterProductRequest request) {
        Product savedProduct = productService.registerProduct(request.getProduct(), request.getCreationTxHash());
        return ResponseEntity.ok(new ApiResponse<>("Producto registrado correctamente", savedProduct));
    }

    /**
     * Endpoint para notificar al Backend de eventos ocurridos en Blockchain.
     * POST /api/products/events
     * * Se debe llamar cada vez que el usuario realiza una acción de escritura en el contrato
     * (Transferir, Borrar) para mantener la base de datos sincronizada.
     * * @param request DTO con los detalles del evento (hash, from, to, type).
     * @return Respuesta vacía indicando éxito.
     */
    @PostMapping("/events")
    public ResponseEntity<ApiResponse<Void>> registerEvent(@RequestBody RegisterEventRequest request) {
        productService.registerEvent(
                request.getBlockchainId(),
                request.getProductHash(),
                request.getTxHash(),
                request.getFrom(),
                request.getTo(),
                request.getType()
        );
        // Devuelve mensaje de éxito pero sin datos (null)
        return ResponseEntity.ok(new ApiResponse<>("Evento registrado y estado actualizado"));
    }
}