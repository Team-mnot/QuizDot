package com.mnot.quizdot.global.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI() {
        Info info = new Info()
            .title("QuizDot 프로젝트의 API Document")
            .version("v0.0.1")
            .description("QuizDot 프로젝트의 API 명세서입니다.");

        SecurityScheme accessKeyScheme = new SecurityScheme()
            .type(SecurityScheme.Type.APIKEY)  // 변경된 부분: HTTP에서 APIKEY로 변경
            .in(SecurityScheme.In.HEADER)      // 인증 정보는 헤더에 위치
            .name("access");                   // 'Authorization' 대신 'access' 키 사용

        // Security 요청 설정
        SecurityRequirement securityRequirement = new SecurityRequirement();
        securityRequirement.addList("access");  // 요구하는 보안 스키마를 'access'로 지정

        Components components = new Components()
            .addSecuritySchemes("access", accessKeyScheme);  // 'access' 보안 스키마 등록

        return new OpenAPI()
            .components(components)
            .addSecurityItem(securityRequirement)
            .info(info);
    }
}

