package com.mnot.quizdot.domain.member.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MultiRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @Enumerated(EnumType.STRING)
    private ModeType mode;

    @ColumnDefault("0")
    private int winCount;

    @ColumnDefault("0")
    private int totalCount;

    @Builder
    public MultiRecord(Member member, ModeType mode) {
        this.member = member;
        this.mode = mode;
    }

    public void updateRecord(int winCount, int totalCount) {
        this.winCount += winCount;
        this.totalCount += totalCount;
    }
}
