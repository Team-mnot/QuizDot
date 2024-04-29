package com.mnot.quizdot.domain.member.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class MemberInfoDto {

    //노말전적, 서바이벌 전적, 1등횟수,유저 정보(칭호,레벨,경험치)
    //유저 Id
    private int id;
    //노말 승률
    private float normalRate;

    //서바이벌 승률
    private float survivalRate;

    //닉네임
    private String nickname;

    //닉네임 색깔
    private String nicknameColor;

    //노말 1등 횟수
    private int normalWinCount;

    //서바이벌 1등 횟수
    private int survivalWinCount;

    //칭호
    private int titleId;

    //아바타
    private int avartarId;

    //보유 포인트
    private int point;

    @Builder
    public MemberInfoDto(int id, float normalRate, float survivalRate, String nickname,
        String nicknameColor, int normalWinCount, int survivalWinCount, int titleId, int avartarId,
        int point) {
        this.id = id;
        this.normalRate = normalRate;
        this.survivalRate = survivalRate;
        this.nickname = nickname;
        this.nicknameColor = nicknameColor;
        this.normalWinCount = normalWinCount;
        this.survivalWinCount = survivalWinCount;
        this.titleId = titleId;
        this.avartarId = avartarId;
        this.point = point;
    }
}
