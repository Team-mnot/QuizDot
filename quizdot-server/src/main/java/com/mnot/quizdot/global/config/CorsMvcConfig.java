package com.mnot.quizdot.global.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsMvcConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry corsRegistry) {
        //5173에서 오는 모든 요청 허용
        corsRegistry.addMapping("/**")
            .allowedOrigins("http://localhost:5173");
    }

}
