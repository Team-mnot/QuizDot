package com.mnot.quizdot.domain.quiz.controller;

import com.mnot.quizdot.domain.member.dto.CustomMemberDetail;
import com.mnot.quizdot.domain.quiz.dto.ResultDto;
import com.mnot.quizdot.domain.quiz.service.SurvivalService;
import com.mnot.quizdot.global.result.ResultResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/survival")
@RequiredArgsConstructor
@Tag(name = "Survival", description = "서바이벌 모드 API")
public class SurvivalController {

    private final SurvivalService survivalService;

    @PostMapping("/exit/{room_id}")
    @Operation(summary = "서바이벌모드 게임 종료 시 호출되는 API")
    public ResponseEntity<ResultResponse> exitGame(Authentication authentication,
        @PathVariable("room_id") int roomId) {
        CustomMemberDetail memberDetail = (CustomMemberDetail) authentication.getPrincipal();
        List<ResultDto> resultDtoList = survivalService.exitGame(roomId, memberDetail.getId());
        return ResponseEntity.ok(ResultResponse.of(200, "리워드 지급 및 결과 계산을 성공하였습니다.", resultDtoList));
    }
}
