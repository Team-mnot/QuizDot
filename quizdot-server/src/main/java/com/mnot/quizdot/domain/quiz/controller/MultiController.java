package com.mnot.quizdot.domain.quiz.controller;

import com.mnot.quizdot.domain.member.dto.CustomMemberDetail;
import com.mnot.quizdot.domain.quiz.dto.ResultDto;
import com.mnot.quizdot.domain.quiz.service.MultiService;
import com.mnot.quizdot.domain.quiz.service.QuizService;
import com.mnot.quizdot.global.result.ResultResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/multi")
@RequiredArgsConstructor
@Tag(name = "Multi", description = "멀티 모드 API")
public class MultiController {

    private final MultiService multiService;
    private final QuizService quizService;

    @PostMapping("/score/{room_id}/{question_id}")
    @Operation(summary = "멀티 모드 점수 업데이트 API")
    public ResponseEntity<ResultResponse> updateScores(
        @AuthenticationPrincipal CustomMemberDetail memberDetail,
        @PathVariable("room_id") int roomId, @PathVariable("question_id") int questionId) {
        multiService.updateScores(roomId, questionId, memberDetail.getId());
        return ResponseEntity.ok(ResultResponse.of(200, "점수 업데이트에 성공하였습니다."));
    }

    @PostMapping("/exit/{room_id}")
    @Operation(summary = "멀티 모드 리워드 지급 및 결과 정보 제공 API")
    public ResponseEntity<ResultResponse> exitGame(
        @AuthenticationPrincipal CustomMemberDetail memberDetail,
        @PathVariable("room_id") int roomId) {
        List<ResultDto> resultDtoList = multiService.exitGame(roomId, memberDetail.getId());
        quizService.deleteGame(roomId);
        return ResponseEntity.ok(ResultResponse.of(200, "리워드 지급 및 결과 계산을 성공하였습니다", resultDtoList));
    }
}
