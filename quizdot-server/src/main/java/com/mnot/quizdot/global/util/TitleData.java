package com.mnot.quizdot.global.util;

import com.mnot.quizdot.domain.member.entity.Member;
import com.mnot.quizdot.domain.member.entity.ModeType;
import com.mnot.quizdot.domain.member.entity.MultiRecord;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class TitleData {

    private final Member member;
    private final MultiRecord multiRecord;
    private final ModeType mode;

    public Member getMember() {
        return member;
    }

    public MultiRecord getMultiRecord() {
        return multiRecord;
    }

    public ModeType getMode() {
        return mode;
    }
}
