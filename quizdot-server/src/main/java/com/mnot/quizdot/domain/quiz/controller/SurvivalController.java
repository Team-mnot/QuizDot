package com.mnot.quizdot.domain.quiz.controller;

import com.mnot.quizdot.domain.member.dto.CustomMemberDetail;
import com.mnot.quizdot.domain.quiz.dto.ResultDto;
import com.mnot.quizdot.domain.quiz.dto.SurvivalAnswerDto;
import com.mnot.quizdot.domain.quiz.service.SurvivalService;
import com.mnot.quizdot.global.result.ResultResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.ZSetOperations.TypedTuple;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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
        survivalService.updateScores(roomId, String.valueOf(memberDetail.getId()),
            answerDto.getResult());
        return ResponseEntity.ok(ResultResponse.of(200, "점수 업데이트에 성공하였습니다."));
    }


    @PostMapping("/exit/{room_id}")
    @Operation(summary = "서바이벌 모드 리워드 지급 및 결과 정보 제공 API")
    public ResponseEntity<ResultResponse> exitGame(Authentication authentication,
        @PathVariable("room_id") int roomId) {
        CustomMemberDetail memberDetail = (CustomMemberDetail) authentication.getPrincipal();
        List<ResultDto> resultDtoList = survivalService.exitGame(roomId, memberDetail.getId());
        return ResponseEntity.ok(ResultResponse.of(200, "리워드 지급 및 결과 계산을 성공하였습니다.", resultDtoList));

    }

    @GetMapping("/score/{room_id}")
    @Operation(summary = "서바이벌 스테이지 결과 API")
    public ResponseEntity<ResultResponse> getStageResult(
        @AuthenticationPrincipal CustomMemberDetail memberDetail,
        @PathVariable("room_id") int roomId) {
        Set<TypedTuple<String>> result = survivalService.getStageResult(roomId,
            memberDetail.getId());
        return ResponseEntity.ok(ResultResponse.of(200, "서바이벌 스테이지 결과 업데이트에 성공하였습니다.", result));
    }
}
