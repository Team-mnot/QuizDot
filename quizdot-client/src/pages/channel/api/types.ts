interface ChannelResponse {
  status: number;
  message: string;
  data: ChannelInfo[];
}

interface ChannelInfo {
  channelId: number;
  activeUserCount: number;
  totalAvailable: number;
}

export type { ChannelResponse, ChannelInfo };
