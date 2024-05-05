package com.mnot.quizdot.domain.quiz.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ActiveUserDto {

    private int id;

    private int level;

    private String nickname;

    @Builder
    public ActiveUserDto(int id, int level, String nickname) {
        this.id = id;
        this.level = level;
        this.nickname = nickname;
    }
}
