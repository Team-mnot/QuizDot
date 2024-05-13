package com.mnot.quizdot.global.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mnot.quizdot.domain.quiz.dto.ActiveUserDto;
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
import com.mnot.quizdot.domain.quiz.dto.MatchRoomDto;

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

        log.info("[getRoomInfo] roomInfoDto : {}", roomInfoDto);
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
     * 전체 채널의 동시 접속 유저 조회
     */
    public Map<Integer, Set<ActiveUserDto>> getAllActivePlayers() {
        Map<Integer, Set<ActiveUserDto>> allActivePlayers = new HashMap<>();
        final int maxChannel = 8;

        for(int channel = 1; channel <= maxChannel; channel++) {
            String key = getActivePlayerKey(channel);
            Set<ActiveUserDto> players = redisTemplate.opsForSet().members(key);
            allActivePlayers.put(channel, players);
        }

        return allActivePlayers;
    }

    /**
     * 게임 중 나간 플레이어 정보 모두 삭제
     */
    public void deleteInactivePlayer(String memberId) {
        // TODO : players 지울 때 모두 나간 방 처리와 나간 유저가 방장인 경우?????
        // 플레이어 정보를 제거하고 방 번호 반환
        int roomId = deletePlayer(memberId);
        log.info("플레이어 정보 제거 성공");

        // 패스 정보 제거
        deletePass(memberId, roomId);
        log.info("패스 정보 제거 성공");

        // 점수 정보 제거
        String boardKey = getBoardKey(roomId);
        redisTemplate.opsForZSet().remove(boardKey, memberId);
        log.info("점수 정보 제거 성공");

        // 서바이벌 생존자 정보 제거
        String surviveKey = String.format("rooms:%d:survivors", roomId);
        boolean removedFromSurvive = redisTemplate.opsForZSet().remove(surviveKey, memberId) > 0;
        log.info("서바이벌 생존자 정보 제거 성공");

        // 서바이벌 탈락자 정보 제거
        if(!removedFromSurvive) {
            String eliminatedKey = String.format("rooms:%d:eliminated", roomId);
            redisTemplate.opsForZSet().remove(eliminatedKey, memberId);
            log.info("서바이벌 탈락자 정보 제거 성공");
        }

        // 매칭중인 경우, 정보 제거
        try{
            deleteMatch(roomId);
            log.info("매칭 정보 제거 성공");
        } catch (BusinessException e) {
            log.error("BusinessException: {}", e.getMessage());
        } catch (Exception e) {
            log.error("매칭 정보 제거를 실패하였습니다.");
        }

        // 동시접속자 정보 제거
        deleteInactiveUser(memberId, roomId);
        log.info("동시접속자 정보 제거 성공");
    }

    public int deletePlayer(String memberId) {
        // scan을 이용해서 키를 찾고 해당 방의 플레이어 정보 제거
        AtomicInteger roomId = new AtomicInteger();
        String pattern = "rooms:*:players";
        ScanOptions options = ScanOptions.scanOptions().match(pattern).build();
        redisTemplate.execute((RedisConnection connection) -> {
            Cursor<byte[]> cursor = connection.scan(options);
            while (cursor.hasNext()) {
                String key = new String(cursor.next());
                Map<String, PlayerInfoDto> players =
                    (Map<String, PlayerInfoDto>) redisTemplate.opsForHash().entries(key);

                // memberId와 일치하는 플레이어 정보를 찾아 삭제
                if (players.containsKey(memberId)) {
                    redisTemplate.opsForHash().delete(key, memberId);
                    // 플레이어가 있던 방 번호 저장
                    String[] parts = key.split(":");
                    roomId.set(Integer.parseInt(parts[1]));
                    break;
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
        String matchKey = "match:"+category;

        Set<MatchRoomDto> existRooms = redisTemplate.opsForSet().members(matchKey);
        MatchRoomDto targetRoom = existRooms.stream()
            .filter(room -> room.getRoomId().equals(strRoomId))
            .findFirst()
            .orElse(null);

        if(targetRoom != null) {
            redisTemplate.opsForSet().remove(matchKey, targetRoom); // 기존 객체 제거
            targetRoom.setPlayerCount(targetRoom.getPlayerCount() - 1); // playerCount 감소
            redisTemplate.opsForSet().add(matchKey, targetRoom); // 수정된 객체 추가
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
                        break;
                    }
                }
            }
            return null;
        });
    }

    public void deleteInactiveUser(String memberId, int roomId) {
        if(roomId==0) {
            // 유저가 로비에 있다가 연결을 끊은 경우
            Map<Integer, Set<ActiveUserDto>> allActivePlayers = getAllActivePlayers();
            for(int channel=1; channel<=8; channel++) {
                 Set<ActiveUserDto> channelPlayers = allActivePlayers.get(channel);
                 for(ActiveUserDto target : channelPlayers) {
                     if(String.valueOf(target.getId()).equals(memberId)) {
                         // 유저가 있던 채널의 동시 접속자 목록에서 삭제
                         redisTemplate.opsForSet().remove(getActivePlayerKey(channel), target);
                     }
                 }
            }
            return ;
        }
        // 유저가 방에 있다 연결을 끊은 경우
        int channelId = roomId/1000;
        String activeUserKey = getActivePlayerKey(channelId);
        List<ActiveUserDto> activeUsers = getActivePlayers(activeUserKey);

        ActiveUserDto targetUser = activeUsers.stream()
            .filter(user -> user.getId() == Integer.parseInt(memberId))
            .findFirst()
            .orElse(null);

        if (targetUser != null) {
            redisTemplate.opsForSet().remove(activeUserKey, targetUser);
        }
        else {
            log.info("접속중인 유저가 아닙니다.");
        }
    }
}
