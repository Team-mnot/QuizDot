package com.mnot.quizdot.domain.member.controller;

import com.mnot.quizdot.domain.member.dto.JoinDTO;
import com.mnot.quizdot.domain.member.service.MemberService;
import com.mnot.quizdot.global.result.ResultResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
@Validated
@Tag(name = "Member", description = "멤버 API")
public class MemberController {

    private final MemberService memberService;

    @PostMapping("/join")
    @Operation(summary = "회원 가입")
    public ResultResponse joinMember(@Valid JoinDTO joinDTO) {
        memberService.joinMember(joinDTO);
        return ResultResponse.of(200, "회원가입 성공");
    }

}
