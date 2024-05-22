package com.mnot.quizdot.domain.quiz.dto;

import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RoomEnterRes {

    // 대기실 내 회원 목록
    Map<String, PlayerInfoDto> players;

    // 대기실 정보
    RoomInfoDto roomInfo;

}
