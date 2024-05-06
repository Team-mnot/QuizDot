package com.mnot.quizdot.domain.member.service;

import com.mnot.quizdot.domain.member.dto.CustomMemberDetail;
import com.mnot.quizdot.domain.member.dto.JoinDto;
import com.mnot.quizdot.domain.member.dto.MemberInfoDto;

public interface MemberService {

    //회원가입
    void joinMember(JoinDto joinDto);

    //회원 탈퇴
    void deleteMember(CustomMemberDetail member);

    //비밀번호 힌트 체크
    void chkHint(String memberId, String hint);

    //비밀번호 힌트 체크 후 비밀번호 설정
    void findPassword(String memberId, String password, String passwordChk);

    //기존 비밀번호 확인
    void checkPassword(CustomMemberDetail member, String password);

    //비밀번호 변경
    void modifyPassword(CustomMemberDetail member, String password, String chkPassword);

    //유저 정보 조회
    MemberInfoDto getInfo(int memberId);

    //닉네임 변경
    void modifyNickname(CustomMemberDetail member, String nickname);

    //캐릭터 변경
    void modifyCharacter(CustomMemberDetail member, int characterId);

    //칭호 변경
    void modifyTitle(CustomMemberDetail member, int titleId);

    //캐릭터 뽑기
    int gachaCharacter(CustomMemberDetail customMemberDetail);

    //닉네임 색상 뽑기
    String gachaColor(CustomMemberDetail customMemberDetail);

}
