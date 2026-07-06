export interface Channel {
  name: string;
  logo: string;
  group: string;
  urls: string[];
}

export interface ChannelData {
  groups_order: string[];
  channels: Channel[];
}
