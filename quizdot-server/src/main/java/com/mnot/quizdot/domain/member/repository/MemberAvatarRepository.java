package com.mnot.quizdot.domain.member.repository;

import com.mnot.quizdot.domain.member.entity.MemberAvatar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberAvatarRepository extends JpaRepository<MemberAvatar, Integer> {


}
