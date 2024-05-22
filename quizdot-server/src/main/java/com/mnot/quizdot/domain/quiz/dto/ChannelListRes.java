package com.mnot.quizdot.domain.quiz.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ChannelListRes {

    private List<ChannelInfo> channelInfos;
}
