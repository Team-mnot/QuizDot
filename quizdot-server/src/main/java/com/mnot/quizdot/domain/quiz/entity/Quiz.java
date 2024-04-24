package com.mnot.quizdot.domain.quiz.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class Quiz {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String question;

    // 문제 형태 - 텍스트 / 텍스트 + 이미지 / OX st
    private QuestionType questionType;

    // 문제 카테고리 - 시사 / 경제 st
    private CategoryType category;

    private String hint;

    private String path;

}
