package com.mnot.quizdot.domain.quiz.dto;

import jakarta.persistence.Id;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RoomInfoDto {

    // 방 번호
    @Id
    private int roomId;

    // 제목
    private String title;

    // 공개 여부
    private boolean isPublic;

    // 비밀번호
    private String password;

    // 게임 모드
    private String gameMode;

    // 최대 인원
    private int maxPeople;

    // 문제 카테고리
    private String category;

    // 최대 퀴즈 개수
    private int maxQuestion;

    // 방장 회원 PK
    private int hostId;

    // 초대 링크
    private String inviteLink;

    @Builder
    public RoomInfoDto(int roomId, String title, boolean isPublic, String password,
        String gameMode,
        int maxPeople, String category, int maxQuestion, int hostId, String inviteLink) {
        this.roomId = roomId;
        this.title = title;
        this.isPublic = isPublic;
        this.password = password;
        this.gameMode = gameMode;
        this.maxPeople = maxPeople;
        this.category = category;
        this.maxQuestion = maxQuestion;
        this.hostId = hostId;
        this.inviteLink = inviteLink;
    }

    public void modifyInfo(RoomReq roomReq) {
        this.title = roomReq.getTitle();
        this.isPublic = roomReq.isPublic();
        this.password = roomReq.getPassword();
        this.gameMode = String.valueOf(roomReq.getMode());
        this.category = String.valueOf(roomReq.getCategory());
        this.maxQuestion = roomReq.getMaxQuestion();
        this.maxPeople = roomReq.getMaxPeople();
    }

    public void modifyHost(int hostId) {
        this.hostId = hostId;
    }
}
