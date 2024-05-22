package com.mnot.quizdot.domain.quiz.repository;

import com.mnot.quizdot.domain.quiz.entity.Quiz;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface QuizRepository extends JpaRepository<Quiz, Integer>, QuizRepositoryCustom {

    @Query(value = "SELECT q.id "
        + "FROM quiz q "
        + "WHERE q.id NOT IN :quizList "
        + "AND (:category is NULL OR q.category = :category) "
        + "ORDER BY RAND()"
        + "LIMIT :maxCount ", nativeQuery = true)
    List<Integer> getRandomQuizIdsByQuizParam(@Param("category") String category,
        @Param("maxCount") int maxCount, @Param("quizList") List<Integer> quizList);

}
