package com.mnot.quizdot.domain.member.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.springframework.data.annotation.CreatedDate;

// TODO : cascade
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(unique = true)
    private String memberId;

    private String password;

    private String nickname;

    private String hint;

    @ColumnDefault(value = "0")
    private int level;

    @ColumnDefault(value = "0")
    private int exp;

    @ColumnDefault(value = "0")
    private int point;

    @OneToMany(mappedBy = "member")
    private List<Title> titles = new ArrayList<>();

    @OneToMany(mappedBy = "member")
    private List<Avatar> avatars = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private Role role;

    @CreatedDate
    private LocalDateTime createTime;

    @ColumnDefault(value = "#000000")
    private String nicknameColor;

    @Builder
    public Member(String memberId, String password, String nickname, String hint, Role role) {
        this.memberId = memberId;
        this.password = password;
        this.nickname = nickname;
        this.hint = hint;
        this.role = role;
    }
}
