package com.mnot.quizdot.domain.quiz.repository;

import com.mnot.quizdot.domain.quiz.dto.QuizRes;
import java.util.List;

public interface QuizRepositoryCustom {

    List<QuizRes> getQuizzesByIds(List<Integer> idList);

}
