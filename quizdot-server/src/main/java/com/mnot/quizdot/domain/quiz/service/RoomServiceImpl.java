package com.mnot.quizdot.domain.quiz.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mnot.quizdot.domain.member.entity.Member;
import com.mnot.quizdot.domain.member.repository.MemberRepository;
import com.mnot.quizdot.domain.quiz.dto.MessageDto;
import com.mnot.quizdot.domain.quiz.dto.PlayerInfoDto;
import com.mnot.quizdot.domain.quiz.dto.RoomEnterRes;
import com.mnot.quizdot.domain.quiz.dto.RoomInfoDto;
import com.mnot.quizdot.domain.quiz.dto.RoomReq;
import com.mnot.quizdot.global.result.error.ErrorCode;
import com.mnot.quizdot.global.result.error.exception.BusinessException;
import java.util.List;
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
    private final MemberRepository memberRepository;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * 대기실 정보 변경
     */
    public void modifyRoomInfo(int roomId, int memberId, RoomReq roomReq)
        throws JsonProcessingException {
        String key = String.format("rooms:%d:info", roomId);
        RoomInfoDto roomInfoDto = getRoomInfo(key);

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

    /**
     * 대기실 입장
     */
    public RoomEnterRes enterRoom(int roomId, int memberId) throws JsonProcessingException {
        // 대기실 회원 리스트 조회
        String memberKey = String.format("rooms:%d:players", roomId);
        String jsonPlayers = redisTemplate.opsForHash().values(memberKey).toString();
        List<PlayerInfoDto> players = objectMapper.readValue(jsonPlayers,
            new TypeReference<List<PlayerInfoDto>>() {
            });

        // 대기실 정보 조회
        String roomKey = String.format("rooms:%d:info", roomId);
        RoomInfoDto roomInfoDto = getRoomInfo(roomKey);

        if (roomInfoDto == null) {
            throw new BusinessException(ErrorCode.ROOM_NOT_FOUND);
        }

        if (players.size() == roomInfoDto.getMaxPeople()) {
            throw new BusinessException(ErrorCode.PLAYER_LIMIT_EXCEEDED);
        }

        // 대기실 회원 리스트에 추가
        log.info("memberId : {}", memberId);
        Member member = memberRepository.findById(memberId)
            .orElseThrow(() -> new BusinessException(ErrorCode.MEMBER_NOT_EXISTS));

        PlayerInfoDto player = PlayerInfoDto.builder()
            .level(member.getLevel())
            .title(member.getTitleId())
            .avatar(member.getAvatarId())
            .nickname(member.getNickname())
            .nicknameColor(member.getNicknameColor())
            .build();

        String obj = objectMapper.writeValueAsString(player);
        redisTemplate.opsForHash().put(memberKey, String.valueOf(memberId), obj);

        messagingTemplate.convertAndSend("/sub/players/room/" + roomId + "/enter", player);
        messagingTemplate.convertAndSend("/sub/chat/room/" + roomId,
            new MessageDto("System", player.getNickname() + "님이 입장하셨습니다."));
        return new RoomEnterRes(players, roomInfoDto);
    }

    /**
     * 대기실 정보 조회
     */
    private RoomInfoDto getRoomInfo(String key) throws JsonProcessingException {
        // Redis 조회
        String info = (String) redisTemplate.opsForValue().get(key);
        if (info == null) {
            throw new BusinessException(ErrorCode.ROOM_NOT_FOUND);
        }

        // 객체 변환
        RoomInfoDto roomInfoDto = objectMapper.readValue(info, RoomInfoDto.class);
        return roomInfoDto;
    }
}
