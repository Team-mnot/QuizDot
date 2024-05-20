package com.mnot.quizdot.global.util;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

@Component
public class SessionManager {

    private final ConcurrentMap<String, WebSocketSession> sessionMap = new ConcurrentHashMap<>();

    public void addSession(String sessionId, WebSocketSession session) {
        sessionMap.put(sessionId, session);
    }

    public void removeSession(String sessionId) {
        sessionMap.remove(sessionId);
    }

    public void closeSession(String sessionId) throws IOException {
        WebSocketSession session = sessionMap.get(sessionId);
        if (session != null && session.isOpen()) {
            session.close();
        }
    }
}
