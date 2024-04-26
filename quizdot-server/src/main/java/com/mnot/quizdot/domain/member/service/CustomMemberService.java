package com.mnot.quizdot.domain.member.service;

import com.mnot.quizdot.domain.member.dto.CustomMemberDetail;
import com.mnot.quizdot.domain.member.entity.Member;
import com.mnot.quizdot.domain.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomMemberService implements UserDetailsService {

    private final MemberRepository memberRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Member member = memberRepository.findByMemberId(username);

        if (member != null) {
            //조회된 멤버 담기
            return new CustomMemberDetail(member);
        }
        return null;
    }
}
