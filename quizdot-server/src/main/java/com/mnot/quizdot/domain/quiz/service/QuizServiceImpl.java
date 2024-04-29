package com.mnot.quizdot.domain.quiz.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mnot.quizdot.domain.quiz.dto.QuizListRes;
import com.mnot.quizdot.domain.quiz.dto.QuizParam;
import com.mnot.quizdot.domain.quiz.dto.QuizRes;
import com.mnot.quizdot.domain.quiz.entity.CategoryType;
import com.mnot.quizdot.domain.quiz.repository.QuizRepository;
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

    private final ObjectMapper objectMapper;
    private final QuizRepository quizRepository;
    private final RedisTemplate redisTemplate;

    /**
     * 퀴즈 문제 리스트 조회 중복 출제를 방지하기 위해 퀴즈 목록을 REDIS에서 관리
     */
    @Override
    public QuizListRes getQuizzes(int roomNum, QuizParam quizParam) {
        // 이미 출제된 퀴즈 리스트 조회
        String key = String.format("rooms:%d:quiz", roomNum);
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
    
}
