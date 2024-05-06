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

    private static final String SERVER_SENDER = "SYSTEM";
    private final RedisTemplate redisTemplate;
    private final RedisUtil redisUtil;
    private final SimpMessagingTemplate messagingTemplate;
    private final MemberRepository memberRepository;

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
        messagingTemplate.convertAndSend("/sub/info/game/" + roomId,
            MessageDto.of(SERVER_SENDER, "리워드 지급 및 결과 계산이 완료되었습니다.",
                MessageType.EXIT, resultDtoList));
        return resultDtoList;
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
