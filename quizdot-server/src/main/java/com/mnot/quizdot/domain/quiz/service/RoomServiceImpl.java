package com.mnot.quizdot.domain.quiz.service;

import com.mnot.quizdot.domain.member.entity.Member;
import com.mnot.quizdot.domain.member.repository.MemberRepository;
import com.mnot.quizdot.domain.member.repository.TitleRepository;
import com.mnot.quizdot.domain.quiz.dto.GameState;
import com.mnot.quizdot.domain.quiz.dto.MessageDto;
import com.mnot.quizdot.domain.quiz.dto.MessageType;
import com.mnot.quizdot.domain.quiz.dto.PlayerInfoDto;
import com.mnot.quizdot.domain.quiz.dto.RoomEnterRes;
import com.mnot.quizdot.domain.quiz.dto.RoomInfoDto;
import com.mnot.quizdot.domain.quiz.dto.RoomReq;
import com.mnot.quizdot.global.result.error.ErrorCode;
import com.mnot.quizdot.global.result.error.exception.BusinessException;
import com.mnot.quizdot.global.util.RedisUtil;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.Cursor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class RoomServiceImpl implements RoomService {

    private static final String SERVER_SENDER = "SYSTEM";
    private static final String ROOM_PLAYER_DESTINATION = "/sub/players/room/";
    private static final String ROOM_INFO_DESTINATION = "/sub/info/room/";
    private static final String ROOM_CHAT_DESTINATION = "/sub/chat/room/";
    private final LobbyService lobbyService;
    private final RedisTemplate redisTemplate;
    private final MemberRepository memberRepository;
    private final TitleRepository titleRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final RedisUtil redisUtil;

    /**
     * 대기실 정보 변경
     */
    public void modifyRoomInfo(int roomId, int memberId, RoomReq roomReq) {
        String roomKey = redisUtil.getRoomInfoKey(roomId);
        RoomInfoDto roomInfoDto = redisUtil.getRoomInfo(roomKey);
        if (memberId != roomInfoDto.getHostId()) {
            throw new BusinessException(ErrorCode.IS_NOT_HOST);
        }
        // 대기실 정보 업데이트
        roomInfoDto.modifyInfo(roomReq);
        redisTemplate.opsForValue().set(roomKey, roomInfoDto);

        // 업데이트 된 정보를 대기실 내 유저들에게 전송
        messagingTemplate.convertAndSend(ROOM_INFO_DESTINATION + roomId,
            MessageDto.of(SERVER_SENDER, MessageType.MODIFY, roomInfoDto));
        messagingTemplate.convertAndSend(ROOM_CHAT_DESTINATION + roomId,
            MessageDto.of(SERVER_SENDER, "대기실 정보가 변경되었습니다.", MessageType.CHAT));
    }

    /**
     * 대기실 입장
     */
    public RoomEnterRes enterRoom(int roomId, int memberId) {
        // 대기실 정보 조회
        String roomKey = redisUtil.getRoomInfoKey(roomId);
        RoomInfoDto roomInfoDto = redisUtil.getRoomInfo(roomKey);
        if (!GameState.WAITING.equals(roomInfoDto.getState())) {
            throw new BusinessException(ErrorCode.IS_NOT_WAITING);
        }

        // 대기실 회원 리스트 조회
        String memberKey = redisUtil.getPlayersKey(roomId);
        Map<String, PlayerInfoDto> players = redisUtil.getPlayersInfo(memberKey);

        if (roomInfoDto == null) {
            throw new BusinessException(ErrorCode.ROOM_NOT_FOUND);
        }

        if (players.size() == roomInfoDto.getMaxPeople()) {
            throw new BusinessException(ErrorCode.PLAYER_LIMIT_EXCEEDED);
        }

        // 대기실 회원 리스트에 추가
        log.info("[enterRoom] memberId : {}", memberId);
        Member member = memberRepository.findById(memberId)
            .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND_MEMBER));

        String title = titleRepository.findById(member.getTitleId())
            .orElseThrow(() -> new BusinessException(ErrorCode.LOCK_TITLE_ERROR)).getTitle();

        PlayerInfoDto player = PlayerInfoDto.builder()
            .id(member.getId())
            .level(member.getLevel())
            .title(title)
            .characterId(member.getCharacterId())
            .nickname(member.getNickname())
            .nicknameColor(member.getNicknameColor())
            .build();

        players.put(String.valueOf(memberId), player);
        redisTemplate.opsForHash().putAll(memberKey, players);

        messagingTemplate.convertAndSend(ROOM_PLAYER_DESTINATION + roomId,
            MessageDto.of(SERVER_SENDER, player.getNickname() + "님이 입장하셨습니다.", MessageType.ENTER,
                player));
        messagingTemplate.convertAndSend(ROOM_CHAT_DESTINATION + roomId,
            MessageDto.of(SERVER_SENDER, player.getNickname() + "님이 입장하셨습니다.", MessageType.CHAT));
        return new RoomEnterRes(players, roomInfoDto);
    }

    /**
     * 대기실 퇴장
     */
    @Override
    public void leaveRoom(int roomId, String memberId) {
        // 대기열 참여 리스트에서 삭제
        String playerKey = redisUtil.getPlayersKey(roomId);
        PlayerInfoDto player = (PlayerInfoDto) redisTemplate.opsForHash().get(playerKey, memberId);
        if (player == null) {
            throw new BusinessException(ErrorCode.NOT_EXISTS_IN_ROOM);
        }

        redisTemplate.opsForHash().delete(playerKey, memberId);
        messagingTemplate.convertAndSend(ROOM_PLAYER_DESTINATION + roomId,
            MessageDto.of(SERVER_SENDER, MessageType.LEAVE, memberId));
        messagingTemplate.convertAndSend(ROOM_CHAT_DESTINATION + roomId,
            MessageDto.of(SERVER_SENDER, player.getNickname() + "님이 퇴장하셨습니다.", MessageType.CHAT));

        // 방장이 퇴장한 경우 체크
        String roomKey = redisUtil.getRoomInfoKey(roomId);
        RoomInfoDto roomInfoDto = redisUtil.getRoomInfo(roomKey);
        if (memberId.equals(String.valueOf(roomInfoDto.getHostId()))) {
            playerKey = redisUtil.getPlayersKey(roomId);
            String newHostId = (String) redisTemplate.opsForHash().randomKey(playerKey);

            // 모든 사람이 퇴장했으면, 대기실 데이터 삭제
            if (newHostId == null) {
                // 대기실 데이터 관리
                deleteRoom(roomId);

                // ID POOL 관리
                int channelId = roomId / 1000;
                int roomNum = roomId % 100;
                lobbyService.modifyRoomNumList(channelId, roomNum, false);
                return;
            }

            // 아직 남아 있는 인원이 있다면, 방장 변경
            roomInfoDto.setHostId(Integer.parseInt(newHostId));
            redisTemplate.opsForValue().set(roomKey, roomInfoDto);

            log.info("[leaveRoom] Host 변경 : {}", newHostId);
            messagingTemplate.convertAndSend(ROOM_INFO_DESTINATION + roomId, roomInfoDto);
            messagingTemplate.convertAndSend(ROOM_CHAT_DESTINATION + roomId,
                MessageDto.of(SERVER_SENDER, "방장이 변경되었습니다", MessageType.CHAT));
        }
    }

    /**
     * 대기실 관련 모든 데이터 삭제
     */
    public void deleteRoom(int roomId) {
        // REDIS
        String pattern = String.format("rooms:%d:*", roomId);
        Cursor<String> keys = redisTemplate.scan(ScanOptions.scanOptions().match(pattern).build());
        keys.forEachRemaining((key) -> {
            redisTemplate.delete(key);
        });
    }

    /**
     * 대기실 초대 링크 생성
     */
    public String inviteRoom(int roomId, int memberId) {
        String key = redisUtil.getRoomInfoKey(roomId);
        RoomInfoDto roomInfoDto = redisUtil.getRoomInfo(key);

        // 링크를 생성하는 사용자가 방장인지 확인
        redisUtil.checkHost(roomId, memberId);

        // 초대 링크 생성시간 저장(방 번호 재사용 시, 초대 링크 중복 방지)
        String now = String.valueOf(System.currentTimeMillis());

        // base64url로 파라미터 인코딩
        String params = String.format("roomId=%d&time=%s", roomId, now);
        String base64UrlEncoded = Base64.getUrlEncoder().withoutPadding()
            .encodeToString(params.getBytes());
        String link = String.format("https://k10d102.p.ssafy.io/invite?data=%s", base64UrlEncoded);

        // redis에 초대링크 저장
        roomInfoDto.setInviteLink(link);
        redisTemplate.opsForValue().set(key, roomInfoDto);
        return link;
    }


    /**
     * 초대 받은 대기실 입장
     */
    public RoomEnterRes enterInvitedRoom(String encodedParam, int memberId) {
        // 파라미터를 디코딩해서 roomId 추출
        String decodedParams = new String(Base64.getUrlDecoder().decode(encodedParam));
        Map<String, String> paramsMap = new HashMap<>();
        String[] params = decodedParams.split("&");
        for (String param : params) {
            String[] keyValuePair = param.split("=");
            if (keyValuePair.length == 2) {
                paramsMap.put(keyValuePair[0], keyValuePair[1]);
            }
        }
        // 초대 링크가 유효한지 확인
        int roomId = Integer.parseInt(paramsMap.get("roomId"));
        String key = redisUtil.getRoomInfoKey(roomId);
        RoomInfoDto roomInfoDto = redisUtil.getRoomInfo(key);
        String link = String.format("https://k10d102.p.ssafy.io/invite?data=%s", encodedParam);
        if (!roomInfoDto.getInviteLink().equals(link)) {
            throw new BusinessException(ErrorCode.INVALID_INVITE_LINK);
        }
        // 대기실 입장
        return enterRoom(roomId, memberId);
    }
}
