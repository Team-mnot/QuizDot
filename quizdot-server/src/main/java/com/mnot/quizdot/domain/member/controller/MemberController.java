package com.mnot.quizdot.domain.member.controller;

import com.mnot.quizdot.domain.member.dto.JoinDto;
import com.mnot.quizdot.domain.member.service.MemberService;
import com.mnot.quizdot.global.result.ResultResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.Collection;
import java.util.Iterator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
@Validated
@Tag(name = "Member", description = "멤버 API")
@Slf4j
public class MemberController {

    private final MemberService memberService;

    @PostMapping("/join")
    @Operation(summary = "회원 가입")
    public ResultResponse joinMember(
        @RequestBody @Valid JoinDto joinDTO) {

        log.info("회원 가입 URL 맵핑 : OK");

        memberService.joinMember(joinDTO);

        log.info("회원 가입 : COMPLETE");

        return ResultResponse.of(200, "회원가입 성공");
    }

    @GetMapping("/test")
    public String test() {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iter = authorities.iterator();
        GrantedAuthority auth = iter.next();
        String role = auth.getAuthority();
        return "test 중 입니다" + name + "\n" + role;
    }

}
