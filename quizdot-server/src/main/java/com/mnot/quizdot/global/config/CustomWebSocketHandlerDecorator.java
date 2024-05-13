package com.mnot.quizdot.global.config;

import com.mnot.quizdot.domain.member.dto.CustomMemberDetail;
import com.mnot.quizdot.global.jwt.JWTUtil;
import com.mnot.quizdot.global.result.error.ErrorCode;
import com.mnot.quizdot.global.result.error.exception.BusinessException;
import com.mnot.quizdot.global.util.RedisUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.WebSocketHandlerDecorator;

@Slf4j
public class CustomWebSocketHandlerDecorator extends WebSocketHandlerDecorator {

    private final RedisUtil redisUtil;
    private final JWTUtil jwtUtil;

    public CustomWebSocketHandlerDecorator(WebSocketHandler handler, RedisUtil redisUtil, JWTUtil jwtUtil) {
        super(handler);
        this.redisUtil = redisUtil;
        this.jwtUtil = jwtUtil;
    }

    // 웹소켓 연결
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        super.afterConnectionEstablished(session);
    }

    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
        if (message instanceof TextMessage) {
            TextMessage textMessage = (TextMessage) message;
            // TODO : 필요한 텍스트 메시지 처리 로직 구현
            super.handleMessage(session, textMessage);  // 원래 핸들러의 로직 호출
        } else {
            super.handleMessage(session, message);  // 다른 타입의 메시지에 대해 기본 로직을 수행
        }
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception)
        throws Exception {
        super.handleTransportError(session, exception);
    }

    // 웹소켓 연결 종료
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status)
        throws Exception {
        super.afterConnectionClosed(session, status);
        // 웹소켓 연결이 끊긴 사용자의 데이터 삭제
        String accessToken = (String) session.getAttributes().get("access");
        if(accessToken != null) {
            redisUtil.deleteInactivePlayer(String.valueOf(jwtUtil.getId(accessToken)));
        }
        else {
            throw new BusinessException(ErrorCode.HTTP_HEADER_INVALID);
        }
    }
}
