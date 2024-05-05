package com.mnot.quizdot.domain.quiz.dto;

public enum MessageType {
    CHAT, // 채팅 메시지
    MODIFY, // 게임 대기실 정보 변경
    ENTER, // 게임 대기실 입장
    LEAVE, // 게임 대기실 퇴장
    START, // 게임 시작
    PASS, // 문제 패스
    UPDATE // 스테이지 결과 업데이트
}
