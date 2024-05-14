package com.mnot.quizdot.domain.quiz.controller;

import com.mnot.quizdot.domain.quiz.dto.MessageDto;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
public class ChattingController {

    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/lobby/{channel_id}")
    @Operation(summary = "채널 로비 채팅방 API")
    public void messageLobby(@DestinationVariable("channel_id") int channelId,
        @RequestBody MessageDto messageDto) {
        log.info("Sender : {}, Message : {}", messageDto.getSender(), messageDto.getText());

        // 로비에 있는 모든 클라이언트에 메시지 전송
        String destination = String.format("/sub/chat/lobby/%d", channelId);
        messagingTemplate.convertAndSend(destination, messageDto);
    }

    @MessageMapping("/room/{room_id}")
    @Operation(summary = "대기실 채팅방 API")
    public void messageRoom(@DestinationVariable("room_id") int roomId,
        @RequestBody MessageDto message) {
        // 대기실에 있는 모든 클라이언트에 메시지 전송
        String destination = String.format("/sub/chat/room/%d", roomId);
        messagingTemplate.convertAndSend(destination, message);
    }

    @MessageMapping("/game/{room_id}")
    @Operation(summary = "게임 채팅방 API")
    public void messageGame(@DestinationVariable("room_id") int roomId,
        @RequestBody MessageDto message) {
        // 게임 진행 중인 모든 클라이언트에 메시지 전송
        String destination = String.format("/sub/chat/game/%d", roomId);
        messagingTemplate.convertAndSend(destination, message);
    }

    @MessageMapping("/game/{room_id}/eliminated")
    @Operation(summary = "서바이벌 탈락자 채팅방 API")
    public void messageEliminated(@DestinationVariable("room_id") int roomId,
        @RequestBody MessageDto message) {
        // 서바이벌 게임 내, 모든 탈락자에게 메시지 전송
        String destination = String.format("/sub/chat/game/%d/eliminated", roomId);
        messagingTemplate.convertAndSend(destination, message);
    }

}
