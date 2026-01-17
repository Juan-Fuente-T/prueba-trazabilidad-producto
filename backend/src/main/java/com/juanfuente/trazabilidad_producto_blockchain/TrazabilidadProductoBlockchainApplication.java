package com.juanfuente.trazabilidad_producto_blockchain;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class TrazabilidadProductoBlockchainApplication {

	public static void main(String[] args) {
		SpringApplication.run(TrazabilidadProductoBlockchainApplication.class, args);
	}

}
