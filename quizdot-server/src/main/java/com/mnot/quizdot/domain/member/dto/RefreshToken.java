package com.mnot.quizdot.domain.member.dto;

import jakarta.persistence.Id;
import lombok.Builder;
import lombok.Getter;
import org.springframework.data.redis.core.RedisHash;


@Builder
@Getter
@RedisHash(value = "refresh", timeToLive = 86400000)
public class RefreshToken {

    @Id
    private int id;

    private String refreshToken;
}
