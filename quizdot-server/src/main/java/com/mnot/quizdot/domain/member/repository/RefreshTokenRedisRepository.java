package com.mnot.quizdot.domain.member.repository;

import com.mnot.quizdot.domain.member.dto.RefreshToken;
import org.springframework.data.repository.CrudRepository;

public interface RefreshTokenRedisRepository extends CrudRepository<RefreshToken, Integer> {

}
