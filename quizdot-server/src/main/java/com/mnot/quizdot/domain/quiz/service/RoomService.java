package com.mnot.quizdot.domain.quiz.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mnot.quizdot.domain.quiz.dto.RoomReq;
import com.mnot.quizdot.domain.quiz.dto.RoomRes;

public interface RoomService {

    RoomRes createRoom(int channelId, int hostId, RoomReq roomReq) throws JsonProcessingException;

}
