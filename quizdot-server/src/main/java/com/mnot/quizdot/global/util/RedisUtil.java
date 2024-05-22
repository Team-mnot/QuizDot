package com.mnot.quizdot.global.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mnot.quizdot.domain.quiz.dto.ActiveUserDto;
import com.mnot.quizdot.domain.quiz.dto.GameState;
import com.mnot.quizdot.domain.quiz.dto.PlayerInfoDto;
import com.mnot.quizdot.domain.quiz.dto.RoomInfoDto;
import com.mnot.quizdot.domain.quiz.service.RoomServiceImpl;
import com.mnot.quizdot.global.result.error.ErrorCode;
import com.mnot.quizdot.global.result.error.exception.BusinessException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.core.Cursor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class RedisUtil {

    private final ObjectMapper objectMapper;
    private final RedisTemplate redisTemplate;
    private final SimpMessagingTemplate messagingTemplate;

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
        RoomInfoDto roomInfoDto = (RoomInfoDto) redisTemplate.opsForValue().get(key);
        if (roomInfoDto == null) {
            throw new BusinessException(ErrorCode.ROOM_NOT_FOUND);
        }
        return roomInfoDto;
    }

    /**
     * 대기실 플레이어 정보 조회
     */
    public Map<String, PlayerInfoDto> getPlayersInfo(String key) {
        Map<String, PlayerInfoDto> playerMap = redisTemplate.opsForHash().entries(key);
        return playerMap;
    }

    /**
     * 대기실 플레이어 PK 값 조회
     */
    public List<Integer> getPlayers(String key) {
        Set<String> playerKeySet = redisTemplate.opsForHash().keys(key);
        return playerKeySet.stream()
            .map((stringKey) -> Integer.parseInt(stringKey)).collect(
                Collectors.toList());
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

    public String getSubmitKey(int roomId) {
        return String.format("rooms:%d:submit", roomId);
    }

    /**
     * 문제 제출 유저 수 확인
     */
    public Long checkSubmit(String sumbitId) {
        return redisTemplate.opsForSet().size(sumbitId);
    }

    /**
     * 채널 내 동시 접속 유저 정보 KEY 생성
     */
    public String getActivePlayerKey(int channelId) {
        return String.format("channel:%d:players", channelId);
    }

    /**
     * 채널 동시 접속 유저 리스트 조회
     */
    public List<ActiveUserDto> getActivePlayers(String key) {
        Map<String, Object> activePlayers = redisTemplate.opsForHash().entries(key);
        List<ActiveUserDto> result = activePlayers.values().stream()
            .map(obj -> (ActiveUserDto) obj)
            .collect(Collectors.toList());

        return result;
    }

    /**
     * 대기실 상태 변경
     */
    public void modifyRoomState(String key, GameState state) {
        RoomInfoDto roomInfoDto = getRoomInfo(key);
        roomInfoDto.modifyState(state);
        redisTemplate.opsForValue().set(key, roomInfoDto);
    }

    /**
     * 전체 채널의 동시 접속 유저 조회
     */
    public Map<Integer, Set<ActiveUserDto>> getAllActivePlayers() {
        Map<Integer, Set<ActiveUserDto>> allActivePlayers = new HashMap<>();
        final int maxChannel = 8;

        for (int channel = 1; channel <= maxChannel; channel++) {
            String key = getActivePlayerKey(channel);
            Set<ActiveUserDto> players = redisTemplate.opsForSet().members(key);
            allActivePlayers.put(channel, players);
        }

        return allActivePlayers;
    }
}
