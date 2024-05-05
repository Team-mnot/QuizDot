package com.mnot.quizdot.domain.quiz.dto;

import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LobbyRes {
    private int channelId;
    private List<ActiveUserDto> activeUserDtos;
    private List<RoomInfoDto> roomInfoDtos;

    @Builder
    public LobbyRes(int channelId, List<ActiveUserDto> activeUserDtos, List<RoomInfoDto> roomInfoDtos) {
        this.channelId = channelId;
        this.activeUserDtos = activeUserDtos;
        this.roomInfoDtos = roomInfoDtos;
    }
}
