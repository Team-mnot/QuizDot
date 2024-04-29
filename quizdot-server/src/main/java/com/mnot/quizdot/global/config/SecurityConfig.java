package com.mnot.quizdot.global.config;

import com.mnot.quizdot.domain.member.repository.RefreshTokenRedisRepository;
import com.mnot.quizdot.global.jwt.CustomLogoutFilter;
import com.mnot.quizdot.global.jwt.JWTFilter;
import com.mnot.quizdot.global.jwt.JWTUtil;
import com.mnot.quizdot.global.jwt.LoginFilter;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Arrays;
import java.util.Collections;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

/**
 * Spring Security 설정
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final AuthenticationConfiguration authenticationConfiguration;
    private final RefreshTokenRedisRepository refreshTokenRedisRepository;
    private final JWTUtil jwtUtil;

    //비밀번호를 암호화 해서 저장하기 위해 사용
    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration)
        throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        //cors처리 안하면 토큰이 리턴되지 않음
        http
            .cors((cors) -> cors
                .configurationSource(new CorsConfigurationSource() {
                    @Override
                    public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
                        CorsConfiguration configuration = new CorsConfiguration();
                        configuration.setAllowedOrigins(
                            //허용할 주소
                            Arrays.asList("https://k10d102.p.ssafy.io", "http://localhost:5173"));
                        //허용할 메소드
                        configuration.setAllowedMethods(Collections.singletonList("*"));
                        //클라이언트에서 credentials 보내주면 true로 하기
                        configuration.setAllowCredentials(true);
                        //허용할 헤더
                        configuration.setAllowedHeaders(Collections.singletonList("*"));
                        //얼마나 허용할 지
                        configuration.setMaxAge(3600L);

                        //Authorization에 jwt담아서 보내기 때문
                        configuration.setExposedHeaders(Collections.singletonList("Authorization"));

                        return configuration;
                    }
                }));

        //csrf
        http
            .csrf((auth) -> auth.disable());

        //jwt 방식으로 로그인을 할 것이기 때문에 formLogin과 http basic 인증 방식 disable하기
        http
            .formLogin((auth) -> auth.disable());
        http
            .httpBasic((auth) -> auth.disable());

        //경로별 인가 작업 나누기
        http
            .authorizeHttpRequests((auth) -> auth
                //해당 경로에는 누구나 접근 가능
                .requestMatchers("/**").permitAll()
                //그 외의 경로들은 인증받은 사람들만 접근 가능
                .anyRequest().authenticated());

        //커스텀 로그인 필터 등록, UsernamePasswordAuthenticationFilter위치에 사용함.
        http
            .addFilterAt(
                new LoginFilter(authenticationManager(authenticationConfiguration), jwtUtil,
                    refreshTokenRedisRepository),
                UsernamePasswordAuthenticationFilter.class);

        http
            .addFilterBefore(new JWTFilter(jwtUtil), LoginFilter.class);

        //커스텀 로그아웃 필터 등록
        http
            .addFilterBefore(new CustomLogoutFilter(jwtUtil, refreshTokenRedisRepository),
                LogoutFilter.class);

        //세션을 stateless상태로 설정함
        http
            .sessionManagement((session) -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        return http.build();
    }
}
