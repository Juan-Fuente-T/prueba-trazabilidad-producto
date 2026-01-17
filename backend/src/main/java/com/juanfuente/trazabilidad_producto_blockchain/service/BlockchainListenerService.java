package com.juanfuente.trazabilidad_producto_blockchain.service;

import com.juanfuente.trazabilidad_producto_blockchain.config.BlockchainConstants;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.request.EthFilter;
import org.web3j.protocol.http.HttpService;

@Service
public class BlockchainListenerService {

    @Value("${blockchain.rpc-url-wss}")
    private String rpcUrl;

    @Value("${blockchain.contract-address}")
    private String contractAddress;

    @Autowired
    private ProductEventService productEventService;

    private Web3j web3j;

    @PostConstruct
    public void init() {
        web3j = Web3j.build(new HttpService(rpcUrl));
        System.out.println("📡 Iniciando Escuchador Blockchain");

        subscribeToEvents();
    }

    private void subscribeToEvents() {
        // Filtro para escuchar SOLO el contrato relevante, desde el bloque actual
        EthFilter filter = new EthFilter(
                DefaultBlockParameterName.LATEST,
                DefaultBlockParameterName.LATEST,
                contractAddress
        );

        // Se suscribe al flujo (Flowable)
        web3j.ethLogFlowable(filter).subscribe(log -> {
            try {
                String eventHash = log.getTopics().get(0); // El Topic 0 indica QUÉ evento es
                String txHash = log.getTransactionHash();

                System.out.println("⚡ Evento detectado en bloque: " + log.getBlockNumber());

                if (BlockchainConstants.EVENT_REGISTERED_HASH.equalsIgnoreCase(eventHash)) {
                    System.out.println("⚡ Registro detectado on-chain");
                    productEventService.markEventAsVerified(txHash);
                }
                else if (BlockchainConstants.EVENT_TRANSFERRED_HASH.equalsIgnoreCase(eventHash)) {
                    System.out.println("⚡ Transferencia detectada on-chain");
                    productEventService.markEventAsVerified(txHash);
                }
                else if (BlockchainConstants.EVENT_DELETED_HASH.equalsIgnoreCase(eventHash)) {
                    System.out.println("⚡ Borrado detectado on-chain");
                    productEventService.markEventAsVerified(txHash);
                }

            } catch (Exception e) {
                System.err.println("Error procesando evento blockchain: " + e.getMessage());
            }
        }, error -> {
            System.err.println("❌ Error en la suscripción Web3j: " + error.getMessage());
        });
    }
}