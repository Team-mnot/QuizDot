package com.mnot.quizdot.domain.member.service;

import com.mnot.quizdot.domain.member.dto.CustomMemberDetail;
import com.mnot.quizdot.domain.member.dto.JoinDto;
import com.mnot.quizdot.domain.member.entity.Member;

public interface MemberService {

    //회원가입
    void joinMember(JoinDto joinDto);

    //게스트로 로그인
    void joinGuest();

    //회원 탈퇴
    void deleteMember(Member member);

    //기존 비밀번호 확인
    void checkPassword(CustomMemberDetail member, String password);

    //비밀번호 변경
    void changePassword(CustomMemberDetail member, String password, String chkPassword);
}
