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

    public ScoreDto(String memberId, Long score) {
        this.playerId = Integer.parseInt(memberId);
        this.score = score;
    }
}
