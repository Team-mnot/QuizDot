package com.mnot.quizdot.global.config;

import java.util.List;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // CORS 설정
        List<String> origins = List.of("http://k10d102.p.ssafy.io", "https://k10d102.p.ssafy.io",
            "http://localhost:5173");
        registry.addMapping("/**")
            .allowedOrigins(String.join(",", origins))
            .allowedMethods("GET", "POST", "DELETE")
            .allowedHeaders("Authorization", "Content-Type")
            .allowCredentials(true)
            .maxAge(3600);
    }
}
