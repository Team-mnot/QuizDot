package com.mnot.quizdot.domain.member.repository;

import com.mnot.quizdot.domain.member.entity.Title;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TitleRepository extends JpaRepository<Title, Integer> {

<<<<<<< HEAD
    @Query(
        "SELECT new com.mnot.quizdot.domain.member.dto.TitleListDto(mt.title.id, mt.title.title, mt.title.requirement, mt.isGet) "
            + "FROM MemberTitle mt "
            + "WHERE mt.member.id = :memberId")
    List<TitleListDto> findAllTitlesByMemberId(int memberId);

    @Query("Select t.title FROM Title t WHERE t.id= :id")
    String findTitleById(int id);
=======
>>>>>>> 99efda8833edc925298ea8af9cd8da47412c9099
}
