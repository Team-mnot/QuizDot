package com.mnot.quizdot.domain.quiz.controller;

import com.mnot.quizdot.domain.member.dto.CustomMemberDetail;
import com.mnot.quizdot.domain.quiz.dto.SurvivalAnswerDto;
import com.mnot.quizdot.domain.quiz.service.SurvivalService;
import com.mnot.quizdot.global.result.ResultResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/survival")
@RequiredArgsConstructor
@Tag(name = "Survival", description = "서바이벌 모드 API")
public class SurvivalController {

    private final SurvivalService survivalService;

    @PostMapping("/score/{room_id}")
    @Operation(summary = "서바이벌 점수 업데이트 API")
    public ResponseEntity<ResultResponse> updateScores(
        @AuthenticationPrincipal CustomMemberDetail memberDetail,
        @PathVariable("room_id") int roomId, @RequestBody SurvivalAnswerDto answerDto) {
        System.out.println(answerDto);
        survivalService.updateScores(roomId, String.valueOf(memberDetail.getId()),
            answerDto.isResult());
        return ResponseEntity.ok(ResultResponse.of(200, "점수 업데이트에 성공하였습니다."));
    }

    @GetMapping("/score/{room_id}")
    @Operation(summary = "서바이벌 스테이지 결과 API")
    public ResponseEntity<ResultResponse> getStageResults(
        @AuthenticationPrincipal CustomMemberDetail memberDetail,
        @PathVariable("room_id") int roomId) {

        return ResponseEntity.ok(ResultResponse.of(200, "서바이벌 스테이지 결과 조회에 성공하였습니다."));
    }
}
