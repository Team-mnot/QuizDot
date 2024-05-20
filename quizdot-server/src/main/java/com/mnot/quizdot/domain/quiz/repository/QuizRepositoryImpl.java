package com.mnot.quizdot.domain.quiz.repository;

import static com.mnot.quizdot.domain.quiz.entity.QAnswer.answer1;
import static com.mnot.quizdot.domain.quiz.entity.QQuiz.quiz;
import static com.querydsl.core.group.GroupBy.groupBy;
import static com.querydsl.core.group.GroupBy.list;

import com.mnot.quizdot.domain.quiz.dto.QuizRes;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class QuizRepositoryImpl implements QuizRepositoryCustom {

    private final JPAQueryFactory jpaQueryFactory;


    @Override
    public List<QuizRes> getQuizzesByIds(List<Integer> idList) {
        return jpaQueryFactory
            .from(quiz)
            .join(quiz.answers, answer1)
            .where(quiz.id.in(idList))
            .transform(
                groupBy(quiz.id).list(
                    Projections.fields(QuizRes.class,
                        quiz.id,
                        quiz.question,
                        quiz.hint,
                        quiz.imagePath,
                        quiz.category,
                        quiz.questionType,
                        quiz.description,
                        list(
                            answer1.answer
                        ).as("answers")
                    )
                )
            );
    }
}
