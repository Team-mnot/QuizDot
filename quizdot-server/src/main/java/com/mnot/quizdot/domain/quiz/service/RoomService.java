package com.mnot.quizdot.domain.quiz.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mnot.quizdot.domain.quiz.dto.RoomEnterRes;
import com.mnot.quizdot.domain.quiz.dto.RoomReq;

public interface RoomService {

    void modifyRoomInfo(int roomId, int memberId, RoomReq roomReq) throws JsonProcessingException;

    RoomEnterRes enterRoom(int roomId, int memberId) throws JsonProcessingException;

    void leaveRoom(int roomId, String memberId) throws JsonProcessingException;

}
