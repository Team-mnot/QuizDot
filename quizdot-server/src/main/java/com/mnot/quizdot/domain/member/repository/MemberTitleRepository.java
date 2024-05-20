package com.mnot.quizdot.domain.member.repository;

import com.mnot.quizdot.domain.member.entity.MemberTitle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberTitleRepository extends JpaRepository<MemberTitle, Integer> {

    boolean existsByTitleIdAndMemberIdAndIsGetTrue(int memberId, int titleId);
}
