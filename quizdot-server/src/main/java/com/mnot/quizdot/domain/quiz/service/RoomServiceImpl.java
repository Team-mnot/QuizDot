package com.mnot.quizdot.domain.quiz.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mnot.quizdot.domain.member.entity.Member;
import com.mnot.quizdot.domain.member.repository.MemberRepository;
import com.mnot.quizdot.domain.member.repository.TitleRepository;
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
import java.util.List;
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

    private final LobbyService lobbyService;
    private final ObjectMapper objectMapper;
    private final RedisTemplate redisTemplate;
    private final MemberRepository memberRepository;
    private final TitleRepository titleRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final RedisUtil redisUtil;

    /**
     * 대기실 정보 변경
     */
    public void modifyRoomInfo(int roomId, int memberId, RoomReq roomReq)
        throws JsonProcessingException {
        String key = redisUtil.getRoomInfoKey(roomId);
        RoomInfoDto roomInfoDto = redisUtil.getRoomInfo(key);

        if (memberId != roomInfoDto.getHostId()) {
            throw new BusinessException(ErrorCode.IS_NOT_HOST);
        }

        // 대기실 정보 업데이트
        roomInfoDto.modifyInfo(roomReq);
        String jsonRoom = objectMapper.writeValueAsString(roomInfoDto);
        redisTemplate.opsForValue().set(key, jsonRoom);

        // 업데이트 된 정보를 대기실 내 유저들에게 전송
        messagingTemplate.convertAndSend("/sub/info/room/" + roomId,
            MessageDto.of("System", MessageType.MODIFY, roomInfoDto));
        messagingTemplate.convertAndSend("/sub/chat/room/" + roomId,
            MessageDto.of("System", "대기실 정보가 변경되었습니다.", MessageType.CHAT));
    }

    /**
     * 대기실 입장
     */
    public RoomEnterRes enterRoom(int roomId, int memberId) throws JsonProcessingException {
        // 대기실 회원 리스트 조회
        String memberKey = redisUtil.getPlayersKey(roomId);
        List<PlayerInfoDto> players = redisUtil.getPlayersInfo(memberKey);

        // 대기실 정보 조회
        String roomKey = redisUtil.getRoomInfoKey(roomId);
        RoomInfoDto roomInfoDto = redisUtil.getRoomInfo(roomKey);

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
            .level(member.getLevel())
            .title(title)
            .characterId(member.getCharacterId())
            .nickname(member.getNickname())
            .nicknameColor(member.getNicknameColor())
            .build();

        String obj = objectMapper.writeValueAsString(player);
        redisTemplate.opsForHash().put(memberKey, String.valueOf(memberId), obj);

        messagingTemplate.convertAndSend("/sub/players/room/" + roomId,
            MessageDto.of("System", player.getNickname() + "님이 입장하셨습니다.", MessageType.ENTER,
                player));
        messagingTemplate.convertAndSend("/sub/chat/room/" + roomId,
            MessageDto.of("System", player.getNickname() + "님이 입장하셨습니다.", MessageType.CHAT));
        return new RoomEnterRes(players, roomInfoDto);
    }

    /**
     * 대기실 퇴장
     */
    @Override
    public void leaveRoom(int roomId, String memberId) throws JsonProcessingException {
        // 대기열 참여 리스트에서 삭제
        String memberKey = redisUtil.getPlayersKey(roomId);
        String jsonPlayer = (String) redisTemplate.opsForHash().get(memberKey, memberId);
        if (jsonPlayer == null) {
            throw new BusinessException(ErrorCode.NOT_EXISTS_IN_ROOM);
        }

        PlayerInfoDto player = objectMapper.readValue(jsonPlayer, PlayerInfoDto.class);
        redisTemplate.opsForHash().delete(memberKey, memberId);

        messagingTemplate.convertAndSend("/sub/players/room/" + roomId,
            MessageDto.of("System", MessageType.LEAVE, memberId));
        messagingTemplate.convertAndSend("/sub/chat/room/" + roomId,
            MessageDto.of("System", player.getNickname() + "님이 퇴장하셨습니다.", MessageType.CHAT));

        // 방장이 퇴장한 경우 체크
        String roomKey = redisUtil.getRoomInfoKey(roomId);
        RoomInfoDto roomInfoDto = redisUtil.getRoomInfo(roomKey);

        if (memberId.equals(String.valueOf(roomInfoDto.getHostId()))) {
            String newHostId = (String) redisTemplate.opsForHash().randomKey(memberKey);

            // 모든 사람이 퇴장했으면, 대기실 데이터 삭제
            if (newHostId == null) {
                deleteRoom(roomId);
                return;
            }

            // 아직 남아 있는 인원이 있다면, 방장 변경
            roomInfoDto.setHostId(Integer.parseInt(newHostId));
            String jsonRoom = objectMapper.writeValueAsString(roomInfoDto);
            redisTemplate.opsForValue().set(roomKey, jsonRoom);

            log.info("[leaveRoom] Host 변경 : {}", newHostId);
            messagingTemplate.convertAndSend("/sub/info/room/" + roomId, roomInfoDto);
            messagingTemplate.convertAndSend("/sub/chat/room/" + roomId,
                MessageDto.of("System", "방장이 변경되었습니다", MessageType.CHAT));
        }
    }


    /**
     * 대기실 관련 모든 데이터 삭제
     */
    private void deleteRoom(int roomId) {
        // REDIS
        String pattern = String.format("rooms:%d:*", roomId);
        Cursor keys = redisTemplate.scan(ScanOptions.scanOptions().match(pattern).build());
        keys.forEachRemaining((key) -> {
            log.info("key : {}", key);
            redisTemplate.delete((String) key);
            return;
        });

        // ID POOL 관리
        int channelId = roomId / 1000;
        int roomNum = roomId % 100;
        lobbyService.modifyRoomNumList(channelId, roomNum, false);
        log.info("[deleteRoom] channelId : {}, roomId : {}", channelId, roomNum);
    }

    /**
     * 대기실 초대 링크 생성
     */
    public String inviteRoom(int roomId, int memberId) throws JsonProcessingException{
        String key = redisUtil.getRoomInfoKey(roomId);
        RoomInfoDto roomInfoDto = redisUtil.getRoomInfo(key);
        // 링크를 생성하는 사용자가 방장인지 확인
        if (memberId != roomInfoDto.getHostId()) {
            throw new BusinessException(ErrorCode.INVITE_NOT_ALLOWED);
        }
        // 초대 링크 생성시간 저장(방 번호 재사용 시, 초대 링크 중복 방지)
        String now = String.valueOf(System.currentTimeMillis());
        // base64url로 파라미터 인코딩
        String params = String.format("roomId=%d&time=%s", roomId, now);
        String base64UrlEncoded = Base64.getUrlEncoder().withoutPadding()
            .encodeToString(params.getBytes());
        String link = String.format("https://k10d102.p.ssafy.io/invite?%s",base64UrlEncoded);
        // redis에 초대링크 저장
        roomInfoDto.setInviteLink(link);
            String obj = objectMapper.writeValueAsString(roomInfoDto);
            redisTemplate.opsForValue().set(key, obj);
        return link;
    }
}
