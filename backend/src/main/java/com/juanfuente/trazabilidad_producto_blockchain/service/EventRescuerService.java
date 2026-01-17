package com.juanfuente.trazabilidad_producto_blockchain.service;

import com.juanfuente.trazabilidad_producto_blockchain.repository.ProductEventRepository;
import com.juanfuente.trazabilidad_producto_blockchain.model.ProductEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.protocol.http.HttpService;
import java.util.List;
import java.util.Optional;

    @Service
    @RequiredArgsConstructor
    public class EventRescuerService {

        private final ProductEventRepository eventRepository;

        // Usamos una conexión HTTP simple y nueva para esto, no hace falta WebSocket
        @Value("${blockchain.rpc-url-http}")
        private String rpcUrl;

        /**
         * Tarea programada: Se ejecuta cada 60 segundos.
         * Busca eventos "huerfanos" en la BD y verifica si existen en Blockchain.
         */
        @Scheduled(fixedRate = 60000)
        public void reconcilePendingEvents() {
            // 1. Busca en BD lo que está pendiente
            List<ProductEvent> unverifiedEvents = eventRepository.findByIsVerifiedFalse();

            if (unverifiedEvents.isEmpty()) return;

            System.out.println("🧹 [Rescuer] Revisando " + unverifiedEvents.size() + " eventos pendientes...");

            // Crea una instancia Web3j temporal (o usa la global si prefieres)
            Web3j web3j = Web3j.build(new HttpService(rpcUrl));

            for (ProductEvent event : unverifiedEvents) {
                String txHash = event.getTransactionHash();

                try {
                    // DEBUG: Imprimimos qué vamos a preguntar y a dónde
                     System.out.println("🔍 Consultando hash: " + txHash);
                    // 2. Pregunta a la Blockchain por el recibo de esa transacción específica
                    Optional<TransactionReceipt> receiptOpt = web3j.ethGetTransactionReceipt(event.getTransactionHash())
                            .send()
                            .getTransactionReceipt();

                    if (receiptOpt.isPresent()) {
                        TransactionReceipt receipt = receiptOpt.get();

                        if ("0x1".equals(receipt.getStatus())) {
                            event.setVerified(true);
                            eventRepository.save(event);
                            System.out.println("✅ [Rescuer] RECUPERADO: " + txHash);
                        } else {
                            // Si la transacción existió pero falló (Revert)
                            System.err.println("❌ [Rescuer] Transacción FALLIDA en Blockchain (Status 0x0): " + txHash);
                        }
                    } else {
                        // EL rpc dice que ese Hash no existe en su base de datos
                        System.out.println("❓ [Rescuer] Transacción NO ENCONTRADA en Blockchain. Hash: " + txHash);
                        System.out.println("   -> Posibles causas: Hash incorrecto, red equivocada (Sepolia vs Mainnet) o transacción nunca enviada.");
                    }
                } catch (Exception e) {
                    System.err.println("⚠️ Error verificando hash " + event.getTransactionHash() + ": " + e.getMessage());
                }
            }
        }
    }
