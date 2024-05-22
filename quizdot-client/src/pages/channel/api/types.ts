/*** 채널 정보 배열 타입 ***/
interface ChannelInfosType {
  channelInfos: ChannelInfoType[];
}

/*** 채널 정보 타입 ***/
interface ChannelInfoType {
  channelId: number;
  activeUserCount: number;
  totalAvailable: number;
}

export type { ChannelInfosType, ChannelInfoType };
