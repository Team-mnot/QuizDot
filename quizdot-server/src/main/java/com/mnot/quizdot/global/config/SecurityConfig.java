package com.mnot.quizdot.global.config;

import com.mnot.quizdot.global.jwt.LoginFilter;
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

/**
 * Spring Security 설정
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final AuthenticationConfiguration authenticationConfiguration;

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
            .addFilterAt(new LoginFilter(authenticationManager(authenticationConfiguration)),
                UsernamePasswordAuthenticationFilter.class);

        //세션을 stateless상태로 설정함
        http
            .sessionManagement((session) -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        return http.build();
    }
}
