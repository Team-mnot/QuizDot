package com.mnot.quizdot.domain.member.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
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
import org.hibernate.annotations.DynamicInsert;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
@DynamicInsert
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(unique = true)
    private String memberId;

    private String password;

    @Column(unique = true)
    private String nickname;

    private String hint;

    @ColumnDefault(value = "1")
    private int level;

    @ColumnDefault(value = "0")
    private int exp;

    @ColumnDefault(value = "0")
    private int point;

    @ColumnDefault(value = "1")
    private int titleId;

    @ColumnDefault(value = "1")
    private int avatarId;

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    private List<MemberTitle> titles = new ArrayList<>();

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    private List<MemberAvatar> avatars = new ArrayList<>();

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    private List<MultiRecord> multiRecords = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private Role role;

    @CreatedDate
    private LocalDateTime createTime;

    @ColumnDefault(value = "'#000000'")
    private String nicknameColor;

    @Builder
    public Member(String memberId, String password, String nickname, String hint, Role role) {
        this.memberId = memberId;
        this.password = password;
        this.nickname = nickname;
        this.hint = hint;
        this.role = role;
        this.point = 0;
        this.exp = 0;
        this.level = 1;
        this.titleId = 1;
        this.avatarId = 1;
        this.nicknameColor = "#000000";
    }

    public void updatePassword(String password) {
        this.password = password;
    }

    public void updateHint(String hint) {
        this.hint = hint;
    }

    public void updateNickname(String nickname) {
        this.nickname = nickname;
    }

    public void updateAvatarId(int avatarId) {
        this.avatarId = avatarId;
    }

    public void updateTitleId(int titleId) {
        this.titleId = titleId;
    }

    public void updatePoint(int point) {
        this.point = point;
    }

    public void updateNicknameColor(String nicknameColor) {
        this.nicknameColor = nicknameColor;
    }

    public int updateReward(int point, int exp) {
        int curLevel = this.level;
        this.point += point;
        this.exp += exp;
        while (this.exp >= 1000) {
            this.exp -= 1000;
            this.level += 1;
        }
        return this.level - curLevel;
    }

    public void setId(int id) {
        this.id = id;
    }
}
