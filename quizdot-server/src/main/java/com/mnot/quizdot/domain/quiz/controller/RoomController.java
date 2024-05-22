package com.mnot.quizdot.domain.quiz.controller;

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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
        @RequestBody RoomReq roomReq) {
        roomService.modifyRoomInfo(roomId, memberDetail.getId(), roomReq);
        return ResponseEntity.ok(ResultResponse.of(200, "대기실 정보 변경에 성공하였습니다."));
    }

    @GetMapping("/{room_id}")
    @Operation(summary = "대기실 입장 API")
    public ResponseEntity<ResultResponse> enterRoom(
        @AuthenticationPrincipal CustomMemberDetail memberDetail,
        @PathVariable("room_id") int roomId) {
        RoomEnterRes roomEnterRes = roomService.enterRoom(roomId, memberDetail.getId());
        return ResponseEntity.ok(ResultResponse.of(200, "대기실 입장에 성공하였습니다.", roomEnterRes));
    }

    @DeleteMapping("/{room_id}")
    @Operation(summary = "대기실 퇴장 API")
    public ResponseEntity<ResultResponse> leaveRoom(
        @AuthenticationPrincipal CustomMemberDetail memberDetail,
        @PathVariable("room_id") int roomId) {
        roomService.leaveRoom(roomId, String.valueOf(memberDetail.getId()));
        return ResponseEntity.ok(ResultResponse.of(200, "대기실 퇴장에 성공하였습니다."));
    }

    @GetMapping("/{room_id}/invite")
    @Operation(summary = "초대 링크 생성 API")
    public ResponseEntity<ResultResponse> inviteRoom(
        @AuthenticationPrincipal CustomMemberDetail memberDetail,
        @PathVariable("room_id") int roomId) {
        String inviteLink = roomService.inviteRoom(roomId, memberDetail.getId());
        return ResponseEntity.ok(ResultResponse.of(200, "대기실 초대 링크 생성에 성공하였습니다.", inviteLink));
    }

    @GetMapping("/invite")
    @Operation(summary = "초대받은 대기실 입장 API")
    public ResponseEntity<ResultResponse> enterInvitedRoom(
        @AuthenticationPrincipal CustomMemberDetail memberDetail,
        @RequestParam String data) {
        RoomEnterRes roomEnterRes = roomService.enterInvitedRoom(data, memberDetail.getId());
        return ResponseEntity.ok(ResultResponse.of(200, "초대받은 대기실 입장에 성공하였습니다.", roomEnterRes));
    }
}