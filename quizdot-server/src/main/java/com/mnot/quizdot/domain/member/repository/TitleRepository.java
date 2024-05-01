package com.mnot.quizdot.domain.member.repository;

import com.mnot.quizdot.domain.member.entity.Title;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TitleRepository extends JpaRepository<Title, Integer> {

}
