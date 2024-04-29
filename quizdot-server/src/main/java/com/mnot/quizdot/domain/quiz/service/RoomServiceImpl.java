package com.mnot.quizdot.domain.quiz.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mnot.quizdot.domain.quiz.dto.RoomInfoDto;
import com.mnot.quizdot.domain.quiz.dto.RoomReq;
import com.mnot.quizdot.domain.quiz.dto.RoomRes;
import com.mnot.quizdot.global.result.error.ErrorCode;
import com.mnot.quizdot.global.result.error.exception.BusinessException;
import jakarta.annotation.PostConstruct;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

    private final static int MAX_CHANNEL = 8;
    private final static int MAX_ROOM = 1;

    private final RedisTemplate redisTemplate;

    private final ObjectMapper objectMapper;
    ConcurrentMap<Integer, boolean[]> roomNumList;

    @PostConstruct
    public void initialize() {
        roomNumList = new ConcurrentHashMap<>();
        for (int i = 1; i <= MAX_CHANNEL; i++) {
            roomNumList.put(i, new boolean[MAX_ROOM + 1]);
        }
    }

    /**
     * 대기실 생성
     */
    @Override
    public RoomRes createRoom(int channelId, int hostId, RoomReq roomReq)
        throws JsonProcessingException {
        // 채널에서 사용 가능한 방 번호를 찾는다
        int roomNum = -1;
        for (int i = 1; i <= MAX_ROOM; i++) {
            if (!roomNumList.get(channelId)[i]) {
                roomNumList.get(channelId)[i] = true;
                roomNum = channelId * 1000 + i;
                break;
            }
        }

        // 현재 채널에 방을 더 이상 생성할 수 없는 경우 예외 발생
        if (roomNum < 0) {
            throw new BusinessException(ErrorCode.ROOM_LIMIT_EXCEEDED);
        }

        // 새로운 대기실 정보 생성하여 REDIS에 등록
        RoomInfoDto roomInfoDto = RoomInfoDto.builder()
            .roomNum(roomNum)
            .title(roomReq.getTitle())
            .isPublic(roomReq.isPublic())
            .password(roomReq.getPassword())
            .gameMode(String.valueOf(roomReq.getMode()))
            .category(String.valueOf(roomReq.getCategory()))
            .maxQuestion(roomReq.getMaxQuestion())
            .hostId(hostId)
            .build();

        String key = makeKey(roomNum);
        String obj = objectMapper.writeValueAsString(roomInfoDto);
        redisTemplate.opsForHash().put(key, "info", obj);

        // 생성된 대기실 정보 반환
        return RoomRes.builder()
            .roomNum(roomNum)
            .build();
    }

    private String makeKey(int roomNum) {
        return String.format("rooms:%d", roomNum);
    }

}
