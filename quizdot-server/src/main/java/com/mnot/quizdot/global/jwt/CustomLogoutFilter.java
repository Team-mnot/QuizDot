package com.mnot.quizdot.global.jwt;

import com.mnot.quizdot.domain.member.repository.RefreshTokenRedisRepository;
import com.mnot.quizdot.global.result.error.ErrorCode;
import com.mnot.quizdot.global.result.error.exception.BusinessException;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.filter.GenericFilterBean;

@RequiredArgsConstructor
@Slf4j
public class CustomLogoutFilter extends GenericFilterBean {

    private final JWTUtil jwtUtil;
    private final RefreshTokenRedisRepository refreshTokenRedisRepository;

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse,
        FilterChain filterChain) throws IOException, ServletException {
        doFilter((HttpServletRequest) servletRequest, (HttpServletResponse) servletResponse,
            filterChain);
    }

    private void doFilter(HttpServletRequest request, HttpServletResponse response,
        FilterChain filterChain) throws IOException, ServletException {

        //logout URI로 들어오면
        String requestUri = request.getRequestURI();
        if (!requestUri.matches("^\\/api\\/member\\/logout$")) {

            filterChain.doFilter(request, response);
            return;
        }
        String requestMethod = request.getMethod();
        if (!requestMethod.equals("GET")) {

            filterChain.doFilter(request, response);
            return;
        }

        //refreshToken 가져오기
        String refresh = null;
        Cookie[] cookies = request.getCookies();
        for (Cookie cookie : cookies) {

            if (cookie.getName().equals("refresh")) {

                refresh = cookie.getValue();
            }
        }

        //refresh 있는지 체크
        if (refresh == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_REFRESH_TOKEN);
        }

        //만료 체크
        try {
            jwtUtil.isExpired(refresh);
        } catch (ExpiredJwtException e) {
            throw new BusinessException(ErrorCode.EXPIRED_REFRESH_TOKEN);
        }

        // refreshToken인지 확인
        String category = jwtUtil.getCategory(refresh);
        if (!category.equals("refresh")) {
            throw new BusinessException(ErrorCode.IS_NOT_REFRESH_TOKEN);
        }

        //redis에 저장되어 있는지 확인
        Boolean isExist = refreshTokenRedisRepository.existsById(jwtUtil.getUsername(refresh));

        log.info("isExist : {}", isExist);
        if (!isExist) {
            throw new BusinessException(ErrorCode.NOT_FOUND_REFRESH_TOKEN);
        }

        //로그아웃 진행
        //Refresh 토큰 redis에서 삭제
        refreshTokenRedisRepository.deleteById(jwtUtil.getUsername(refresh));

        //Refresh 토큰 Cookie 값 0
        Cookie cookie = new Cookie("refresh", null);
        cookie.setMaxAge(0);
        cookie.setPath("/");

        response.addCookie(cookie);
        response.setStatus(HttpServletResponse.SC_OK);
    }

}
