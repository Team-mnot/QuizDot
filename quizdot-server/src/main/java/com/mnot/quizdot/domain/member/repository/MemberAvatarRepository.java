package com.mnot.quizdot.domain.member.repository;

import com.mnot.quizdot.domain.member.entity.MemberCharacter;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberCharacterRepository extends JpaRepository<MemberCharacter, Integer> {

    @Query("SELECT mc.character.id FROM MemberCharacter mc WHERE mc.member.id = :memberId")
    List<Integer> findCharacterIdsByMemberId(int memberId);

}
