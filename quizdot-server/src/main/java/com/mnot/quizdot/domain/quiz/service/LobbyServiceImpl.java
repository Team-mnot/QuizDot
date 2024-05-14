package com.mnot.quizdot.domain.quiz.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mnot.quizdot.domain.member.entity.Member;
import com.mnot.quizdot.domain.member.repository.MemberRepository;
import com.mnot.quizdot.domain.quiz.dto.ActiveUserDto;
import com.mnot.quizdot.domain.quiz.dto.ChannelInfo;
import com.mnot.quizdot.domain.quiz.dto.GameState;
import com.mnot.quizdot.domain.quiz.dto.RoomInfoDto;
import com.mnot.quizdot.domain.quiz.dto.RoomReq;
import com.mnot.quizdot.domain.quiz.dto.RoomRes;
import com.mnot.quizdot.global.result.error.ErrorCode;
import com.mnot.quizdot.global.result.error.exception.BusinessException;
import com.mnot.quizdot.global.util.RedisUtil;
import jakarta.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.core.Cursor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class LobbyServiceImpl implements LobbyService {

    private final static int MAX_CHANNEL = 8;
    private final static int MAX_ROOM = 30;

    private final RedisTemplate redisTemplate;

    private final ObjectMapper objectMapper;

    private final RedisUtil redisUtil;
    ConcurrentMap<Integer, boolean[]> roomNumList;

    private final MemberRepository memberRepository;
    private final static int MAX_CAPACITY = 200;

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
    public RoomRes createRoom(int channelId, int hostId, RoomReq roomReq) {
        // 채널에서 사용 가능한 방 번호를 찾는다
        int roomId = -1;
        for (int i = 1; i <= MAX_ROOM; i++) {
            if (!roomNumList.get(channelId)[i]) {
                modifyRoomNumList(channelId, i, true);
                roomId = channelId * 1000 + i;
                break;
            }
        }

        // 현재 채널에 방을 더 이상 생성할 수 없는 경우 예외 발생
        if (roomId < 0) {
            throw new BusinessException(ErrorCode.ROOM_LIMIT_EXCEEDED);
        }

        // 새로운 대기실 정보 생성하여 REDIS에 등록
        RoomInfoDto roomInfoDto = RoomInfoDto.builder()
            .roomId(roomId)
            .title(roomReq.getTitle())
            .open(roomReq.isOpen())
            .password(roomReq.getPassword())
            .gameMode(String.valueOf(roomReq.getMode()))
            .category(String.valueOf(roomReq.getCategory()))
            .maxQuestion(roomReq.getMaxQuestion())
            .maxPeople(roomReq.getMaxPeople())
            .hostId(hostId)
            .state(GameState.WAITING)
            .build();

        String roomKey = redisUtil.getRoomInfoKey(roomId);
        redisTemplate.opsForValue().set(roomKey, roomInfoDto);

        // 생성된 대기실 정보 반환
        return RoomRes.builder()
            .roomId(roomId)
            .build();
    }

    public void modifyRoomNumList(int channelId, int roomNum, boolean state) {
        roomNumList.get(channelId)[roomNum] = state;
    }

    /**
     * 동시 접속자 목록 조회
     */
    public List<ActiveUserDto> getActiveUserList(int channelId, int memberId) {
        Member member = memberRepository.findById(memberId)
            .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND_MEMBER));

        ActiveUserDto activeUserDto = ActiveUserDto.builder()
            .id(memberId)
            .nickname(member.getNickname())
            .level(member.getLevel())
            .build();

        // 해당 유저를 동시접속목록 REDIS Set에 추가
        String roomKey = redisUtil.getActiveUserKey(channelId);
        redisTemplate.opsForSet().add(roomKey, activeUserDto);

        // 채널 내 동시 접속자 목록 반환
        return redisUtil.getActiveUsers(roomKey);
    }

    /**
     * 대기실 목록 조회
     */
    public List<RoomInfoDto> getRoomList(int channelId) {
        String pattern = String.format("rooms:%d*:info", channelId);
        List<RoomInfoDto> roomsList = new ArrayList<>();

        redisTemplate.execute((RedisConnection connection) -> {
            try (Cursor<byte[]> cursor = connection.scan(
                ScanOptions.scanOptions().match(pattern).count(MAX_ROOM).build())) {
                while (cursor.hasNext()) {
                    String key = new String(cursor.next());
                    log.info("key : {}", key);
                    if (!(key.endsWith("0520:info"))) {
                        RoomInfoDto roomInfoDto = redisUtil.getRoomInfo(key);
                        roomsList.add(roomInfoDto);
                    }
                }
            }
            return null;
        });
        return roomsList;
    }

    /**
     * 채널 목록 조회
     */
    public List<ChannelInfo> getChannelList() {
        // 레디스에서 채널별로 동시접속자 수 구해오기
        List<ChannelInfo> channelInfos = new ArrayList<>();
        for (int channel = 1; channel <= MAX_CHANNEL; channel++) {
            String key = redisUtil.getActiveUserKey(channel);
            long activeUserCount = redisTemplate.opsForSet().size(key);

            // 각 채널의 동시접속자 반영
            ChannelInfo channelInfo = ChannelInfo.builder()
                .channelId(channel)
                .activeUserCount(activeUserCount)
                .totalAvailable(MAX_CAPACITY)
                .build();

            channelInfos.add(channelInfo);
        }
        return channelInfos;
    }

    /**
     * 채널 입장 가능 여부 확인
     */
    public void checkAvailable(int channelId) {
        String key = redisUtil.getActiveUserKey(channelId);

        if (MAX_CAPACITY == redisTemplate.opsForSet().size(key)) {
            throw new BusinessException(ErrorCode.CHANNEL_LIMIT_EXCEEDED);
        }
    }

    /**
     * 비공개 방 비밀번호 확인
     */
    public void checkPassword(int roomId, String password) {
        String key = redisUtil.getRoomInfoKey(roomId);
        RoomInfoDto roomInfoDto = redisUtil.getRoomInfo(key);

        if (!roomInfoDto.getPassword().equals(password)) {
            throw new BusinessException(ErrorCode.INVALID_ROOM_PASSWORD);
        }
    }
}
