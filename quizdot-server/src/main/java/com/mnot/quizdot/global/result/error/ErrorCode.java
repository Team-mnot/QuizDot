package com.mnot.quizdot.global.result.error;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    //Global
    INTERNAL_SERVER_ERROR(500, "내부 서버 오류입니다."),
    METHOD_NOT_ALLOWED(405, "허용되지 않은 HTTP method입니다."),
    INPUT_VALUE_INVALID(400, "유효하지 않은 입력입니다."),
    INPUT_TYPE_INVALID(400, "입력 타입이 유효하지 않습니다."),
    HTTP_MESSAGE_NOT_READABLE(400, "request message body가 없거나, 값 타입이 올바르지 않습니다."),
    HTTP_HEADER_INVALID(400, "request header가 유효하지 않습니다."),
    ENTITY_NOT_FOUND(500, "존재하지 않는 Entity입니다."),
    FORBIDDEN_ERROR(403, "작업을 수행하기 위한 권한이 없습니다."),
    IS_NOT_IMAGE(400, "이미지가 아닙니다."),
    JSON_PROCESSING_ERROR(400, " JSON 데이터를 처리할 수 없습니다."),

    //Room
    ROOM_LIMIT_EXCEEDED(409, "채널 내 대기실 생성 한도를 초과하였습니다."),
    ROOM_NOT_FOUND(400, "존재하지 않는 대기실입니다."),
    IS_NOT_HOST(403, "대기실 정보 변경 권한이 없습니다."),
    PLAYER_LIMIT_EXCEEDED(400, "대기실 최대 인원을 초과하였습니다."),
    NOT_EXISTS_IN_ROOM(400, "대기실에 존재하지 않는 회원입니다."),

    // Member
    LOGIN_ERROR(400, "로그인에 실패했습니다."),
    EXISTS_ID_ERROR(400, "이미 존재하는 아이디입니다."),
    EXISTS_NICKNAME_ERROR(400, "이미 존재하는 닉네임입니다."),
    NOT_VALID_ERROR(400, "유효성 검사를 통과하지 못했습니다."),
    NOT_EXISTS_REFRESH_TOKEN_ERROR(400, "refreshToken이 존재하지 않습니다."),
    EXPIRED_REFRESH_TOKEN(400, "refreshToken이 만료되었습니다."),
    IS_NOT_REFRESH_TOKEN(400, "refreshToken이 아닙니다."),
    IS_NOT_EXISTS_REFRESH_TOKEN(400, "refreshToken이 존재하지 않습니다."),
    PASSWORD_DO_NOT_MATCH(400, "비밀번호가 일치하지 않습니다"),
    HINT_DO_NOT_MATCH(400, "비밀번호 힌트가 일치하지 않습니다"),
    RECORD_NOT_FOUND(400, "전적이 없습니다."),
    LOCK_TITLE_ERROR(400, "칭호가 해금되지 않았습니다."),
    GUEST_LOGIN_ERROR(400, "게스트 정보 생성에 실패했습니다"),
    MEMBER_NOT_EXISTS(400, "회원 정보가 존재하지 않습니다."),

    //Game
    SUBMIT_ALREADY_COMPLETE(400, "이미 제출된 결과입니다.");

    private final int status;
    private final String message;
}
