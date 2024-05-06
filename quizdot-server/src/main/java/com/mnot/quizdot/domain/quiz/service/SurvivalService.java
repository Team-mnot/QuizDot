package com.mnot.quizdot.domain.quiz.service;

import com.mnot.quizdot.domain.quiz.dto.ResultDto;
import java.util.List;

public interface SurvivalService {

    void updateScores(int roomId, String memberId, boolean isCorrect);

    List<ResultDto> exitGame(int roomId, int memberId);
}
