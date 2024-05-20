package com.mnot.quizdot.domain.member.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
public class LoginRes {

    //응답 상태
    private int status;

    //메시지
    private String message;

    private LoginMemberData data;


    @Builder
    public LoginRes(int status, String message, LoginMemberData memberData) {
        this.status = status;
        this.message = message;
        this.data = memberData;
    }
}
