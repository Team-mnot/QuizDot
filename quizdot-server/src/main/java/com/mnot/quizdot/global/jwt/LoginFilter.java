package com.mnot.quizdot.global.jwt;

import com.mnot.quizdot.domain.member.dto.CustomMemberDetail;
import com.mnot.quizdot.domain.member.dto.RefreshToken;
import com.mnot.quizdot.domain.member.repository.RefreshTokenRedisRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Collection;
import java.util.Iterator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@RequiredArgsConstructor
@Slf4j
public class LoginFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;

    private final RefreshTokenRedisRepository refreshTokenRedisRepository;


    @Override
    public Authentication attemptAuthentication(HttpServletRequest request,
        HttpServletResponse response) throws AuthenticationException {

        //클라이언트에서 보내준 아이디와 비밀번호 추출;
        String memberId = request.getParameter("memberId");
        String password = request.getParameter("password");

        log.info("로그인 필터 : {}", memberId);

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

        log.info("로그인 성공 : START");

        CustomMemberDetail customMemberDetail = (CustomMemberDetail) authentication.getPrincipal();
        //유저 아이디 가져오기
        String memberId = customMemberDetail.getUsername();
        int id = customMemberDetail.getId();

        //권한 가져오기
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority authority = iterator.next();

        //role 가져오기
        String role = authority.getAuthority();

        // 닉네임 가져오기
        String nickname = customMemberDetail.getNickname();

        log.info("로그인 한 아이디 : {}", memberId);
        log.info("로그인 한 role : {}", role);

        //토큰 발급
        String access = jwtUtil.createJwt("access", id, memberId, role, nickname, 10800000L);
        String refresh = jwtUtil.createJwt("refresh", id, memberId, role, nickname, 64800000L);
        RefreshToken refreshToken = RefreshToken.builder()
            .memberId(memberId)
            .refreshToken(refresh)
            .build();

        //redis에 refreshtoken 저장
        try {
            refreshTokenRedisRepository.save(refreshToken);
            log.info("Refresh token 저장 성공");
        } catch (Exception e) {
            log.error("Redis에 Refresh token 저장 실패", e);
        }

        response.setHeader("access", access);
        response.addCookie(createCookie("refresh", refresh));
        response.setStatus(HttpStatus.OK.value());

        log.info("로그인 성공 : COMPLETE");
    }

    //로그인 실패했을 때 오는 함수
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request,
        HttpServletResponse response, AuthenticationException failed) {

        response.setStatus(401);

    }

    //쿠키 생성
    private Cookie createCookie(String key, String value) {

        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(24 * 60 * 60);
        cookie.setHttpOnly(true);

        return cookie;
    }
}
