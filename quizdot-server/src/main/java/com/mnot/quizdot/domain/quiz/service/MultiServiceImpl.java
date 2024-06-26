package com.mnot.quizdot.domain.quiz.service;

import com.mnot.quizdot.domain.member.entity.Member;
import com.mnot.quizdot.domain.member.entity.ModeType;
import com.mnot.quizdot.domain.member.entity.MultiRecord;
import com.mnot.quizdot.domain.member.repository.MemberRepository;
import com.mnot.quizdot.domain.member.repository.MultiRecordRepository;
import com.mnot.quizdot.domain.quiz.dto.GameState;
import com.mnot.quizdot.domain.quiz.dto.MessageDto;
import com.mnot.quizdot.domain.quiz.dto.MessageType;
import com.mnot.quizdot.domain.quiz.dto.ResultDto;
import com.mnot.quizdot.domain.quiz.dto.ScoreDto;
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
    private static final String GAME_DESTINATION = "/sub/info/game/";
    private final RedisUtil redisUtil;
    private final RedisTemplate redisTemplate;
    private final SimpMessagingTemplate messagingTemplate;
    private final MemberRepository memberRepository;
    private final MultiRecordRepository multiRecordRepository;
    private final TitleUtil titleUtil;

    /**
     * 멀티 점수 업데이트 (문제를 맞힌 순서에 따라 점수 업데이트)
     */
    @Override
    public void updateScores(int roomId, int questionId, int memberId) {
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

        // 다른 플레이어들에게 실시간 점수 업데이gg트 메시지 보내기
        ScoreDto updatedScore = new ScoreDto(memberId, newScore);
        messagingTemplate.convertAndSend(GAME_DESTINATION + roomId,
            MessageDto.of(SERVER_SENDER, MessageType.UPDATE, updatedScore));

        // 모든 플레이어가 답안을 제출하는 경우
        // TODO: 만약 문제가 넘어가고 나서 패스 메세지가 전송되어도 처리하지 않도록 프론트 전달하기
        Long playerCount = redisTemplate.opsForHash().size(redisUtil.getPlayersKey(roomId));
        if (size == playerCount) {
            messagingTemplate.convertAndSend(getGameDestination(roomId),
                MessageDto.of(SERVER_SENDER, "모든 플레이어가 답안을 제출하였습니다.", MessageType.PASS,
                    System.currentTimeMillis()));
//            messagingTemplate.convertAndSend("/sub/chat/game/" + roomId,
//                MessageDto.of(SERVER_SENDER, "모든 플레이어가 답안을 제출하였습니다.", MessageType.CHAT));
        }
    }

    /**
     * 결과에 따라 경험치 및 포인트 업데이트, 결과 정보 제공
     */

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
        int rank = 1;
        int sameScoreCount = 1;

        if (scores != null) {
            //총 인원 수
            int totalPlayer = scores.size();
            double curScore = -1;
            int exp;
            for (ZSetOperations.TypedTuple<Integer> score : scores) {
                int id = score.getValue();
                Member member = memberMap.get(id);
                MultiRecord multiRecord = multiRecordMap.get(id);
                double memberScore = score.getScore();

                if (curScore != -1 && curScore != memberScore) {
                    rank += sameScoreCount;
                    sameScoreCount = 1;
                } else if (curScore == memberScore) {
                    sameScoreCount++;
                }

                curScore = memberScore;
                exp = (totalPlayer + 1 - rank) * 100;

                int curLevel = member.updateReward(exp, exp);
                multiRecord.updateRecord(rank == 1 ? 1 : 0, 1);

                //칭호 확인
                List<String> unlockList = titleUtil.checkRequirment(member, multiRecord,
                    ModeType.NORMAL);
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
                    .point(exp)
                    .curExp(member.getExp())
                    .build();
                resultDtoList.add(resultDto);
            }
        }
        log.info("resultDtoList 확인 : {}", resultDtoList);
        messagingTemplate.convertAndSend(GAME_DESTINATION + roomId,
            MessageDto.of(SERVER_SENDER, "리워드 지급 및 결과 계산이 완료되었습니다.", MessageType.REWARD,
                resultDtoList));

        // 대기실 상태 변경 (INPROGRESS -> WAITING)
        String roomKey = redisUtil.getRoomInfoKey(roomId);
        redisUtil.modifyRoomState(roomKey, GameState.WAITING);
        return resultDtoList;
    }

    private String getGameDestination(int roomId) {
        return String.format("/sub/info/game/%d", roomId);
    }
}
