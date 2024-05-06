package com.mnot.quizdot.domain.quiz.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
public class ResultDto {

    //유저 id
    private int id;

    //레벨
    private int level;

    //닉네임
    private String nickname;

    //등수
    private int rank;

    //획득 점수
    private int score;

    //획득 포인트
    private int point;

    //획득 경험치
    private int exp;

    //원래 경험치
    int curExp;

    @Builder
    public ResultDto(int id, int level, String nickname, int rank, int score, int point, int exp,
        int curExp) {
        this.id = id;
        this.level = level;
        this.nickname = nickname;
        this.rank = rank;
        this.score = score;
        this.point = point;
        this.exp = exp;
        this.curExp = curExp;
    }
}
