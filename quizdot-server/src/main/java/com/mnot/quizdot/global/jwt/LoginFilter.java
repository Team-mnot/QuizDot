package com.mnot.quizdot.global.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@RequiredArgsConstructor
public class LoginFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request,
        HttpServletResponse response) throws AuthenticationException {

        //클라이언트에서 보내준 아이디와 비밀번호 추출
        String memberId = obtainUsername(request);
        String password = obtainPassword(request);

        //검증하기 위해서는 토큰에 담은 뒤 토큰을 검증함
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
            memberId, password, null);

        //토큰을 검증하기 위해 AuthenticationManger에게 보냄
        return authenticationManager.authenticate(authenticationToken);
    }

    //로그인 성공했을 때 오게 되는 함수
    @Override
    protected void successfulAuthentication(HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain, Authentication authentication) {

    }

    //로그인 실패했을 때 오는 함수
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request,
        HttpServletResponse response, AuthenticationException failed) {

    }

}
