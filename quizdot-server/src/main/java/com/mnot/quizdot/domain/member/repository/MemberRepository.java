package com.mnot.quizdot.domain.member.repository;

import com.mnot.quizdot.domain.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberRepository extends JpaRepository<Member, Integer> {

    //아이디 중복 체크
    Boolean existsByMemberId(String memberId);

    //닉네임 중복 체크
    Boolean existsByNickname(String nickname);

    //로그인 했을 때 아이디로 유저 조회
    Member findByMemberId(String memberId);
    

}
