package com.mnot.quizdot.domain.quiz.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mnot.quizdot.domain.quiz.dto.RoomReq;

public interface RoomService {

    void modifyRoomInfo(int roomId, int memberId, RoomReq roomReq) throws JsonProcessingException;
    // TODO : 방장이 나가는 경우, 다른 회원으로 방장 변경
}
