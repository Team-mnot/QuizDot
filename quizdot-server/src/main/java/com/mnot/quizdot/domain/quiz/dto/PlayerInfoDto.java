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

    private int title;

    private int avatar;


    @Builder
    public PlayerInfoDto(int level, String nickname, String nicknameColor, int title, int avatar) {
        this.level = level;
        this.nickname = nickname;
        this.nicknameColor = nicknameColor;
        this.title = title;
        this.avatar = avatar;
    }
}
