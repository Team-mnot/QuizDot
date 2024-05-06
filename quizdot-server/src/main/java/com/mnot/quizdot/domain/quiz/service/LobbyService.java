package com.mnot.quizdot.domain.quiz.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mnot.quizdot.domain.quiz.dto.ActiveUserDto;
import com.mnot.quizdot.domain.quiz.dto.Channelnfo;
import com.mnot.quizdot.domain.quiz.dto.RoomInfoDto;
import com.mnot.quizdot.domain.quiz.dto.RoomReq;
import com.mnot.quizdot.domain.quiz.dto.RoomRes;
import java.util.List;

public interface LobbyService {

    RoomRes createRoom(int channelId, int hostId, RoomReq roomReq) throws JsonProcessingException;

    void modifyRoomNumList(int channelId, int roomId, boolean state);

    List<ActiveUserDto> getActiveUserList(int channelId, int memberId) throws JsonProcessingException;

    List<RoomInfoDto> getRoomList(int channelId) throws JsonProcessingException;

    List<Channelnfo> getChannelList();

    void checkAvailable(int channelId);
}
