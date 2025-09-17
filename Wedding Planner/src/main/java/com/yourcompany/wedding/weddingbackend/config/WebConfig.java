package com.yourcompany.wedding.weddingbackend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // CORS for Angular dev server (safe to keep)
//    @Override
//    public void addCorsMappings(CorsRegistry registry) {
//        registry.addMapping("/**")
//                .allowedOrigins("http://localhost:4200")
//                .allowedMethods("*");
//    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:4200")
                .allowedMethods("*")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

    // SPA fallback that does NOT swallow /assets/... or files with dots.
    // It forwards only one-level app routes like /home, /login, /tasks, etc.
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/{spring:[a-zA-Z0-9-]+}")
                .setViewName("forward:/index.html");
        // Note: we intentionally do NOT add the "/{spring}/**" mapping here,
        // because it would also catch static assets (e.g., /assets/logo.png).
    }



}