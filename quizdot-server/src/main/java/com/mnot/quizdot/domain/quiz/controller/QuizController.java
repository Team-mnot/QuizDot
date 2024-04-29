package com.mnot.quizdot.domain.quiz.controller;

import com.mnot.quizdot.domain.member.dto.CustomMemberDetail;
import com.mnot.quizdot.domain.quiz.dto.QuizListRes;
import com.mnot.quizdot.domain.quiz.dto.QuizParam;
import com.mnot.quizdot.domain.quiz.service.QuizService;
import com.mnot.quizdot.global.result.ResultResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/game")
@RequiredArgsConstructor
@Tag(name = "Game", description = "게임 API")
public class QuizController {

    private final QuizService quizService;

    @GetMapping("/quiz/{room_id}")
    @Operation(summary = "조건에 따른 퀴즈 목록 조회 API")
    public ResponseEntity<ResultResponse> getQuizzes(
        @PathVariable("room_id") int roomId,
        @ModelAttribute @ParameterObject QuizParam quizParam) {
        QuizListRes quizListRes = quizService.getQuizzes(roomId, quizParam);
        return ResponseEntity.ok(ResultResponse.of(200, "퀴즈 목록 조회에 성공하였습니다.", quizListRes));
    }

    @PostMapping("/game/score/{room_id}/{question_id}")
    @Operation(summary = "문제 별 점수 업데이트 API")
    public ResponseEntity<ResultResponse> updateScores(Authentication authentication,
        @PathVariable("room_id") int roomId, @PathVariable("question_id") int questionId) {
        CustomMemberDetail memberDetail = (CustomMemberDetail) authentication.getPrincipal();
        quizService.updateScores(roomId, questionId, "4");
        return ResponseEntity.ok(ResultResponse.of(200, "점수 업데이트에 성공하였습니다."));
    }

}