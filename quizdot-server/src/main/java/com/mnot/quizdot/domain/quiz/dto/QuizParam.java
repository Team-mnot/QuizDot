package com.mnot.quizdot.domain.quiz.dto;

import com.mnot.quizdot.domain.member.entity.ModeType;
import com.mnot.quizdot.domain.quiz.entity.CategoryType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "퀴즈 목록 조회 조건 파라미터")
public class QuizParam {

    CategoryType category; // 카테고리

    int count; // 개수

    ModeType modeType; //모드

}