package com.mnot.quizdot.global.util;


import com.mnot.quizdot.domain.member.entity.ModeType;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Predicate;

public class TitleRequirment {

    private static final Map<Integer, Predicate<TitleData>> requirment = new HashMap<>();

    static {
        requirment.put(2, titleData -> titleData.getMember().getLevel() == 10);
        requirment.put(3, titleData -> titleData.getMember().getLevel() == 20);
        requirment.put(4, titleData -> titleData.getMember().getLevel() == 30);
        requirment.put(5, titleData -> titleData.getMember().getLevel() == 40);
        requirment.put(6, titleData -> titleData.getMember().getLevel() == 50);
        requirment.put(7, titleData -> titleData.getMember().getLevel() == 60);
        requirment.put(8, titleData -> titleData.getMember().getLevel() == 70);
        requirment.put(9, titleData -> titleData.getMember().getLevel() == 80);
        requirment.put(10, titleData -> titleData.getMember().getLevel() == 90);
        requirment.put(11, titleData -> titleData.getMember().getLevel() == 100);

        requirment.put(12, titleData -> titleData.getMember().getPoint() >= 1000);
        requirment.put(13, titleData -> titleData.getMember().getPoint() >= 10000);
        requirment.put(14, titleData -> titleData.getMember().getPoint() >= 50000);
        requirment.put(15, titleData -> titleData.getMember().getPoint() >= 100000);

        requirment.put(16, titleData -> titleData.getMode() == ModeType.NORMAL
            && titleData.getMultiRecord().getWinCount() == 1);
        requirment.put(17, titleData -> titleData.getMode() == ModeType.NORMAL
            && titleData.getMultiRecord().getWinCount() == 10);
        requirment.put(18, titleData -> titleData.getMode() == ModeType.NORMAL
            && titleData.getMultiRecord().getWinCount() == 30);
        requirment.put(19, titleData -> titleData.getMode() == ModeType.NORMAL
            && titleData.getMultiRecord().getWinCount() == 50);
        requirment.put(20, titleData -> titleData.getMode() == ModeType.NORMAL
            && titleData.getMultiRecord().getWinCount() == 100);

        requirment.put(21, titleData -> titleData.getMode() == ModeType.NORMAL
            && titleData.getMultiRecord().getTotalCount() == 1);
        requirment.put(22, titleData -> titleData.getMode() == ModeType.NORMAL
            && titleData.getMultiRecord().getTotalCount() == 10);
        requirment.put(23, titleData -> titleData.getMode() == ModeType.NORMAL
            && titleData.getMultiRecord().getTotalCount() == 50);
        requirment.put(24, titleData -> titleData.getMode() == ModeType.NORMAL
            && titleData.getMultiRecord().getTotalCount() == 100);
        requirment.put(25, titleData -> titleData.getMode() == ModeType.NORMAL
            && titleData.getMultiRecord().getTotalCount() == 500);

        requirment.put(26, titleData -> titleData.getMode() == ModeType.SURVIVAL
            && titleData.getMultiRecord().getWinCount() == 1);
        requirment.put(27, titleData -> titleData.getMode() == ModeType.SURVIVAL
            && titleData.getMultiRecord().getWinCount() == 10);
        requirment.put(28, titleData -> titleData.getMode() == ModeType.SURVIVAL
            && titleData.getMultiRecord().getWinCount() == 30);
        requirment.put(29, titleData -> titleData.getMode() == ModeType.SURVIVAL
            && titleData.getMultiRecord().getWinCount() == 50);
        requirment.put(30, titleData -> titleData.getMode() == ModeType.SURVIVAL
            && titleData.getMultiRecord().getWinCount() == 100);

        requirment.put(31, titleData -> titleData.getMode() == ModeType.SURVIVAL
            && titleData.getMultiRecord().getTotalCount() == 1);
        requirment.put(32, titleData -> titleData.getMode() == ModeType.SURVIVAL
            && titleData.getMultiRecord().getTotalCount() == 10);
        requirment.put(33, titleData -> titleData.getMode() == ModeType.SURVIVAL
            && titleData.getMultiRecord().getTotalCount() == 50);
        requirment.put(34, titleData -> titleData.getMode() == ModeType.SURVIVAL
            && titleData.getMultiRecord().getTotalCount() == 100);
        requirment.put(35, titleData -> titleData.getMode() == ModeType.SURVIVAL
            && titleData.getMultiRecord().getTotalCount() == 500);

        requirment.put(36, titleData -> titleData.getMode() == ModeType.ILGITO
            && titleData.getMultiRecord().getWinCount() == 1);
        requirment.put(37, titleData -> titleData.getMode() == ModeType.ILGITO
            && titleData.getMultiRecord().getWinCount() == 10);
        requirment.put(38, titleData -> titleData.getMode() == ModeType.ILGITO
            && titleData.getMultiRecord().getWinCount() == 30);
        requirment.put(39, titleData -> titleData.getMode() == ModeType.ILGITO
            && titleData.getMultiRecord().getWinCount() == 50);
        requirment.put(40, titleData -> titleData.getMode() == ModeType.ILGITO
            && titleData.getMultiRecord().getWinCount() == 100);

        requirment.put(41, titleData -> titleData.getMode() == ModeType.ILGITO
            && titleData.getMultiRecord().getTotalCount() == 1);
        requirment.put(42, titleData -> titleData.getMode() == ModeType.ILGITO
            && titleData.getMultiRecord().getTotalCount() == 10);
        requirment.put(43, titleData -> titleData.getMode() == ModeType.ILGITO
            && titleData.getMultiRecord().getTotalCount() == 50);
        requirment.put(44, titleData -> titleData.getMode() == ModeType.ILGITO
            && titleData.getMultiRecord().getTotalCount() == 100);
        requirment.put(45, titleData -> titleData.getMode() == ModeType.ILGITO
            && titleData.getMultiRecord().getTotalCount() == 500);
    }

    public static Predicate<TitleData> getRequirement(int titleId) {
        //찾는 titleId 의 value 값이 없거나 null 일때 반환하는 값
        return requirment.getOrDefault(titleId, titleData -> false);
    }
}
