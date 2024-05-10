package com.mnot.quizdot.domain.quiz.controller;

import com.mnot.quizdot.domain.member.dto.CustomMemberDetail;
import com.mnot.quizdot.domain.quiz.dto.OneToOneAnswerDto;
import com.mnot.quizdot.domain.quiz.service.OneToOneService;
import com.mnot.quizdot.global.result.ResultResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/oto")
@RequiredArgsConstructor
@Tag(name = "OneToOne", description = "1:1 모드 API")
public class OneToOneController {

    private final OneToOneService oneToOneService;

    @PostMapping("/select/{room_id}/{question_id}")
    @Operation(summary = "일대일 문제 전달 API")
    public ResponseEntity<ResultResponse> selectQuestion(@AuthenticationPrincipal
    CustomMemberDetail customMemberDetail, @PathVariable("room_id") int roomId,
        @PathVariable("question_id") int questionId) {
        oneToOneService.selectQuestion(roomId, questionId, customMemberDetail.getId());
        return ResponseEntity.ok(ResultResponse.of(200, "문제 전달에 성공하였습니다"));
    }

    @PostMapping("/score/{room_id}")
    @Operation(summary = "일대일 점수 업데이트 API")
    public ResponseEntity<ResultResponse> updateScores(
        @AuthenticationPrincipal CustomMemberDetail customMemberDetail,
        @PathVariable("room_id") int roomId, @RequestBody OneToOneAnswerDto answerDto
    ) {
        return ResponseEntity.ok(ResultResponse.of(200, "점수 업데이트에 성공하였습니다."));
    }


}