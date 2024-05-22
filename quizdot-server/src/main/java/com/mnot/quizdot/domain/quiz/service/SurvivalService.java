package com.mnot.quizdot.domain.quiz.service;

import com.mnot.quizdot.domain.quiz.dto.ResultDto;
import java.util.List;
import java.util.Set;
import org.springframework.data.redis.core.ZSetOperations.TypedTuple;

public interface SurvivalService {

    void updateScores(int roomId, int memberId, int isCorrect);

    List<ResultDto> exitGame(int roomId, int memberId);

    Set<TypedTuple<String>> getStageResult(int roomId, int memberId);

    String registMatchmaking(int roomId, String category);

    void cancelMatchmaking(int roomId, String category);
}
