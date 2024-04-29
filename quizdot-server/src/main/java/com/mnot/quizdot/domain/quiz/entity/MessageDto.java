package com.mnot.quizdot.domain.quiz.entity;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class MessageDto {

    @NotNull
    private String sender;

    @NotEmpty
    private String text;
}
