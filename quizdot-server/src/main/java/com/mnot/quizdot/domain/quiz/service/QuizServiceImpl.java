package com.mnot.quizdot.domain.quiz.service;

import com.mnot.quizdot.domain.member.entity.ModeType;
import com.mnot.quizdot.domain.quiz.dto.GameState;
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
import com.mnot.quizdot.global.util.S3Util;
import com.mnot.quizdot.global.util.S3Util.Directory;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.Cursor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.data.redis.core.ZSetOperations.TypedTuple;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

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
    private final S3Util s3Util;

    /**
     * 문제 리스트 조회 (중복 출제를 방지하기 위해 퀴즈 목록을 REDIS에서 관리)
     */
    @Override
    public void getQuizzes(int roomId, QuizParam quizParam) {
        String key = String.format("rooms:%d:quiz", roomId);
        Set<Integer> quizSet = redisTemplate.opsForSet().members(key);
        List<Integer> quizList = new ArrayList<>(quizSet);

        if (quizList.isEmpty()) {
            quizList.add(-1);
        }
        String category = (CategoryType.RANDOM.equals(quizParam.getCategory())) ? null
            : String.valueOf(quizParam.getCategory());
        // 문제 리스트 조회
        List<Integer> quizIdList = quizRepository.getRandomQuizIdsByQuizParam(category,
            quizParam.getCount(), quizList);
        List<QuizRes> quizListRes = quizRepository.getQuizzesByIds(quizIdList);
        Collections.shuffle(quizListRes);

        // 중복 출제 방지를 위해 조회한 문제 PK를 REDIS에 저장
        quizListRes
            .forEach(
                (quizRes -> redisTemplate.opsForSet().add(key, quizRes.getId())));
        switch (quizParam.getModeType()) {
            case NORMAL:
            case SURVIVAL:
                messagingTemplate.convertAndSend("/sub/quiz/game/" + roomId,
                    MessageDto.of(SERVER_SENDER, "조회된 퀴즈 리스트 입니다.", MessageType.QUIZ, quizListRes));
                break;
            case ILGITO:
                String memberKey = redisUtil.getPlayersKey(roomId);
                List<Integer> players = redisUtil.getPlayers(memberKey);
                List<QuizRes> player1 = new ArrayList<>(
                    quizListRes.subList(quizListRes.size() - 3, quizListRes.size()));
                List<QuizRes> player2 = new ArrayList<>(
                    quizListRes.subList(quizListRes.size() - 6, quizListRes.size() - 3));
                messagingTemplate.convertAndSend("/sub/quiz/game/" + roomId + "/" + players.get(0),
                    MessageDto.of(SERVER_SENDER, "조회된 퀴즈 리스트 입니다.", MessageType.QUIZ, player1));
                messagingTemplate.convertAndSend("/sub/quiz/game/" + roomId + "/" + players.get(1),
                    MessageDto.of(SERVER_SENDER, "조회된 퀴즈 리스트 입니다.", MessageType.QUIZ, player2));
                break;
            default:
                throw new BusinessException(ErrorCode.NOT_EXSITS_MODE);
        }
    }

    /**
     * 문제 패스 API (REDIS PASS 유저 집합에 추가, 모든 유저가 PASS 버튼을 누른 경우에는 PASS 메세지 전송)
     */
    @Override
    public void passQuestion(int roomId, int questionId, int memberId, String nickname) {
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

        // 아직 모든 유저가 PASS 버튼을 누르지 않았다면
        messagingTemplate.convertAndSend("/sub/chat/game/" + roomId,
            MessageDto.of(SERVER_SENDER,
                String.format("%s님이 문제를 패스했습니다. [%d명/%d명]", nickname, passPeople,
                    totalPeople), MessageType.CHAT));

        if (passPeople == totalPeople) {
            // 모든 유저가 PASS 버튼을 눌렀다면
            messagingTemplate.convertAndSend("/sub/info/game/" + roomId,
                MessageDto.of(SERVER_SENDER, "모든 유저의 동의 하에 문제가 패스되었습니다.", MessageType.PASS,
                    System.currentTimeMillis()));

//            messagingTemplate.convertAndSend("/sub/chat/game/" + roomId,
//                MessageDto.of(SERVER_SENDER, "모든 유저의 동의 하에 문제가 패스되었습니다.", MessageType.CHAT));
        }

    }

    /**
     * 게임 시작 (REDIS 초기화)
     */
    @Override
    public void startGame(int roomId, int memberId, ModeType mode) {
        // 방장 권한 체크
        redisUtil.checkHost(roomId, memberId);

        // 게임 데이터 초기화
        initGame(roomId, memberId, mode);

        // 대기실 상태 변경 (WAITING -> INPROGRESS)
        String roomKey = redisUtil.getRoomInfoKey(roomId);
        redisUtil.modifyRoomState(roomKey, GameState.INPROGRESS);
        switch (mode) {
            case ILGITO:
                messagingTemplate.convertAndSend("/sub/chat/room/" + roomId,
                    MessageDto.of(SERVER_SENDER, MessageType.ILGITO));
                break;
            case NORMAL:
                messagingTemplate.convertAndSend("/sub/chat/room/" + roomId,
                    MessageDto.of(SERVER_SENDER, MessageType.MULTI));
                break;
        }
    }

    /**
     * 특정 대기실의 게임 기록 삭제
     */
    public void deleteGame(int roomId) {
        // 스테이지 결과 삭제
        String pattern = String.format("rooms:%d:*", roomId);
        Cursor keys = redisTemplate.scan(ScanOptions.scanOptions().match(pattern).build());

        while (keys.hasNext()) {
            String key = (String) keys.next();
            if (!(key.endsWith(":info") || key.endsWith(":players"))) {
                redisTemplate.delete(key);
            }
        }

        // 스코어 보드 삭제
        String boardKey = redisUtil.getBoardKey(roomId);
        redisTemplate.delete(boardKey);
    }

    /**
     * 게임 초기화 (불필요하게 남아 있던 게임 기록 삭제, 게임
     */
    public void initGame(int roomId, int memberId, ModeType mode) {
        // 방장 권한 체크
        redisUtil.checkHost(roomId, memberId);

        // 현재 대기실 관련 게임 기록이 남아 있다면 모두 삭제
        deleteGame(roomId);

        // 게임 모드에 따라 스코어보드 초기화
        String boardKey = redisUtil.getBoardKey(roomId);
        String playerKey = redisUtil.getPlayersKey(roomId);
        List<Integer> players = redisUtil.getPlayers(playerKey);
        Double defaultScore = getDefaultScore(mode);

        Set<TypedTuple<Integer>> defaultScoreSet = new HashSet<>();
        for (int playerId : players) {
            defaultScoreSet.add(TypedTuple.of(playerId, defaultScore));
        }

        redisTemplate.opsForZSet().add(boardKey, defaultScoreSet);
    }

    /**
     * 게임 모드에 따른 스코어보드 초기화 값 리턴
     */
    private Double getDefaultScore(ModeType mode) {
        switch (mode) {
            case SURVIVAL:
                return 1.0;
            case ILGITO:
                return 10.0;
            default:
                return 0.0;
        }
    }

    /**
     * 퀴즈와 정답을 DB에 업로드
     */
    @Transactional
    public List<String> uploadQuizImage(List<MultipartFile> imageFiles) {
        List<String> urlList = new ArrayList<>();
        String imageUrl = "";
        // S3에 이미지 업로드
        for (MultipartFile imageFile : imageFiles) {
            if (imageFile != null && !imageFile.isEmpty()) {
                // 이미지 파일인지 검사
                String contentType = imageFile.getContentType();
                if (contentType == null || !contentType.startsWith("image/")) {
                    throw new BusinessException(ErrorCode.IS_NOT_IMAGE);
                }
                imageUrl = s3Util.uploadFile(imageFile, Directory.QUIZ);
            }
            urlList.add(imageUrl);
        }
        return urlList;
    }
}
