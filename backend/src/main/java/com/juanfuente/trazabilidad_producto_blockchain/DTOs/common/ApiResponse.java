package com.juanfuente.trazabilidad_producto_blockchain.DTOs.common;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Clase envoltorio estándar para todas las respuestas de la API.
 * * La "T" corresponde a "Type" (Tipo Genérico). Es como un "comodín" o una variable matemática (x),
 * pero para Tipos de Datos.
 * * - Al usar ApiResponse<Product>, la "T" se convierte automáticamente en un objeto Product.
 * - Al usar ApiResponse<List<ProductEvent>>, la "T" se convierte en una Lista de Eventos.
 * * Esto nos permite usar ESTA MISMA CLASE para enviar cualquier cosa (coches, usuarios, productos...)
 * sin tener que crear "ProductResponse", "UserResponse", etc.
 */
@Data
@AllArgsConstructor
public class ApiResponse<T> {
    private String message;
    private T data;

    // Constructor para mensajes de éxito sin datos (como borrar o registrar evento)
    public ApiResponse(String message) {
        this.message = message;
        this.data = null;
    }
}