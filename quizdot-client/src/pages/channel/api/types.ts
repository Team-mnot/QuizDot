interface channelInfo {
  channelId: number;
  activeUserCount: number;
  totalAvailable: number;
}

interface Response {
  status: number;
  message: string;
  data: channelInfo[];
}

export type { Response, channelInfo };
