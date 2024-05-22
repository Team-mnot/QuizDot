package com.mnot.quizdot.global.config;

import com.mnot.quizdot.global.jwt.JWTUtil;
import com.mnot.quizdot.global.util.SessionUtil;
import com.mnot.quizdot.global.util.SessionManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;
import org.springframework.web.socket.handler.WebSocketHandlerDecoratorFactory;

@Configuration
@EnableWebSocketMessageBroker
@Slf4j
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final CustomChannelInterceptor customChannelInterceptor;
    private final ApplicationContext applicationContext;


    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Message Broker 설정
        ThreadPoolTaskScheduler taskScheduler = new ThreadPoolTaskScheduler();
        taskScheduler.initialize();

        registry.setApplicationDestinationPrefixes(("/pub/chat")) // 클라이언트→서버 PREFIX
            .enableSimpleBroker("/sub") // 서버→클라이언트 PREFIX
            .setHeartbeatValue(new long[]{1000, 1000}) // 하트비트 1초로 설정
            .setTaskScheduler(taskScheduler); // 하트비트 시간 설정하기 위해서 스케줄러 추가
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // WebSocket Stomp Endpoint 등록
        registry.addEndpoint("/ws/chat")
            .setAllowedOriginPatterns("*")
            .withSockJS();
    }

    @Override
    public void configureWebSocketTransport(WebSocketTransportRegistration registration) {
        // WebSocketHandler를 Decorate 패턴으로 확장하여 등록
        registration.addDecoratorFactory(new WebSocketHandlerDecoratorFactory() {
            @Override
            public WebSocketHandler decorate(WebSocketHandler handler) {
                SessionUtil sessionUtil = applicationContext.getBean(SessionUtil.class);
                JWTUtil jwtUtil = applicationContext.getBean(JWTUtil.class);
                SessionManager sessionManager = applicationContext.getBean(SessionManager.class);
                return new CustomWebSocketHandlerDecorator
                    (handler, sessionUtil, jwtUtil, sessionManager);
            }
        });
    }
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        // 웹소켓 연결 시 인증 헤더를 전달하기 위해 인터셉터 등록
        registration.interceptors(customChannelInterceptor);
    }
}
