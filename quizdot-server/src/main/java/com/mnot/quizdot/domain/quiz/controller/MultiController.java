package com.mnot.quizdot.domain.quiz.controller;

import com.mnot.quizdot.domain.member.dto.CustomMemberDetail;
import com.mnot.quizdot.domain.quiz.service.MultiService;
import com.mnot.quizdot.global.result.ResultResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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

    @PostMapping("/score/{room_id}/{question_id}")
    @Operation(summary = "멀티 모드 점수 업데이트 API")
    public ResponseEntity<ResultResponse> updateScores(Authentication authentication,
        @PathVariable("room_id") int roomId, @PathVariable("question_id") int questionId) {
        CustomMemberDetail memberDetail = (CustomMemberDetail) authentication.getPrincipal();
        multiService.updateScores(roomId, questionId, String.valueOf(memberDetail.getId()));
        return ResponseEntity.ok(ResultResponse.of(200, "점수 업데이트에 성공하였습니다."));
    }
}
