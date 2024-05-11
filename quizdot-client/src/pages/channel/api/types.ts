/*** 채널 API 반환 타입 ***/
interface ChannelResponse {
  status: number;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

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

export type { ChannelResponse, ChannelInfosType, ChannelInfoType };
