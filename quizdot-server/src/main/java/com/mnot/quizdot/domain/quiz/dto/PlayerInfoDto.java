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

    private int title;

    private int avatar;


    @Builder
<<<<<<< HEAD
    public PlayerInfoDto(int id, int level, String nickname, String nicknameColor, String title,
        int characterId) {
        this.id = id;
=======
    public PlayerInfoDto(int level, String nickname, String nicknameColor, int title, int avatar) {
>>>>>>> 99efda8833edc925298ea8af9cd8da47412c9099
        this.level = level;
        this.nickname = nickname;
        this.nicknameColor = nicknameColor;
        this.title = title;
        this.avatar = avatar;
    }
}
