package com.mnot.quizdot.domain.member.repository;

import com.mnot.quizdot.domain.member.entity.MemberCharacter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberCharacterRepository extends JpaRepository<MemberCharacter, Integer> {


}
