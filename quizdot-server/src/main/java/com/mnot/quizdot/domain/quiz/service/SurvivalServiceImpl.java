package com.mnot.quizdot.domain.quiz.service;

import com.mnot.quizdot.domain.member.entity.Member;
import com.mnot.quizdot.domain.member.entity.ModeType;
import com.mnot.quizdot.domain.member.entity.MultiRecord;
import com.mnot.quizdot.domain.member.repository.MemberRepository;
import com.mnot.quizdot.domain.member.repository.MultiRecordRepository;
import com.mnot.quizdot.domain.quiz.dto.GameState;
import com.mnot.quizdot.domain.quiz.dto.MessageDto;
import com.mnot.quizdot.domain.quiz.dto.MessageType;
import com.mnot.quizdot.domain.quiz.dto.PlayerInfoDto;
import com.mnot.quizdot.domain.quiz.dto.ResultDto;
import com.mnot.quizdot.domain.quiz.dto.RoomEnterRes;
import com.mnot.quizdot.domain.quiz.dto.RoomInfoDto;
import com.mnot.quizdot.global.result.error.ErrorCode;
import com.mnot.quizdot.global.result.error.exception.BusinessException;
import com.mnot.quizdot.global.util.RedisUtil;
import com.mnot.quizdot.global.util.TitleUtil;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations.TypedTuple;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class SurvivalServiceImpl implements SurvivalService {

    private static final int MIN_SCORE = -1000;
    private static final int MAX_SCORE = 1000;
    private static final String SERVER_SENDER = "SYSTEM";
    private static final String GAME_DEFAULT_ID = "0520";
    private static final String MATCH_KEY = "match:";
    private static final String ROOM_CHAT_DESTINATION = "/sub/chat/room/";

    private final RedisTemplate redisTemplate;
    private final RedisUtil redisUtil;
    private final SimpMessagingTemplate messagingTemplate;
    private final MemberRepository memberRepository;
    private final MultiRecordRepository multiRecordRepository;
    private final TitleUtil titleUtil;
    private final QuizService quizService;

    /**
     * 서바이벌 모드 점수 업데이트
     */
    @Override
    public void updateScores(int roomId, int memberId, int isCorrect) {
        // 생존 여부 체크
        String boardKey = redisUtil.getBoardKey(roomId);
        Double doubleState = redisTemplate.opsForZSet().score(boardKey, memberId);
        if (doubleState == null) {
            throw new BusinessException(ErrorCode.PLAYER_NOT_EXISTS);
        }

        int state = doubleState.intValue();

        // 생존 여부에 따라 정답 여부를 다른 집합에서 관리
        String stateKey = (state > 0) ? getSurviveKey(roomId) : getEliminatedKey(roomId);
        redisTemplate.opsForZSet().add(stateKey, memberId, isCorrect);
        log.info("[updateScores] stateKey : {}", stateKey);

        // 전체 생존자가 풀었을 경우 패스 메세지 송신
        long survivePeople = redisTemplate.opsForZSet().count(boardKey, 0, MAX_SCORE);
        long submitPeople = redisTemplate.opsForZSet()
            .count(getSurviveKey(roomId), MIN_SCORE, MAX_SCORE);
        log.info("survive : {}, submit : {}", survivePeople, submitPeople);

        if (submitPeople == survivePeople) {
            messagingTemplate.convertAndSend(getGameDestination(roomId),
                MessageDto.of(SERVER_SENDER, "모든 생존자가 답안을 제출하였습니다.", MessageType.PASS,
                    System.currentTimeMillis()));
        }
    }

    /**
     * 결과에 따라 경험치 및 포인트 업데이트, 결과 정보 제공
     */
    @Transactional
    @Override
    public List<ResultDto> exitGame(int roomId, int memberId) {
        String boardKey = redisUtil.getBoardKey(roomId);
        redisUtil.checkHost(roomId, memberId);

        Set<TypedTuple<Integer>> scores = redisTemplate.opsForZSet()
            .reverseRangeWithScores(boardKey, 0, -1);

        //board에 있는 멤버들의 pk 저장 및 pk로 Member 객체 가져오기
        List<Integer> memberIdList = scores.stream().map(score -> score.getValue())
            .collect(Collectors.toList());

        List<Member> memberList = memberRepository.findAllById(memberIdList);
        Map<Integer, Member> memberMap = memberList.stream()
            .collect(Collectors.toMap(Member::getId, member -> member));
        log.info("memberIdList : {}", memberIdList);

        List<MultiRecord> multiRecordList = multiRecordRepository.findAllByMember_IdAndMode(
            memberIdList,
            ModeType.SURVIVAL);

        Map<Integer, MultiRecord> multiRecordMap = multiRecordList.stream()
            .collect(Collectors.toMap(multiRecord -> multiRecord.getMember().getId(),
                multiRecord -> multiRecord));

        List<ResultDto> resultDtoList = new ArrayList<>();
        if (scores != null) {
            int totalPlayer = scores.size();
            int exp;
            boolean isFirst = true;
            int rank = 1;
            for (TypedTuple<Integer> score : scores) {
                int id = score.getValue();
                Member member = memberMap.get(id);
                MultiRecord multiRecord = multiRecordMap.get(id);
                double memberScore = score.getScore();
                if (isFirst) {
                    exp = ((totalPlayer) + 1) * 200;
                    isFirst = false;
                } else {
                    exp = (int) (Math.abs(memberScore) * 10);
                    rank = 2;
                }

                int curLevel = member.updateReward(exp, exp);
                multiRecord.updateRecord(rank == 1 ? 1 : 0, 1);

                //칭호 얻은게 있으면
                List<String> unlockList = titleUtil.checkRequirment(member, multiRecord,
                    ModeType.SURVIVAL);
                if (!unlockList.isEmpty()) {
                    log.info("멤버 pk : {}", id);
                    log.info("칭호 체크 : {}", unlockList);
                    messagingTemplate.convertAndSend(getGameDestination(roomId) + "/title/" + id,
                        MessageDto.of(SERVER_SENDER, "칭호가 해금되었습니다", MessageType.TILE, unlockList));
                }

                ResultDto resultDto = ResultDto.builder()
                    .id(id)
                    .level(member.getLevel())
                    .curLevel(curLevel)
                    .nickname(member.getNickname())
                    .rank(rank)
                    .score(exp)
                    .point(exp)
                    .curExp(member.getExp())
                    .build();
                resultDtoList.add(resultDto);
            }
        }
        messagingTemplate.convertAndSend(getGameDestination(roomId),
            MessageDto.of(SERVER_SENDER, "리워드 지급 및 결과 계산이 완료되었습니다.",
                MessageType.REWARD, resultDtoList));

        // 대기실 상태 변경 (INPROGRESS -> WAITING)
        Map<String, Integer> matchRooms = redisTemplate.opsForHash()
            .entries(getMatchRoomKey(roomId));
        matchRooms.entrySet()
            .forEach((entry) -> {
                redisUtil.modifyRoomState(
                    redisUtil.getRoomInfoKey(Integer.parseInt(entry.getKey())), GameState.WAITING);
            });
        return resultDtoList;
    }

    /**
     * 스테이지 결과를 계산하고, 게임 진행 중인 모든 플레이어에게 결과 전송
     */
    @Override
    public Set<TypedTuple<String>> getStageResult(int roomId, int memberId) {
        // 방장 권한 체크
        redisUtil.checkHost(roomId, memberId);

        // 스테이지 결과 계산
        String boardKey = redisUtil.getBoardKey(roomId);
        String surviveKey = getSurviveKey(roomId);
        String eliminatedKey = getEliminatedKey(roomId);

        // 생존자 중에서 정답을 맞힌 사람이 없는 경우
        // 생존자는 그대로 다음 문제로 넘어가되, 정답을 맞힌 탈락자는 추가로 부활시킨다
        if (redisTemplate.opsForZSet().count(surviveKey, 0, MAX_SCORE) == 0) {
            Set<TypedTuple<Integer>> resurrections = redisTemplate.opsForZSet()
                .rangeByScoreWithScores(eliminatedKey, 0, MAX_SCORE);
            Set<TypedTuple<Integer>> newRessurections = new HashSet<>();
            for (TypedTuple<Integer> player : resurrections) {
                // 부활 처리
                Integer playerId = player.getValue();
                Double originalScore = redisTemplate.opsForZSet().score(boardKey, playerId);
                newRessurections.add(TypedTuple.of(playerId, originalScore * (-1)));
            }

            log.info("[getStageResult] newRessurections : {}", newRessurections);

            // 부활 메시지 전송
            if (!newRessurections.isEmpty()) {
                redisTemplate.opsForZSet().add(boardKey, newRessurections);
                messagingTemplate.convertAndSend(getGameDestination(roomId),
                    MessageDto.of(SERVER_SENDER, newRessurections.size() + "명의 플레이어가 부활했습니다 !!",
                        MessageType.RESURRECT));
            }
        }
        // 생존자 중에서 한 명이라도 정답을 맞히는 경우
        // 맞힌 플레이어는 점수를 부여하고, 정답을 제출하지 않았거나 틀린 플레이어는 탈락 처리한다
        else {
            // 스코어보드에서 생존자들 정보를 가져온다
            Set<TypedTuple<Integer>> survivors = redisTemplate.opsForZSet()
                .rangeByScoreWithScores(boardKey, 0, MAX_SCORE);
            Set<TypedTuple<Integer>> newSurvivors = new HashSet<>();
            for (TypedTuple<Integer> survivor : survivors) {
                Integer playerId = survivor.getValue();
                Double originalScore = survivor.getScore();
                Double state = redisTemplate.opsForZSet().score(surviveKey, playerId);

                if (state == null || state <= 0) {
                    // 정답자가 아니면 탈락 처리
                    newSurvivors.add(TypedTuple.of(playerId, originalScore * (-1)));
                } else {
                    // 정답자면 점수 부여
                    newSurvivors.add(TypedTuple.of(playerId, originalScore + 1));
                }
            }
            redisTemplate.opsForZSet().add(boardKey, newSurvivors);
            log.info("[getStageResult] newSurvivors : {}", newSurvivors);
        }

        // 스테이지 결과 초기화
        redisTemplate.unlink(List.of(surviveKey, eliminatedKey));

        // 최종 스테이지 결과 리턴
        MessageType messageType = MessageType.STAGE_RESULT;
        Set<TypedTuple<String>> results = redisTemplate.opsForZSet()
            .rangeByScoreWithScores(boardKey, MIN_SCORE, MAX_SCORE);
        long left = redisTemplate.opsForZSet().count(boardKey, 0, MAX_SCORE);

        if (left == 1) {
            // 만약 생존자가 1명이면 서바이벌 게임 종료, 모든 대기실의 상태 변경 (INPROGRESS -> WAITING)
            messageType = MessageType.EXIT;
        }

        messagingTemplate.convertAndSend(getGameDestination(roomId),
            MessageDto.of(SERVER_SENDER, messageType, results));
        return results;
    }

    /**
     * 서바이벌 게임 매칭 및 시작
     */
    @Override
    public String registMatchmaking(int roomId, String category) {
        String strRoomId = String.valueOf(roomId);
        String roomKey = redisUtil.getRoomInfoKey(roomId);
        String strGameId = strRoomId + GAME_DEFAULT_ID;

        String matchKey = MATCH_KEY + category;
        Map<String, Integer> matchRooms = new HashMap<>();

        String playersKey = redisUtil.getPlayersKey(roomId);
        int playerCount = redisUtil.getPlayers(playersKey).size();

        // 게임 시작 여부 확인
        if (playerCount < 2) {
            // 대기실 인원이 10명 미만이면, 매칭 등록 후 게임 시작 여부를 다시 확인한다
            redisTemplate.opsForHash().put(matchKey, strRoomId, playerCount);

            // 매칭 대기자가 10명 이상이면  게임 시작
            Map<String, Integer> existRooms = redisTemplate.opsForHash().entries(matchKey);
            int totalPlayer = existRooms.values().stream().reduce(0, Integer::sum);
            log.info("[registMatchMaking] 카테고리의 매칭 큐 : {}명", totalPlayer);

            // 매칭 대기자가 10명 미만이면 기다린다
            if (totalPlayer < 2) {
                messagingTemplate.convertAndSend(ROOM_CHAT_DESTINATION + roomId,
                    MessageDto.of(SERVER_SENDER, "최소 인원 수가 부족해 서바이벌 게임 매칭을 시작합니다.",
                        MessageType.CHAT));
                // 대기실 상태 변경 (WAITING -> MATHING)
                redisUtil.modifyRoomState(roomKey, GameState.MATCHING);
                return null;
            }

            // 매칭이 완료되면 매칭 큐를 초기화한다
            matchRooms.putAll(existRooms);
            redisTemplate.unlink(matchKey);
        } else {
            // 대기실 인원이 10명 이상이면, 바로 게임을 시작한다
            matchRooms.put(strRoomId, playerCount);
        }

        // 서바이벌 게임 준비
        // 임시 게임 대기실을 생성하고 모든 플레이어를 등록한다
        int gameId = Integer.parseInt(strGameId);
        int hostId = redisUtil.getRoomInfo(roomKey).getHostId();
        RoomInfoDto gameRoomInfoDto = RoomInfoDto.builder()
            .title("게임 진행 대기실")
            .gameMode(String.valueOf(ModeType.SURVIVAL))
            .roomId(gameId)
            .category(category)
            .hostId(hostId)
            .build();

        Map<String, PlayerInfoDto> matchPlayers = new HashMap<>();
        matchRooms.entrySet().forEach((entry) -> {
            String playerKey = redisUtil.getPlayersKey(Integer.parseInt(entry.getKey()));
            Map<String, PlayerInfoDto> players = redisUtil.getPlayersInfo(playerKey);
            matchPlayers.putAll(players);
        });

        redisTemplate.opsForValue().set(redisUtil.getRoomInfoKey(gameId), gameRoomInfoDto);
        redisTemplate.opsForHash().putAll(redisUtil.getPlayersKey(gameId), matchPlayers);

        // 게임 데이터 삭제 후, 초기화
        quizService.initGame(gameId, hostId, ModeType.SURVIVAL);
        redisTemplate.opsForHash().putAll(getMatchRoomKey(gameId), matchRooms);

        // 게임 시작
        matchRooms.entrySet().forEach(entry -> {
            // 대기실 상태 변경 (WAITING => INPROGRESS)
            int matchRoomId = Integer.parseInt(entry.getKey());
            redisUtil.modifyRoomState(redisUtil.getRoomInfoKey(matchRoomId), GameState.INPROGRESS);

            // 임시 게임 대기실 ID, 게임 플레이어 정보를 메세지로 전송
            messagingTemplate.convertAndSend(
                ROOM_CHAT_DESTINATION + matchRoomId,
                MessageDto.of(SERVER_SENDER, "매칭을 완료했습니다. 게임을 시작합니다 ♪(´▽｀)", MessageType.START,
                    new RoomEnterRes(matchPlayers, gameRoomInfoDto)));
        });

        return strGameId;
    }

    /**
     * 서바이벌 게임 매칭 취소
     */
    @Override
    public void cancelMatchmaking(int roomId, String category) {
        // 매칭 큐에서 삭제
        String matchKey = MATCH_KEY + category;
        String strRoomId = String.valueOf(roomId);
        redisTemplate.opsForHash().delete(matchKey, strRoomId);

        // 대기실 상태 변경 (MATCHING -> WAITING)
        redisUtil.modifyRoomState(redisUtil.getRoomInfoKey(roomId), GameState.WAITING);

        // 매칭 취소 메세지 전송
        messagingTemplate.convertAndSend(ROOM_CHAT_DESTINATION + roomId,
            MessageDto.of(SERVER_SENDER, "매칭이 취소되었습니다.", MessageType.CHAT));
    }

    private String getSurviveKey(int roomId) {
        return String.format("rooms:%d:survivors", roomId);
    }

    private String getEliminatedKey(int roomId) {
        return String.format("rooms:%d:eliminated", roomId);
    }

    private String getMatchRoomKey(int roomId) {
        return String.format("rooms:%d:matches", roomId);
    }

    private String getGameDestination(int roomId) {
        return String.format("/sub/info/game/%d", roomId);
    }

}
