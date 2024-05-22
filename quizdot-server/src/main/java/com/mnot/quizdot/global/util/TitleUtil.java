package com.mnot.quizdot.global.util;

import com.mnot.quizdot.domain.member.entity.Member;
import com.mnot.quizdot.domain.member.entity.MemberTitle;
import com.mnot.quizdot.domain.member.entity.ModeType;
import com.mnot.quizdot.domain.member.entity.MultiRecord;
import com.mnot.quizdot.domain.member.repository.MemberRepository;
import com.mnot.quizdot.domain.member.repository.MemberTitleRepository;
import com.mnot.quizdot.domain.member.repository.MultiRecordRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TitleUtil {

    private final MemberRepository memberRepository;
    private final MultiRecordRepository multiRecordRepository;
    private final MemberTitleRepository memberTitleRepository;

    public List<String> checkRequirment(Member member, MultiRecord multiRecord, ModeType modeType) {
        List<String> unlockList = new ArrayList<>();
        List<MemberTitle> memberTitleList = memberTitleRepository.findAllByMemberIdAndIsGetFalse(
            member.getId());

        TitleData titleData = new TitleData(member, multiRecord, modeType);
        for (MemberTitle memberTitle : memberTitleList) {
            Predicate<TitleData> requirement = TitleRequirment.getRequirement(
                memberTitle.getTitle().getId());
            if (!memberTitle.isGet() && requirement.test(titleData)) {
                memberTitle.updateIsGet();
                unlockList.add(memberTitle.getTitle().getTitle());
            }
        }
        return unlockList;
    }
}
