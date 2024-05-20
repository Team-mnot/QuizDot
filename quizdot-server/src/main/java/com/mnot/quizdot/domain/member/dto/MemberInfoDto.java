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

    //일대일 승률
    private float otoRate;

    //닉네임
    private String nickname;

    //닉네임 색깔
    private String nicknameColor;

    //노말 1등 횟수
    private int normalWinCount;

    //서바이벌 1등 횟수
    private int survivalWinCount;

    //일대일 승리 횟수
    private int otoWinCount;

    //칭호
    private int titleId;

<<<<<<< HEAD
    //칭호 리스트
    private List<TitleListDto> titleListDtos;

    //캐릭터
    private int characterId;

    //캐릭터 리스트
    private List<CharacterListDto> characterListDtos;
=======
    //아바타
    private int avartarId;
>>>>>>> 99efda8833edc925298ea8af9cd8da47412c9099

    //보유 포인트
    private int point;

    @Builder
<<<<<<< HEAD
    public MemberInfoDto(int id, float totalRate, float normalRate, float survivalRate,
        float otoRate,
        String nickname,
        String nicknameColor, int totalWinCount, int normalWinCount, int survivalWinCount,
        int otoWinCount,
        String title,
        int characterId,
        int point, int level, int exp, List<TitleListDto> titleListDtos,
        List<CharacterListDto> characterListDtos) {
=======
    public MemberInfoDto(int id, float normalRate, float survivalRate, String nickname,
        String nicknameColor, int normalWinCount, int survivalWinCount, int titleId, int avartarId,
        int point) {
>>>>>>> 99efda8833edc925298ea8af9cd8da47412c9099
        this.id = id;
        this.normalRate = normalRate;
        this.survivalRate = survivalRate;
        this.otoRate = otoRate;
        this.nickname = nickname;
        this.nicknameColor = nicknameColor;
        this.normalWinCount = normalWinCount;
        this.survivalWinCount = survivalWinCount;
<<<<<<< HEAD
        this.otoWinCount = otoWinCount;
        this.title = title;
        this.titleListDtos = titleListDtos;
        this.characterId = characterId;
        this.characterListDtos = characterListDtos;
=======
        this.titleId = titleId;
        this.avartarId = avartarId;
>>>>>>> 99efda8833edc925298ea8af9cd8da47412c9099
        this.point = point;
    }
}
