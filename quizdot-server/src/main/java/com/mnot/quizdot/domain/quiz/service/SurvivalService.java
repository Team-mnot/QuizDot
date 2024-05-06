package com.mnot.quizdot.domain.quiz.service;

import com.mnot.quizdot.domain.quiz.dto.ResultDto;
import java.util.List;

public interface SurvivalService {

    List<ResultDto> exitGame(int roomId, int memberId);
}
