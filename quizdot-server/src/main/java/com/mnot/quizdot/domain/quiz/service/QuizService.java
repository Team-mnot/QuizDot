package com.mnot.quizdot.domain.quiz.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mnot.quizdot.domain.member.entity.ModeType;
import com.mnot.quizdot.domain.quiz.dto.QuizListRes;
import com.mnot.quizdot.domain.quiz.dto.QuizParam;

public interface QuizService {

    QuizListRes getQuizzes(int roomNum, QuizParam quizParam);

    void passQuestion(int roomId, int questionId, int memberId, String nickname)
        throws JsonProcessingException;

    void startGame(int roomId, int memberId, ModeType mode);

    void deleteGame(int roomId);

    void initGame(int roomId, int memberId, ModeType mode);

}
