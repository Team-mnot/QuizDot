package com.mnot.quizdot.domain.member.service;

import com.mnot.quizdot.domain.member.dto.JoinDTO;
import com.mnot.quizdot.domain.member.entity.Member;
import com.mnot.quizdot.domain.member.entity.Role;
import com.mnot.quizdot.domain.member.repository.MemberRepository;
import com.mnot.quizdot.global.result.error.ErrorCode;
import com.mnot.quizdot.global.result.error.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    //비밀번호 암호화
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public void joinMember(JoinDTO joinDTO) {
        //폼에서 받아온 정보들
        String memberId = joinDTO.getMemberId();
        String password = joinDTO.getPassword();
        String nickname = joinDTO.getNickname();
        String hint = joinDTO.getHint();
        //아이디 중복 확인
        Boolean isExistId = memberRepository.existsByMemberId(memberId);
        if (isExistId) {
            throw new BusinessException(ErrorCode.EXISTS_ID_ERROR);
        }
        //닉네임 중복 확인
        Boolean isExistNickname = memberRepository.existsByNickname(nickname);
        if (isExistNickname) {
            throw new BusinessException(ErrorCode.EXISTS_NICKNAME_ERROR);
        }

        //멤버 엔티티 생성
        Member member = Member.builder()
            .memberId(memberId)
            .password(bCryptPasswordEncoder.encode(password))
            .nickname(nickname)
            .hint(hint)
            .role(Role.ROLE_USER)
            .build();

        //멤버 엔티티 저장
        memberRepository.save(member);
    }
}
