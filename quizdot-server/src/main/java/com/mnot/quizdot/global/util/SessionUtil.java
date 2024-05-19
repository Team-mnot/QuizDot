package com.mnot.quizdot.global.util;

import com.mnot.quizdot.domain.quiz.dto.ActiveUserDto;
import com.mnot.quizdot.domain.quiz.service.RoomService;
import com.mnot.quizdot.global.result.error.exception.BusinessException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.core.Cursor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class SessionUtil {

    private final RedisTemplate redisTemplate;
    private final RedisUtil redisUtil;
    private final RoomService roomService;

    /**
     * 게임 중 나간 플레이어 정보 모두 삭제
     */
    public void deleteInactivePlayerData(String memberId) {
        List<Integer> roomIds = getRoomIdFromPlayers(memberId);
        log.info("웹소켓 세션 끊김. 유저 게임 정보 제거 시작");
        for(int roomId : roomIds) {
            // 동시접속자 정보 제거
            log.info("roomId: "+roomId);
            boolean isOnlyLobby = deleteInactivePlayer(memberId, roomId);
            if(isOnlyLobby) {
                // 유저가 방을 생성하지 않고 로비에만 있다 나간 경우
                return;
            }

            // 점수 정보 제거
            String boardKey = redisUtil.getBoardKey(roomId);
            redisTemplate.opsForZSet().remove(boardKey, Integer.parseInt(memberId));
//        log.info("유저 점수 정보 제거");

            // 패스 정보 제거
            deletePass(memberId, roomId);
//        log.info("유저 패스 정보 제거");

            // 서바이벌 생존자 정보 제거
            String surviveKey = String.format("rooms:%d:survivors", roomId);
            boolean removedFromSurvive = redisTemplate.opsForZSet()
                .remove(surviveKey, Integer.parseInt(memberId)) > 0;
//        log.info("서바이벌 생존자 정보 제거");

            // 서바이벌 탈락자 정보 제거
            if (!removedFromSurvive) {
                String eliminatedKey = String.format("rooms:%d:eliminated", roomId);
                redisTemplate.opsForZSet().remove(eliminatedKey, Integer.parseInt(memberId));
            }
//        log.info("서바이벌 탈락자 정보 제거");

            // 매칭중인 경우, 정보 제거
            try {
                deleteMatch(roomId);
            } catch (BusinessException e) {
                log.error("BusinessException: {}", e.getMessage());
            } catch (Exception e) {
                log.error("매칭 정보 제거를 실패하였습니다.");
            }
//        log.info("매칭 정보 제거");

            // 플레이어 정보 제거
            try {
                roomService.leaveRoom(roomId, memberId);
            log.info(roomId+"번방의 플레이어 정보 제거");
            } catch(BusinessException e) {
                log.error("BusinessException: {}", e.getMessage());
            } catch(Exception e) {
                log.error("Exception: {}", e.getMessage());
                e.printStackTrace(); // TODO : develop이나 master 옮길때는 이거 포함 각종 로그없애기
            }
        }
    }

    public List<Integer> getRoomIdFromPlayers(String memberId) {
        List<Integer> roomIds = new ArrayList<>();
        // scan을 이용해서 유저가 마지막으로 있었던 방 번호 찾기
        String pattern = "rooms:*:players";
        ScanOptions options = ScanOptions.scanOptions().match(pattern).build();
        redisTemplate.execute((RedisConnection connection) -> {
            try (Cursor<byte[]> cursor = connection.scan(options)) {
                while (cursor.hasNext()) {
                    String key = new String(cursor.next());
                    if (redisTemplate.opsForHash().hasKey(key, memberId)) {
                        // 플레이어가 있던 방 번호 저장
                        String[] parts = key.split(":");
                        int roomId = Integer.parseInt(parts[1]);
                        roomIds.add(roomId);
                    }
                }
            }
            return null;
        });
        return roomIds;
    }

    public boolean deleteMatch(int roomId) {
        String strRoomId = String.valueOf(roomId);
        String roomKey = redisUtil.getRoomInfoKey(roomId);
        String category = redisUtil.getRoomInfo(roomKey).getCategory();
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
                    if (redisTemplate.opsForSet().isMember(key, Integer.parseInt(memberId))) {
                        redisTemplate.opsForSet().remove(key, Integer.parseInt(memberId));
                    }
                }
            }
            return null;
        });
    }

    public boolean deleteInactivePlayer(String memberId, int roomId) {
        if (roomId == 0) {
            // 유저가 로비에 있다가 연결을 끊은 경우
            for (int channel = 1; channel <= 8; channel++) {
                String activePlayerKey = redisUtil.getActivePlayerKey(channel);

                // memberId를 가진 유저가 해당 채널에 있는지 확인
                Map<String, Object> channelPlayers = redisTemplate.opsForHash().entries(activePlayerKey);
                ActiveUserDto targetUser = (ActiveUserDto) channelPlayers.get(memberId);

                if (targetUser != null) {
                    // 유저가 있던 채널의 동시 접속자 목록에서 삭제
                    redisTemplate.opsForHash().delete(activePlayerKey, memberId);
                }
            }
            return true;
        }
        // 유저가 방에 있다 연결을 끊은 경우
        int channelId = roomId / 1000;
        String activePlayerKey = redisUtil.getActivePlayerKey(channelId);
        List<ActiveUserDto> activeUsers = redisUtil.getActivePlayers(activePlayerKey);

        ActiveUserDto targetUser = activeUsers.stream()
            .filter(user -> user.getId() == Integer.parseInt(memberId))
            .findFirst()
            .orElse(null);

        if (targetUser != null) {
            redisTemplate.opsForHash().delete(activePlayerKey, memberId);
        } else {
            log.info("접속중인 유저가 아닙니다.");
        }
        return false;
    }
}
