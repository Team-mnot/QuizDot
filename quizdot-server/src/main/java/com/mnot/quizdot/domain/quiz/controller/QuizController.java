package com.mnot.quizdot.domain.quiz.controller;

import com.mnot.quizdot.domain.member.dto.CustomMemberDetail;
import com.mnot.quizdot.domain.member.entity.ModeType;
import com.mnot.quizdot.domain.quiz.dto.QuizParam;
import com.mnot.quizdot.domain.quiz.service.QuizService;
import com.mnot.quizdot.global.result.ResultResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/game")
@RequiredArgsConstructor
@Tag(name = "Game", description = "게임 공통 API")
@Slf4j
public class QuizController {

    private final QuizService quizService;

    @GetMapping("/quiz/{room_id}")
    @Operation(summary = "조건에 따른 퀴즈 목록 조회 API")
    public ResponseEntity<ResultResponse> getQuizzes(
        @PathVariable("room_id") int roomId,
        @ModelAttribute @ParameterObject QuizParam quizParam) {
        quizService.getQuizzes(roomId, quizParam);
        return ResponseEntity.ok(ResultResponse.of(200, "퀴즈 목록 조회에 성공하였습니다."));
    }

    @PostMapping("/quiz/{room_id}/{question_id}")
    @Operation(summary = "문제 패스 API")
    public ResponseEntity<ResultResponse> passQuestion(
        @AuthenticationPrincipal CustomMemberDetail memberDetail,
        @PathVariable("room_id") int roomId,
        @PathVariable("question_id") int questionId) {
        quizService.passQuestion(roomId, questionId, memberDetail.getId(),
            memberDetail.getNickname());
        return ResponseEntity.ok(ResultResponse.of(200, "문제 패스에 성공하였습니다."));
    }

    @PostMapping("/start/{room_id}")
    @Operation(summary = "게임 시작 API")
    public ResponseEntity<ResultResponse> startGame(
        @AuthenticationPrincipal CustomMemberDetail memberDetail,
        @PathVariable("room_id") int roomId,
        @RequestParam("mode") ModeType mode) {
        quizService.startGame(roomId, memberDetail.getId(), mode);
        log.info("[startGame] GameMode : {}", mode);
        return ResponseEntity.ok(ResultResponse.of(200, "게임 시작에 성공하였습니다."));
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "퀴즈 이미지 업로드")
    public ResponseEntity<ResultResponse> uploadQuizImage(
        @RequestPart(value="image") List<MultipartFile> imageFiles) {
        List<String> urlList = quizService.uploadQuizImage(imageFiles);
        return ResponseEntity.ok(ResultResponse.of(200, "퀴즈 이미지 업로드를 성공하였습니다.", urlList));
    }
}