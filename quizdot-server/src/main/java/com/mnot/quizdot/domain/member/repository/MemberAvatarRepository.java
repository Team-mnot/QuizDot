package com.mnot.quizdot.domain.member.repository;

<<<<<<< HEAD:quizdot-server/src/main/java/com/mnot/quizdot/domain/member/repository/MemberCharacterRepository.java
import com.mnot.quizdot.domain.member.entity.MemberCharacter;
import java.util.List;
=======
import com.mnot.quizdot.domain.member.entity.MemberAvatar;
>>>>>>> 99efda8833edc925298ea8af9cd8da47412c9099:quizdot-server/src/main/java/com/mnot/quizdot/domain/member/repository/MemberAvatarRepository.java
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberAvatarRepository extends JpaRepository<MemberAvatar, Integer> {

    @Query("SELECT mc.character.id FROM MemberCharacter mc WHERE mc.member.id = :memberId")
    List<Integer> findCharacterIdsByMemberId(int memberId);

}
