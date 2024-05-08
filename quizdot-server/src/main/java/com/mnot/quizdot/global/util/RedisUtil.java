package com.mnot.quizdot.global.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mnot.quizdot.domain.quiz.dto.ActiveUserDto;
import com.mnot.quizdot.domain.quiz.dto.PlayerInfoDto;
import com.mnot.quizdot.domain.quiz.dto.RoomInfoDto;
import com.mnot.quizdot.global.result.error.ErrorCode;
import com.mnot.quizdot.global.result.error.exception.BusinessException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RedisUtil {

    private final ObjectMapper objectMapper;
    private final RedisTemplate redisTemplate;


    /**
     * 게임 스코어 보드 KEY 생성
     */
    public String getBoardKey(int roomId) {
        return String.format("rooms:%d:board", roomId);
    }

    /**
     * 대기실 정보 KEY 생성
     */
    public String getRoomInfoKey(int roomId) {
        return String.format("rooms:%d:info", roomId);
    }

    /**
     * 플레이어 정보 KEY 생성
     */
    public String getPlayersKey(int roomId) {
        return String.format("rooms:%d:players", roomId);
    }

    /**
     * 대기실 정보 조회
     */
    public RoomInfoDto getRoomInfo(String key) {
        // Redis 조회
        String info = (String) redisTemplate.opsForValue().get(key);
        if (info == null) {
            throw new BusinessException(ErrorCode.ROOM_NOT_FOUND);
        }

        // 객체 변환
        try {
            return objectMapper.readValue(info, RoomInfoDto.class);
        } catch (JsonProcessingException e) {
            throw new BusinessException(ErrorCode.JSON_PROCESSING_ERROR);
        }
    }

    /**
     * 대기실 플레이어 정보 조회
     */
    public List<PlayerInfoDto> getPlayersInfo(String key) {
        String jsonPlayers = redisTemplate.opsForHash().values(key).toString();
        List<PlayerInfoDto> players;

        try {
            players = objectMapper.readValue(jsonPlayers, new TypeReference<>() {
            });
        } catch (JsonProcessingException e) {
            throw new BusinessException(ErrorCode.JSON_PROCESSING_ERROR);
        }

        return players;
    }

    /**
     * 대기실 플레이어 PK 값 조회
     */
    public List<Integer> getPlayers(String key) {
        String jsonPlayers = redisTemplate.opsForHash().keys(key).toString();
        List<Integer> players = null;
        try {
            players = objectMapper.readValue(jsonPlayers, new TypeReference<>() {
            });
        } catch (JsonProcessingException e) {
            throw new BusinessException(ErrorCode.JSON_PROCESSING_ERROR);
        }
        return players;
    }

    /**
     * 대기실 방장 권한 확인
     */
    public boolean checkHost(int roomId, int memberId) {
        RoomInfoDto roomInfoDto = getRoomInfo(getRoomInfoKey(roomId));
        if (roomInfoDto.getHostId() != memberId) {
            throw new BusinessException(ErrorCode.IS_NOT_HOST);
        }
        return true;
    }

    /**
     * 채널 내 동시 접속 유저 정보 KEY 생성
     */
    public String getActiveUserKey(int channelId) {
        return String.format("channel:%d:lobby:players", channelId);
    }

    /**
     * 채널 동시 접속 유저 리스트 조회
     */
    public List<ActiveUserDto> getActiveUsers(String key) {
        // 레디스에서 해당 채널의 동시 접속 유저 목록 추출
        Set<Object> activeSet = redisTemplate.opsForSet().members(key);
        List<ActiveUserDto> activeUsers = null;

        activeUsers = activeSet.stream()
            .map(Object::toString)
            .map(jsonString -> {
                try {
                    return objectMapper.readValue(jsonString, ActiveUserDto.class);
                } catch (JsonProcessingException e) {
                    throw new BusinessException(ErrorCode.JSON_PROCESSING_ERROR);
                }
            })
            .collect(Collectors.toList());

        return activeUsers;
    }
}
