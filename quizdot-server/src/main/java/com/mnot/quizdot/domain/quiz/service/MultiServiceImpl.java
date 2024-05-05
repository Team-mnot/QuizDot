package com.mnot.quizdot.domain.quiz.service;

import com.mnot.quizdot.domain.quiz.dto.MessageDto;
import com.mnot.quizdot.domain.quiz.dto.MessageType;
import com.mnot.quizdot.domain.quiz.dto.ScoreDto;
import com.mnot.quizdot.global.result.error.ErrorCode;
import com.mnot.quizdot.global.result.error.exception.BusinessException;
import com.mnot.quizdot.global.util.RedisUtil;
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
public class MultiServiceImpl implements MultiService {

    private final RedisUtil redisUtil;
    private final RedisTemplate redisTemplate;
    private final SimpMessagingTemplate messagingTemplate;

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

}
