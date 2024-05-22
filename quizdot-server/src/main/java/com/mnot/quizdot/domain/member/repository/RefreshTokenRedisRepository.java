package com.mnot.quizdot.domain.member.repository;

import com.mnot.quizdot.domain.member.dto.RefreshToken;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RefreshTokenRedisRepository extends CrudRepository<RefreshToken, String> {

    void deleteByRefreshToken(String refresh);

    Boolean existsByrefreshToken(String refresh);

}
