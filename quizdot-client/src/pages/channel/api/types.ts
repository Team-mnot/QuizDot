interface ChannelResponse {
  status: number;
  message: string;
  data: ChannelInfo[];
}

interface ChannelInfos {
  channelnfos: ChannelInfo[];
}

interface ChannelInfo {
  channelId: number;
  activeUserCount: number;
  totalAvailable: number;
}

export type { ChannelResponse, ChannelInfos, ChannelInfo };
