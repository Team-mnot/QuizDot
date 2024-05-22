package com.mnot.quizdot.domain.quiz.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


//같은 형태의 Dto가 있는데 이름이 다르다는 이유로 새로 만들어야하는지?
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SubmitDto {

    private String roomId;

    private int questionId;

    private int memberId;
}
