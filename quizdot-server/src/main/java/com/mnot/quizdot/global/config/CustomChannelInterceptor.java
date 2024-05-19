package com.mnot.quizdot.global.config;

import com.mnot.quizdot.global.util.SessionManager;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@EnableScheduling
@Component
@Slf4j
@Order(Ordered.HIGHEST_PRECEDENCE + 99)
public class CustomChannelInterceptor implements ChannelInterceptor {

    private final Map<String, Integer> heartbeatCounts = new ConcurrentHashMap<>();
    private final int MAX_HEARTBEAT_COUNT = 10; // 최대 허용 하트비트 횟수
    private final SessionManager sessionManager;

    public CustomChannelInterceptor(SessionManager sessionManager) {
        this.sessionManager = sessionManager;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
        if (accessor != null) {
            SimpMessageType messageType = accessor.getMessageType();
            switch (messageType) {
                case CONNECT:
                    String accessToken = accessor.getFirstNativeHeader("access");
                    if (accessToken != null) {
                        log.info("access token 있다 : {}", accessToken);
                        // Access token을 세션 속성에 저장
                        accessor.getSessionAttributes().put("access", accessToken);
                    } else {
                        log.info("access token 없다");
                    }
                    break;
                case HEARTBEAT:
                    // HEARTBEAT 메시지 처리
                    log.info("하트비트받았다");
                    handleHeartbeat(accessor);
                    break;
            }
        }
        return message;
    }

    private void handleHeartbeat(StompHeaderAccessor accessor) {
        String sessionId = accessor.getSessionId();
        heartbeatCounts.put(sessionId, 0); // 하트비트 카운트 초기화
    }

    @Scheduled(fixedDelay = 1000) // 1초마다 실행
    public void checkHeartbeat() {
        for (String sessionId : heartbeatCounts.keySet()) {
            Integer count = heartbeatCounts.get(sessionId);
//            log.info("하트비트 못받은 횟수: "+count);
            heartbeatCounts.put(sessionId, ++count);
            if (count > MAX_HEARTBEAT_COUNT) {
                // 연속으로 10번 핑퐁 안되면 세션 종료
                try {
                    sessionManager.closeSession(sessionId);
                } catch (Exception e) {
                    // 세션 종료 실패 처리
                    log.error("세션 종료 실패: {}", e.getMessage());
                }
                log.info("하트비트 핑퐁안됨!!");
                heartbeatCounts.remove(sessionId); // 종료된 세션의 카운트 삭제
            }
        }
    }
}
