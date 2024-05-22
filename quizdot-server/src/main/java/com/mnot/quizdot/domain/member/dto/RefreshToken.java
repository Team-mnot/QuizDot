package com.mnot.quizdot.domain.member.dto;

import lombok.Builder;
import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;


@Builder
@Getter
@RedisHash(value = "refresh", timeToLive = 86400000)
public class RefreshToken {

    @Id
    private String memberId;

    private String refreshToken;
}
