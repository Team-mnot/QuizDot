package com.mnot.quizdot.domain.member.dto;

import java.util.List;
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

    //전체 승률
    private float totalRate;

    //노말 승률
    private float normalRate;

    //서바이벌 승률
    private float survivalRate;

    //닉네임
    private String nickname;

    //닉네임 색깔
    private String nicknameColor;

    //전체 1등 횟수
    private int totalWinCount;

    //노말 1등 횟수
    private int normalWinCount;

    //서바이벌 1등 횟수
    private int survivalWinCount;

    //칭호
    private String title;

    //칭호 리스트
    private List<TitleListDto> titleListDtos;

    //캐릭터
    private int characterId;

    //캐릭터 리스트
    private List<CharacterListDto> characterListDtos;

    //보유 포인트
    private int point;

    //레벨
    private int level;

    //경험치
    private int exp;

    @Builder
    public MemberInfoDto(int id, float totalRate, float normalRate, float survivalRate,
        String nickname,
        String nicknameColor, int totalWinCount, int normalWinCount, int survivalWinCount,
        String title,
        int characterId,
        int point, int level, int exp, List<TitleListDto> titleListDtos,
        List<CharacterListDto> characterListDtos) {
        this.id = id;
        this.totalRate = totalRate;
        this.normalRate = normalRate;
        this.survivalRate = survivalRate;
        this.nickname = nickname;
        this.nicknameColor = nicknameColor;
        this.totalWinCount = totalWinCount;
        this.normalWinCount = normalWinCount;
        this.survivalWinCount = survivalWinCount;
        this.title = title;
        this.titleListDtos = titleListDtos;
        this.characterId = characterId;
        this.characterListDtos = characterListDtos;
        this.point = point;
        this.level = level;
        this.exp = exp;

    }
}
