package com.mnot.quizdot.domain.quiz.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mnot.quizdot.domain.member.dto.CustomMemberDetail;
import com.mnot.quizdot.domain.quiz.dto.RoomEnterRes;
import com.mnot.quizdot.domain.quiz.dto.RoomReq;
import com.mnot.quizdot.domain.quiz.service.RoomService;
import com.mnot.quizdot.global.result.ResultResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/room")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Room", description = "대기실 API")
public class RoomController {

    private final RoomService roomService;
    private final RedisTemplate redisTemplate;
    private final SimpMessagingTemplate messagingTemplate;

    @PostMapping("/{room_id}")
    @Operation(summary = "대기실 정보 변경 API")
    public ResponseEntity<ResultResponse> modifyRoomInfo(
        @AuthenticationPrincipal CustomMemberDetail memberDetail,
        @PathVariable("room_id") int roomId,
        @RequestBody RoomReq roomReq) throws JsonProcessingException {
        roomService.modifyRoomInfo(roomId, memberDetail.getId(), roomReq);
        return ResponseEntity.ok(ResultResponse.of(200, "대기실 정보 변경에 성공하였습니다."));
    }

    @GetMapping("/{room_id}")
    @Operation(summary = "대기실 입장 API")
    public ResponseEntity<ResultResponse> enterRoom(
        @AuthenticationPrincipal CustomMemberDetail memberDetail,
        @PathVariable("room_id") int roomId) throws JsonProcessingException {
        RoomEnterRes roomEnterRes = roomService.enterRoom(roomId, memberDetail.getId());
        return ResponseEntity.ok(ResultResponse.of(200, "대기실 입장에 성공하였습니다.", roomEnterRes));
    }
}