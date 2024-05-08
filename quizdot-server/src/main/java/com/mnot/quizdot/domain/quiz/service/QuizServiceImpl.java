package com.mnot.quizdot.domain.quiz.service;

import com.mnot.quizdot.domain.member.entity.ModeType;
import com.mnot.quizdot.domain.quiz.dto.MessageDto;
import com.mnot.quizdot.domain.quiz.dto.MessageType;
import com.mnot.quizdot.domain.quiz.dto.QuizListRes;
import com.mnot.quizdot.domain.quiz.dto.QuizParam;
import com.mnot.quizdot.domain.quiz.dto.QuizRes;
import com.mnot.quizdot.domain.quiz.entity.CategoryType;
import com.mnot.quizdot.domain.quiz.repository.QuizRepository;
import com.mnot.quizdot.global.result.error.ErrorCode;
import com.mnot.quizdot.global.result.error.exception.BusinessException;
import com.mnot.quizdot.global.util.RedisUtil;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.Cursor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class QuizServiceImpl implements QuizService {

    private static final String SERVER_SENDER = "SYSTEM";
    private final RedisTemplate redisTemplate;
    private final QuizRepository quizRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final RedisUtil redisUtil;

    /**
     * 문제 리스트 조회 (중복 출제를 방지하기 위해 퀴즈 목록을 REDIS에서 관리)
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
     * 문제 패스 API (REDIS PASS 유저 집합에 추가, 모든 유저가 PASS 버튼을 누른 경우에는 PASS 메세지 전송)
     */
    @Override
    public void passQuestion(int roomId, int questionId, String memberId, String nickname) {
        String passKey = String.format("rooms:%d:%d:pass", roomId, questionId);

        // 이미 패스한 유저가 시도하는 경우
        if (redisTemplate.opsForSet().isMember(passKey, memberId)) {
            throw new BusinessException(ErrorCode.PASS_ALREADY_COMPLETE);
        }

        // 유저 PK를 REDIS의 PASS 유저 집합에 추가하고 메세지 전송
        redisTemplate.opsForSet().add(passKey, memberId);
        Long passPeople = redisTemplate.opsForSet().size(passKey);

        String memberKey = String.format("rooms:%d:players", roomId);
        Long totalPeople = redisTemplate.opsForHash().size(memberKey);

        if (passPeople == totalPeople) {
            // 모든 유저가 PASS 버튼을 눌렀다면
            messagingTemplate.convertAndSend("/sub/chat/game/" + roomId,
                MessageDto.of(SERVER_SENDER, "모든 유저의 동의 하에 문제가 패스되었습니다.", MessageType.PASS,
                    System.currentTimeMillis()));
        } else {
            // 아직 모든 유저가 PASS 버튼을 누르지 않았다면
            String message = String.format("%s님이 문제를 패스했습니다. [%d명/%d명]", nickname, passPeople,
                totalPeople);
            messagingTemplate.convertAndSend("/sub/chat/game/" + roomId,
                MessageDto.of(SERVER_SENDER, message, MessageType.CHAT));
        }
    }

    /**
     * 게임 시작 (REDIS 초기화)
     */
    @Override
    public void startGame(int roomId, int memberId, ModeType mode) {
        // 방장 권한 체크
        redisUtil.checkHost(roomId, memberId);

        // 현재 대기실 관련 게임 기록이 남아 있다면 초기화
        deleteGame(roomId);

        // 게임 모드에 따라 REDIS 값 초기화
        String boardKey = redisUtil.getBoardKey(roomId);
        String memberKey = redisUtil.getPlayersKey(roomId);
        List<Integer> players = redisUtil.getPlayers(memberKey);

        int defaultValue = (ModeType.NORMAL.equals(mode)) ? 0 : 1;
        players.forEach((playerId) -> redisTemplate.opsForZSet()
            .add(boardKey, String.valueOf(playerId), defaultValue));

        // 모든 플레이어에게 게임 시작을 알린다
        messagingTemplate.convertAndSend("/sub/info/room/" + roomId,
            MessageDto.of(SERVER_SENDER, MessageType.START));
    }

    /**
     * 특정 대기실의 게임 기록 삭제
     */
    public void deleteGame(int roomId) {
        // 스테이지 결과 삭제
        String pattern = String.format("rooms:%d:*:*", roomId);
        Cursor keys = redisTemplate.scan(ScanOptions.scanOptions().match(pattern).build());
        keys.forEachRemaining((key) -> {
            log.info("[deleteGame] key : {}", key);
            redisTemplate.delete(key);
        });

        // 스코어 보드 삭제
        String boardKey = redisUtil.getBoardKey(roomId);
        redisTemplate.delete(boardKey);
    }
}
