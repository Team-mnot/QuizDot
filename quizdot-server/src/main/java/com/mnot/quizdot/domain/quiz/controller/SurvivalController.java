package com.mnot.quizdot.domain.quiz.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/survival")
@RequiredArgsConstructor
@Tag(name = "Survival", description = "서바이벌 모드 API")
public class SurvivalController {

}
