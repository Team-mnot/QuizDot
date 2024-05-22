package com.mnot.quizdot.domain.quiz.dto;

import com.mnot.quizdot.domain.member.entity.ModeType;
import com.mnot.quizdot.domain.quiz.entity.CategoryType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RoomReq {

    // 제목
    @NotBlank
    private String title;

    // 공개여부
    @NotNull
    private boolean open;

    // 비밀번호
    private String password;

    // 게임모드
    @NotNull
    private ModeType mode;

    // 문제 카테고리
    @NotNull
    private CategoryType category;

    // 최대인원
    @NotNull
    private int maxPeople;

    // 최대 퀴즈 개수
    @NotNull
    private int maxQuestion;

    @Builder
    public RoomReq(String title, boolean open, String password, ModeType mode,
        CategoryType category, int maxPeople, int maxQuestion) {
        this.title = title;
        this.open = open;
        this.password = password;
        this.mode = mode;
        this.category = category;
        this.maxPeople = maxPeople;
        this.maxQuestion = maxQuestion;
    }
}
