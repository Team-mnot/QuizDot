package com.mnot.quizdot.domain.member.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.springframework.data.annotation.CreatedDate;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(unique = true)
    private String ;

    private String password;

    private String nickname;

    private String hint;

    @ColumnDefault(value = "0")
    private int level;

    @ColumnDefault(value = "0")
    private int exp;

    @ColumnDefault(value = "0")
    private int point;

    @ColumnDefault(value = "0")
    private int titleId;

    @ColumnDefault(value = "0")
    private int avatarId;

    @Enumerated(EnumType.STRING)
    private Role role;

    @CreatedDate
    private LocalDateTime createTime;

    @ColumnDefault(value = "#000000")
    private String nicknameColor;
}
