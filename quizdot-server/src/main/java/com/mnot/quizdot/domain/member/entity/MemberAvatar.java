package com.mnot.quizdot.domain.member.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
<<<<<<< HEAD:quizdot-server/src/main/java/com/mnot/quizdot/domain/member/entity/MemberCharacter.java
@NoArgsConstructor
public class MemberCharacter {
=======
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MemberAvatar {
>>>>>>> 99efda8833edc925298ea8af9cd8da47412c9099:quizdot-server/src/main/java/com/mnot/quizdot/domain/member/entity/MemberAvatar.java

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private boolean isGet;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "avatar_id")
    private Avatar avatar;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @Builder
    public MemberAvatar(Avatar avatar, Member member) {
        this.avatar = avatar;
        this.member = member;
    }
}
