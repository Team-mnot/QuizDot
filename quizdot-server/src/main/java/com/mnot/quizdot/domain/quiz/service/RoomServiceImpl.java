package com.mnot.quizdot.domain.quiz.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mnot.quizdot.domain.quiz.dto.MessageDto;
import com.mnot.quizdot.domain.quiz.dto.RoomInfoDto;
import com.mnot.quizdot.domain.quiz.dto.RoomReq;
import com.mnot.quizdot.global.result.error.ErrorCode;
import com.mnot.quizdot.global.result.error.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class RoomServiceImpl implements RoomService {

    private final ObjectMapper objectMapper;
    private final RedisTemplate redisTemplate;
    private final SimpMessagingTemplate messagingTemplate;

    public void modifyRoomInfo(int roomId, int memberId, RoomReq roomReq)
        throws JsonProcessingException {
        // 대기실 정보 조회
        String key = String.format("rooms:%d:info", roomId);
        RoomInfoDto roomInfoDto = objectMapper.readValue(
            (String) redisTemplate.opsForValue().get(key), RoomInfoDto.class);

        if (roomInfoDto == null) {
            throw new BusinessException(ErrorCode.ROOM_NOT_FOUND);
        }

        if (memberId != roomInfoDto.getHostId()) {
            throw new BusinessException(ErrorCode.IS_NOT_HOST);
        }

        // 대기실 정보 업데이트
        roomInfoDto.modifyInfo(roomReq);
        String obj = objectMapper.writeValueAsString(roomInfoDto);
        redisTemplate.opsForValue().set(key, obj);

        // 업데이트 된 정보를 대기실 내 유저들에게 전송
        messagingTemplate.convertAndSend("/sub/info/room/" + roomId, roomInfoDto);
        messagingTemplate.convertAndSend("/sub/chat/room/" + roomId,
            new MessageDto("System", "대기실 정보가 변경되었습니다."));
    }
}
