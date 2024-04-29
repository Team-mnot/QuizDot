package com.mnot.quizdot.domain.quiz.dto;

import com.mnot.quizdot.domain.quiz.entity.CategoryType;
import com.mnot.quizdot.domain.quiz.entity.QuestionType;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class QuizRes {

    private int id;
    private String question;
    private String hint;
    private String imagePath;
    private CategoryType category;
    private QuestionType questionType;
    private String description;
    private List<String> answers;

}
