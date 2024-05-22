package com.mnot.quizdot.domain.quiz.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ScoreDto {

    private int playerId;

    private Long score;

    public ScoreDto(int memberId, Long score) {
        this.playerId = memberId;
        this.score = score;
    }
}
