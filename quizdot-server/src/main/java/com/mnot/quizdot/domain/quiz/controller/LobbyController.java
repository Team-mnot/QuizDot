package com.mnot.quizdot.domain.quiz.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mnot.quizdot.domain.member.dto.CustomMemberDetail;
import com.mnot.quizdot.domain.quiz.dto.RoomReq;
import com.mnot.quizdot.domain.quiz.dto.RoomRes;
import com.mnot.quizdot.domain.quiz.service.RoomService;
import com.mnot.quizdot.global.result.ResultResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/lobby")
@RequiredArgsConstructor
@Tag(name = "Lobby", description = "로비 API")
public class LobbyController {

    private final RoomService roomService;

    @PostMapping("/channel/{channel_id}")
    @Operation(summary = "대기실 생성")
    public ResponseEntity<ResultResponse> createRoom(Authentication authentication,
        @PathVariable("channel_id") int channelId, @RequestBody RoomReq roomReq)
        throws JsonProcessingException {

        // 방장 회원 PK
        CustomMemberDetail userDetails = (CustomMemberDetail) authentication.getPrincipal();
        int hostId = userDetails.getId();

        // 대기실 생성
        RoomRes roomRes = roomService.createRoom(channelId, 1, roomReq);
        return ResponseEntity.ok(ResultResponse.of(201, "대기실 생성에 성공하였습니다.", roomRes));
    }
}
