package com.mnot.quizdot.domain.quiz.service;

import com.mnot.quizdot.domain.quiz.dto.MessageDto;
import com.mnot.quizdot.domain.quiz.dto.MessageType;
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
public class SurvivalServiceImpl implements SurvivalService {

    private static final String SERVER_SENDER = "System";
    private final RedisTemplate redisTemplate;
    private final RedisUtil redisUtil;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * 서바이벌 모드 점수 업데이트
     */
    @Override
    public void updateScores(int roomId, String memberId, boolean isCorrect) {
        // 생존 여부 체크
        String boardKey = redisUtil.getBoardKey(roomId);
        Double state = redisTemplate.opsForZSet().score(boardKey, memberId);

        if (state == null) {
            throw new BusinessException(ErrorCode.PLAYER_NOT_EXISTS);
        }

        // 생존 여부, 정답 여부에 따라 다른 집합에서 관리
        String stateKey = null;
        String totalKey = getSurviverTotalKey(roomId);

        if (state > 0) {
            if (isCorrect) {
                // 생존자-정답
                stateKey = getSurviveCorrectKey(roomId);
            } else {
                // 생존자-오답, 탈락 처리도 함께 수행
                stateKey = getSurviverIncorrectKey(roomId);
                redisTemplate.opsForZSet().add(boardKey, memberId, -1);
            }
            redisTemplate.opsForValue().increment(totalKey);
        } else {
            stateKey = getEliminatedCorrectKey(roomId);
        }

        // 탈락자-오답인 경우는 처리하지 않는다
        log.info("[updateScores] stateKey : {}", stateKey);
        if (stateKey != null) {
            redisTemplate.opsForSet().add(stateKey, memberId);
        }

        // 전체 생존자가 풀었을 경우 패스 메세지 송신
        long submitPeople = Long.parseLong(redisTemplate.opsForValue().get(totalKey).toString());
        long survivePeople = redisTemplate.opsForZSet().count(boardKey, 1, 100);
        if (submitPeople == survivePeople) {
            messagingTemplate.convertAndSend("/sub/chat/game/" + roomId,
                MessageDto.of(SERVER_SENDER, "모든 생존자가 제출하여 문제가 패스되었습니다.", MessageType.PASS,
                    System.currentTimeMillis()));
        }
    }

    private String getSurviverTotalKey(int roomId) {
        return String.format("rooms:%d:survivors:total", roomId);
    }

    private String getSurviveCorrectKey(int roomId) {
        return String.format("rooms:%d:survivors:correct", roomId);
    }

    private String getSurviverIncorrectKey(int roomId) {
        return String.format("rooms:%d:survivors:incorrect", roomId);
    }

    private String getEliminatedCorrectKey(int roomId) {
        return String.format("rooms:%d:eliminated:correct", roomId);
    }
}
