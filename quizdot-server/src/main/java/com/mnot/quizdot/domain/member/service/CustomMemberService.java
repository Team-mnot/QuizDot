package com.mnot.quizdot.domain.member.service;

import com.mnot.quizdot.domain.member.dto.CustomMemberDetail;
import com.mnot.quizdot.domain.member.entity.Member;
import com.mnot.quizdot.domain.member.repository.MemberRepository;
import com.mnot.quizdot.global.result.error.ErrorCode;
import com.mnot.quizdot.global.result.error.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomMemberService implements UserDetailsService {

    private final MemberRepository memberRepository;

    @Override
    public UserDetails loadUserByUsername(String memberId) throws UsernameNotFoundException {

        log.info("멤버 정보 가져오기 : START");
        Member member = memberRepository.findByMemberId(memberId);
        log.info("memberId : {}", memberId);
        if (member == null) {
            throw new BusinessException(ErrorCode.ENTITY_NOT_FOUND);
        }
        log.info("멤버 정보 가져오기 : COMPLETE");
        return new CustomMemberDetail(member);
    }
}
