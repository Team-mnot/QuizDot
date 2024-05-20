package com.mnot.quizdot.domain.member.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CharacterListDto {

    //캐릭터 id
    private int id;

    //캐릭터 명
    private String name;
}
