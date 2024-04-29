package com.mnot.quizdot.domain.quiz.controller;

import com.mnot.quizdot.domain.quiz.entity.MessageDto;
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
public class ChattingContoller {

    private final SimpMessagingTemplate messagingTemplate;

    /**
     * 로비 채팅방 메시지 전송
     */
    @MessageMapping("/lobby/{channel_id}")
    public void messageLobby(@DestinationVariable("channel_id") int channelId,
        @RequestBody MessageDto messageDto) {
        log.info("Sender : {}, Message : {}", messageDto.getSender(), messageDto.getText());

        // 로비에 있는 모든 클라이언트에 메시지 전송
        String destination = String.format("/sub/chat/lobby/%d", channelId);
        messagingTemplate.convertAndSend(destination, messageDto);
    }

    /**
     * 대기실 채팅방 메시지 전송
     */
    @MessageMapping("/room/{room_id}")
    public void messageRoom(@DestinationVariable("room_id") int roomId,
        @RequestBody MessageDto message) {
        // 대기실에 있는 모든 클라이언트에 메시지 전송
        String destination = String.format("/sub/chat/room/%d", roomId);
        messagingTemplate.convertAndSend(destination, message);
    }

}
