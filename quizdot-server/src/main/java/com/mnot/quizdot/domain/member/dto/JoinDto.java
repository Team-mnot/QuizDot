package com.mnot.quizdot.domain.member.dto;


import jakarta.validation.constraints.Pattern;
import lombok.Getter;

@Getter
public class JoinDto {

    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,}$", message = "아이디는 영어와 숫자를 최소 1개씩 포함한 6자 이상이어야 합니다.")
    private String memberId;
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$", message = "비밀번호는 영어와 숫자를 최소 1개씩 포함한 8자 이상이어야 합니다.")
    private String password;
    private String nickname;
    private String hint;
}
