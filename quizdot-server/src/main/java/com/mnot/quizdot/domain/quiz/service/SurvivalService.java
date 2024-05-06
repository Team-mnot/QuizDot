package com.mnot.quizdot.domain.quiz.service;

import com.mnot.quizdot.domain.quiz.dto.ResultDto;
import java.util.List;

public interface SurvivalService {

    void updateScores(int roomId, String memberId, int isCorrect);

    List<ResultDto> exitGame(int roomId, int memberId);

    void getStageResult(int roomId, int memberId);
}
