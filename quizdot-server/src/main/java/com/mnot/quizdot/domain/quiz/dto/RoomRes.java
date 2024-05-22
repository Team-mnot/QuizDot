package com.mnot.quizdot.domain.quiz.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.redis.core.RedisHash;

@Getter
@Setter
@NoArgsConstructor
@RedisHash
public class RoomRes {

    // 방 번호
    private int roomId;

    @Builder
    public RoomRes(int roomId) {
        this.roomId = roomId;
    }
}
