package com.mnot.quizdot.domain.member.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class TitleListDto {

    //칭호 아이디
    int id;

    //칭호명
    String title;

    //획득 조건
    String requirement;

    //획득 여부
    boolean isGet;


}
