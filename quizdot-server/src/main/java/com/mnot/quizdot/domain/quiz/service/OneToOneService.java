package com.mnot.quizdot.domain.quiz.service;


public interface OneToOneService {

    void selectQuestion(int roomId, int questionId, int memberId);

    void updateScores(int roomId, int memberId, int isCorrect);
}
