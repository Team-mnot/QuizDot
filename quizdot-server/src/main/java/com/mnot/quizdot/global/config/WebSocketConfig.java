package com.mnot.quizdot.global.config;

import com.mnot.quizdot.global.jwt.JWTUtil;
import com.mnot.quizdot.global.util.RedisUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
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
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final ApplicationContext applicationContext;

    public WebSocketConfig(ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Message Broker 설정
        ThreadPoolTaskScheduler taskScheduler = new ThreadPoolTaskScheduler();
        taskScheduler.initialize();

        registry.setApplicationDestinationPrefixes(("/pub/chat")) // 클라이언트→서버 PREFIX
            .enableSimpleBroker("/sub"); // 서버→클라이언트 PREFIX
//            .setHeartbeatValue(new long[]{1000, 1000}) // 하트비트 1초로 설정
//            .setTaskScheduler(taskScheduler); // 하트비트 시간 설정하기 위해서 스케줄러 추가
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
                RedisUtil redisUtil = applicationContext.getBean(RedisUtil.class);
                JWTUtil jwtUtil = applicationContext.getBean(JWTUtil.class);
                return new CustomWebSocketHandlerDecorator(handler, redisUtil, jwtUtil);
            }
        });
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        // 웹소켓 연결 시 인증 헤더를 전달하기 위해 인터셉터 등록
        registration.interceptors(customChannelInterceptor());
    }

    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE + 99)
    public ChannelInterceptor customChannelInterceptor() {
        // Channel Interceptor를 Spring Security보다 앞쪽 순서에 설정
        return new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor =
                    MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
                if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                    String accessToken = accessor.getFirstNativeHeader("access");
                    if (accessToken != null) {
                        log.info("access token 있다 : {}", accessToken);
                        // Access token을 세션 속성에 저장
                        accessor.getSessionAttributes().put("access", accessToken);
                    } else {
                        log.info("access token 없다");
                    }
                }
                return message;
            }
        };
    }
}
