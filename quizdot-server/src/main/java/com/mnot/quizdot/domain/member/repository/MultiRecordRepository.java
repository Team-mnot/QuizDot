package com.mnot.quizdot.domain.member.repository;

import com.mnot.quizdot.domain.member.entity.ModeType;
import com.mnot.quizdot.domain.member.entity.MultiRecord;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface MultiRecordRepository extends JpaRepository<MultiRecord, Integer> {

    Optional<MultiRecord> findByMemberIdAndMode(int memberId, ModeType mode);


    @Query("SELECT mr FROM MultiRecord mr WHERE mr.member.id IN :memberId AND mr.mode = :mode")
    List<MultiRecord> findAllByMember_IdAndMode(List<Integer> memberId, ModeType mode);

}
