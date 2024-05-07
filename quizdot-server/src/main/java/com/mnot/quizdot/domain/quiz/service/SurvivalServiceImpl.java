package com.mnot.quizdot.domain.quiz.service;

import com.mnot.quizdot.domain.member.entity.Member;
import com.mnot.quizdot.domain.member.repository.MemberRepository;
import com.mnot.quizdot.domain.quiz.dto.MessageDto;
import com.mnot.quizdot.domain.quiz.dto.MessageType;
import com.mnot.quizdot.domain.quiz.dto.ResultDto;
import com.mnot.quizdot.global.result.error.ErrorCode;
import com.mnot.quizdot.global.result.error.exception.BusinessException;
import com.mnot.quizdot.global.util.RedisUtil;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
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
    private static final String GAME_DESTINATION = "/sub/info/game/";
    private final RedisTemplate redisTemplate;
    private final RedisUtil redisUtil;
    private final SimpMessagingTemplate messagingTemplate;
    private final MemberRepository memberRepository;

    /**
     * 서바이벌 모드 점수 업데이트
     */
    @Override
    public void updateScores(int roomId, String memberId, int isCorrect) {
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
            messagingTemplate.convertAndSend(GAME_DESTINATION + roomId,
                MessageDto.of(SERVER_SENDER, "모든 생존자가 답안을 제출하였습니다.", MessageType.PASS,
                    System.currentTimeMillis()));
        }
    }

    /**
     * 결과에 따라 경험치 및 포인트 업데이트, 결과 정보 제공
     */
    @Override
    public List<ResultDto> exitGame(int roomId, int memberId) {
        String boardKey = redisUtil.getBoardKey(roomId);
        redisUtil.checkHost(roomId, memberId);

        Set<TypedTuple<String>> scores = redisTemplate.opsForZSet()
            .reverseRangeWithScores(boardKey, 0, -1);

        List<ResultDto> resultDtoList = new ArrayList<>();
        if (scores != null) {
            int totalPlayer = scores.size();
            int exp;
            boolean isFirst = true;
            int rank = 1;
            for (TypedTuple<String> score : scores) {
                String id = score.getValue();
                Member member = memberRepository.findById(Integer.parseInt(id))
                    .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND_MEMBER));
                double memberScore = score.getScore();
                if (isFirst) {
                    exp = ((totalPlayer) + 1) * 200;
                    isFirst = false;
                } else {
                    exp = (int) (Math.abs(memberScore) * 10);
                    rank = 2;
                }

                member.updateReward(member.getPoint() + exp, member.getExp() + exp);

                ResultDto resultDto = ResultDto.builder()
                    .id(Integer.parseInt(id))
                    .level(member.getLevel())
                    .nickname(member.getNickname())
                    .rank(rank)
                    .score(exp)
                    .point(exp)
                    .exp(exp)
                    .curExp(member.getExp())
                    .build();
                resultDtoList.add(resultDto);
            }
        }
        messagingTemplate.convertAndSend(GAME_DESTINATION + roomId,
            MessageDto.of(SERVER_SENDER, "리워드 지급 및 결과 계산이 완료되었습니다.",
                MessageType.EXIT, resultDtoList));
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

        // 생존자 중에서 정답을 맞힌 사람이 없는 경우
        // 생존자는 그대로 다음 문제로 넘어가되, 정답을 맞힌 탈락자는 추가로 부활시킨다
        if (redisTemplate.opsForZSet().count(surviveKey, 0, MAX_SCORE) == 0) {
            String eliminatedKey = getEliminatedKey(roomId);
            Set<TypedTuple<String>> resurrections = redisTemplate.opsForZSet()
                .rangeByScoreWithScores(eliminatedKey, 0, MAX_SCORE);
            Set<TypedTuple<String>> newRessurections = new HashSet<>();
            for (TypedTuple<String> resurrection : resurrections) {
                // 부활 처리
                String playerId = resurrection.getValue();
                // TODO: REDIS 호출 최적화 (현재는 생존자/탈락자 수만큼 반복하며 REDIS 호출)
                Double originalScore = redisTemplate.opsForZSet().score(boardKey, playerId);
                newRessurections.add(TypedTuple.of(resurrection.getValue(), originalScore * (-1)));
            }

            redisTemplate.opsForZSet().add(boardKey, newRessurections);
            log.info("[getStageResult] newRessurections : {}", newRessurections);

            // 부활 메시지 전송
            if (!newRessurections.isEmpty()) {
                messagingTemplate.convertAndSend(GAME_DESTINATION + roomId,
                    MessageDto.of(SERVER_SENDER, newRessurections.size() + "명의 플레이어가 부활했습니다 !!",
                        MessageType.RESURRECT));
            }
        }
        // 생존자 중에서 한 명이라도 정답을 맞히는 경우
        // 맞힌 플레이어는 점수를 부여하고, 정답을 제출하지 않았거나 틀린 플레이어는 탈락 처리한다
        else {
            // 스코어보드에서 생존자들 정보를 가져온다
            Set<TypedTuple<String>> survivors = redisTemplate.opsForZSet()
                .rangeByScoreWithScores(boardKey, 0, MAX_SCORE);
            Set<TypedTuple<String>> newSurvivors = new HashSet<>();
            for (TypedTuple<String> survivor : survivors) {
                String playerId = survivor.getValue();
                Double originalScore = survivor.getScore();
                // TODO: REDIS 호출 최적화 (현재는 생존자/탈락자 수만큼 반복하며 REDIS 호출)
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

        // 최종 스테이지 결과 리턴
        Set<TypedTuple<String>> result = redisTemplate.opsForZSet()
            .rangeByScoreWithScores(boardKey, MIN_SCORE, MAX_SCORE);
        messagingTemplate.convertAndSend("/sub/info/game" + roomId,
            MessageDto.of(SERVER_SENDER, MessageType.STAGE_RESULT, result));
        return result;
    }

    /**
     * 스테이지 결과 초기화
     */
    @Override
    public void initStageResult(int roomId) {

    }

    private String getSurviveKey(int roomId) {
        return String.format("rooms:%d:survivors", roomId);

    }

    private String getEliminatedKey(int roomId) {
        return String.format("rooms:%d:eliminated", roomId);
    }
}
