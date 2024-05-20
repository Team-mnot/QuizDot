package com.mnot.quizdot.domain.member.dto;

import com.mnot.quizdot.domain.member.entity.Member;
import java.util.ArrayList;
import java.util.Collection;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@RequiredArgsConstructor
public class CustomMemberDetail implements UserDetails {

    private final Member member;


    //role 반환
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> collection = new ArrayList<>();
        collection.add(new GrantedAuthority() {
            @Override
            public String getAuthority() {
                return member.getRole().toString();
            }
        });
        return collection;
    }

    public int getId() {
        return member.getId();
    }

    @Override
    public String getPassword() {
        return member.getPassword();
    }

    @Override
    public String getUsername() {
        return member.getMemberId();
    }

    //계정이 만료되지 않았는지 체크
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    //계정이 잠기지 않았는지 체크
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    //계정 비밀번호 만료 체크
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    //계정 사용 되는지 체크
    @Override
    public boolean isEnabled() {
        return true;
    }
}
