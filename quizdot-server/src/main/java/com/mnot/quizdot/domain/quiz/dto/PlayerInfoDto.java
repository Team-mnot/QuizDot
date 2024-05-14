package com.mnot.quizdot.domain.quiz.dto;

import java.io.Serializable;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class PlayerInfoDto implements Serializable {

    private int id;

    private int level;

    private String nickname;

    private String nicknameColor;

    private String title;

    private int characterId;


    @Builder
    public PlayerInfoDto(int id, int level, String nickname, String nicknameColor, String title,
        int characterId) {
        this.id = id;
        this.level = level;
        this.nickname = nickname;
        this.nicknameColor = nicknameColor;
        this.title = title;
        this.characterId = characterId;
    }
}
