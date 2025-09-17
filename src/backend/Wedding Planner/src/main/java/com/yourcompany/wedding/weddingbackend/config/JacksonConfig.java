// File: src/main/java/com/yourcompany/wedding/weddingbackend/config/JacksonConfig.java
package com.yourcompany.wedding.weddingbackend.config;

import com.fasterxml.jackson.databind.Module;
import org.openapitools.jackson.nullable.JsonNullableModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JacksonConfig {

    @Bean
    public Module jsonNullableModule() {
        return new JsonNullableModule();
    }
}