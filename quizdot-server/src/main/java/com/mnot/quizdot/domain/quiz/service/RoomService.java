package com.mnot.quizdot.domain.quiz.service;

import com.mnot.quizdot.domain.quiz.dto.RoomEnterRes;
import com.mnot.quizdot.domain.quiz.dto.RoomReq;

public interface RoomService {

<<<<<<< HEAD
    void modifyRoomInfo(int roomId, int memberId, RoomReq roomReq);

    RoomEnterRes enterRoom(int roomId, int memberId);

    void leaveRoom(int roomId, String memberId);

    String inviteRoom(int roomId, int memberId);

    RoomEnterRes enterInvitedRoom(String encodedParam, int memberId);

    void deleteRoom(int roomId);
=======
    void modifyRoomInfo(int roomId, int memberId, RoomReq roomReq) throws JsonProcessingException;
    // TODO : 방장이 나가는 경우, 다른 회원으로 방장 변경

    RoomEnterRes enterRoom(int roomId, int memberId) throws JsonProcessingException;
>>>>>>> 99efda8833edc925298ea8af9cd8da47412c9099
}
