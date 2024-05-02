package com.mnot.quizdot.domain.quiz.dto;

import lombok.Getter;

@Getter
public class MessageDto {

    // 발신자
    private final String sender;

    // 메세지
    private final String text;

    // 메세지 타입
    private final MessageType type;

    // 데이터
    private final Object data;
    
    public MessageDto(String sender, String text, MessageType type, Object data) {
        this.sender = sender;
        this.text = text;
        this.type = type;
        this.data = data;
    }

    public static MessageDto of(String sender, String text, MessageType type, Object data) {
        return new MessageDto(sender, text, type, data);
    }

    public static MessageDto of(String sender, String text, MessageType type) {
        return new MessageDto(sender, text, type, "");
    }

    public static MessageDto of(String sender, MessageType type, Object data) {
        return new MessageDto(sender, "", type, data);
    }

}
