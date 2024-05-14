package com.mnot.quizdot.global.jwt;

import com.mnot.quizdot.domain.member.dto.CustomMemberDetail;
import com.mnot.quizdot.domain.member.entity.Member;
import com.mnot.quizdot.domain.member.entity.Role;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

@RequiredArgsConstructor
@Slf4j
public class JWTFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
        FilterChain filterChain) throws ServletException, IOException {

        //request에서 access 헤더 찾기
        String authorization = request.getHeader("access");

        //헤더 검증
        if (authorization == null) {
            //다음 필터
            filterChain.doFilter(request, response);
            return;
        }

        try {
            jwtUtil.isExpired(authorization);
        } catch (ExpiredJwtException e) {
            PrintWriter writer = response.getWriter();
            writer.println("access token 만료");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        String category = jwtUtil.getCategory(authorization);
        if (!category.equals("access")) {
            //response body
            PrintWriter writer = response.getWriter();
            writer.print("invalid access token");

            //response status code
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        String memberId = jwtUtil.getUsername(authorization);
        String role = jwtUtil.getRole(authorization);
        int id = jwtUtil.getId(authorization);
        String nickname = jwtUtil.getNickname(authorization);

        Member member = Member.builder()
            .memberId(memberId)
            .role(Role.valueOf(Role.class, role))
            .nickname(nickname)
            .build();

        member.setId(id);

        log.info("member : {}", member.getRole());
        //userDetails에 회원 정보 담기!
        CustomMemberDetail customMemberDetail = new CustomMemberDetail(member);

        //시큐리티 인증 토큰 생성
        Authentication authenticationToken = new UsernamePasswordAuthenticationToken(
            customMemberDetail, null, customMemberDetail.getAuthorities());

        //세션에 등록
        SecurityContextHolder.getContext().setAuthentication(authenticationToken);

        filterChain.doFilter(request, response);

    }
}
