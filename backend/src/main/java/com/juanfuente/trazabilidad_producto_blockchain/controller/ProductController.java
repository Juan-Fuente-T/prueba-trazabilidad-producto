package com.juanfuente.trazabilidad_producto_blockchain.controller;

import com.juanfuente.trazabilidad_producto_blockchain.DTOs.common.ApiResponse;
import com.juanfuente.trazabilidad_producto_blockchain.DTOs.product.request.RegisterProductRequest;
import com.juanfuente.trazabilidad_producto_blockchain.DTOs.product.request.TransferProductRequest;
import com.juanfuente.trazabilidad_producto_blockchain.DTOs.product.request.DeleteProductRequest;
import com.juanfuente.trazabilidad_producto_blockchain.DTOs.product.response.ProductResponse;
import com.juanfuente.trazabilidad_producto_blockchain.model.Product;
import com.juanfuente.trazabilidad_producto_blockchain.model.ProductEvent;
import com.juanfuente.trazabilidad_producto_blockchain.service.ProductService;
import jakarta.validation.Valid;
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
    public ResponseEntity<ApiResponse<ProductResponse>> registerProduct(@RequestBody @Valid RegisterProductRequest request) {
        ProductResponse savedProductResponse = productService.registerProduct(request.getProduct(), request.getCreationTxHash());
        return ResponseEntity.ok(new ApiResponse<>("Producto registrado correctamente", savedProductResponse));
    }

    @PostMapping("/transfer")
    public ResponseEntity<ApiResponse<ProductResponse>> transferProduct(@RequestBody @Valid TransferProductRequest request) {
        ProductResponse transferredResponseDto = productService.transferProduct(
                request.blockchainId(),
                request.txHash(),
                request.newOwnerAddress(),
                request.expectedProductHash()
        );
        return ResponseEntity.ok(new ApiResponse<>("Producto registrado correctamente", transferredResponseDto));
    }
    @PostMapping("/delete")
    public ResponseEntity<ApiResponse<ProductResponse>> deleteProduct(@RequestBody @Valid DeleteProductRequest request) {
        ProductResponse deletedResponseDto = productService.deleteProduct(
                request.blockchainId(),
                request.txHash(),
                request.expectedProductHash());
        return ResponseEntity.ok(new ApiResponse<>("Producto registrado correctamente", deletedResponseDto));
    }
}