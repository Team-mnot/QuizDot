package com.mnot.quizdot.domain.quiz.dto;

public enum MessageType {
    CHAT, // 채팅 메시지
    MODIFY, // 게임 대기실 정보 변경
    ENTER, // 게임 대기실 입장
    LEAVE, // 게임 대기실 퇴장
    START, // 게임 시작
    PASS, // 문제 패스
    STAGE_RESULT, // 스테이지 결과
    RESURRECT, // 탈락자 부활
    UPDATE, // 스테이지 결과 업데이트
    EXIT, //게임 종료
    REWARD, //결과에 따른 리워드 지급
    TILE //칭호가 해금이 되었음을 알림
}
