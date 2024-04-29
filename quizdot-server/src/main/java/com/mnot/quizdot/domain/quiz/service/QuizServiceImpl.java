package com.mnot.quizdot.domain.quiz.service;

import com.mnot.quizdot.domain.quiz.dto.QuizListRes;
import com.mnot.quizdot.domain.quiz.dto.QuizParam;
import com.mnot.quizdot.domain.quiz.dto.QuizRes;
import com.mnot.quizdot.domain.quiz.entity.CategoryType;
import com.mnot.quizdot.domain.quiz.repository.QuizRepository;
import com.mnot.quizdot.global.result.error.ErrorCode;
import com.mnot.quizdot.global.result.error.exception.BusinessException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class QuizServiceImpl implements QuizService {

    private final QuizRepository quizRepository;
    private final RedisTemplate redisTemplate;

    /**
     * 퀴즈 문제 리스트 조회 중복 출제를 방지하기 위해 퀴즈 목록을 REDIS에서 관리한다
     */
    @Override
    public QuizListRes getQuizzes(int roomId, QuizParam quizParam) {
        // 이미 출제된 퀴즈 리스트 조회
        String key = String.format("rooms:%d:quiz", roomId);
        Set<Integer> quizSet = redisTemplate.opsForSet().members(key);
        List<Integer> quizList = new ArrayList<>(quizSet);

        if (quizList.isEmpty()) {
            quizList.add(-1);
        }

        String category = (CategoryType.RANDOM.equals(quizParam.getCategory())) ? null
            : String.valueOf(quizParam.getCategory());

        // 문제 리스트 조회
        List<Integer> quizIdList = quizRepository.getRandomQuizIdsByQuizParam(
            category, quizParam.getCount(), quizList);

        List<QuizRes> quizListRes = quizRepository.getQuizzesByIds(quizIdList);

        // 중복 출제 방지를 위해 조회한 문제 PK를 REDIS에 저장
        quizListRes
            .forEach(
                (quizRes -> redisTemplate.opsForSet().add(key, String.valueOf(quizRes.getId()))));
        return new QuizListRes(quizListRes);
    }

    /**
     * 문제를 맞힌 순서에 따라 현재 스테이지의 점수를 부여한다
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
        String boardKey = String.format("rooms:%d:board", roomId);
        redisTemplate.opsForZSet().incrementScore(boardKey, memberId, score);

        log.info("[updateScores] Member : {}, Rank : {}, Score : {}", memberId, size, score);
    }

}
