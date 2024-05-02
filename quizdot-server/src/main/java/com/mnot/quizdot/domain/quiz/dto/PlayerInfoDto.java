package com.mnot.quizdot.domain.quiz.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PlayerInfoDto {

    private int level;

    private String nickname;

    private String nicknameColor;

    private String title;

    private int characterId;


    @Builder
    public PlayerInfoDto(int level, String nickname, String nicknameColor, String title,
        int characterId) {
        this.level = level;
        this.nickname = nickname;
        this.nicknameColor = nicknameColor;
        this.title = title;
        this.characterId = characterId;
    }
}
