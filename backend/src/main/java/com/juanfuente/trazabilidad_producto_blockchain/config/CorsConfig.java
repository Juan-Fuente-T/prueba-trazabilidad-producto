package com.juanfuente.trazabilidad_producto_blockchain.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@Configuration
public class CorsConfig {
    //Permite ajustar la url del front añadiendo variables de entorno ALLOWED_ORIGINS
    // a allowedOrigins en el servidor donde este desplegada la app, en este caso mi servidor.
//    @Value("#{'${ALLOWED_ORIGINS:*}'.split(',')}") // Si no existe la variable, usa "*"
    private String[] allowedOrigins;

    public CorsConfig(
            @Value("#{'${ALLOWED_ORIGINS:*}'.split(',')}") String[] allowedOrigins
    ) {
        this.allowedOrigins = allowedOrigins;
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(@NonNull CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOriginPatterns(allowedOrigins)
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true)
                        .maxAge(3600);
            }
        };
    }
}