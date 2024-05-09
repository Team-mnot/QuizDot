package com.mnot.quizdot.domain.quiz.service;

import com.mnot.quizdot.domain.quiz.dto.RoomEnterRes;
import com.mnot.quizdot.domain.quiz.dto.RoomReq;

public interface RoomService {

    void modifyRoomInfo(int roomId, int memberId, RoomReq roomReq);

    RoomEnterRes enterRoom(int roomId, int memberId);

    void leaveRoom(int roomId, String memberId);

    String inviteRoom(int roomId, int memberId);

    RoomEnterRes enterInvitedRoom(String encodedParam, int memberId);
}
