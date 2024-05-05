package com.mnot.quizdot.domain.quiz.service;

import com.mnot.quizdot.domain.quiz.dto.ResultDto;
import java.util.List;

public interface MultiService {

    void updateScores(int roomId, int questionId, String memberId);

    List<ResultDto> exitGame(int roomId, int memberId);
}
