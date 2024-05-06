package com.mnot.quizdot.domain.quiz.service;

public interface SurvivalService {

    void updateScores(int roomId, String memberId, boolean isCorrect);
}
