package com.mnot.quizdot.domain.member.repository;

import com.mnot.quizdot.domain.member.entity.Avatar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AvatarRepository extends JpaRepository<Avatar, Integer> {

}
