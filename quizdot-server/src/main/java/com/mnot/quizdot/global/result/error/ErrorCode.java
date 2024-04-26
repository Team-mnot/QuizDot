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
    ENTITY_NOT_FOUNT(500, "존재하지 않는 Entity입니다."),
    FORBIDDEN_ERROR(403, "작업을 수행하기 위한 권한이 없습니다."),
    IS_NOT_IMAGE(400, "이미지가 아닙니다."),
    JSON_PROCESSING_ERROR(400, " JSON 데이터를 처리할 수 없습니다."),

    //Room
    ROOM_LIMIT_EXCEEDED(409, "채널 내 방 생성 한도를 초과하였습니다."),

    // Member
    EXISTS_ID_ERROR(400, "이미 존재하는 아이디입니다."),
    EXISTS_NICKNAME_ERROR(400, "이미 존재하는 닉네임입니다."),
    NOT_VALID_ERROR(400, "유효성 검사에서 걸림");

    private final int status;
    private final String message;
}
