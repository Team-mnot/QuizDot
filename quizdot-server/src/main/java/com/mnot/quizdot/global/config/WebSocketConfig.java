package com.mnot.quizdot.global.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Message Broker 설정
        registry.enableSimpleBroker("/sub"); // 서버→클라이언트 PREFIX
        registry.setApplicationDestinationPrefixes("/pub/chat"); // 클라이언트→서버 PREFIX
    }


    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // WebSocket Stomp Endpoint 등록
        registry.addEndpoint("/ws/chat")
            .setAllowedOriginPatterns("*")
            .withSockJS();
    }
}
