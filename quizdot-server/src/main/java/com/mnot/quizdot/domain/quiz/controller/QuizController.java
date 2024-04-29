package com.mnot.quizdot.domain.quiz.controller;

import com.mnot.quizdot.domain.quiz.dto.QuizListRes;
import com.mnot.quizdot.domain.quiz.dto.QuizParam;
import com.mnot.quizdot.domain.quiz.service.QuizService;
import com.mnot.quizdot.global.result.ResultResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/game")
@RequiredArgsConstructor
@Tag(name = "Game", description = "게임 API")
public class QuizController {

    private final QuizService quizService;

    @GetMapping("/quiz/{room_num}")
    public ResponseEntity<ResultResponse> getQuizzes(
        @PathVariable("room_num") int roomNum,
        @ModelAttribute @ParameterObject QuizParam quizParam) {
        QuizListRes quizListRes = quizService.getQuizzes(roomNum, quizParam);
        return ResponseEntity.ok(ResultResponse.of(200, "퀴즈 목록 조회에 성공하였습니다.", quizListRes));
    }
    
}