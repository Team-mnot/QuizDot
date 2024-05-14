package com.mnot.quizdot.domain.quiz.service;

import com.mnot.quizdot.domain.member.entity.ModeType;
import com.mnot.quizdot.domain.quiz.dto.QuizParam;

public interface QuizService {

    void getQuizzes(int roomNum, QuizParam quizParam);

    void passQuestion(int roomId, int memberId, String nickname);

    void startGame(int roomId, int memberId, ModeType mode);

    void deleteGame(int roomId);

    void initGame(int roomId, int memberId, ModeType mode);

}
