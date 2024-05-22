package com.mnot.quizdot.domain.quiz.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ChannelInfo {
    private int channelId;
    // 동시 접속자
    private long activeUserCount;
    // 채널 수용 가능 인원
    private long totalAvailable;

    @Builder
    public ChannelInfo(int channelId, long activeUserCount, long totalAvailable) {
        this.channelId = channelId;
        this.activeUserCount = activeUserCount;
        this.totalAvailable = totalAvailable;
    }
}
