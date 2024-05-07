package com.mnot.quizdot.global.util;

import com.mnot.quizdot.domain.member.entity.Member;
import com.mnot.quizdot.domain.member.entity.MemberTitle;
import com.mnot.quizdot.domain.member.repository.MemberRepository;
import com.mnot.quizdot.domain.member.repository.MemberTitleRepository;
import com.mnot.quizdot.domain.member.repository.MultiRecordRepository;
import com.mnot.quizdot.global.result.error.ErrorCode;
import com.mnot.quizdot.global.result.error.exception.BusinessException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TitleUtil {

    private final MemberRepository memberRepository;
    private final MultiRecordRepository multiRecordRepository;
    private final MemberTitleRepository memberTitleRepository;

    public Boolean checkLevel(int memberId) {
        //칭호의 상태가 변한것이 있는지
        Boolean isChange = false;
        Member member = memberRepository.findById(memberId)
            .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND_MEMBER));
        List<MemberTitle> memberTitleList = memberTitleRepository.findAllByMemberIdAndIsGetFalse(
            memberId);
        int memberLevel = member.getLevel();

        if (memberLevel % 10 == 0 && memberLevel <= 100) {
            for (MemberTitle memberTitle : memberTitleList) {
                if (!memberTitle.isGet()) {
                    memberTitle.updateIsGet();
                    isChange = true;
                }
            }
        }
        return isChange;
    }

    public Boolean checkRecord(int memberId) {
        Boolean isChange=false;
        Member member=memberRepository.findById(memberId)
            .orElseThrow(()->new BusinessException(ErrorCode.NOT_FOUND_MEMBER));
        List<MemberTitle>
    }
}
