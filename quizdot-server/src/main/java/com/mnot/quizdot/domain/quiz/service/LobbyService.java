package com.mnot.quizdot.domain.quiz.service;

import com.mnot.quizdot.domain.quiz.dto.ActiveUserDto;
import com.mnot.quizdot.domain.quiz.dto.ChannelInfo;
import com.mnot.quizdot.domain.quiz.dto.RoomInfoDto;
import com.mnot.quizdot.domain.quiz.dto.RoomReq;
import com.mnot.quizdot.domain.quiz.dto.RoomRes;
import java.util.List;

public interface LobbyService {

    RoomRes createRoom(int channelId, int hostId, RoomReq roomReq);

<<<<<<< HEAD
    void modifyRoomNumList(int channelId, int roomId, boolean state);

    List<ActiveUserDto> getActiveUserList(int channelId, int memberId);

    List<RoomInfoDto> getRoomList(int channelId);

    List<ChannelInfo> getChannelList();

    void checkAvailable(int channelId);

    void checkPassword(int roomId, String password);

    void exitChannel(int memberId, int channelId);
=======
>>>>>>> 99efda8833edc925298ea8af9cd8da47412c9099
}
