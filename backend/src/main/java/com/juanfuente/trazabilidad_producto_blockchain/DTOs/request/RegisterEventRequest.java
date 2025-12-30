package com.juanfuente.trazabilidad_producto_blockchain.DTOs.request;

import lombok.Data;
import com.juanfuente.trazabilidad_producto_blockchain.model.EventType;

@Data
public class RegisterEventRequest {
    private Long blockchainId;
    private String productHash;
    private String txHash;
    private String from;
    private String to;
    private EventType type;
}