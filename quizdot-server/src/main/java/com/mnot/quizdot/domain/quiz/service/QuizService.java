package com.mnot.quizdot.domain.quiz.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mnot.quizdot.domain.quiz.dto.QuizListRes;
import com.mnot.quizdot.domain.quiz.dto.QuizParam;

public interface QuizService {

    QuizListRes getQuizzes(int roomNum, QuizParam quizParam);

    void updateScores(int roomId, int questionId, String memberId);

    void passQuestion(int roomId, int questionId, String memberId, String nickname)
        throws JsonProcessingException;

}
