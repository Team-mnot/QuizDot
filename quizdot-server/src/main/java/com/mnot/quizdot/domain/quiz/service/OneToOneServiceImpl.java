package com.mnot.quizdot.domain.quiz.service;

import com.mnot.quizdot.domain.member.entity.Member;
import com.mnot.quizdot.domain.member.entity.ModeType;
import com.mnot.quizdot.domain.member.entity.MultiRecord;
import com.mnot.quizdot.domain.member.repository.MemberRepository;
import com.mnot.quizdot.domain.member.repository.MultiRecordRepository;
import com.mnot.quizdot.domain.quiz.dto.MessageDto;
import com.mnot.quizdot.domain.quiz.dto.MessageType;
import com.mnot.quizdot.domain.quiz.dto.QuizRes;
import com.mnot.quizdot.domain.quiz.dto.ResultDto;
import com.mnot.quizdot.domain.quiz.dto.ScoreDto;
import com.mnot.quizdot.domain.quiz.dto.SubmitDto;
import com.mnot.quizdot.domain.quiz.entity.Quiz;
import com.mnot.quizdot.domain.quiz.repository.QuizRepository;
import com.mnot.quizdot.global.result.error.ErrorCode;
import com.mnot.quizdot.global.result.error.exception.BusinessException;
import com.mnot.quizdot.global.util.RedisUtil;
import com.mnot.quizdot.global.util.TitleUtil;
import java.util.ArrayList;
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
@Transactional
@Slf4j
public class OneToOneServiceImpl implements OneToOneService {

    private static final String SERVER_SENDER = "SYSTEM";
    private static final int EXP = 300;
    private final RedisUtil redisUtil;
    private final RedisTemplate redisTemplate;
    private final SimpMessagingTemplate messagingTemplate;
    private final QuizRepository quizRepository;
    private final MultiRecordRepository multiRecordRepository;
    private final MemberRepository memberRepository;
    private final TitleUtil titleUtil;

    @Override
    public void selectQuestion(int roomId, int questionId, int memberId) {
        //방번호 가져오기
        String strRoomId = String.valueOf(roomId);
        //제출 테이블키(submit+방번호)
        String submitKey = redisUtil.getSubmitKey(roomId);
        //퀴즈리스트 키
        String quizKey = String.format("rooms:%s:quiz", strRoomId);

        //퀴즈가 존재하는지 체크
        if (!quizRepository.existsById(questionId)) {
            throw new BusinessException(ErrorCode.NOT_FOUND_QUIZ);
        }
        Set<Integer> quizList = redisTemplate.opsForSet().members(quizKey);
        log.info("Quiz List {}: {}", strRoomId, quizList);
        if (!quizList.contains(questionId)) {
            throw new BusinessException(ErrorCode.NOT_EXSITS_LIST);
        }

        String memberKey = redisUtil.getPlayersKey(roomId);
        List<Integer> players = redisUtil.getPlayers(memberKey);
        //해당 방에 있는 유저가 맞는지 체크
        if (!players.contains(memberId)) {
            throw new BusinessException(ErrorCode.NOT_EXISTS_IN_ROOM);
        }

        //선택한 문제 추가하기
        redisTemplate.opsForSet().add(submitKey, new SubmitDto(strRoomId, questionId, memberId));

        long submitCount = redisUtil.checkSubmit(submitKey);

        if (submitCount == 2) {
            Set<SubmitDto> submitDtoSet = redisTemplate.opsForSet().members(submitKey);
            for (SubmitDto sender : submitDtoSet) {
                for (SubmitDto receiver : submitDtoSet) {
                    if (sender.getMemberId() != receiver.getMemberId()) {
                        log.info("퀴즈ID값 체크 : {}", receiver.getQuestionId());
                        Quiz quiz = quizRepository.findById(receiver.getQuestionId())
                            .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND_QUIZ));
                        QuizRes quizRes = new QuizRes();
                        quizRes.setId(sender.getQuestionId());
                        quizRes.setQuestion(quiz.getQuestion());
                        quizRes.setHint(quiz.getHint());
                        quizRes.setImagePath(quiz.getImagePath());
                        quizRes.setCategory(quiz.getCategory());
                        quizRes.setQuestionType(quiz.getQuestionType());
                        quizRes.setDescription(quiz.getDescription());
                        quizRes.setAnswers(quiz.getAnswers().stream()
                            .map(answer -> answer.getAnswer())
                            .collect(Collectors.toList()));
                        log.info("memberId : {}", sender.getMemberId());
                        // 상대방의 문제 정보 조회
                        messagingTemplate.convertAndSend(
                            getGameDestination(roomId) + "/select/" + receiver.getMemberId(),
                            MessageDto.of(SERVER_SENDER,
                                MessageType.SUBMIT, quizRes));
                    }
                }
            }
            //sumbit 삭제하기
            redisTemplate.delete(submitKey);
        }
    }

    @Override
    public void updateScores(int roomId, int memberId, int isCorrect) {

        String memberKey = redisUtil.getPlayersKey(roomId);
        String boardKey = redisUtil.getBoardKey(roomId);
        List<Integer> players = redisUtil.getPlayers(memberKey);

        if (!players.contains(memberId)) {
            throw new BusinessException(ErrorCode.NOT_EXISTS_IN_ROOM);
        }

        int enemyPlayerId = 0;
        for (int i : players) {
            if (i != memberId) {
                enemyPlayerId = i;
            }
        }
        if (enemyPlayerId == 0) {
            throw new BusinessException(ErrorCode.NOT_EXISTS_IN_ROOM);
        }

        Double curScore = (isCorrect == 1) ? redisTemplate.opsForZSet()
            .incrementScore(boardKey, enemyPlayerId, -1)
            : redisTemplate.opsForZSet().score(boardKey, enemyPlayerId);

        if (curScore == null) {
            throw new BusinessException(ErrorCode.NOT_EXSITS_BOARD);
        }

        // 실시간 점수 업데이트 메시지 보내기
        ScoreDto updatedScore = new ScoreDto(enemyPlayerId, curScore.longValue());
        messagingTemplate.convertAndSend(getGameDestination(roomId),
            MessageDto.of(SERVER_SENDER, MessageType.UPDATE, updatedScore));

        if (curScore <= 0) {
            messagingTemplate.convertAndSend(getGameDestination(roomId),
                MessageDto.of(SERVER_SENDER, "플레이어중 한명의 체력이 0이 되었습니다", MessageType.EXIT));
        }
    }

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

        List<MultiRecord> multiRecordList = multiRecordRepository.findAllByMember_IdAndMode(
            memberIdList,
            ModeType.NORMAL);

        Map<Integer, MultiRecord> multiRecordMap = multiRecordList.stream()
            .collect(Collectors.toMap(multiRecord -> multiRecord.getMember().getId(),
                multiRecord -> multiRecord));

        List<ResultDto> resultDtoList = new ArrayList<>();

        if (scores != null) {
            int rank = 1;
            double curScore = -1;
            for (TypedTuple<Integer> score : scores) {
                int id = score.getValue();
                Member member = memberMap.get(id);
                MultiRecord multiRecord = multiRecordMap.get(id);
                curScore = score.getScore();

                int curLevel = 0;
                int point = -1;
                multiRecord.updateRecord(rank == 1 ? 1 : 0, 1);
                if (rank == 1) {
                    curLevel = member.updateReward(EXP, EXP);
                    point = EXP;
                } else {
                    if (member.getPoint() - EXP < 0) {
                        curLevel = member.updateReward(0, EXP);
                    } else {
                        curLevel = member.updateReward(-EXP, EXP);
                    }
                    point = -EXP;
                }

                //칭호 확인
                List<String> unlockList = titleUtil.checkRequirment(id, ModeType.ILGITO);
                if (!unlockList.isEmpty()) {
                    messagingTemplate.convertAndSend(getGameDestination(roomId) + "/title/" + id,
                        MessageDto.of(SERVER_SENDER, "칭호가 해금되었습니다", MessageType.TILE, unlockList));
                }
                ResultDto resultDto = ResultDto.builder()
                    .id(id)
                    .level(member.getLevel())
                    .curLevel(curLevel)
                    .nickname(member.getNickname())
                    .rank(rank)
                    .score((int) curScore)
                    .point(point)
                    .curExp(member.getExp())
                    .build();
                resultDtoList.add(resultDto);
                rank++;
            }
        }
        messagingTemplate.convertAndSend(getGameDestination(roomId),
            MessageDto.of(SERVER_SENDER, "리워드 지급 및 결과 계산이 완료되었습니다.", MessageType.REWARD,
                resultDtoList));
        return resultDtoList;
    }

    private String getGameDestination(int roomId) {
        return String.format("/sub/info/game/%d", roomId);
    }
}