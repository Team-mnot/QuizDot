package com.mnot.quizdot.domain.member.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
public class LoginMemberData {

    //멤버 pk
    private int id;

    //칭호명
    private String title;

    //닉네임
    private String nickname;

    //닉네임 색상
    private String nicknameColor;

    //캐릭터 Id
    private int characterId;

    //레벨
    private int level;

    //경험치
    private int exp;

    //포인트
    private int point;

    @Builder
    public LoginMemberData(int id, String title, String nickname, String nicknameColor,
        int characterId, int level, int exp, int point) {
        this.id = id;
        this.title = title;
        this.nickname = nickname;
        this.nicknameColor = nicknameColor;
        this.characterId = characterId;
        this.level = level;
        this.exp = exp;
        this.point = point;
    }
}
