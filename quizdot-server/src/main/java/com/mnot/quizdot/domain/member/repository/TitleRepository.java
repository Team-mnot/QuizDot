package com.mnot.quizdot.domain.member.repository;

import com.mnot.quizdot.domain.member.dto.TitleListDto;
import com.mnot.quizdot.domain.member.entity.Title;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface TitleRepository extends JpaRepository<Title, Integer> {

    @Query(
        "SELECT new com.mnot.quizdot.domain.member.dto.TitleListDto(mt.title.id, mt.title.title, mt.title.requirement, mt.isGet) "
            + "FROM MemberTitle mt "
            + "WHERE mt.member.id = :memberId")
    List<TitleListDto> findAllTitlesByMemberId(int memberId);

    @Query("Select t.title FROM Title t WHERE t.id= :id")
    String findTitleById(int id);
}
