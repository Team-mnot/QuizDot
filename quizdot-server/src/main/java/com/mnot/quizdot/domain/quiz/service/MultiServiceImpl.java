package com.mnot.quizdot.domain.quiz.service;

import com.mnot.quizdot.domain.member.entity.Member;
import com.mnot.quizdot.domain.member.repository.MemberRepository;
import com.mnot.quizdot.domain.quiz.dto.MessageDto;
import com.mnot.quizdot.domain.quiz.dto.MessageType;
import com.mnot.quizdot.domain.quiz.dto.ResultDto;
import com.mnot.quizdot.domain.quiz.dto.ScoreDto;
import com.mnot.quizdot.global.result.error.ErrorCode;
import com.mnot.quizdot.global.result.error.exception.BusinessException;
import com.mnot.quizdot.global.util.RedisUtil;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.data.redis.core.ZSetOperations.TypedTuple;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class MultiServiceImpl implements MultiService {

    private static final String SERVER_SENDER = "SYSTEM";
    private final RedisUtil redisUtil;
    private final RedisTemplate redisTemplate;
    private final SimpMessagingTemplate messagingTemplate;
    private final MemberRepository memberRepository;

    /**
     * 멀티 점수 업데이트 (문제를 맞힌 순서에 따라 점수 업데이트)
     */
    @Override
    public void updateScores(int roomId, int questionId, String memberId) {
        // 나의 제출 순위 조회
        String stageKey = String.format("rooms:%d:%d", roomId, questionId);
        if (redisTemplate.opsForList().lastIndexOf(stageKey, memberId) != null) {
            throw new BusinessException(ErrorCode.SUBMIT_ALREADY_COMPLETE);
        }

        Long size = redisTemplate.opsForList().rightPush(stageKey, memberId);

        // 스테이지 점수 부여
        int score = (size >= 3) ? 70 : (int) (100 - ((size - 1) * 10));
        String boardKey = redisUtil.getBoardKey(roomId);
        Long newScore = redisTemplate.opsForZSet().incrementScore(boardKey, memberId, score)
            .longValue();

        log.info("[updateScores] Member : {}, Rank : {}, Score : {}", memberId, size, score);

        // 다른 플레이어들에게 실시간 점수 업데이트 메시지 보내기
        ScoreDto updatedScore = new ScoreDto(memberId, newScore);
        messagingTemplate.convertAndSend("/sub/info/game/" + roomId,
            MessageDto.of(memberId, MessageType.UPDATE, updatedScore));

        // TODO: 전체 플레이어가 풀었을 경우 패스 메세지 보내기
    }

    /**
     * 결과에 따라 경험치 및 포인트 업데이트, 결과 정보 제공
     */

    @Override
    public List<ResultDto> exitGame(int roomId, int memberId) {
        log.info("계산 시작 : START");
        String boardKey = redisUtil.getBoardKey(roomId);
        redisUtil.checkHost(roomId, memberId);
        log.info("roomKey : {}", boardKey);
        Set<TypedTuple<String>> scores = redisTemplate.opsForZSet()
            .reverseRangeWithScores(boardKey, 0, -1);

        List<ResultDto> resultDtoList = new ArrayList<>();
        int rank = 1;
        int sameScoreCount = 1;

        if (scores != null) {
            //총 인원 수
            int totalPlayer = scores.size();
            double curScore = -1;
            int exp;
            for (ZSetOperations.TypedTuple<String> score : scores) {
                String id = score.getValue();
                Member member = memberRepository.findById(Integer.parseInt(id))
                    .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND_MEMBER));
                double memberScore = score.getScore();

                if (curScore != -1 && curScore != memberScore) {
                    rank += sameScoreCount;
                    sameScoreCount = 1;
                } else if (curScore == memberScore) {
                    sameScoreCount++;
                }

                curScore = memberScore;
                exp = (totalPlayer + 1 - rank) * 100;

                member.updateReward(member.getPoint() + exp, member.getExp() + exp);

                ResultDto resultDto = ResultDto.builder()
                    .id(Integer.parseInt(id))
                    .level(member.getLevel())
                    .nickname(member.getNickname())
                    .rank(rank)
                    .score((int) curScore)
                    .point(exp)
                    .exp(exp)
                    .curExp(member.getExp())
                    .build();
                resultDtoList.add(resultDto);
            }
        }
        log.info("resultDtoList 확인 : {}", resultDtoList);
        messagingTemplate.convertAndSend("/sub/info/game/" + roomId,
            MessageDto.of(SERVER_SENDER, "리워드 지급 및 결과 계산이 완료되었습니다.", MessageType.EXIT,
                resultDtoList));
        log.info("계산 시작 : COMPLETE");
        return resultDtoList;
    }
}
