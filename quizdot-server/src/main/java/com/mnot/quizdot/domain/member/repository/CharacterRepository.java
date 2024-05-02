package com.mnot.quizdot.domain.member.repository;

import com.mnot.quizdot.domain.member.dto.CharacterListDto;
import com.mnot.quizdot.domain.member.entity.Character;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CharacterRepository extends JpaRepository<Character, Integer> {

    @Query(
        "SELECT new com.mnot.quizdot.domain.member.dto.CharacterListDto(c.id, c.name) "
            + "FROM MemberCharacter mc JOIN mc.character c "
            + "WHERE mc.member.id = :memberId")
    List<CharacterListDto> findAllCharacterByMemberId(int memberId);

}
