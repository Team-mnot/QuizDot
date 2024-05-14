package com.mnot.quizdot.global.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mnot.quizdot.domain.quiz.dto.ActiveUserDto;
import com.mnot.quizdot.domain.quiz.dto.GameState;
import com.mnot.quizdot.domain.quiz.dto.PlayerInfoDto;
import com.mnot.quizdot.domain.quiz.dto.RoomInfoDto;
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
        return String.format("channel:%d:lobby:players", channelId);
    }

    /**
     * 채널 동시 접속 유저 리스트 조회
     */
    public List<ActiveUserDto> getActivePlayers(String key) {
        // 레디스에서 해당 채널의 동시 접속 유저 목록 추출
        return new ArrayList<>(redisTemplate.opsForSet().members(key));
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

    /**
     * 게임 중 나간 플레이어 정보 모두 삭제
     */
    public void deleteInactivePlayerData(String memberId) {
        // TODO : players 지울 때 모두 나간 방 처리와 나간 유저가 방장인 경우?????
        // 플레이어 정보를 제거하고 방 번호 반환
        int roomId = deleteGamePlayer(memberId);
        log.info("플레이어 정보 제거 성공");

        // 패스 정보 제거
        deletePass(memberId, roomId);
        log.info("패스 정보 제거 성공");

        // 점수 정보 제거
        String boardKey = getBoardKey(roomId);
        Long deleteBoard = redisTemplate.opsForZSet().remove(boardKey, memberId);
        log.info("점수 정보 제거 성공 = deleteBoardCount={}", deleteBoard);

        // 서바이벌 생존자 정보 제거
        String surviveKey = String.format("rooms:%d:survivors", roomId);
        boolean removedFromSurvive = redisTemplate.opsForZSet().remove(surviveKey, memberId) > 0;
        log.info("서바이벌 생존자 정보 제거 성공");

        // 서바이벌 탈락자 정보 제거
        if (!removedFromSurvive) {
            String eliminatedKey = String.format("rooms:%d:eliminated", roomId);
            redisTemplate.opsForZSet().remove(eliminatedKey, memberId);
            log.info("서바이벌 탈락자 정보 제거 성공");
        }

        // 매칭중인 경우, 정보 제거
        try {
            deleteMatch(roomId);
            log.info("매칭 정보 제거 성공");
        } catch (BusinessException e) {
            log.error("BusinessException: {}", e.getMessage());
        } catch (Exception e) {
            log.error("매칭 정보 제거를 실패하였습니다.");
        }

        // 동시접속자 정보 제거
        deleteInactivePlayer(memberId, roomId);
        log.info("동시접속자 정보 제거 성공");
    }

    public int deleteGamePlayer(String memberId) {
        // scan을 이용해서 키를 찾고 해당 방의 플레이어 정보 제거
        AtomicInteger roomId = new AtomicInteger();
        String pattern = "rooms:*:players";
        ScanOptions options = ScanOptions.scanOptions().match(pattern).build();
        redisTemplate.execute((RedisConnection connection) -> {
            try (Cursor<byte[]> cursor = connection.scan(options)) {
                while (cursor.hasNext()) {
                    String key = new String(cursor.next());
                    if (redisTemplate.opsForHash().hasKey(key, memberId)) {
                        redisTemplate.opsForHash().delete(key, memberId);
                        // 플레이어가 있던 방 번호 저장
                        String[] parts = key.split(":");
                        roomId.set(Integer.parseInt(parts[1]));
                        break;
                    }
                }
            }
            return null;
        });
        return roomId.get();
    }

    public boolean deleteMatch(int roomId) {
        String strRoomId = String.valueOf(roomId);
        String roomKey = getRoomInfoKey(roomId);
        String category = getRoomInfo(roomKey).getCategory();
        String matchKey = "match:" + category;

        // 유저의 있던 방에서 매칭 중인 플레이어 수
        Integer playerCount = (Integer) redisTemplate.opsForHash().get(matchKey, strRoomId);

        if (playerCount != null) {
            if (playerCount > 1) {
                // 세션이 끊어진 사용자를 매칭에서 제외
                redisTemplate.opsForHash().put(matchKey, strRoomId, playerCount - 1);
            } else {
                // 사용자가 매칭중인 방의 마지막 유저인 경우 매칭 삭제
                redisTemplate.opsForHash().delete(matchKey, strRoomId);
            }
            return true;
        }
        return false;
    }

    public void deletePass(String memberId, int roomId) {
        String pattern = String.format("rooms:%d:*:pass", roomId);
        redisTemplate.execute((RedisConnection connection) -> {
            try (Cursor<byte[]> cursor =
                connection.scan(ScanOptions.scanOptions().match(pattern).build())) {
                while (cursor.hasNext()) {
                    String key = new String(cursor.next());
                    // memberId의 유저가 패스했는지 확인
                    if (redisTemplate.opsForSet().isMember(key, memberId)) {
                        redisTemplate.opsForSet().remove(key, memberId);
                    }
                }
            }
            return null;
        });
    }

    public void deleteInactivePlayer(String memberId, int roomId) {
        if (roomId == 0) {
            // 유저가 로비에 있다가 연결을 끊은 경우
            for (int channel = 1; channel <= 8; channel++) {
                String activePlayerKey = getActivePlayerKey(channel);

                // memberId를 가진 유저가 해당 채널에 있는지 확인
                Set<Object> channelPlayers = redisTemplate.opsForSet().members(activePlayerKey);
                ActiveUserDto targetUser = channelPlayers.stream()
                    .filter(
                        player -> ((ActiveUserDto) player).getId() == Integer.parseInt(memberId))
                    .map(player -> (ActiveUserDto) player)
                    .findFirst()
                    .orElse(null);

                if (targetUser != null) {
                    // 유저가 있던 채널의 동시 접속자 목록에서 삭제
                    redisTemplate.opsForSet().remove(activePlayerKey, targetUser);
                }
            }
            return;
        }
        // 유저가 방에 있다 연결을 끊은 경우
        int channelId = roomId / 1000;
        String activeUserKey = getActivePlayerKey(channelId);
        List<ActiveUserDto> activeUsers = getActivePlayers(activeUserKey);

        ActiveUserDto targetUser = activeUsers.stream()
            .filter(user -> user.getId() == Integer.parseInt(memberId))
            .findFirst()
            .orElse(null);

        if (targetUser != null) {
            redisTemplate.opsForSet().remove(activeUserKey, targetUser);
        } else {
            log.info("접속중인 유저가 아닙니다.");
        }
    }
}
