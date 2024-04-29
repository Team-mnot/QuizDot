package com.mnot.quizdot.domain.member.repository;

import com.mnot.quizdot.domain.member.entity.ModeType;
import com.mnot.quizdot.domain.member.entity.MultiRecord;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MultiRecordRepository extends JpaRepository<MultiRecord, Integer> {

    Optional<MultiRecord> findByMemberIdAndMode(int memberId, ModeType mode);
}
