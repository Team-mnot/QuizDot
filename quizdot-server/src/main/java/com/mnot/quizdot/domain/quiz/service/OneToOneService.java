package com.mnot.quizdot.domain.quiz.service;


import com.mnot.quizdot.domain.quiz.dto.ResultDto;
import java.util.List;

public interface OneToOneService {

    void selectQuestion(int roomId, int questionId, int memberId);

    void updateScores(int roomId, int memberId, int isCorrect);

    List<ResultDto> exitGame(int roomId, int memberId);
}
