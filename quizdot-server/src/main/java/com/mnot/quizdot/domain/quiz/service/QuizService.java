package com.mnot.quizdot.domain.quiz.service;

import com.mnot.quizdot.domain.quiz.dto.QuizListRes;
import com.mnot.quizdot.domain.quiz.dto.QuizParam;

public interface QuizService {

    QuizListRes getQuizzes(int roomNum, QuizParam quizParam);

}
