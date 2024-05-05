package com.mnot.quizdot.domain.quiz.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mnot.quizdot.domain.member.dto.CustomMemberDetail;
import com.mnot.quizdot.domain.quiz.dto.ActiveUserDto;
import com.mnot.quizdot.domain.quiz.dto.ChannelListRes;
import com.mnot.quizdot.domain.quiz.dto.Channelnfo;
import com.mnot.quizdot.domain.quiz.dto.LobbyRes;
import com.mnot.quizdot.domain.quiz.dto.RoomInfoDto;
import com.mnot.quizdot.domain.quiz.dto.RoomReq;
import com.mnot.quizdot.domain.quiz.dto.RoomRes;
import com.mnot.quizdot.domain.quiz.service.LobbyService;
import com.mnot.quizdot.global.result.ResultResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
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

    private final LobbyService lobbyService;

    @PostMapping("/channel/{channel_id}")
    @Operation(summary = "대기실 생성")
    public ResponseEntity<ResultResponse> createRoom(Authentication authentication,
        @PathVariable("channel_id") int channelId, @RequestBody RoomReq roomReq)
        throws JsonProcessingException {

        // 방장 회원 PK
        CustomMemberDetail userDetails = (CustomMemberDetail) authentication.getPrincipal();
        int hostId = userDetails.getId();

        // 대기실 생성
        RoomRes roomRes = lobbyService.createRoom(channelId, hostId, roomReq);
        return ResponseEntity.ok(ResultResponse.of(201, "대기실 생성에 성공하였습니다.", roomRes));
    }

    @GetMapping("/channel/{channel_id}")
    @Operation(summary = "채널 로비 입장")
    public ResponseEntity<ResultResponse> enterLobby(Authentication authentication,
        @PathVariable("channel_id") int channelId)
        throws JsonProcessingException {

        // TODO : 입장 가능 여부 체크하기

        // 입장한 유저의 정보
        CustomMemberDetail userDetails = (CustomMemberDetail) authentication.getPrincipal();
        int memberId = userDetails.getId();

        // 동시 접속자 목록 조회
        List<ActiveUserDto> activeUserDtos = lobbyService.getActiveUserList(channelId, memberId);

        // 방 목록 조회
        List<RoomInfoDto> roomInfoDtos = lobbyService.getRoomList(channelId);

        LobbyRes lobbyRes = LobbyRes.builder()
            .channelId(channelId)
            .activeUserDtos(activeUserDtos)
            .roomInfoDtos(roomInfoDtos)
            .build();

        return ResponseEntity.ok(ResultResponse.of(200, "채널 로비 입장에 성공하였습니다.", lobbyRes));
    }

    @GetMapping("/channel")
    @Operation(summary = "채널 목록 조회")
    public ResponseEntity<ResultResponse> getChannels() {
        // 각 채널의 동시 접속 수와 수용 가능 인원수 조회
        List<Channelnfo> channels = lobbyService.getChannelList();
        ChannelListRes channelListRes = new ChannelListRes(channels);
        return ResponseEntity.ok(ResultResponse.of(200, "채널 목록 조회에 성공하였습니다.", channelListRes));
    }
}
